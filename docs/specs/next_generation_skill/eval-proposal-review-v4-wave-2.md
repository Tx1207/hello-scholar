# Haiku v4 Baseline Proposal 批量审核 — 2 plan tasks

- Status: `pending-user-review`
- Batch ID: `haiku-v4-wave-2-plan-tasks`
- Batch SHA-256: `sha256:095127bc045576f905a778344b15f06a51629552dc1e9884b42315ff29c195ba`
- Manifest: [`eval-proposal-batch-v4-wave-2.json`](./eval-proposal-batch-v4-wave-2.json)
- Scope: `4` 个待审 Protocol v4 Proposal，覆盖 `generating-tasks、writing-plans`；全部计入候选产品 Skill 覆盖，但只有后续真实 Red、Live 通过并由用户接受后才成为 accepted coverage。
- Run state at review creation: 未启动任何本 Batch 的 Haiku Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。

## 这次审核的边界

本页与 manifest 固定当前 `4` 个 Scenario、Protocol、Fixture 与共享用户价值 rubric 的完整输入。批准顶部的 Batch ID 和 Batch SHA-256 后，授权的仅是这批完全绑定输入的 **Baseline Observation**；不接受任何 Skill 输出，不授权生产代码修改，不授权 Live Eval，也不代替后续对 Scorecard 的用户决定。

任何已绑定 Scenario、Protocol、Fixture、共享 rubric 或 manifest 的语义变更都会改变 Batch SHA-256；受影响的 Proposal 必须以新 Hash 重新审核。

## Fixture 可见性

Implementer 只会看到隔离 Fixture、当前用户请求、Fixture `AGENTS.md`、允许的 Skill snapshot/hash、绝对 CLI、读取边界和安全停止条件。完整 Scenario、Protocol、rubric、hard rejects、预期答案、Reviewer 判断与未来消息仍是 evaluator-only，不会暴露给 Implementer。

## 逐项审核材料

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 4 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `4` 个 pending v4 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 4 项逐项合同

### 01. `writing-plans-bundle-v3` - `writing-plans`

- Proposal ID: [`proposal-writing-plans-bundle-v3-haiku-v4`](../../../test/skill-evals/writing-plans-bundle-v3/proposal-approval.json)
- Project / case: `py-event-export-service` / `writing-plans-bundle-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 请使用 `$writing-plans`，从当前 Accepted `SPEC-017` revision 3 生成同一 Spec Bundle 下可单独审核的高层 `plan.md`。Plan 要写清实现目标、范围、技术方案、模块和文件边界、接口、阶段、测试/实验、迁移、清理、回滚和 Tasks 生成规则，但不要写 Task 复选框、逐步源码、微操作清单、逐步 commit 或执行器选择，也不要创建 `tasks.md` 或开始实现。先生成 `draft` 并停下来等我审核。

**当前不可变输入**

- Scenario: [`test/skill-evals/writing-plans-bundle-v3/scenario.md`](../../../test/skill-evals/writing-plans-bundle-v3/scenario.md) = `bf56bce58c5e905e0abbda0ac05d17188c655fbdf3c2ac0e696712aaa5d706a9`
- Protocol: [`test/skill-evals/writing-plans-bundle-v3/protocol.json`](../../../test/skill-evals/writing-plans-bundle-v3/protocol.json) = `34854e45a76fd8472cd361dfc08e67175428f68bbb95da718def1a467d3b12ad`
- Fixture: [`test/skill-evals/writing-plans-bundle-v3/fixture`](../../../test/skill-evals/writing-plans-bundle-v3/fixture) = `41215692930d1d9619c9b633cc4ad937b985961d6e3c1d3c416ed40cfd1560c2`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `source-and-gate-reading` - 权重 `25%`，critical `true`，最低 `90`：Confirm the Plan reads Architecture, accepted SPEC-017 revision 3, source, tests, replay caller, and project rules as fixed inputs, and retains revision 1 as draft before the separate approval decision.
- `high-level-plan-contract` - 权重 `30%`，critical `true`，最低 `90`：Confirm plan.md is independently reviewable as a high-level implementation strategy with goal, scope, approach, module and file boundaries, interfaces, phases, and testing, without a Task checklist, source-level procedure, or executor selection.
- `coverage-and-migration` - 权重 `25%`，critical `true`，最低 `90`：Confirm every accepted interface, compatibility, migration, cleanup, error, rollback, and must-not-touch constraint is mapped, including the rule that later Tasks generation follows Plan approval.
- `scope-and-routing` - 权重 `20%`，critical `true`，最低 `90`：Confirm only the Bundle Plan and generated indexes change, approval changes only after the separate review message, and the response stops with generating-tasks as the next owner without Tasks, code, Runs, or upstream edits.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes outside the current Bundle Plan and generated indexes
- creates tasks.md, implementation code, tests, Runs, an implementation report, or a memory artifact
- uses Task checkboxes, complete implementation code, executor micro-steps, per-step commits, or execution-agent options in the Plan
- omits an accepted criterion, public interface, migration, cleanup, rollback, or must-not-touch boundary
- marks the Plan approved before the separate review message or begins implementation after approval
- changes the accepted Spec or makes an unaccepted architecture or public-contract decision
- routes somewhere other than generating-tasks after Plan approval
- reads a repository-wide task packet, production Skill, or other evaluation evidence

**Critical path**: Read the accepted archive contract and real implementation boundaries, create a reviewable high-level draft Plan, then stop before Tasks or code.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `writing-plans-spec-gap-v3` - `writing-plans`

- Proposal ID: [`proposal-writing-plans-spec-gap-v3-haiku-v4`](../../../test/skill-evals/writing-plans-spec-gap-v3/proposal-approval.json)
- Project / case: `node-webhook-signing-service` / `writing-plans-spec-gap-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 请使用 `$writing-plans` 为当前 Accepted `SPEC-026` 生成实施 Plan，重点覆盖多 key rotation、失败响应和旧签名迁移。先结合真实 handler、verifier、调用方和测试检查 Spec 是否足以约束实现；如果仍有会改变公共 API、安全边界或迁移路径的重大决定没有定稿，请明确列出影响和最小澄清问题，零写入停止并让我先回到 `brainstorming/manage-specs`。不要替我选择方案，也不要先创建一个草稿 Plan 占位。

**当前不可变输入**

- Scenario: [`test/skill-evals/writing-plans-spec-gap-v3/scenario.md`](../../../test/skill-evals/writing-plans-spec-gap-v3/scenario.md) = `9b6c1f2721a5ac545850003bc1fea9a7e02267620dbc6045b13cebf1ac5b7020`
- Protocol: [`test/skill-evals/writing-plans-spec-gap-v3/protocol.json`](../../../test/skill-evals/writing-plans-spec-gap-v3/protocol.json) = `81beb0ca5b78e5ae0bfc06d8071379fc30e8e45b7b916772b2bb9701a1b39f42`
- Fixture: [`test/skill-evals/writing-plans-spec-gap-v3/fixture`](../../../test/skill-evals/writing-plans-spec-gap-v3/fixture) = `763a78a849ca4a4b5506e5b0c61cbfefd2ae290a00c49cef5d372a7fb40e89d9`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `fact-reading-and-gap-detection` - 权重 `35%`，critical `true`，最低 `90`：Confirm the accepted Spec, handler, verifier, caller, and tests are read and the unresolved key identity, HTTP response, and legacy-signature window are identified as real contract gaps.
- `contract-impact-and-questions` - 权重 `30%`，critical `true`，最低 `90`：Confirm each gap is connected to its Spec section and affected project files, explains its public, security, or migration impact, and asks only the minimum decision questions without an invented default.
- `zero-write-stop-gate` - 权重 `25%`，critical `true`，最低 `90`：Confirm the complete Git tree remains byte-identical and no Plan, Tasks, index, report, source, test, Spec, or Architecture file is created or modified.
- `terminal-routing` - 权重 `10%`，critical `true`，最低 `90`：Confirm the response stops and routes unresolved design work to brainstorming and manage-specs rather than proceeding to Tasks or implementation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates or modifies plan.md, tasks.md, an index, a report, source, tests, the Spec, or Architecture
- chooses a key identity, HTTP failure contract, or compatibility window not accepted by the Spec
- treats accepted status as sufficient while ignoring explicit unresolved design decisions
- asks generic implementation questions without connecting them to affected Spec sections and real project files
- routes directly to Tasks or implementation instead of brainstorming and manage-specs
- reads a repository-wide task packet, production Skill, or other evaluation evidence

**Critical path**: Read the accepted webhook contract and callers, identify the first material unresolved public decision, then stop with zero writes and route it to design ownership.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 03. `generating-tasks-product-feature-policy-v3` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-product-feature-policy-v3-haiku-v4`](../../../test/skill-evals/generating-tasks-product-feature-policy-v3/proposal-approval.json)
- Project / case: `py-feature-policy-engine` / `generating-tasks-product-feature-policy-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-product-feature-policy-v3/scenario.md`](../../../test/skill-evals/generating-tasks-product-feature-policy-v3/scenario.md) = `77763b042c411626fc34cd1994f0cb8cde594567d2b92c3b76ee92b963ce04fd`
- Protocol: [`test/skill-evals/generating-tasks-product-feature-policy-v3/protocol.json`](../../../test/skill-evals/generating-tasks-product-feature-policy-v3/protocol.json) = `56d6b1652732bdde6be9f81efe78bd88ee4dcff8d7dbb0c7392e41d01c5caf7d`
- Fixture: [`test/skill-evals/generating-tasks-product-feature-policy-v3/fixture`](../../../test/skill-evals/generating-tasks-product-feature-policy-v3/fixture) = `caefa42d07d2ff450a391a46f37fd0cb32d7e43bde5e10197934095734b886a6`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `task-document-contract` - 权重 `25%`，critical `true`，最低 `90`：Confirm tasks.md binds SPEC-003 revision 2 and Plan revision 1, initializes revision 1 with pending-review, null approved revision, and pending status, and gives every Task independently readable sections.
- `coverage-and-dependencies` - 权重 `30%`，critical `true`，最低 `90`：Confirm unique Tasks cover every Spec acceptance criterion and Plan migration, cleanup, regression, and rollback obligation with exact files and an acyclic graph whose parallel writers do not overlap or depend on one another.
- `validation-and-tdd-boundary` - 权重 `30%`，critical `true`，最低 `90`：Confirm every Task has executable validation, observable expected signals, and checkable completion, and Red-Green-Refactor appears only on the precedence behavior explicitly selected by the approved Plan.
- `scope-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm only same-Bundle tasks.md and CLI-generated indexes are written, Tasks remain unapproved and unimplemented, and the Spec, Plan, Architecture, runtime, tests, packages, Runs, and legacy paths remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates Tasks without kind tasks, SPEC-003/spec revision 2/plan revision 1 bindings, or the exact revision 1 pending-review approval state
- omits a unique Task ID, plain-language goal, Spec Coverage, Depends On, Parallel, Files, Work, Validation, or Completion from any top-level Task
- modifies the Spec, Plan, Architecture, source, tests, or package files
- omits an acceptance criterion or Plan migration, cleanup, regression, or rollback obligation
- marks Tasks approved or begins implementation
- applies TDD to Tasks whose approved Plan does not select it or drops Red-Green-Refactor from the selected behavior
- uses cyclic dependencies, dependent or same-file parallel Tasks, placeholders, non-observable validation, or context-dependent shorthand
- reopens decisions fixed by the accepted Spec and approved Plan
- writes a global tasks directory or hello-scholar/memory path
- reads a repository-wide task packet, production Skill, or other evaluation evidence

**Critical path**: Read the accepted Spec and approved Plan, then produce the first independently executable Task coverage result without implementing it.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 04. `generating-tasks-product-migration-v3` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-product-migration-v3-haiku-v4`](../../../test/skill-evals/generating-tasks-product-migration-v3/proposal-approval.json)
- Project / case: `node-config-format-cli` / `generating-tasks-product-migration-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-product-migration-v3/scenario.md`](../../../test/skill-evals/generating-tasks-product-migration-v3/scenario.md) = `3b7766d298eb80c2738459b01ae54c53a40dba5b4e47967d36613f220263dead`
- Protocol: [`test/skill-evals/generating-tasks-product-migration-v3/protocol.json`](../../../test/skill-evals/generating-tasks-product-migration-v3/protocol.json) = `3922fa6c311693576f92b4c004c0ffb37b33a800565a46d8d02ae4cc10aca2d6`
- Fixture: [`test/skill-evals/generating-tasks-product-migration-v3/fixture`](../../../test/skill-evals/generating-tasks-product-migration-v3/fixture) = `69ff5b5be97cdf739f8e7bd6422fa943eca1f2f5729687e248ab1173a0050ac9`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `task-document-contract` - 权重 `20%`，critical `true`，最低 `90`：Confirm tasks.md binds SPEC-014 revision 3 and Plan revision 2, starts at revision 1 pending-review with null approved revision and pending status, and every unique Task contains all required standalone sections.
- `migration-and-cutover-sequence` - 权重 `35%`，critical `true`，最低 `90`：Confirm distinct dependency-ordered Tasks preserve migration preparation, dual-read proof, persisted-profile conversion, and an evidence-gated format cutover with explicit recovery when the gate fails.
- `cleanup-regression-and-rollback` - 权重 `30%`，critical `true`，最低 `90`：Confirm later Tasks name exact legacy profile, writer, flag, and codec-dependency removals, require prerequisite evidence, cover the complete regression matrix, and include an executable rollback drill with expected signals.
- `scope-and-parallel-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm dependent or same-file migration Tasks are not parallel and only tasks.md plus generated indexes change, with no migration execution, data, state, source, tests, vendor, package, lockfile, backup, or approval mutation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates Tasks without kind tasks, SPEC-014/spec revision 3/plan revision 2 bindings, or the exact revision 1 pending-review approval state
- omits a unique Task ID, plain-language goal, Spec Coverage, Depends On, Parallel, Files, Work, Validation, or Completion from any top-level Task
- collapses migration preparation, compatibility reading, conversion, cutover, cleanup, regression, or rollback into an implementation-new-format happy path
- deletes a legacy profile, writeLegacyConfig, --legacy-output, or the local codec dependency without the approved Plan's prerequisite evidence and recovery action
- uses cyclic dependencies or marks dependent or same-file writers as parallel
- uses placeholders, context-dependent shorthand, generic cleanup, or validation without an executable command and observable expected signal
- modifies or approves upstream documents, data, migration state, source, tests, vendor, package metadata, or lockfile, runs migration, or begins implementation
- reopens persistence-format or migration decisions fixed by the accepted Spec and approved Plan
- writes a global tasks directory, hello-scholar/memory, backup, or migration report
- reads a repository-wide task packet, production Skill, or other evaluation evidence

**Critical path**: Read the approved migration contract, then produce dependency-ordered cutover, cleanup, regression, rollback, and recovery Tasks without running them.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 审核后的可执行范围

若该 Batch 得到精确批准，才会为其中每个 Scenario 严格串行执行真实 Haiku Baseline。每场 Baseline 只可真实记录 `fail` 或 `control-pass`；`control-pass` 立即停止该路径，只有有效 Red 才可进入最小修复与独立 Live authorization。
