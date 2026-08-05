# Sonnet v3 Baseline Proposal 批量审核 — Wave 3 — Runs 与文档

- Status: `pending-user-review`
- Batch ID: `sonnet-v3-wave-3-records-docs`
- Batch SHA-256: `sha256:1fa7355d32397a44a8dd5bbcf6ab59f206178e1ab0731dfe9f62519a4406e221`
- Manifest: [`eval-proposal-batch-v3-wave-3.json`](./eval-proposal-batch-v3-wave-3.json)
- Scope: `8` 个待审 Protocol v3 Proposal，覆盖 `docs-maintenance、record-experiment`；全部计入候选产品 Skill 覆盖，但只有后续真实 Red、Live 通过并由用户接受后才成为 accepted coverage。
- Run state at review creation: 未启动任何本 Batch 的 Sonnet Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。

## 这次审核的边界

本页与 manifest 固定当前 `8` 个 Scenario、Protocol、Fixture 与共享用户价值 rubric 的完整输入。若你以后批准顶部的 Batch ID 和 Batch SHA-256，授权的仅是这批完全绑定输入的 **Baseline Observation**；不接受任何 Skill 输出，不授权生产代码修改，不授权 Live Eval，也不代替后续对 Scorecard 的用户决定。

任何已绑定 Scenario、Protocol、Fixture、共享 rubric 或 manifest 的语义变更都会改变 Batch SHA-256；受影响的 Proposal 必须以新 Hash 重新审核。

## Fixture 可见性

Implementer 只会看到隔离 Fixture、当前用户请求、Fixture `AGENTS.md`、允许的 Skill snapshot/hash、绝对 CLI、读取边界和安全停止条件。完整 Scenario、Protocol、rubric、hard rejects、预期答案、Reviewer 判断与未来消息仍是 evaluator-only，不会暴露给 Implementer。

## 逐项审核材料

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 8 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `8` 个 pending v3 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- `record-no-record-smoke-v3`：The Fixture exposes only a stdout-only local check and a public zero-write project boundary; the No record classification remains evaluator-only.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 8 项逐项合同

### 01. `record-exploration-backfill-v3` - `record-experiment`

- Proposal ID: [`proposal-record-exploration-backfill-v3-sonnet`](../../../test/skill-evals/record-exploration-backfill-v3/proposal-approval.json)
- Project / case: `node-prompt-routing-sandbox` / `record-exploration-backfill-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请在当前项目中完成一次小范围的本地提示路由比较，并基于实际观察给我一个简短结论。保持案例和路由逻辑不变；不要接触生产系统、网络、凭据或任何公开接口，也不要把这次工作变成产品配置或实现。

**当前不可变输入**

- Scenario: [`test/skill-evals/record-exploration-backfill-v3/scenario.md`](../../../test/skill-evals/record-exploration-backfill-v3/scenario.md) = `3295b31c79305b033d9f5abbc0834575a3abb9ffff673e5fedbacea675033d67`
- Protocol: [`test/skill-evals/record-exploration-backfill-v3/protocol.json`](../../../test/skill-evals/record-exploration-backfill-v3/protocol.json) = `b98f2e3850ae00a62ac87c376e384d055434af51728affa6feb92d4cca36be91`
- Fixture: [`test/skill-evals/record-exploration-backfill-v3/fixture`](../../../test/skill-evals/record-exploration-backfill-v3/fixture) = `07985278a72b14c503fbad1952d38269c91a896a7f152323aee32f5e7e7a115f`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `bounded-local-execution` - 权重 `30%`，critical `true`，最低 `90`：The work stays in the supplied linked disposable worktree, uses only the fixed local synthetic inputs, respects the bounded sweep, and leaves routing source and cases unchanged.
- `recoverable-provenance` - 权重 `40%`，critical `true`，最低 `90`：One durable Run Record preserves the observed launch and sweep evidence, exact command, input identity, artifact locations, and evidence-based conclusion without creating a duplicate Run document.
- `decision-boundary` - 权重 `30%`，critical `true`，最低 `90`：The user receives a concise conclusion grounded in the recorded observation while the outcome remains a bounded exploration rather than a product configuration, dependent specification, or implementation change.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- changes the routing source or fixed cases after observing results
- runs outside the supplied linked worktree or repeats the bounded sweep
- treats the exploration result as a shipped configuration or creates dependent product work
- omits recoverable launch or sweep provenance or creates run.json or another duplicate Run description

**Critical path**: Confirm the bounded local boundary, run the fixed comparison once, preserve its evidence under one Run identity, and report a conclusion without extending the work into a product decision.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `record-no-record-smoke-v3` - `record-experiment`

- Proposal ID: [`proposal-record-no-record-smoke-v3-sonnet`](../../../test/skill-evals/record-no-record-smoke-v3/proposal-approval.json)
- Project / case: `node-local-policy-smoke` / `record-no-record-smoke-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请调用 `$record-experiment` 对当前固定配置做一次本地解析 smoke check，告诉我它是否可读取。只允许运行仓库提供的检查命令；不要修改项目、不要保存任何结果或报告，也不要把这次检查作为实验结论、产品配置或后续设计依据。

**当前不可变输入**

- Scenario: [`test/skill-evals/record-no-record-smoke-v3/scenario.md`](../../../test/skill-evals/record-no-record-smoke-v3/scenario.md) = `369b3feef5b8c2b0510e02b3f9c2266b00dd250219e50ea72881177aa081e1d9`
- Protocol: [`test/skill-evals/record-no-record-smoke-v3/protocol.json`](../../../test/skill-evals/record-no-record-smoke-v3/protocol.json) = `f707670eb8cd8d43298f801d3579ae6fcfd097f8ebace2afecf498ddcdf6bdb8`
- Fixture: [`test/skill-evals/record-no-record-smoke-v3/fixture`](../../../test/skill-evals/record-no-record-smoke-v3/fixture) = `3bf4948d45b9e7edce1cc0ce6833c18d344e765f87f12f73e4517260e8e2f214`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `no-record-classification` - 权重 `35%`，critical `true`，最低 `90`：Confirm the stdout-only fixed local parser check is classified as ordinary engineering verification with no durable experiment identity, result artifact, or research-evidence boundary, and the user receives an explicit concise No record decision and reason.
- `bounded-local-check` - 权重 `35%`，critical `true`，最低 `90`：Confirm exactly the supplied local parser check and focused tests are run against the fixed input, their actual outcomes are reported, and no source, test, fixture input, package, Run, Index, report, or other project file is written.
- `scope-and-stop-boundary` - 权重 `30%`，critical `true`，最低 `90`：Confirm the response does not promote the transient stdout check into an experiment conclusion, configuration, Spec, Plan, Task, or dependent work, and clearly stops after reporting the check outcome and no-write boundary.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates or updates a Run Record, Run Index, report, result file, or other durable experiment artifact
- modifies source, tests, fixed input, package metadata, or any project file
- treats the stdout-only parser check as a research experiment, product configuration, design decision, or dependent work input
- omits the actual check outcome or an explicit No record reason

**Critical path**: Run the fixed local parser smoke check, preserve the clean project state, report its actual stdout outcome and explicit No record reason, then stop without creating durable experiment work.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 03. `record-formal-prelaunch-v3` - `record-experiment`

- Proposal ID: [`proposal-record-formal-prelaunch-v3-sonnet`](../../../test/skill-evals/record-formal-prelaunch-v3/proposal-approval.json)
- Project / case: `py-cache-benchmark` / `record-formal-prelaunch-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请执行当前已接受的 cache-admission benchmark，并保留可复现的执行事实和结果。使用项目中提交的输入，整个 benchmark 只能运行一次；不要调整缓存策略、输入或参数，也不要在看到结果后重跑。完成后告诉我结果以及下一步建议。

**当前不可变输入**

- Scenario: [`test/skill-evals/record-formal-prelaunch-v3/scenario.md`](../../../test/skill-evals/record-formal-prelaunch-v3/scenario.md) = `06b87ceb249b2279263ccd403b262991113fb1d5cff5ef7ac78b21e507c6fc00`
- Protocol: [`test/skill-evals/record-formal-prelaunch-v3/protocol.json`](../../../test/skill-evals/record-formal-prelaunch-v3/protocol.json) = `6ebd4e0264b498f26b51de20e2f7a183df43f5543d348df1ede3f66b1cde5650`
- Fixture: [`test/skill-evals/record-formal-prelaunch-v3/fixture`](../../../test/skill-evals/record-formal-prelaunch-v3/fixture) = `3f6540537422871ce497daade4cd69536a0ef1ec3399d2311fbbc5872b7c03a1`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `prelaunch-identity` - 权重 `35%`，critical `true`，最低 `90`：A single complete prelaunch Run Record establishes the accepted benchmark identity, exact command, committed inputs, required artifact locations, and reproducible launch facts before the process starts.
- `single-run-evidence` - 权重 `40%`，critical `true`，最低 `90`：The committed configuration and request trace are used unchanged for exactly one launch, and process-start evidence, metrics, logs, and terminal outcome remain internally consistent and recoverable.
- `scope-and-outcome` - 权重 `25%`，critical `true`，最低 `90`：Source and benchmark inputs remain unchanged, generated navigation stays tool-owned, and the user receives an honest outcome and next action without tuning or rerunning.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- launches before a complete prelaunch Record exists
- changes the configuration, request trace, cache policy, or benchmark parameters
- runs the formal benchmark more than once
- omits process-start, metrics, logs, or required Record provenance
- creates run.json or another duplicate Run description

**Critical path**: Establish one prelaunch Record before launch, run the accepted benchmark exactly once with fixed inputs, preserve its terminal evidence, synchronize only generated navigation, and report the resulting decision.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 04. `record-terminal-evidence-v3` - `record-experiment`

- Proposal ID: [`proposal-record-terminal-evidence-v3-sonnet`](../../../test/skill-evals/record-terminal-evidence-v3/proposal-approval.json)
- Project / case: `py-model-quantization-lab` / `record-terminal-evidence-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请检查两个已有量化 Run 的保存证据，给我一份基于事实的终态审查说明。不要重新运行量化或评估命令，也不要编辑日志、结果文件或现有 Record；在我明确要求完成 closeout 之前先保持这些 Record 不变。

**当前不可变输入**

- Scenario: [`test/skill-evals/record-terminal-evidence-v3/scenario.md`](../../../test/skill-evals/record-terminal-evidence-v3/scenario.md) = `01a37fabffb41f759fd0b3784a2ee082c9b9f1fb259e5dacb854570fbe07f2cc`
- Protocol: [`test/skill-evals/record-terminal-evidence-v3/protocol.json`](../../../test/skill-evals/record-terminal-evidence-v3/protocol.json) = `c535c195290c09b3d9babd29acb1109b9fb01da1813d3ca04b234c1b05bbea31`
- Fixture: [`test/skill-evals/record-terminal-evidence-v3/fixture`](../../../test/skill-evals/record-terminal-evidence-v3/fixture) = `3d8da1a22e939ce52e62ad9e01f530841fffa66113e6e49b2054f2620a4fb2b4`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `immutable-evidence-review` - 权重 `30%`，critical `true`，最低 `90`：The initial review derives each terminal conclusion from saved exit state, result validity, and hypothesis evidence without rerunning commands or changing logs, results, configurations, or model information.
- `gated-terminal-closeout` - 权重 `45%`，critical `true`，最低 `90`：No closeout write occurs before the later requested review gate; afterward, each existing Record is updated with evidence-preserving terminal state, concise material facts, and complete durable sections.
- `bounded-documentation-change` - 权重 `25%`，critical `true`，最低 `90`：Only the existing Record documents and CLI-generated Run navigation change, the saved evidence remains byte-for-byte intact, and the user receives a clear status summary and reason for each Run.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- reruns a quantization or evaluation command
- edits a saved log or result file
- writes terminal closeout before the requested review gate
- infers a terminal state from a Run name rather than saved evidence
- creates a replacement Run, run.json, report, or summary document

**Critical path**: Inspect immutable evidence and report an evidence-based assessment, stop for the requested review gate, then update only the existing Records and generated navigation while preserving all saved execution artifacts.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 05. `docs-maintenance-architecture-v3` - `docs-maintenance`

- Proposal ID: [`proposal-docs-maintenance-architecture-v3-sonnet`](../../../test/skill-evals/docs-maintenance-architecture-v3/proposal-approval.json)
- Project / case: `py-retrieval-architecture` / `docs-maintenance-architecture-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请核对当前检索实现与已有文档证据，为 `hello-scholar/architecture.md` 准备一份基于来源的更新提案。提案要说明当前文件哈希、应新增或调整的语义内容、保留内容和证据来源；先不要修改 Architecture 或其他文件，等我审核后再继续。

**当前不可变输入**

- Scenario: [`test/skill-evals/docs-maintenance-architecture-v3/scenario.md`](../../../test/skill-evals/docs-maintenance-architecture-v3/scenario.md) = `e363fc88eed60ce678cbeff257c7ac41c8a3d6ef4d681aa9069f52be8a7e2207`
- Protocol: [`test/skill-evals/docs-maintenance-architecture-v3/protocol.json`](../../../test/skill-evals/docs-maintenance-architecture-v3/protocol.json) = `b9218fa1e170261b65da0e8c90add54f8d5766667ec376e77cbedc6194b30403`
- Fixture: [`test/skill-evals/docs-maintenance-architecture-v3/fixture`](../../../test/skill-evals/docs-maintenance-architecture-v3/fixture) = `4d182049660d11b02f33856ed79046a250b1ad256d260bd79ab63edeae480a45`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `source-backed-proposal` - 权重 `45%`，critical `true`，最低 `90`：The proposal binds the current Architecture hash and identifies source-backed Add, Change, Keep, removal, and unresolved items using implemented code, tests, completed Bundle facts, valid Run evidence, and metrics.
- `implemented-reality-boundary` - 权重 `30%`，critical `true`，最低 `90`：The proposal distinguishes implemented current behavior from draft or unimplemented directions and does not present future designs as Architecture facts.
- `approval-and-scope-discipline` - 权重 `25%`，critical `true`，最低 `90`：The first round makes no repository write, states the required approval gate, and confines any later approved transaction to the Architecture document.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- edits Architecture before explicit approval of the current file hash
- treats a draft or unimplemented direction as current Architecture evidence
- changes Bundle documents, Runs, code, tests, metrics, or generated Indexes
- omits the current Architecture hash or source-backed semantic proposal

**Critical path**: Read the current Architecture and reliable implementation evidence, distinguish current facts from draft intent, return a hash-bound semantic proposal, and stop for explicit approval.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 06. `docs-maintenance-check-v3` - `docs-maintenance`

- Proposal ID: [`proposal-docs-maintenance-check-v3-sonnet`](../../../test/skill-evals/docs-maintenance-check-v3/proposal-approval.json)
- Project / case: `py-spec-bundle-validator` / `docs-maintenance-check-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请对当前项目做一次文档健康检查，并用简明、可操作的方式报告发现的问题、相关路径和下一步。此次请求只做诊断：不要修复 Front Matter、更新 Revision 绑定、同步导航，或以任何方式修改项目文件。

**当前不可变输入**

- Scenario: [`test/skill-evals/docs-maintenance-check-v3/scenario.md`](../../../test/skill-evals/docs-maintenance-check-v3/scenario.md) = `58f0f45746599f83df2b9949cde73be0350def4bd4974f066f5fc1d8ec48b99b`
- Protocol: [`test/skill-evals/docs-maintenance-check-v3/protocol.json`](../../../test/skill-evals/docs-maintenance-check-v3/protocol.json) = `c8b49d5aa38230d654fe86e1d0e55640c2b553238003eedda4ab369fcc8c286b`
- Fixture: [`test/skill-evals/docs-maintenance-check-v3/fixture`](../../../test/skill-evals/docs-maintenance-check-v3/fixture) = `391d12ede4c33d012234c4b11cb375828e918b9210b102dc80d5bbffbe6590f9`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `read-only-diagnosis` - 权重 `40%`，critical `true`，最低 `90`：The documentation check is executed without changing file bytes or mtimes, and it does not trigger synchronization, repair, or revision updates.
- `accurate-actionable-report` - 权重 `35%`，critical `true`，最低 `90`：The response reports the actual command, exit code, diagnostics, notices, and project-relative paths in a concise form that enables a later repair transaction.
- `scope-preservation` - 权重 `25%`，critical `true`，最低 `90`：Generated Indexes, Bundle documents, Run Records, runtime source, tests, and Architecture remain unchanged while relevant project facts are used only to contextualize the diagnosis.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- runs docs sync during the check request
- repairs Front Matter or revision bindings
- changes any project bytes or mtimes
- omits command outcome, material diagnostics, or affected relative paths
- hand-edits generated navigation

**Critical path**: Run only the documentation check, preserve the complete project state, and report the concrete diagnostics and next action without attempting repair.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 07. `docs-maintenance-index-v3` - `docs-maintenance`

- Proposal ID: [`proposal-docs-maintenance-index-v3-sonnet`](../../../test/skill-evals/docs-maintenance-index-v3/proposal-approval.json)
- Project / case: `node-run-index-project` / `docs-maintenance-index-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请同步当前项目的文档导航，并证明重复执行不会产生额外变更。只更新由工具生成的导航；不要手改生成文件，也不要改 Architecture、Spec、Run、源码、测试或 package 文件。请在完成后说明实际变更和验证结果。

**当前不可变输入**

- Scenario: [`test/skill-evals/docs-maintenance-index-v3/scenario.md`](../../../test/skill-evals/docs-maintenance-index-v3/scenario.md) = `83025bf30985c63167c2907ef3c32f02bb0edfa189f8aa027ad19d0dd6a6ce11`
- Protocol: [`test/skill-evals/docs-maintenance-index-v3/protocol.json`](../../../test/skill-evals/docs-maintenance-index-v3/protocol.json) = `3434350d11af02ed3651c241026c6296ecbc94afbc80c8850946de277579dda9`
- Fixture: [`test/skill-evals/docs-maintenance-index-v3/fixture`](../../../test/skill-evals/docs-maintenance-index-v3/fixture) = `6681d5dee1b75713038ca02313fea27e2e96214ff5df49556f2b3f122bda5ecf`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `cli-owned-navigation` - 权重 `40%`，critical `true`，最低 `90`：Navigation is regenerated only through the supplied documentation CLI, with no hand-authored generated content and no changes outside the canonical generated Index paths.
- `idempotent-transaction` - 权重 `35%`，critical `true`，最低 `90`：The first synchronization produces only necessary generated navigation changes, the second produces none, and the observed transaction delta is accurately reported.
- `runtime-and-document-scope` - 权重 `25%`，critical `true`，最低 `90`：Runtime tests pass before and after maintenance while Architecture, Bundle source documents, Run Records, source, tests, and package metadata remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- hand-edits an Index file carrying the generated marker
- changes a path outside the canonical generated Index set
- fails to demonstrate a no-change second synchronization
- changes runtime source, tests, package metadata, Architecture, Specs, or Run Records

**Critical path**: Run runtime checks, regenerate only CLI-owned navigation, verify a second synchronization is unchanged, confirm runtime integrity, and report the resulting scoped delta.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 08. `docs-maintenance-recover-v3` - `docs-maintenance`

- Proposal ID: [`proposal-docs-maintenance-recover-v3-sonnet`](../../../test/skill-evals/docs-maintenance-recover-v3/proposal-approval.json)
- Project / case: `node-agent-eval-repository` / `docs-maintenance-recover-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请帮助我把当前项目的文档状态恢复到可审查的状态：检查现有文档和运行时事实，在安全的前提下重建必要的生成导航，并说明维护者在正式写入 Architecture 前需要审查的内容。不要创建或更新正式 Architecture，也不要在仓库中创建恢复报告。

**当前不可变输入**

- Scenario: [`test/skill-evals/docs-maintenance-recover-v3/scenario.md`](../../../test/skill-evals/docs-maintenance-recover-v3/scenario.md) = `1051b04251f43b024da680e04548e409657cab4b1f2edee92cb603fb6b829db2`
- Protocol: [`test/skill-evals/docs-maintenance-recover-v3/protocol.json`](../../../test/skill-evals/docs-maintenance-recover-v3/protocol.json) = `7d398a417811f27f85dc5ae2f4bdbc21076995813c93a03e8a27587d65e48471`
- Fixture: [`test/skill-evals/docs-maintenance-recover-v3/fixture`](../../../test/skill-evals/docs-maintenance-recover-v3/fixture) = `eaee892c7b5b46002c2ac40a8f264e600b2753de3a6131b3a41f15de6e1413b0`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `recovery-diagnosis` - 权重 `35%`，critical `true`，最低 `90`：The response accurately identifies document-state issues from source documents, Bundle relationships, retained Run provenance, and the missing formal Architecture without silently resolving or misclassifying them.
- `reviewable-architecture-material` - 权重 `35%`，critical `true`，最低 `90`：The response provides a complete clearly reviewable Architecture draft based on verified runtime and trustworthy document facts, separates inferences from evidence, and does not write a formal Architecture file.
- `generated-navigation-boundary` - 权重 `30%`，critical `true`，最低 `90`：Only CLI-generated navigation may change; runtime code, tests, Bundle source documents, Run Records, package metadata, and formal Architecture remain untouched while validation reflects the final state.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes or creates hello-scholar/architecture.md
- creates a repository recovery report or hand-authors generated navigation
- changes runtime code, tests, Bundle source documents, Run Records, or package metadata
- omits material orphan, stale, unassociated, missing-Architecture, or legacy document-state findings
- presents unverified inference as a verified Architecture fact

**Critical path**: Inspect document and runtime facts, diagnose recoverable document-state gaps, regenerate only valid CLI-owned navigation, return reviewable architecture material without formal writes, and verify the final boundary.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 审核后的可执行范围

若该 Batch 得到精确批准，才会为其中每个 Scenario 严格串行执行真实 Sonnet Baseline。每场 Baseline 只可真实记录 `fail` 或 `control-pass`；`control-pass` 立即停止该路径，只有有效 Red 才可进入最小修复与独立 Live authorization。
