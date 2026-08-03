# T082：运行 Framework E2E v2 Red Baseline

- Status: `approved`（从已批准的 T071 运行阶段拆出；等待 Proposal Batch v2 用户批准）
- PR: `PR 0 / PR 7 - Eval 历史保护与最终闭环`
- Depends On: T071, T073, T080, T081
- Parallel: No。它会首次启动 Framework v2 Eval；必须独占该场景目录，并严格停在 Proposal 批准门或 `control-pass` 人审门。

## 目标

在不修改任何考题或生产 Skill 的前提下，用修改前 Skill snapshot 对 `framework-e2e-paged-cache-v2` 运行一次真实 Baseline。结果只能是有完整证据的 `fail` 或 `control-pass`：真实 `fail` 才打开 T047；全绿时必须保存 `control-pass` 并立刻交用户判断框架是否仍有独立增益。

这个 Task 原本混在 T071 里，导致“Proposal 已经准备好”和“用户批准后启动 Agent”共享一个 `in-progress` 状态。拆开后，T071 是可以独立审核的考题文件，本 Task 是可以单独授权和运行的实验，不需要发明新的状态类型。

## 与历史 v1 和 T071 的区别

| 输入 | 本 Task 如何处理 |
|---|---|
| 历史 `framework-e2e-paged-cache` v1 | 全目录只读，只作为旧 Red 的来源说明，不回填字段、不新增 Scorecard |
| T071 v2 Proposal | 作为当前不可变 Scenario/Protocol/Fixture；任何语义变化都退回 T071 并重新审核 |
| T073 formal wrapper | 真实证明最小 Record 事前存在、命令一致、正式 Benchmark exactly once |
| T081 Terra 合同 | Implementer/Reviewer 都使用 `gpt-5.6-terra`、不同 Agent ID、`forkTurns: none`；不可用时停止，不回退 |

## 当前批准门

运行前从 `docs/specs/next_generation_skill/eval-proposal-review.md` 读取并逐字核对当前：

```text
Batch ID: next-generation-skill-protocol-v2-proposals-batch-v2
Batch SHA-256: aa58b9b4dc0723d18808e9a9fe011bd73a3c92eff4ca354e8c199afb75ebf155
```

只有用户明确批准这个 Batch ID 和 SHA-256，才把本场景 `proposal-approval.json` 改为 `decision: approved` 并保存非空 `replyEvidence`。批准其他 Task、旧 Batch、模型选择或“继续处理”都不能替代这一步。任一绑定输入变化时，先由 T080 重建 Batch 并重新审核。

## 文件边界

### Modify

- `test/skill-evals/framework-e2e-paged-cache-v2/proposal-approval.json`，且只在当前 Batch 获批后更新决定和回复证据。

### Add

- `test/skill-evals/framework-e2e-paged-cache-v2/baseline.json`
- `test/skill-evals/framework-e2e-paged-cache-v2/evidence/baseline/` 中被 Baseline 实际引用的最小脱敏证据。

### Must Not Modify

- v2 `scenario.md`、`protocol.json`、`fixture/` 或共享用户价值 rubric。
- 历史 v1 场景的任何字节。
- 任何生产 Skill、`src/`、AGENTS、PRD、Plan、迁移说明或其他场景。
- T047 的 Live Scorecard 路径。

## 运行前事实检查

1. 完整读取 `test/skill-evals/WORKFLOW.md`，核对 Proposal/Scenario/Protocol/Fixture/共享 rubric Hash 和当前批准回复。
2. 确认目录中没有旧 Baseline、Scorecard 或残留 evidence；发现未知运行产物时停止，不覆盖。
3. 从 Fixture 创建新的隔离临时 Git 工作区，运行初始 Node/Python/Git/CLI 检查并提交 Base；环境失败不算 Skill Red。
4. 按 Protocol 解析每个 `baselineLoad` 的修改前不可变 Skill snapshot 或有意 `absent` 状态，保存真实 Hash。
5. 在正式 Benchmark 前创建最小 `runs/<run-id>/record.md`；命令、CWD、输入、关键配置、产物路径、停止条件和一次性身份必须先存在，背景润色和终态结论延后。

## Terra Baseline 执行

1. 用全新 `gpt-5.6-terra` Implementer，`forkTurns: none`。首轮只给临时工作区、原始用户请求、项目规则、读取禁区和获批 snapshot 路径/Hash；完整 Scenario、Protocol、rubric、hard rejects 和未来四条批准消息保持 evaluator-only。
2. Eval 主 Agent只在 Protocol 的 Plan、Tasks、实施和 Architecture 真实停点逐轮发送获批消息。不得提前透露，Tasks 批准也不得冒充实施授权。
3. Formal wrapper 验证 Record 的事前 Hash并独占创建 sentinel；正式 Benchmark 只能成功启动一次。Verifier 必须实际证明第二次启动在计算前被拒绝。
4. 执行 Protocol 全部命令，保存原模板、只解析占位符后的真实命令、退出码、stdout/stderr、产物 Hash 和 Base 到最终树的 committed/index/working-tree/untracked/final-hash 证据。
5. 用另一个全新 Terra Reviewer，Agent ID 与 Implementer 不同。Reviewer 只在运行后收到用户已批准的业务 rubric、共享用户价值 rubric、完整真实交互、命令、产物和树证据。
6. Reviewer 分别评估业务质量和用户价值，并用 `criticalPath` 核对顺序、必要停点和延后工作；不使用墙钟、暂停次数或 watchdog 作质量分。

## 结果分支

- `fail`：至少一个失败必须能直接归因于目标 Skill 缺失/旧行为，`failureKind` 只能是 `skill-behavior | skill-user-value`，并保留其他失败证据。写入 Baseline 后可满足 T047 的 Red 前置。
- `control-pass`：行为、用户价值和关键路径证据全绿。诚实写入后立即停止，不创建 T047 Scorecard、不改生产 Skill，先让用户判断框架是否仍值得保留。
- 环境阻塞：不写成 `fail` 或 `control-pass`；保留诊断并报告，修复环境后从新的临时工作区重跑。

## 验证

- `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=test python3 -m unittest test_skill_eval_contract.SkillEvalContractTests`
- `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=test python3 -m unittest test_eval_proposal_batch.EvalProposalBatchTests`
- 运行 v2 Fixture 的全部 Protocol 命令和 T073 formal verifier。
- 对历史 v1 目录比较运行前后递归 Hash，必须零变化。
- `git diff --check`

## 完成标准

- 当前用户批准、不可变输入和运行证据 Hash 全部一致。
- Implementer/Reviewer 身份、Prompt 隔离、多轮停点、完整树和 exactly-once provenance 可复核。
- 保存一份诚实且静态合同有效的 `fail | control-pass`，没有用环境错误制造 Red。
- 只有真实 `fail` 打开 T047；其余分支保持明确停点。

