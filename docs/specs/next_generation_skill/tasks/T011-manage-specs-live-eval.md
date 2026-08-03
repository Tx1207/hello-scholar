# T011：用当前 Codex subagent 验证 `manage-specs`

- Status: `approved`
- PR: `PR 2 - Spec Bundle 与 Manage Specs`
- Depends On: T010
- Parallel: No。评测期间不得改 Skill。

## 目标

对 T009 的四个场景逐个做真实 Live Eval，证明 T010 的 Skill 能在隔离项目中正确选择原 Spec、合并候选方案、在新建/替代前等待用户确认，并产生正确 Index。

## 文件边界

### Add

- `test/skill-evals/manage-specs-existing/scorecard.json`
- `test/skill-evals/manage-specs-existing/evidence/live/`
- `test/skill-evals/manage-specs-options/scorecard.json`
- `test/skill-evals/manage-specs-options/evidence/live/`
- `test/skill-evals/manage-specs-independent/scorecard.json`
- `test/skill-evals/manage-specs-independent/evidence/live/`
- `test/skill-evals/manage-specs-successor/scorecard.json`
- `test/skill-evals/manage-specs-successor/evidence/live/`

每个 `evidence/live/` 只保存 Scorecard 引用的必要脱敏输入、diff 摘要和命令输出；不得覆盖 Baseline 证据、复制临时工作区或保存未脱敏对话。

### Must Not Modify

- `skills/hello-scholar/manage-specs/`
- 任何 `src/` 或其他 Skill
- `scenario.md`、`protocol.json`、`baseline.json`（Hash 错误时应重开 T009，不在此 Task 偷改场景）

## 执行方法

1. 完整读取 Workflow，核对四组 Proposal/Scenario/Protocol/Fixture Hash 仍是用户批准版本；任何变化都停止并重开 T009，不沿用旧 rubric。
2. 每个场景创建新的临时 Git 工作区，预检绝对源码 CLI、初始测试和当前 Skill copy，提交并记录 `fixtureBaseCommit`。
3. 每个场景使用全新 `fork_turns: "none"` Implementer。Prompt 给当前 `manage-specs/SKILL.md` 绝对路径/Hash并要求完整读取，只提供工作目录、当前轮逐字消息、项目规则和读取禁区；完整 Scenario/Protocol、rubric、T010 和预期 diff 保持 evaluator-only。
4. Independent/Successor 等多轮确认由 Eval 主 Agent按 Protocol 在停点使用 `followup_task` 发送。主 Agent核对文件数量、ID/Revision、用户门、替代关系、Index、禁止路径及 Base 到最终树完整变化。
5. 每个场景使用一个与 Implementer 不同的全新 `fork_turns: "none"` Reviewer。Reviewer 只看用户批准 rubric、原始交互、Scenario、Protocol、final-tree diff、产物和命令证据。
6. 写入当前 Proposal/Scenario/Protocol/Fixture/Skill Hash、Agent ID、硬门槛、评分、命令、有序关键路径证据和 Reviewer 建议。环境无 token 数据时使用 `null` 和原因；不把墙钟时间写成质量字段或通过条件。
7. 任一场景失败时如实记为 `fail`，报告应重开 T010 还是 T009，不在本 Task 修 Skill或放宽门槛。四场 Reviewer pass 后把摘要与证据批量交用户；只有用户明确接受当前 Hash 才写 `userDecision: accepted`。

## 必须核对的差异

- 与旧 Brainstorm 直接新建日期文件相比，新流程优先复用 ID/Bundle。
- 与“为每个候选方案新建 Spec”相比，新流程在同一 Spec 记录方案和决定。
- 与“AI 自行新建/替代”相比，新流程在这两类写入前必须有用户明确确认。

## 验证与完成

- 四个 Scorecard 都通过 T002 合同并由用户最终 accepted。
- 四次硬门槛全部为 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`。
- 运行 `npm test`。
- 临时工作区已清理，仓库只留下脱敏证据和 Scorecard。
