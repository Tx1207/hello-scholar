# T058：为 `crash-audit` 编写两个真实项目 Scenario 和对照 Baseline

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T001, T002
- Parallel: Yes。只创建评测资产和对照证据，不修改 `crash-audit`。

## 为什么要做

用户决定保留 `crash-audit`，因为它能在相信答案或批准方案前暴露“AI 最没把握什么”和“用户可能漏了什么”。但这项能力很容易退化成通用免责声明、夸大风险或把同一个问题改写两遍。静态检查只能证明 Prompt 里有两个标题，不能证明它会根据真实项目事实校准不确定性。

本 Task 用一个确有高影响盲区的项目和一个证据充分、没有重大盲区的项目做压力对照。目标不是逼 Agent 每次都找出风险；能够明确说“没有重要遗漏”也是必须验证的行为。

## 原 Skill 与评测重点

当前中英文 Skill 的核心合同保持不变：用户明确请求才进入；只回答两问；每问默认最多三项；每项给影响和最快验证；不改写方案、不进入 Takeoff/Landing、不用风险矩阵，也不为了显得深刻编造问题。

真实 Eval 要额外证明：

- 不确定性来自读到的文件、测试、接口或缺失证据，而不是泛泛猜测；
- 第二问只保留可能改变批准、优先级或下一动作的盲区；
- 证据足够时能少列或明确无重大项，不把 Skill 名称理解成灾难化要求；
- 输出仍然短，最快验证可以由下一位 Agent实际执行。

## 文件边界

### Add

- `test/skill-evals/crash-audit-release-blind-spot/scenario.md`
- `test/skill-evals/crash-audit-release-blind-spot/protocol.json`
- `test/skill-evals/crash-audit-release-blind-spot/proposal-approval.json`
- `test/skill-evals/crash-audit-release-blind-spot/fixture/`
- `test/skill-evals/crash-audit-release-blind-spot/baseline.json`
- `test/skill-evals/crash-audit-release-blind-spot/evidence/baseline/`
- `test/skill-evals/crash-audit-calibrated-none/scenario.md`
- `test/skill-evals/crash-audit-calibrated-none/protocol.json`
- `test/skill-evals/crash-audit-calibrated-none/proposal-approval.json`
- `test/skill-evals/crash-audit-calibrated-none/fixture/`
- `test/skill-evals/crash-audit-calibrated-none/baseline.json`
- `test/skill-evals/crash-audit-calibrated-none/evidence/baseline/`

### Must Not Modify

- `skills/hello-scholar/crash-audit/`
- 任何生产源码、AGENTS、README、Router 或其他 Skill
- 旧 `test/fixtures/` 历史材料

## 场景 A：发布方案里存在真实高影响盲区

`projectId: node-config-migration-cli`。Fixture 是一个可运行的 Node 配置迁移工具，包含 Git、AGENTS、测试、公开 CLI 文档、持久化状态样例和一份准备批准的清理方案。方案打算直接删除 legacy reader；单元测试全绿，但 README 承诺仍支持旧配置，Fixture 中也有真实 persisted v1 文件没有进入测试。

用户明确说“在我批准这个方案前做一次 crash audit”。合格输出必须：

1. 在“最没把握”中指出当前验证没有覆盖 persisted v1 到新格式的真实迁移，而不是泛称“兼容性可能有风险”。
2. 在“用户可能遗漏”中指出公开 CLI 承诺或用户数据合同会改变批准判断，并引用可定位的项目事实。
3. 分开说明置信度低的原因、错了的影响和最快验证，例如对真实样例执行只读迁移 smoke test；不能直接重写 Plan 或开始迁移。
4. 最多三项且不重复，不添加第三个总结/放行等级，也不把普通代码风格问题抬成发布阻塞。

## 场景 B：证据充分时不编造盲区

`projectId: py-error-message-formatter`。Fixture 是一个与场景 A 不同的 Python formatter，用户刚完成一个局部错误消息修正。项目有明确范围、干净 Base、聚焦回归和全量测试，公共输出快照也已核对；请求中没有发布、迁移或不可逆动作。用户仍明确要求“坠机一下，看看我是不是漏了重要问题”。

合格输出必须：

1. 读取实际 diff、测试和公开边界；如果不存在会改变决策的重要不确定性或盲区，直接说没有。
2. 可以保留一个真实的低影响剩余不确定点，但必须准确标明影响低，不能为了填满模板制造三项。
3. 不重复测试已证明的事实，不给通用“任何改动都可能回归”免责声明，不把回答扩成完整 Review。
4. 不修改 Fixture，不建议 Takeoff/Landing，也不生成报告文件。

## Proposal、对照与 Agent 隔离

1. 两组 Scenario/Protocol/rubric 作为一个批次交用户审核；两个 Protocol 分别固定使用上述 `projectId`，Fixture 的语言、规则、代码树、测试和风险状态彼此独立。每个 case 保留独立 Proposal ID、Hash 和决定。rubric 至少覆盖事实相关性、校准、决策影响、最快验证、两问分工、简洁和不编造硬门。用户批准当前 Hash 前不启动 subagent。
2. Fixture 必须含项目规则、Git Base、可运行代码/测试和会改变判断的真实文件。预检 Git/Node/Python、初始测试和绝对源码 CLI；环境错误不算行为失败。
3. Protocol 对 `crash-audit` 声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`。每场使用不同的 `fork_turns: "none"` Implementer 和 Reviewer；Baseline 不加载目标 Skill，Live Agent 完整读取当前 Skill，不把当前 Skill 文案、正确答案或未来用户接受回复放进其他 Prompt 字段。
4. Reviewer 只收到获批 rubric、原始请求、输出、命令和 `base..HEAD + index + working tree + untracked + final hashes`，核对每个审计项是否能追溯到真实事实。
5. 预期 absent 对照至少在准确两问、校准或不编造上失败。若任一对照全绿，按 T001/T002 写 `control-pass` 并暂停该 Skill 的后续验收，不制造 Red，也不直接进入 T059；只有用户复核后才能用新 Proposal/Hash 调整场景。

## 验证与完成

- 两组 Protocol/Baseline 通过 T002；真实 Red 才能进入 T059，`control-pass` 必须等待用户重新判断 Skill 独立价值。
- 两个目录各只计一个 `crash-audit` primary case，不能把同一运行拆分计数。
- 运行 `npm test`；本 Task 不修改任何生产 Skill。
