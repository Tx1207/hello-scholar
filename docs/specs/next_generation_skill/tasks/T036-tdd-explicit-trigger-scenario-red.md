# T036：为 TDD 显式触发价值编写两个 Scenario 和 Red Baseline

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T001, T002
- Parallel: Yes。只准备评测资产，不修改 `test-driven-development`。

## 用户已确认的决定

保留 `test-driven-development`，但默认不因 Feature、Bugfix、重构或 Skill 修改自动启动。只有用户明确指定，或当前 Approved Task 明确要求 TDD 时才调用；一旦调用，Red-Green-Refactor 和“先看到正确失败”仍是完整硬门。

## 当前 Skill 与目标 Skill 比较

| 当前行为 | 目标行为 |
|---|---|
| Front Matter 写“任何 feature 或 bugfix，在实现前使用” | 保留窄 model invocation，只让用户或 Approved Task 明确要求 TDD 的语言命中 |
| `When to Use` 对 feature、bugfix、refactor、behavior change 写 `Always` | 未显式触发时读取入口后退出，仍按 AGENTS/Task 做普通测试与验证 |
| 一旦进入 TDD，禁止先写生产代码 | 完整保留 |
| 支持 unit/contract/prompt/RAG/agent/research/skill evidence | 完整保留，不退化成只会单元测试 |

## 文件边界

### Add

- `test/skill-evals/tdd-user-trigger/scenario.md`
- `test/skill-evals/tdd-user-trigger/protocol.json`
- `test/skill-evals/tdd-user-trigger/proposal-approval.json`
- `test/skill-evals/tdd-user-trigger/fixture/`
- `test/skill-evals/tdd-user-trigger/baseline.json`
- `test/skill-evals/tdd-user-trigger/evidence/baseline/`
- `test/skill-evals/tdd-approved-task-trigger/scenario.md`
- `test/skill-evals/tdd-approved-task-trigger/protocol.json`
- `test/skill-evals/tdd-approved-task-trigger/proposal-approval.json`
- `test/skill-evals/tdd-approved-task-trigger/fixture/`
- `test/skill-evals/tdd-approved-task-trigger/baseline.json`
- `test/skill-evals/tdd-approved-task-trigger/evidence/baseline/`

每个 evidence 目录只保存对应 Baseline 引用的最小脱敏调用、命令、有序交互和 final-tree diff 证据。

### Must Not Modify

- `skills/superpowers-skills/test-driven-development/`
- `skills/superpowers-skills/using-helloscholar/`
- AGENTS、`src/`、其他 Skill

## 两个独立真实项目场景

两个 Fixture 使用不同 `projectId`、不同代码树和不同问题域，不是同一项目的复制品。每个都有自己的 AGENTS、Git Base、可运行测试和会影响流程判断的真实状态；它们不能共享 Agent、工作区或运行产物。未触发时的普通测试/验证边界由 Router 与 T037 静态合同保证，不单列运行时退出 Protocol。

### Case A：用户明确要求 TDD

- `projectId: node-rate-window`。Fixture 是一个 Node.js 滑动窗口限流库，用户要增加明确的边界行为，现有 `node:test` 覆盖正常路径但缺少该能力。
- 用户明确写“使用 `$test-driven-development` 完成”。
- Protocol 声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`，用 Baseline 证明没有该指令时通用 Agent不能稳定给出有效 Red-Green-Refactor，并要求 Live Agent 完整读取当前 Skill 后进入 TDD；这不是 Loader 故障。
- 目标行为先选择最便宜能证明行为的 evidence artifact，运行并看到因目标行为缺失而失败，再写最小生产修改、跑 Green、必要时 Refactor 并保持全绿。
- 测试配置错误、语法错误、本来就通过或生产改动后的补测都不是有效 Red。

### Case B：Approved Task 明确要求 TDD

- `projectId: py-config-upgrader`。Fixture 是一个独立的 Python 配置升级 CLI，含 Current Tasks：当前 Revision 已 `approval: approved`、`approved_revision == revision`，对应迁移校验 Task 明确写 `Process: test-driven-development`；当前用户只另行授权执行，没有重复说 TDD。
- Protocol 同样声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`。目标行为把获用户批准的 Task Process 视为显式触发；Live Agent 完整读取当前 Skill 后执行完整 Red-Green-Refactor。
- 只有普通 `Validation`、`npm test` 或“补测试”字样的 Task 不满足这个触发合同；Fixture 必须有明确 Process，避免靠关键词猜。

## Proposal、预检与 Agent 隔离

1. 两组 Scenario/Protocol/rubric 作为一个 Proposal 批次交用户；每个 `proposal-approval.json` 绑定 Proposal ID、当前 Scenario/Protocol/Fixture Hash 和明确回复证据。Protocol 使用上面的两个 `projectId`，用户审核时确认它们不是复制项目；批准前不运行 Baseline。
2. 预检绝对源码 CLI、Git、初始测试和预期 Skill snapshot。两场的 absent 是目标条件；其他依赖失败不算 Red。
3. 每个临时仓库提交并记录 `fixtureBaseCommit`。Implementer/Reviewer 都是不同的 `fork_turns: "none"` Agent；两场 Baseline 都不伪造目标文件。
4. Reviewer 只接收获批 rubric、原始请求、有序命令证据和 `base..HEAD + index + working tree + untracked + final hashes`，不接收 T037 或隐藏答案。
5. 两份 Baseline 分别绑定自己的 Proposal/Fixture/Skill snapshot并如实为 `fail | control-pass`；任一全绿时暂停 TDD 后续验收，只有用户复核后才能用新 Proposal/Hash 调整场景，不能直接加难度。

## 验证与完成

- 两组 Protocol/Baseline 通过 T002；只有真实 `fail` 的目录才计作 `test-driven-development` case，`control-pass` 停在人审门。
- 两场都确认 Red 的失败原因真实，且不是环境问题。
- 运行 `npm test`，本 Task 没有修改生产 Skill。
