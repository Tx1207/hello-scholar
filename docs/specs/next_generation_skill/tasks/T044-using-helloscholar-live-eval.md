# T044：用当前 Codex subagent 验证五路 Router

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T014, T017, T020, T023, T035, T038, T041, T043
- Parallel: No。这是 PR 6 的 Router 集成验收，评测期间不得改任何 Skill。

## 目标

逐个运行 T042 的五个场景，证明 Router 能从项目状态和当前意图选对立即路径。特别验证 Fast Path 的文档成本为零、Execution 不重复设计、Experiment 不越过 Record 门、Maintenance 不触碰无关文档。

## 与旧 Router 的差异证据

- 不能只看回答是否打印 `Fast/Design/...` 标签；必须看实际调用的下游 Skill、文件 diff 和审批门。
- 新 Router 应比旧“1%”规则少做无关 Skill 调用，但仍必须在明确实验/设计/维护场景调用正确 owner。
- Fast Path 必须直接完成必要修复和真实测试；质量由获批 `criticalPath` 的有序行为和证据判断，不记录或比较墙钟速度。

## 文件边界

### Add

- `test/skill-evals/router-fast/scorecard.json`
- `test/skill-evals/router-fast/evidence/live/`
- `test/skill-evals/router-design/scorecard.json`
- `test/skill-evals/router-design/evidence/live/`
- `test/skill-evals/router-execution/scorecard.json`
- `test/skill-evals/router-execution/evidence/live/`
- `test/skill-evals/router-experiment/scorecard.json`
- `test/skill-evals/router-experiment/evidence/live/`
- `test/skill-evals/router-maintenance/scorecard.json`
- `test/skill-evals/router-maintenance/evidence/live/`

每个 `evidence/live/` 只保存 Scorecard 引用的必要脱敏调用记录、diff 摘要和命令输出；不得覆盖 Baseline 证据或提交临时工作区副本。

### Must Not Modify

- `skills/superpowers-skills/using-helloscholar/`
- 所有下游 Skill
- 五个场景的 Scenario、Protocol、Baseline 和 Fixture 原件
- `src/`、AGENTS、README

## 执行方法

1. 按 Workflow 核对五组 Proposal/Scenario/Protocol/Fixture Hash 仍获用户批准；为每场创建干净临时 Git 工作区，预检绝对源码 CLI/初始命令/当前 Skill copy，提交并记录 `fixtureBaseCommit`。
2. 每个场景使用全新 `fork_turns: "none"` Implementer。Prompt 提供当前 Router和允许下游 Skill的绝对 `SKILL.md` 路径/Hash map并要求按需要完整读取；它只看到工作目录、当前轮逐字消息、项目规则和读取禁区，不看到完整 Scenario/Protocol、rubric、T043 路由表或预期答案。
3. Eval 主 Agent从工具调用/输出、实际文件、命令和 diff 判断路由；记录被调用 Skill、有序关键动作和验证证据。Implementer under test 是产品主 Agent，不嵌套派发执行 subagent。
4. Fast 场景运行真实聚焦测试、不进入 TDD branch，并断言五类核心文档零变化；Design 场景停在用户审批门；Execution 场景经脚本化实施授权后由当前 Implementer直接复用已批准/current Tasks；Experiment 场景 Record 早于命令；Maintenance 场景只有 Index 变化。
5. 每个场景派发不同的全新 `fork_turns: "none"` Reviewer，只给获批 rubric、原始交互、Scenario、Protocol、Base-to-final diff、产物和验证证据，不给路由期望表。
6. 写当前全部 Hash、Agent ID、硬门、命令、评分和 Reviewer 建议。失败时区分 Router 与下游 Skill，重开对应 Implementation Task；本 Task 不修实现。五场 pass 后批量咨询用户，只有用户明确接受当前 Hash 才标记 accepted。

## 验证与完成

- 五个 Scorecard 通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- Fast 场景新增/修改 Spec、Plan、Tasks、Record、Architecture 数量为 0。
- Design/Execution 的 Bundle 数量符合预期；Experiment 的根目录 Run 合法；Maintenance 第二次 sync 零 diff。
- Execution 与所有场景均未调用九个已淘汰 Skill或 `project-structure`；Fast 未显式指定时没有 TDD 调用。
- Implementer/Reviewer ID 每场不同，五个场景之间不复用上下文或临时产物。
- 运行 Router 聚焦测试、T023/T038/T041 静态测试和 `npm test`。
- 所有临时工作区已清理，仓库只留脱敏 Scorecard/证据。
