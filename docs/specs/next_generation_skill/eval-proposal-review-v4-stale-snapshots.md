# Stale Skill Snapshot Haiku v4 Baseline Proposal 审核

- Status: `approved-baseline-observed`
- Batch ID: `haiku-v4-wave-7-stale-snapshots`
- Batch SHA-256: `sha256:4f339f0e380bb06de4d9e763aa8490be1cdee4e231cd8143ce1d0aaf4b2a7aa6`
- Manifest: [`eval-proposal-batch-v4-stale-snapshots.json`](./eval-proposal-batch-v4-stale-snapshots.json)
- Scope: `2` 个 Protocol v4 Haiku successor Proposal；历史 Sonnet Protocol、Baseline 与 pending Live authorization 保持原始 provenance。
- Run state at review creation: 未启动任何本 Batch 的 Haiku Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。
- Execution result: 两项 successor Baseline 已严格串行完成，均记录为有效 `fail / skill-behavior` Red；未将结果重标为历史 evidence。

## 审核边界

批准顶部 Batch ID 和 Batch SHA-256，仅授权严格串行执行这两个已绑定 successor Proposal 的 Baseline Observation。它不授权 Live Eval，不接受 Skill 输出，也不重标历史 Sonnet evidence。

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 2 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `2` 个 pending v4 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- `generating-tasks-v4-feature-policy-revalidation`：The successor preserves the original Fixture and task-generation boundary while reminting the unrun work as Protocol v4 for canonical Haiku agents.
- `generating-tasks-v4-migration-revalidation`：The successor preserves the original Fixture and migration-task boundary while reminting the unrun work as Protocol v4 for canonical Haiku agents.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 2 项逐项合同

### 01. `generating-tasks-v4-feature-policy-revalidation` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-v4-feature-policy-revalidation-haiku`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/proposal-approval.json)
- Project / case: `py-feature-policy-engine` / `generating-tasks-v4-feature-policy-revalidation`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 否
- 业务目标: 请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-v4-feature-policy-revalidation/scenario.md`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/scenario.md) = `a4a639c1e740b0c050049de820e570acac677d6405d8ebb924ef98c0077266bf`
- Protocol: [`test/skill-evals/generating-tasks-v4-feature-policy-revalidation/protocol.json`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/protocol.json) = `239cba58666ea63762aeea582b0eac3dd1469376504129bccb91d879b20825fb`
- Fixture: [`test/skill-evals/generating-tasks-v4-feature-policy-revalidation/fixture`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/fixture) = `552900ceea3fd669cf55a785143a6e1cc583645a28863365ab74afc286f21315`

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

### 02. `generating-tasks-v4-migration-revalidation` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-v4-migration-revalidation-haiku`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/proposal-approval.json)
- Project / case: `node-config-format-cli` / `generating-tasks-v4-migration-revalidation`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 否
- 业务目标: 请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-v4-migration-revalidation/scenario.md`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/scenario.md) = `f93f77f40a3b78671f7aa3dc77ffb40cd25fff04a79e7e88c847d32e15d59032`
- Protocol: [`test/skill-evals/generating-tasks-v4-migration-revalidation/protocol.json`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/protocol.json) = `b7ef1a72588a4c42001fe8fb628b49c4552f9195940d4cc47ca026c7bab467a8`
- Fixture: [`test/skill-evals/generating-tasks-v4-migration-revalidation/fixture`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/fixture) = `776e8dad7591a35621d54eb7234a9c382f87256be98c10775b66a2c51ed3b18e`

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

## 批准后的执行边界

每个 Baseline 使用 fresh、独立的 Haiku Implementer 与 Reviewer，并只记录真实 `fail` 或 `control-pass`。只有有效 Red 才可另行创建绑定当前 `generating-tasks` Skill snapshot 的 Live authorization。
