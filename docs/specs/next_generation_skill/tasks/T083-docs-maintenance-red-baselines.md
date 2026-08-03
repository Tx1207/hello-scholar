# T083：运行 `docs-maintenance` 四模式 Red Baseline

- Status: `approved`（从已批准的 T039 运行阶段拆出；等待 Proposal Batch v2 用户批准）
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T039, T074, T080, T081
- Parallel: No。四个场景共享同一目标 Skill 决策和 Batch 门；逐场使用独立工作区/Agent，任一 `control-pass` 立即停下交用户判断。

## 目标

在 `docs-maintenance` 尚不存在时，分别用真实 Terra subagent 运行 `check`、`index`、`architecture`、`recover` 四个已审核项目。它要回答一个实际问题：确定性 docs CLI 已经存在的情况下，独立 Skill 是否仍能改善模式选择、写入边界、Architecture 人审和恢复表达。

本 Task 只记录修改前对照，不实现 Skill。T039 拥有考题和四个 Fixture，T074 已把 Index 二次同步的 bytes/mode/mtime 幂等证据做实；本 Task只消费这些当前 Hash并生成 Baseline/evidence。

## 与 T039 的区别

| T039 | T083 |
|---|---|
| 编写 Scenario、Protocol、Fixture 和 pending Approval | 在用户批准当前 Batch 后更新对应 Approval 决定 |
| 定义业务 rubric、共享用户价值引用、hard rejects 和 `criticalPath` | 用真实输出、命令和树证据执行这些门 |
| 不启动 Agent，不预写结果 | 每场使用 fresh Terra Implementer/Reviewer，保存诚实 `fail | control-pass` |

## 当前批准门

运行前从 `docs/specs/next_generation_skill/eval-proposal-review.md` 核对并取得用户对以下当前值的明确批准：

```text
Batch ID: next-generation-skill-protocol-v2-proposals-batch-v2
Batch SHA-256: aa58b9b4dc0723d18808e9a9fe011bd73a3c92eff4ca354e8c199afb75ebf155
```

只更新本 Task 四个 `proposal-approval.json` 的 `decision` 和非空 `replyEvidence`，保留已绑定的 Scenario/Protocol/Fixture Hash。任何输入变化先重建并重新审核 Batch；不得把旧批准、Task 批准或 Reviewer 意见当作用户批准证据。

## 文件边界

### Modify After Approval

- `test/skill-evals/docs-maintenance-check/proposal-approval.json`
- `test/skill-evals/docs-maintenance-index/proposal-approval.json`
- `test/skill-evals/docs-maintenance-architecture/proposal-approval.json`
- `test/skill-evals/docs-maintenance-recover/proposal-approval.json`

### Add From Real Runs

- 上述四个场景各自的 `baseline.json`
- 上述四个场景各自的 `evidence/baseline/`，只保存 Baseline 实际引用的最小脱敏证据。

### Must Not Modify

- 四个场景的 `scenario.md`、`protocol.json`、`fixture/` 或共享 rubric。
- `skills/hello-scholar/docs-maintenance/`，它只能由真实 Red 后的 T040 创建。
- `src/`、AGENTS、README、PRD、Plan、其他 Skill 或其他 Eval 场景。
- 任何 Scorecard/Live evidence。

## 每场共同运行合同

1. 完整读取 `test/skill-evals/WORKFLOW.md`，核对当前 Approval、Hash、Terra 模型、命令、允许/禁止路径、rubric、hard rejects、`criticalPath` 和多轮消息。
2. 从该场 Fixture 创建全新临时 Git 工作区，运行项目初始测试和绝对源码 CLI预检，提交 Base。CLI、Git、依赖或 Fixture 错误属于环境阻塞，不得记为 Skill Red。
3. 确认 `docs-maintenance` 的 Baseline snapshot 是有意 `absent`；不要提供 T040、目标 Skill草稿或 evaluator-only答案。
4. 派发全新 `gpt-5.6-terra` Implementer，`forkTurns: none`；它只看到原始用户请求、项目规则、当前轮消息和运行所需工具事实。
5. 派发不同 Agent ID 的全新 Terra Reviewer。Reviewer 在运行结束后才读取获批 rubric、完整交互、命令、产物和 Base 到最终树的全部证据。
6. 分开评分业务质量和共享用户价值；用 `criticalPath` 核对动作顺序和必要停点，不使用墙钟质量门。

## 四个真实项目的专属证据

### `check`

- 运行真实 `docs check` 并报告相对路径、error/notice 和非零退出原因。
- 工作区所有文件 bytes、mode、mtime 和 Git 状态保持不变；调用 sync 或顺手修文档直接失败。

### `index`

- 只允许三个程序生成的 Index 变化。
- T074 verifier 连续同步两次；第二次完整 tree 的 bytes SHA-256、mode、纳秒 mtime 都不变，CLI 报告零写入。
- 手写 Index、修改核心源文档或人工拼表直接失败。

### `architecture`

- 第一轮只给带当前 Architecture SHA-256 和事实来源的语义 Proposal，零写入并停止。
- Eval 主 Agent观察真实停点后才发送 Protocol 中获批的第二轮消息；随后只允许修改 `hello-scholar/architecture.md`。
- Draft 设计、未实现事实、其他核心文档或批准前写入均为失败。

### `recover`

- 可以用 `docs sync` 重建派生 Index，并报告孤立/Stale/无关联事实。
- 完整 Architecture 草稿只出现在用户回复中，明确 `Needs Human Review`；不得写正式 Architecture 或仓库内恢复报告。

## 结果与停点

- `fail`：失败必须直接归因于缺少目标 Skill 的模式选择、边界或表达价值，保存 `skill-behavior | skill-user-value` 和全部证据，然后继续下一场。
- `control-pass`：该对照已经全绿。保存事实后立即停止整个 T083，不强化题目、不创建 Skill，先把该 Skill 的独立价值交用户裁决。
- 环境阻塞：不生成 Baseline 结论；修复环境后用新的工作区和 Agent 重跑该场。

## 验证

- 每场运行其 Protocol 全部命令；`index` 额外运行 T074 verifier。
- `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=test python3 -m unittest test_skill_eval_contract.SkillEvalContractTests`
- `PYTHONDONTWRITEBYTECODE=1 PYTHONPATH=test python3 -m unittest test_eval_proposal_batch.EvalProposalBatchTests`
- `node --test test/test_index_generator.js test/test_cli_docs.js`
- `git diff --check`

## 完成标准

- 四个项目都由不同 fresh Implementer/Reviewer 运行，或在首个 `control-pass`/环境阻塞处诚实停止。
- 每份已保存 Baseline 都绑定当前 Proposal/Scenario/Protocol/Fixture/共享 rubric 和 `docs-maintenance: absent` snapshot。
- 失败来自 Skill 行为/用户价值，不来自坏 Fixture；输出让用户无需阅读 Agent 内部过程就能看懂差异和价值。
- 只有全部所需场景取得真实 Red 后，T040 才可开始生产 Skill 编写。

