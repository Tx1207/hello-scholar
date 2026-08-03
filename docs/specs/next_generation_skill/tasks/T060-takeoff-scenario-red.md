# T060：为 `takeoff` 编写两个真实项目 Scenario 和对照 Baseline

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T001, T002
- Parallel: Yes。只创建评测资产和 absent / 修改前对照，不修改 `takeoff`。

## 为什么要做

`takeoff` 被保留为按需的方向判断 Skill。它的价值不是把任何方案说得更大胆，而是分清“旧结构只是惯性”与“公开 API、持久数据、文档化集成等真实合同”，然后给一个可证伪的高杠杆目标模型。只检查固定标题会奖励形式完整，却无法判断它是在挑战保守方案，还是在无视现实合同。

本 Task 用一对相反项目测试方向判断：一个确实应该删除内部兼容层，另一个必须保护真实外部合同。两场都由用户清楚表达放大目标的意图；未明确触发时的普通事实比较边界由 Router 与 T066 的静态合同保证，不单列运行时退出 Protocol。

## 原 Skill 与评测重点

完整保留当前 Skill 的方向层职责、至少一个显式 Frame-Opening Move、Thesis/Confidence/Options/First Proof Point/Falsifier/Payoff Ledger，以及“给取舍而非实施步骤”。也保留它只询问是否进入 Brainstorming/Landing、不会自动切换阶段的边界。

真实 Eval 重点检查：

- 先读本地事实，再判断兼容是合同还是惯性；
- 大胆方向包含清楚的保留/删除决定和可证伪条件，而不是口号；
- First Proof Point 是证据问题，不偷写第一个 PR、文件列表或执行顺序；
- 用户明确要求大胆不等于允许破坏真实外部承诺。

## 文件边界

### Add

- `test/skill-evals/takeoff-delete-internal-compat/scenario.md`
- `test/skill-evals/takeoff-delete-internal-compat/protocol.json`
- `test/skill-evals/takeoff-delete-internal-compat/proposal-approval.json`
- `test/skill-evals/takeoff-delete-internal-compat/fixture/`
- `test/skill-evals/takeoff-delete-internal-compat/baseline.json`
- `test/skill-evals/takeoff-delete-internal-compat/evidence/baseline/`
- `test/skill-evals/takeoff-protect-real-contract/scenario.md`
- `test/skill-evals/takeoff-protect-real-contract/protocol.json`
- `test/skill-evals/takeoff-protect-real-contract/proposal-approval.json`
- `test/skill-evals/takeoff-protect-real-contract/fixture/`
- `test/skill-evals/takeoff-protect-real-contract/baseline.json`
- `test/skill-evals/takeoff-protect-real-contract/evidence/baseline/`

### Must Not Modify

- `skills/hai-skills/takeoff/`
- `skills/hai-skills/landing/`
- 生产源码、Spec/Plan、AGENTS、README 或其他 Skill

## 场景 A：内部兼容惯性应该删除

`projectId: py-feature-flag-core`。Fixture 是一个可运行的 Python feature-flag 库。仓库内部同时保留 `LegacyFlagAdapter -> FlagService -> FlagStore` 三层，所有调用方和数据都在同一仓库；README 没有公开旧类，Git 历史说明它只是半完成重构的过渡层。用户给出一个继续加 shim 的保守方案，并明确要求“takeoff，别老想着兼容，重新看目标模型”。

合格判断必须：

1. 把真正决策提升为“是否仍需要两个内部模型”，而不是讨论 shim 命名。
2. 用 Zero-Legacy Thought Experiment、Kill The Wrong Concept 或 Tasteful Deletion 等至少一个显式打法，基于调用方/文档/持久格式证据说明兼容只是惯性。
3. 给清楚 thesis 和 kill list，说明现在付出的迁移成本、消除的具体重复状态/错误面，以及收益何时可观察。
4. 保留可证伪条件：如果发现真实外部消费者或 persisted contract，方向必须重判。
5. 不直接改代码、写 Spec/Plan、列实施步骤或自动进入 Landing。

## 场景 B：真实合同不能被“大胆”抹掉

`projectId: node-model-config-sdk`。Fixture 是一个与场景 A 不同的 Node 模型配置 SDK，包含公开 README、两个外部消费示例、版本化 JSON Schema、旧模型文件和兼容测试。用户明确说“greenfield this，把 legacy 全杀掉，给我一个高格局判断”。

合格判断必须：

1. 区分内部旧 wrapper 与公开 API、persisted JSON、文档化集成；后者是真合同，不因用户用了 bold 词就假装不存在。
2. 仍提出干净目标模型，可以删除内部双轨，但把外部合同的迁移/版本边界作为需要定价的约束。
3. Options 展示保守路线、干净目标、分阶段抵达干净目标的真实取舍，不暗中默认永久兼容，也不建议立即破坏消费者。
4. First Proof Point 问“哪些版本/消费者仍在使用旧格式”等最小证据；Falsifier 能推翻 thesis。
5. 停在方向判断并询问下一阶段，不输出 migration steps 或实现清单。

## Proposal、Baseline 与隔离

1. 两组 Scenario/Protocol/rubric 批量交用户审核，每个 case 有独立 Proposal ID/Hash/决定，并分别固定使用 `py-feature-flag-core`、`node-model-config-sdk`。两个 Fixture 的语言/依赖、项目规则、代码树、测试和合同状态彼此独立。rubric 覆盖事实阅读、合同分类、方向杠杆、可证伪性、Payoff Ledger、显式入口和无步骤漂移。
2. Fixture 包含 AGENTS、Git、可运行代码/测试、公共文档和会改变判断的真实调用/数据。预检环境与初始命令，提交并记录 `fixtureBaseCommit`。
3. 两场均声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`。每场由不同 `fork_turns: "none"` Implementer/Reviewer运行；当前 Skill 只交给 Live Agent，其他 Prompt 字段不含 T066、当前目标 Skill 文案或标准答案。
4. Reviewer 只看获批 rubric、原始请求、输出、项目证据和 Base-to-final 全部状态，检查是否把真实合同和惯性判反。
5. 预期 A/B absent 对照至少在高层重构、合同定价、证明问题或非步骤边界上失败。任一全绿时写 `control-pass` 并暂停该 Skill 后续验收，不人为强化题目；只有用户复核后才能用新 Proposal/Hash 修改场景。

## 验证与完成

- 两组 Baseline 通过 T002；只有真实 Red 打开 T066/T061，`control-pass` 交用户复核 Skill 是否有独立增益。
- 两个目录使用不同 `projectId`，各只计一个 `takeoff` primary case；不能用同一项目的多种答案重复计数。
- 运行 `npm test`，生产文件零修改。
