# T081：Eval Terra 子代理模型合同

- Status: `completed`
- PR: `PR 0 - Skill Eval 基础设施修正`
- Depends On: T068, T071, T072, T080
- Parallel: No。它会改变所有待审核 v2 Protocol 的 Hash，必须在任何 Baseline 或 Live Eval 前完成，并与 Proposal 审批记录同步。

## 为什么要做

T068/T072 已经要求隔离的 Implementer、独立 Reviewer 和 `forkTurns: none`，但旧合同只保存 Agent ID，无法证明两角色实际使用同一种指定能力，也没有阻止运行者在 Terra 不可用时把其他模型的结果写成同一份 Eval 证据。这样会把模型变化、上下文继承和 Skill 行为混在一起，后续 Baseline/Live 的比较失去可解释性。

本 Task 把所有新 Protocol v2 的运行身份固定为 `gpt-5.6-terra`，并把同一身份绑定到 Baseline 和 Scorecard。它只收紧评测输入和证据格式，不运行 Agent、不修改生产 Skill、不生成 Baseline/Scorecard，也不把 pending Proposal 变为 approved。

## 与既有设计比较

| 项目 | 原合同 | T081 后 |
|---|---|---|
| Protocol 运行身份 | 只记录 Implementer/Reviewer 数量和 `forkTurns`，模型隐含在运行环境 | `agents.model` 必须是 `gpt-5.6-terra`，37 个 v2 Protocol 显式受 Hash 绑定 |
| 运行证据 | 两角色只保存 ID 和 `forkTurns` | Baseline/Scorecard 的 Implementer、Reviewer 都保存 `id`、`model`、`forkTurns`，模型必须匹配 Protocol，ID 必须不同 |
| Terra 不可用 | 可能改用其他可用模型且没有可审计边界 | 作为环境阻塞停止并报告；不得静默回退、不得把替代模型输出记录为 Skill Red、control-pass 或 Live 质量证据 |
| 历史 v1 | 可能被新字段回填 | 历史 v1 Baseline 保持原字节与原 Hash；只约束 37 个尚未运行的 v2 Proposal |

## 输入

- `test/skill_eval_contract.py` 的 v2 Protocol、Baseline、Scorecard 确定性验证器；
- `test/test_skill_eval_contract.py` 的隔离 fixture 和合同负例；
- `test/skill-evals/*/protocol.json` 中全部 37 份 pending Protocol v2 及其 `proposal-approval.json`；
- `test/skill-evals/WORKFLOW.md`、PRD 和执行 Plan 的 Eval 运行规则；
- T080 的 Proposal 审批 Hash 绑定规则。

## 输出

1. v2 Protocol 的 `agents` 必须同时包含正整数 `implementers`/`reviewers`、`model: "gpt-5.6-terra"` 和 `forkTurns: "none"`。
2. v2 Baseline/Scorecard 的 `agents.implementer` 与 `agents.reviewer` 都必须包含非空 `id`、匹配 Protocol 的 `model` 与 `forkTurns: "none"`；两个 ID 不得相同。
3. 所有 37 个 pending v2 Protocol 显式声明 Terra，并刷新每份 Approval 的 `protocolSha256`；历史 v1 不修改。
4. Proposal Manifest 的每个条目派生 `agentModel`，审核页逐项展示，用户可以在批准 Batch 前直接看见运行身份。
5. 文档明确 Terra 不可用是环境阻塞，停止并报告，禁止静默回退。

## 具体修改

1. 在 `test/skill_eval_contract.py` 固定 `EVAL_AGENT_MODEL = "gpt-5.6-terra"`，验证 Protocol 模型，并让 Baseline/Scorecard 复用同一模型约束。
2. 在 `test/test_skill_eval_contract.py` 的 v2 fixture 中写入 Protocol 与两类运行证据的模型；覆盖 Protocol 模型缺失/不匹配、Baseline/Scorecard 两角色模型缺失/不匹配、相同 ID 和非 `none` `forkTurns`。
3. 给 `test/skill-evals/*/protocol.json` 的 37 个 v2 `agents` 加入模型字段，不修改历史 `framework-e2e-paged-cache` v1 目录。
4. 使用安全 JSON 解析重算每个受影响 pending `proposal-approval.json` 的 `protocolSha256`；不改 `decision` 或 `replyEvidence`。
5. 由 T080 的确定性派生逻辑把 Protocol 模型写入 Manifest 和审核页，不在两处手工维护第二个模型配置。
6. 在 Workflow、PRD 和执行 Plan 记录模型身份、运行证据字段与环境阻塞规则。

## 验证

1. `PYTHONPATH=test python3 -m unittest test_skill_eval_contract.SkillEvalContractTests`
   - 验证：37 个 v2 Proposal 与历史 v1 保存状态均通过静态合同，新增模型负例被拒绝。
2. Batch owner 重建审核材料后执行 `PYTHONPATH=test python3 -m unittest test_eval_proposal_batch.EvalProposalBatchTests`
   - 验证：更新后的 Protocol、Approval、Manifest 和 Review 共同绑定当前输入；重建前不得运行。
3. `python3 -m unittest test/test_function_contract_comments.py`
   - 验证：本 Task 修改或新增的 Python 函数继续满足 `Purpose`、`Input`、`Output` 合同注释守卫。

## 完成条件

- 37 个 Protocol v2 都显式绑定 `gpt-5.6-terra`；
- 任何缺失/错误模型、相同 Agent ID 或非 `none` `forkTurns` 的 v2 运行记录均无法通过静态合同；
- 受影响 Approval 的 Protocol Hash 全部当前，且没有跨越 pending 用户 Proposal 门；
- Manifest 和审核页逐项显示与 Protocol 一致的 `agentModel`；
- 文档把 Terra 不可用归类为环境阻塞并禁止回退；
- 未启动 Baseline/Live Eval，未修改生产 Skill，未重写历史 v1 证据。
