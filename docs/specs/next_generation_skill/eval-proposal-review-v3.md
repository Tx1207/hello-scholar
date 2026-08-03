# Generating Tasks Sonnet v3 Proposal 批量审核

- Status: `pending-user-review`
- Batch ID: `generating-tasks-sonnet-v3-proposals-batch-v1`
- Batch SHA-256: `sha256:4f39d2a323c6e262850c9ffb76a54c25caaed06213d39ca0c4790a822bc82c0e`
- Manifest: [`eval-proposal-batch-v3.json`](./eval-proposal-batch-v3.json)
- Scope: 两个不计产品 Skill 覆盖的 `generating-tasks` Protocol v3 successor；两项均显式绑定持久化 provenance `claude-sonnet-5`。它们复用真实项目事实，但不复用任何 Terra Baseline、Scorecard、运行证据或批准决定。
- Run state at review creation: 未启动任何 Sonnet Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。

## 一次批准到底批准什么

用户批准时只需要明确回复上面的 **Batch ID** 和 **Batch SHA-256**。这个 Hash 对应 manifest 的完整 UTF-8 bytes；manifest 再逐项绑定两份 `scenario.md`、两份 `protocol.json`、两棵 Fixture 文件树，以及一份共享用户价值 rubric。因此，一次批准不是模糊地同意“两个 case 看起来差不多”，而是同意 manifest 中列出的这些确定 bytes。

批准只打开 **Baseline Observation**，不代表接受任何 Skill 输出，不授权 Live Eval，也不把 Reviewer 建议当成用户的最终质量决定。某场 Baseline 如果得到诚实的 `control-pass`，该场立即暂停，不能人为制造 Red。

### 批准范围内的不可变 bytes

- 每份 `scenario.md` 的完整 bytes，由该项 `scenarioSha256` 绑定。
- 每份 `protocol.json` 的完整 bytes，由该项 `protocolSha256` 绑定；其中包括业务 rubric、hard rejects、Prompt 隔离、canonical `claude-sonnet-5` Agent provenance 和不含墙钟门的 critical path。
- 每棵 Fixture 中排序后的相对 POSIX 路径和文件 bytes，由该项 `fixtureSha256` 绑定。算法排除 `.git`、`__pycache__`、`.DS_Store` 和 `.hello-scholar-install.json`，拒绝 symlink、junction 和特殊节点。
- [`user-value-rubric.json`](../../../test/skill-evals/user-value-rubric.json) 的完整 bytes，由 manifest 顶层共享 Hash 绑定。
- [`eval-proposal-batch-v3.json`](./eval-proposal-batch-v3.json) 自身的规范化完整 bytes，由本页顶部的 Batch SHA-256 绑定。

### 不在这次批准中的 mutable bytes

- `proposal-approval.json`：待审记录中的三份输入 Hash 必须已经与 manifest 一致；用户批准后还要修改 `decision` 和最小脱敏 `replyEvidence`，所以不能把 Approval 文件自己的 bytes 放进自引用批次。
- 后续 Baseline、Scorecard 和 `evidence/`：它们必须来自真实运行，当前不能预造。
- 生产 Skill：只有某场出现真实 Red Baseline 后才进入对应实现和 Live Eval。
- 所有历史 Protocol v1/v2、Terra Approval、Baseline、Scorecard 和 evidence：它们继续按原 Hash 只读保存，不属于本批次。

任何已绑定 Scenario、Protocol、Fixture、共享 rubric 或 manifest 发生语义变化，当前 Batch SHA-256 都失效；受影响的场景必须以新 Hash 重新交用户审核，不能只改 Approval 数字。

## 两组独立质量门

每场都分别通过“场景业务 rubric”和“共享用户价值 rubric”。两组不能互相平均补分；任一 critical 维度、任一组总分或任一 hard reject 失败，整场就失败。Reviewer 每维只能使用 `0 / 90 / 100`，并引用交互、文件、完整树或命令证据：

- `0`：存在材料性缺失、事实错误、越权或没有证据。
- `90`：核心行为与边界全部满足，只剩轻微表达或组织问题。
- `100`：所有可观察要求都有直接证据，且没有可定位缺陷。

共享用户价值 rubric 的五个等权 critical 维度是：

- `value-visibility`：先让用户看到结果、决定或文档价值。
- `audience-fit`：语言、术语和技术深度匹配用户与项目。
- `information-design`：容易扫描，正式文档离开聊天仍可独立使用。
- `actionability`：决定、未知项、owner、下一步或停点明确。
- `signal-to-noise`：没有样板话、重复结论、评测内部叙述和无关细节。

生成区先完整展示一次这五维及当前 criterion；每个 Proposal 只引用同一事实源，避免重复淹没业务差异。

## Critical path 怎么读

每项都用一句话写清从当前请求到有效结果的最短合理流程。它回答三件事：

- 哪些事实或最小记录必须先具备；
- 哪个动作才算真正进入任务，而不是只解释流程；
- 哪些说明、整理或终态文档应延后，不能挡在关键动作前。

通过与否由业务 rubric、hard rejects、获批命令、产物和完整树证据共同判断，不使用分钟或毫秒阈值。runner 的 watchdog 只防止运行无限占用资源；触发时表示本次运行未完成，不能直接冒充 Skill 质量失败。

## 与历史 Terra cohort 的边界

- Protocol v1 只保存历史 Baseline；Protocol v2 是被冻结的 Terra 历史 cohort，不能新增或重写 run evidence。
- Protocol v3 是唯一未来正式 Eval cohort。持久化协议、manifest、Baseline 和 Scorecard 记录 `claude-sonnet-5`；实际 Claude Code Agent 启动时使用 selector `sonnet`，selector 不写入 Hash-bound evidence。
- Sonnet 不可用是环境阻塞：不能静默回退到 Terra、Opus 或其它模型，也不能把替代模型的输出冒充 v3 evidence。
- 实际 Live Eval 仍要求不同的新 Implementer/Reviewer Agent ID 和 `forkTurns: none`；本次 Proposal 批准不授权这些运行。

## 机器能证明什么，用户仍要判断什么

静态合同可以证明：本页逐项内容与 manifest 完全一致；manifest 正好覆盖当前两个 v3 Proposal；三份输入 Hash、共享 rubric、业务 rubric、hard rejects、`agentModel` 和 critical path 都与仓库当前 bytes 一致；两项均为 pending、non-counting，并且不含 Baseline、Scorecard 或 `evidence/`。

静态合同不能替用户判断：这两个业务目标是否值得评测、rubric 是否真正代表“好输出”、hard rejects 是否过严或过松、critical path 是否符合真实工作习惯。下面的逐项内容正是留给用户做这部分质量裁决的材料。

## 2 个 Proposal 逐项审核

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 2 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `2` 个 pending v3 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- `generating-tasks-v3-feature-policy`：This Sonnet v3 successor reuses the real feature-policy project facts without copying any Terra Baseline, Scorecard, run evidence, or approval decision.
- `generating-tasks-v3-migration`：This Sonnet v3 successor reuses the real config-migration project facts without copying any Terra Baseline, Scorecard, run evidence, or approval decision.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 2 项逐项合同

### 01. `generating-tasks-v3-feature-policy` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-v3-feature-policy-sonnet`](../../../test/skill-evals/generating-tasks-v3-feature-policy/proposal-approval.json)
- Project / case: `py-feature-policy-engine` / `generating-tasks-v3-feature-policy`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 否
- 业务目标: 请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-v3-feature-policy/scenario.md`](../../../test/skill-evals/generating-tasks-v3-feature-policy/scenario.md) = `b0d3541a632f212fa545ffe56cc1b9059f2c7ed48f6cb8b9536582d4ac31f816`
- Protocol: [`test/skill-evals/generating-tasks-v3-feature-policy/protocol.json`](../../../test/skill-evals/generating-tasks-v3-feature-policy/protocol.json) = `932c163d7ce551f30b08a4b027bed96fb4edbab8884f04f16a7f1621447f02f1`
- Fixture: [`test/skill-evals/generating-tasks-v3-feature-policy/fixture`](../../../test/skill-evals/generating-tasks-v3-feature-policy/fixture) = `552900ceea3fd669cf55a785143a6e1cc583645a28863365ab74afc286f21315`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `task-document-contract` - 权重 `25%`，critical `true`，最低 `90`：Confirm tasks.md binds SPEC-003 revision 2 and Plan revision 1, initializes revision 1 with pending-review, null approved revision and pending status, and gives every Task all required independently readable sections.
- `coverage-and-dependencies` - 权重 `30%`，critical `true`，最低 `90`：Confirm unique Tasks cover every Spec acceptance criterion and Plan migration, cleanup, regression and rollback obligation with exact files and an acyclic graph whose parallel writers do not overlap or depend on one another.
- `validation-and-tdd-boundary` - 权重 `30%`，critical `true`，最低 `90`：Confirm every Task has executable validation, observable expected signals and checkable completion, and Red-Green-Refactor appears only on the precedence behavior explicitly selected by the approved Plan.
- `scope-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm only same-Bundle tasks.md and CLI-generated indexes are written, Tasks remain unapproved and unimplemented, and Spec, Plan, Architecture, runtime, tests, packages, Runs and legacy paths remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates Tasks without kind tasks, SPEC-003/spec revision 2/plan revision 1 bindings, or the exact revision 1 pending-review approval state
- omits a unique Task ID, plain-language goal, Spec Coverage, Depends On, Parallel, Files, Work, Validation, or Completion from any top-level Task
- modifies Spec, Plan, Architecture, source, tests, or package files
- omits any AC, migration, cleanup, or rollback obligation
- marks Tasks approved or begins implementation
- applies TDD to tasks whose Approved Plan does not select it or drops Red-Green-Refactor from the selected behavior
- uses cyclic dependencies, dependent or same-file parallel Tasks, placeholders, non-observable validation, or context-dependent shorthand
- reopens architecture decisions already fixed by the Accepted Spec and Approved Plan
- writes a global tasks directory or hello-scholar/memory path
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the Accepted Spec and Approved Plan, then produce the first independently executable Task coverage result without implementing it.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `generating-tasks-v3-migration` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-v3-migration-sonnet`](../../../test/skill-evals/generating-tasks-v3-migration/proposal-approval.json)
- Project / case: `node-config-format-cli` / `generating-tasks-v3-migration`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 否
- 业务目标: 请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-v3-migration/scenario.md`](../../../test/skill-evals/generating-tasks-v3-migration/scenario.md) = `0a2f24b5e5a77a25aa5749831dd4707b6eaded6c0e4fe857e63f8135d6bec016`
- Protocol: [`test/skill-evals/generating-tasks-v3-migration/protocol.json`](../../../test/skill-evals/generating-tasks-v3-migration/protocol.json) = `1f2fd5fe7bd548fc6d33d16531f4cf892fdabcd4981781b037472eac554337a1`
- Fixture: [`test/skill-evals/generating-tasks-v3-migration/fixture`](../../../test/skill-evals/generating-tasks-v3-migration/fixture) = `776e8dad7591a35621d54eb7234a9c382f87256be98c10775b66a2c51ed3b18e`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `task-document-contract` - 权重 `20%`，critical `true`，最低 `90`：Confirm tasks.md binds SPEC-014 revision 3 and Plan revision 2, starts at revision 1 pending-review with null approved revision and pending status, and every unique Task contains all required standalone sections.
- `migration-and-cutover-sequence` - 权重 `35%`，critical `true`，最低 `90`：Confirm distinct dependency-ordered Tasks preserve migration preparation, dual-read proof, persisted-profile conversion and an evidence-gated format cutover with explicit recovery when the gate fails.
- `cleanup-regression-and-rollback` - 权重 `30%`，critical `true`，最低 `90`：Confirm later Tasks name exact legacy profile, writer, flag and codec-dependency removals, require prerequisite evidence, cover the complete regression matrix, and include an executable rollback drill with expected signals.
- `scope-and-parallel-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm dependent or same-file migration Tasks are not parallel and only tasks.md plus generated indexes change, with no migration execution, data, state, source, tests, vendor, package, lockfile, backup or approval mutation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates Tasks without kind tasks, SPEC-014/spec revision 3/plan revision 2 bindings, or the exact revision 1 pending-review approval state
- omits a unique Task ID, plain-language goal, Spec Coverage, Depends On, Parallel, Files, Work, Validation, or Completion from any top-level Task
- collapses migration preparation, compatibility reading, conversion, cutover, cleanup, regression, or rollback into an implementation-new-format happy path
- deletes a legacy profile, writeLegacyConfig, --legacy-output, or the local codec dependency without the Approved Plan's prerequisite evidence and recovery action
- uses cyclic dependencies or marks dependent or same-file writers as parallel
- uses placeholders, context-dependent shorthand, generic cleanup, or validation without an executable command and observable expected signal
- modifies or approves upstream documents, data, migration state, source, tests, vendor, package metadata, or lockfile, runs migration, or begins implementation
- reopens the persistence format or migration decisions fixed by the Accepted Spec and Approved Plan
- writes a global tasks directory, hello-scholar/memory, backup, or migration report
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the approved migration contract, then produce dependency-ordered cutover, cleanup, regression, rollback, and recovery Tasks without running them.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 推荐决定

推荐按顶部 Batch ID 与 Batch SHA-256 整批批准当前两个 Protocol v3 Proposal。批准后只更新对应 Approval 记录，并用 Claude Code selector `sonnet` 打开 Baseline Observation，同时在保存的 run provenance 中保持 `claude-sonnet-5`；每个 Baseline 和后续 Live Eval 的输出质量仍分别交用户审核，不能沿用这次 Proposal 批准代替结果接受。
