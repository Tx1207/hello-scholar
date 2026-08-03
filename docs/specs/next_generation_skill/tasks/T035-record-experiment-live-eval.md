# T035：用当前 Codex subagent 验证 `record-experiment` v2

- Status: `approved`
- PR: `PR 5 - 根目录 Runs 与 Record`
- Depends On: T034
- Parallel: No。Live Eval 期间不得修改 Skill、场景或门槛。

## 目标

分别运行 T033 的正式、探索和终态场景，证明升级后的 Skill 既能把正式实验挡在正确的事前 Record 门后，也不会用同一套重流程阻塞合格的低风险探索；同时确认失败和负结果在新根目录布局中可恢复。

## 与旧 Skill 的比较重点

- 旧 Skill 的强项是实验身份和证据完整性，新 Skill 必须继续通过这些维度。
- 旧 Skill 的错误边界是 `memory` 路径、手写 Index 和无例外事前记录，新 Skill 必须在真实文件/diff 中消除这些行为。
- 评测不能只看回答里是否提到 `runs/`，必须检查 Record 确实写在正确目录、命令执行顺序正确、禁止文件没有出现。

## 文件边界

### Add

- `test/skill-evals/record-formal-prelaunch/scorecard.json`
- `test/skill-evals/record-formal-prelaunch/evidence/live/`
- `test/skill-evals/record-exploration-backfill/scorecard.json`
- `test/skill-evals/record-exploration-backfill/evidence/live/`
- `test/skill-evals/record-terminal-evidence/scorecard.json`
- `test/skill-evals/record-terminal-evidence/evidence/live/`

三个 `evidence/live/` 目录只保存 Scorecard 引用的必要脱敏时间顺序、diff 摘要和命令输出，不覆盖 Baseline 证据。

### Must Not Modify

- `skills/hello-scholar/record-experiment/`
- 三个场景的 `scenario.md`、`protocol.json`、`baseline.json` 和 Fixture 原件
- `src/`
- `test/fixtures/record_experiment_10_scenario_protocol.json`
- `test/fixtures/record_experiment_10_scenario_scorecard.json`

旧十场景是 v0.1 的历史静态回归材料，继续由现有测试校验其自洽性，但不按 v0.2 Workflow 重跑、不计入三个 primary case，也不以旧 98 分门阻塞本次发布。

## 执行方法

1. 完整读取 Workflow，确认三组 Proposal/Scenario/Protocol/Fixture Hash 仍获用户批准；任何变化停止并重开 T033。每个场景从 Fixture 创建新的临时 Git 工作区，预检绝对源码 CLI、初始命令与当前 Skill copy，提交并记录 `fixtureBaseCommit`。
2. 每个场景使用全新 `fork_turns: "none"` Implementer，Prompt 给当前 `record-experiment/SKILL.md` 绝对路径/Hash并要求完整读取，只给工作目录、当前轮逐字消息、项目规则和读取禁区；完整 Scenario/Protocol、rubric、T034 和预期答案保持 evaluator-only。多轮用户动作只在真实停点由 Eval 主 Agent按 Protocol 逐字使用 `followup_task`。
3. Formal 场景由主 Agent 核对文件时间/事件证据，确认 `record.md` 在 Benchmark 启动前存在且启动字段齐全。
4. Exploration 场景核对隔离条件、先运行的许可和补录截止门；不能把它偷改成正式事前场景来规避评测。
5. Terminal 场景核对失败/负结果的状态、结果分工和“一 Run 一 Record”，并确认旧记录内容没有被覆盖成同一结论。
6. 每个场景派发与 Implementer 不同的全新 `fork_turns: "none"` Reviewer。Reviewer 只收到获批 rubric、原始交互、Scenario、Protocol、Base-to-final 完整 diff、产物和命令证据。
7. 写入当前 Proposal/Scenario/Protocol/Fixture/Skill Hash、不同 Agent ID、Terra 模型、`forkTurns`、硬门、评分、命令/退出码、逐轮停点、`criticalPath` 顺序和 Reviewer 建议。无 token 数据时写 `null` 和原因；v2 Scorecard 不写 `timing`。
8. 任一场景失败时如实保存 `fail`，判断应重开 T034 还是 T033；本 Task 不修 Skill、不改 Fixture、不降低分数。三个标准场景完成后，把新场景输出/证据/评分批量交用户；只有用户明确接受当前 Hash 才写各 Scorecard `userDecision: accepted`。

## 必须检查的硬证据

- 所有新 Record 都位于 `runs/<run-id>/record.md`，目录名与 Front Matter `run_id` 一致。
- `hello-scholar/memory/`、`hello-scholar/runs/` 和禁止说明文件都不存在。
- `runs/INDEX.md` 由 `docs sync` 生成并带 generated marker，不是 Agent 手写表格。
- 正式场景具备事前最小可复现字段；探索场景在任何依赖结论的动作前已补录。
- 失败与负结果都保留，原始日志/结果没有被大段复制到 `record.md`。
- Implementer 和 Reviewer ID 不同，仓库 diff 无场景外改动。

## 验证与完成

- 三个 Scorecard 均通过 T002 静态合同，硬门全部为 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 旧十场景文件 bytes 不变；现有质量门可以继续读取它们作为历史回归，但其分数不替代三个 v0.2 Live Eval，也不阻塞 v0.2 accepted 判定。
- 运行 T034 的四个聚焦测试、现有历史 Fixture 静态测试和 `npm test`。
- 临时工作区全部清理，仓库只留下 Scorecard 和必要脱敏证据。
- 本 Task 完成后 PR 5 的目标行为有真实 subagent 证据，不只依赖 Prompt 静态扫描。
