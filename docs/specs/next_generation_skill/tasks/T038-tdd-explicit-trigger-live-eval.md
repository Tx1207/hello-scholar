# T038：用当前 Codex subagent 验证 TDD 两类显式触发边界

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T037
- Parallel: No。三个 case 必须使用不同工作区和 Agent，评测期间不改 Skill。

## 目标

分别运行 T036 的 user-trigger 与 approved-task-trigger 场景，证明用户或当前 Approved Task 明确要求时，完整 Red-Green-Refactor 都能生效。普通 Bugfix 不自动启动 TDD 的边界由 Router、T037 和静态测试负责，不再用第三个运行时 no-auto case 重复证明。

## 文件边界

### Add

- `test/skill-evals/tdd-user-trigger/scorecard.json`
- `test/skill-evals/tdd-user-trigger/evidence/live/`
- `test/skill-evals/tdd-approved-task-trigger/scorecard.json`
- `test/skill-evals/tdd-approved-task-trigger/evidence/live/`

每个 evidence 目录只保存 Scorecard 引用的必要脱敏 Skill 读取、Red/Green 命令、时序和 final-tree diff，不保存临时工作区副本。

### Must Not Modify

- `skills/superpowers-skills/test-driven-development/`
- T036 的 Scenario、Protocol、Proposal、Fixture 和 Baseline
- Router、AGENTS、其他 Skill、`src/`

## 运行前合同

1. 完整读取 Workflow，确认三组 Proposal/Scenario/Protocol/Fixture Hash 仍获用户批准；变化时停止并重开 T036。
2. 每场创建新临时 Git 仓库，预检初始测试、绝对源码 CLI 和当前 Skill copy，提交并记录 `fixtureBaseCommit`。
3. 每个 Implementer/Reviewer 都使用 `gpt-5.6-terra`、不同 Agent ID 和 `fork_turns: "none"`。两个 Live case 都显式提供当前 `test-driven-development/SKILL.md` 的绝对路径/Hash并要求完整读取；这验证两种明确入口，不冒充名称自动激活。
4. Reviewer 只接收用户批准 rubric、原始请求、Skill 读取证据、命令时序及 Base 到最终树的 committed/index/working-tree/untracked/final-hash 证据。

## 两次执行

1. `tdd-user-trigger`：核对入口进入，Red 在生产修改前发生且因目标行为缺失失败，Green 在最小实现后通过，Refactor 后仍全绿。
2. `tdd-approved-task-trigger`：核对 Agent 实际读取 Approved/current Tasks 的 Process，再走同样严格顺序；实施授权与 Task 合同批准都有证据。
3. 每场由独立 Reviewer评分。无调用/分支遥测时，使用可核实的 Skill 读取记录、时序、命令和产物，不伪造平台 trace。
4. 写当前 Proposal/Scenario/Protocol/Fixture/Skill Hash、不同 Agent ID、Terra 模型、硬门、命令/退出码、`criticalPath` 顺序和 Reviewer 建议，不写 `timing`。任何 tests-after、假 Red 或把普通 Validation 当触发都记为 `fail`。
5. 两场 Reviewer pass 后，把输出、证据和建议作为一个批次交用户；只有用户明确接受当前 Hash，才分别写 `userDecision: accepted`。

## 验证与完成

- 两个 Scorecard 通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 用户显式入口和 Approved Task 入口的严格纪律都没有退化；未触发边界继续由 T037 的静态合同覆盖。
- supporting references Hash/bytes 未变化。
- 运行 `python3 -m unittest test/test_tdd_explicit_trigger.py` 和 `npm test`，清理两个临时工作区。
