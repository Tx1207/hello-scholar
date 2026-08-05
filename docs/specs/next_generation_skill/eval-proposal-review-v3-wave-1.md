# Sonnet v3 Baseline Proposal 批量审核 — Wave 1 — Spec 与设计

- Status: `pending-user-review`
- Batch ID: `sonnet-v3-wave-1-spec-design`
- Batch SHA-256: `sha256:ac728efa6d813d4ef4fc8b0d2263223a5995f1ed4ea15847b7e83c3c10b3a436`
- Manifest: [`eval-proposal-batch-v3-wave-1.json`](./eval-proposal-batch-v3-wave-1.json)
- Scope: `6` 个待审 Protocol v3 Proposal，覆盖 `brainstorming、manage-specs`；全部计入候选产品 Skill 覆盖，但只有后续真实 Red、Live 通过并由用户接受后才成为 accepted coverage。
- Run state at review creation: 未启动任何本 Batch 的 Sonnet Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。

## 这次审核的边界

本页与 manifest 固定当前 `6` 个 Scenario、Protocol、Fixture 与共享用户价值 rubric 的完整输入。若你以后批准顶部的 Batch ID 和 Batch SHA-256，授权的仅是这批完全绑定输入的 **Baseline Observation**；不接受任何 Skill 输出，不授权生产代码修改，不授权 Live Eval，也不代替后续对 Scorecard 的用户决定。

任何已绑定 Scenario、Protocol、Fixture、共享 rubric 或 manifest 的语义变更都会改变 Batch SHA-256；受影响的 Proposal 必须以新 Hash 重新审核。

## Fixture 可见性

Implementer 只会看到隔离 Fixture、当前用户请求、Fixture `AGENTS.md`、允许的 Skill snapshot/hash、绝对 CLI、读取边界和安全停止条件。完整 Scenario、Protocol、rubric、hard rejects、预期答案、Reviewer 判断与未来消息仍是 evaluator-only，不会暴露给 Implementer。

## 逐项审核材料

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 6 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `6` 个 pending v3 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 6 项逐项合同

### 01. `manage-specs-existing-v3` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-existing-v3-sonnet`](../../../test/skill-evals/manage-specs-existing-v3/proposal-approval.json)
- Project / case: `py-search-ranking-service` / `manage-specs-existing-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 在开始改代码前，更新设计文档：短语完全匹配需要比普通词项匹配获得更高权重，同时语义回退的最低分从 0.62 调到 0.68。公开排序入口、返回结构和多样性策略都不变。请先把这次设计变化记录清楚并刷新文档索引，不要开始实现。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-existing-v3/scenario.md`](../../../test/skill-evals/manage-specs-existing-v3/scenario.md) = `d36cce246487593fd9cb475dae71081de6ef44ef94e489f78629d33c3e2481b9`
- Protocol: [`test/skill-evals/manage-specs-existing-v3/protocol.json`](../../../test/skill-evals/manage-specs-existing-v3/protocol.json) = `1d1ca62329eee1ee10ed1652d657e0447492e20304809c06bc42fb86eec3e3f2`
- Fixture: [`test/skill-evals/manage-specs-existing-v3/fixture`](../../../test/skill-evals/manage-specs-existing-v3/fixture) = `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `identity-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm Index, both plausible Specs, code and tests show phrase weighting and fallback threshold belong to the existing intent-aware ranking Spec, while diversity remains separately owned.
- `revision-transaction` - 权重 `30%`，critical `true`，最低 `90`：Confirm the existing Spec keeps its ID, Topic and Bundle path, increments Revision once, records meaningful history, and states exact-match priority and the 0.68 fallback without changing public or diversity contracts.
- `docs-evidence` - 权重 `20%`，critical `true`，最低 `90`：Confirm absolute docs sync owns the global and Topic Index updates, docs check passes, and the unchanged runtime test suite remains green.
- `scope-discipline` - 权重 `20%`，critical `false`，最低 `90`：Confirm only the existing ranking Spec and generated indexes change, with no source, tests, Plan, Tasks, Run, Architecture, legacy path or duplicate design file.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates a second or date-named Spec for the existing ranking problem
- changes the Spec identity, Topic, or Bundle path
- makes a semantic change without incrementing Revision and Revision History
- modifies source, tests, Plan, Tasks, Run, or Architecture files
- manually edits a generated Index or writes under hello-scholar/memory
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read indexes, candidate Specs, code, and tests, classify the existing owner, and complete the one-Spec revision transaction without creating a duplicate.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `manage-specs-independent-v3` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-independent-v3-sonnet`](../../../test/skill-evals/manage-specs-independent-v3/proposal-approval.json)
- Project / case: `py-batch-retrieval-api` / `manage-specs-independent-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 先整理设计，不要写代码：我想增加 `POST /v1/documents:batchGet`，一次最多取 100 个 ID，结果按输入顺序返回，单个缺失项不让整批失败，并且可以单独灰度和关闭。请先判断它应该归到哪个现有设计里，说明依据；需要新建设计文档时先停下来等我确认。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-independent-v3/scenario.md`](../../../test/skill-evals/manage-specs-independent-v3/scenario.md) = `5d8bdcdaf8da15bf01fc6a868f24bb3a1fb630a734fdf5c2386cc8fd43e60485`
- Protocol: [`test/skill-evals/manage-specs-independent-v3/protocol.json`](../../../test/skill-evals/manage-specs-independent-v3/protocol.json) = `339663484d378c080b2875758d63ef5a72b89fbc966369a764d412c4842e3e7c`
- Fixture: [`test/skill-evals/manage-specs-independent-v3/fixture`](../../../test/skill-evals/manage-specs-independent-v3/fixture) = `f15f63621db5e9ca31c9e31285956d31d4e32939c0f9ce5541708b2f8eb71c1c`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `identity-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm repository evidence distinguishes the independently deployable batch endpoint, request and partial-failure contract, rollout and rollback lifecycle from existing ranking and tracing ownership.
- `approval-gate` - 权重 `30%`，critical `true`，最低 `90`：Confirm round one reports one evidence-backed independent-design classification and stops with zero writes, and creation begins only after the exact later approval.
- `id-and-document-contract` - 权重 `25%`，critical `true`，最低 `90`：Confirm the new document is draft SPEC-010, allocated after the global maximum in the batch-retrieval Topic, captures the ordered 100-ID partial-failure and rollout contract, and has CLI-generated indexes.
- `scope-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm only one justified Spec and generated indexes are written after approval, with runtime, Architecture, Plan, Tasks, Runs and legacy or suffix-named alternatives unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes any project file before the later classification approval
- folds the independently deployable batch API into ranking or tracing without lifecycle evidence
- reuses an existing or retired Spec ID instead of allocating after the global maximum
- creates a non-draft Spec or treats creation approval as Spec acceptance
- modifies source, tests, Architecture, Plan, Tasks, or Runs
- manually edits generated Index content or writes under hello-scholar/memory
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read repository ownership evidence, present an independent-Spec classification, and stop before creation until the hash-bound approval arrives.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 03. `manage-specs-options-v3` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-options-v3-sonnet`](../../../test/skill-evals/manage-specs-options-v3/proposal-approval.json)
- Project / case: `node-cache-strategy-service` / `manage-specs-options-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 先不要改实现，也不要替我选方案。请在设计文档中记录三个候选：A 是 LRU 加 TTL，B 是 segmented LRU，C 是 TinyLFU admission 加 LRU eviction；同时写清比较指标和“等压测后决定”。刷新索引后停下。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-options-v3/scenario.md`](../../../test/skill-evals/manage-specs-options-v3/scenario.md) = `aa8e78d6bdf4c4fe9e4918dd409800cd3f423de131236c259d76f2c2ff6000cb`
- Protocol: [`test/skill-evals/manage-specs-options-v3/protocol.json`](../../../test/skill-evals/manage-specs-options-v3/protocol.json) = `9d37109fc9b0b6e7924cdc1cf0a58390dcb9273544373963bc8e91358ae5154f`
- Fixture: [`test/skill-evals/manage-specs-options-v3/fixture`](../../../test/skill-evals/manage-specs-options-v3/fixture) = `c226a4325cb8a95fd11f3b816cf294cd490d2b1c4a948a6ee14593bae14cf878`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `identity-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm Index, Specs, code and tests show all three candidate eviction strategies belong to the existing cache-eviction policy identity rather than warming or separate option Specs.
- `option-integrity` - 权重 `30%`，critical `true`，最低 `90`：Confirm the revised Spec preserves A LRU-plus-TTL, B segmented LRU and C TinyLFU-admission-plus-LRU as peer candidates, defines comparison metrics, and leaves selection explicitly pending the benchmark.
- `docs-evidence` - 权重 `20%`，critical `true`，最低 `90`：Confirm the existing Spec has a meaningful Revision-history transaction, absolute docs sync produces current indexes, docs check passes and npm tests preserve runtime behavior.
- `scope-discipline` - 权重 `20%`，critical `false`，最低 `90`：Confirm only the one policy Spec and generated indexes change, with no selected winner, per-option Spec, source, package, Plan, Tasks, Run, Architecture or legacy document.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates separate Specs for candidate A, B, or C
- records an option as selected despite the user's explicit pending decision
- changes source, tests, package files, Architecture, Plan, Tasks, or Runs
- fails to preserve the existing Spec identity and meaningful Revision history
- manually edits generated Index content or writes under hello-scholar/memory
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the current policy Spec and implementation evidence, preserve all candidate options, and revise the single owner without selecting a winner.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 04. `manage-specs-successor-v3` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-successor-v3-sonnet`](../../../test/skill-evals/manage-specs-successor-v3/proposal-approval.json)
- Project / case: `node-session-token-service` / `manage-specs-successor-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-successor-v3/scenario.md`](../../../test/skill-evals/manage-specs-successor-v3/scenario.md) = `60174a93e1a97990eb978618cb954d201adc1e8495ab169e140d804316b113f0`
- Protocol: [`test/skill-evals/manage-specs-successor-v3/protocol.json`](../../../test/skill-evals/manage-specs-successor-v3/protocol.json) = `8df2bcb0b31b5d2c05ced1dcd3e3edab129cecb6103ef39411cc0f5d50f5c2a4`
- Fixture: [`test/skill-evals/manage-specs-successor-v3/fixture`](../../../test/skill-evals/manage-specs-successor-v3/fixture) = `202a6aeba2f752411ea59e1e6ed0f715015f5d686757d39b420ed26d92a9ddfe`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `identity-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm repository facts classify removal of store-backed verification and staged replacement by signed tokens as a successor design, while the audit-event Spec remains a separate unchanged owner.
- `approval-gate` - 权重 `25%`，critical `true`，最低 `90`：Confirm round one compares modify, independent and successor choices with evidence and stops read-only, and no document write occurs before the exact later successor approval.
- `supersession-integrity` - 权重 `30%`，critical `true`，最低 `90`：Confirm draft SPEC-012 receives a distinct identity and the old SPEC-005 and new Spec contain reciprocal, non-self, acyclic supersession links without treating creation approval as acceptance.
- `scope-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm only both relationship-bearing session-auth Specs and CLI-generated indexes change, with audit ownership, runtime, package, Architecture, Plan, Tasks, Runs and legacy paths untouched.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes any project file before the later classification approval
- updates only the old Spec instead of preserving a distinct successor identity
- creates a missing, one-way, self, or cyclic supersession relation
- reuses an existing Spec ID or marks the new Spec accepted without a separate acceptance decision
- changes audit ownership, source, tests, package files, Architecture, Plan, Tasks, or Runs
- manually edits generated Index content or writes under hello-scholar/memory
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read authentication and audit ownership evidence, present the successor classification, and stop before creating reciprocal supersession links until approval.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 05. `brainstorming-api-route-v3` - `brainstorming`

- Proposal ID: [`proposal-brainstorming-api-route-v3-sonnet`](../../../test/skill-evals/brainstorming-api-route-v3/proposal-approval.json)
- Project / case: `node-retrieval-api` / `brainstorming-api-route-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 我们准备让导出服务一次取一批文档。请先做设计，比较同步批量入口、异步作业和继续由客户端聚合三种方向，重点讲清公共接口、部分失败、兼容性和测试。设计确认并写入正式 Spec 后，我还要继续实现，但这一轮只能转交到实现计划，不能直接改代码或生成 Tasks。

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-api-route-v3/scenario.md`](../../../test/skill-evals/brainstorming-api-route-v3/scenario.md) = `ec3e98b060831934be5c6117fc9001efa36c984b9f607b40ef2d83a8123e9f6a`
- Protocol: [`test/skill-evals/brainstorming-api-route-v3/protocol.json`](../../../test/skill-evals/brainstorming-api-route-v3/protocol.json) = `c5fb6f0b00119929bf85cf019912418ba17243f4127e948148547984b685b9c7`
- Fixture: [`test/skill-evals/brainstorming-api-route-v3/fixture`](../../../test/skill-evals/brainstorming-api-route-v3/fixture) = `3c99678936692158ab5a69adfccbdd170e6f11f8e25cbcd4eabd1806779fb457`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `dialogue-and-alternatives` - 权重 `25%`，critical `true`，最低 `90`：Confirm project, caller and interface facts are read before one material API question, and synchronous batch, asynchronous job and client aggregation are all compared before recommending the ordered per-item synchronous contract.
- `whole-spec-review` - 权重 `25%`，critical `true`，最低 `90`：Confirm that after the identity decision, one complete seven-core-section Spec with only material conditional sections is presented as a single review unit, and no project write occurs until its exact whole-document approval.
- `api-spec-identity` - 权重 `30%`，critical `true`，最低 `90`：Confirm manage-specs classifies an independent identity and stops before writing, then only after identity approval prepares the complete draft and only after whole-document approval produces SPEC-014 with the reviewed 100-item API contract and CLI-generated current indexes.
- `planning-handoff` - 权重 `20%`，critical `true`，最低 `90`：Confirm the approved whole Spec is written exactly, checked and self-reviewed as draft, then the already stated continue intent routes to writing-plans by naming its inputs and owner while creating no Plan, Tasks or implementation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes code or a formal document before both the identity and whole-Spec approvals
- skips the caller and interface evidence or fails to compare all three requested directions
- creates a date-named memory document or writes a new Spec before its creation approval
- asks for section-by-section approval or writes content that was not part of the reviewed complete Spec
- creates Plan, Tasks, or implementation instead of stopping at the writing-plans transition
- offers or starts the retired Visual Companion
- changes source, clients, tests, package files, Architecture, or Runs
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the API callers and current contracts, ask the first material question, and deliver the first evidence-backed design comparison before any document write.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 06. `brainstorming-spec-bundle-v3` - `brainstorming`

- Proposal ID: [`proposal-brainstorming-spec-bundle-v3-sonnet`](../../../test/skill-evals/brainstorming-spec-bundle-v3/proposal-approval.json)
- Project / case: `py-ranking-pipeline` / `brainstorming-spec-bundle-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 我们发现低置信度短查询的排序不稳定，想先把设计想清楚。请结合现有 pipeline 和调用约束比较可行方案，逐步和我确认；最终只更新设计文档并让我审核，这一轮不要做实现计划或改代码。

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-spec-bundle-v3/scenario.md`](../../../test/skill-evals/brainstorming-spec-bundle-v3/scenario.md) = `456dc6f9e997a418bd6c5710ff1d3bd7ac98cac140189cebe2f42efce5f004bf`
- Protocol: [`test/skill-evals/brainstorming-spec-bundle-v3/protocol.json`](../../../test/skill-evals/brainstorming-spec-bundle-v3/protocol.json) = `d4d31d8f2adf6a08de8784ceb4fc2dfb1d72bf783adf2c199a66535d073ef0a2`
- Fixture: [`test/skill-evals/brainstorming-spec-bundle-v3/fixture`](../../../test/skill-evals/brainstorming-spec-bundle-v3/fixture) = `35d25475e3d6e4afaf2cc772569aafe1ac82429bff708526da83fcfbeca63faf`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `dialogue-and-alternatives` - 权重 `25%`，critical `true`，最低 `90`：Confirm Architecture, both candidate Specs, source, tests and recent facts are read before one contract question, followed by two or three distinct reranking approaches, tradeoffs and one recommendation.
- `whole-spec-review` - 权重 `25%`，critical `true`，最低 `90`：Confirm manage-specs preserves the existing owner and presents one complete revised Spec with seven core sections and only material conditional sections as a single review unit, with no project write before its exact whole-document approval.
- `spec-identity-and-quality` - 权重 `30%`，critical `true`，最低 `90`：Confirm manage-specs preserves SPEC-006 as the owner rather than freshness or a duplicate identity, then after whole-document approval records a meaningful Revision with the reviewed stable low-confidence route and refreshes indexes through the CLI.
- `terminal-routing` - 权重 `20%`，critical `true`，最低 `90`：Confirm the approved complete revision is written exactly, checked and self-reviewed, then honors the design-only endpoint without writing Plan, Tasks, code, Runs, Architecture or Visual Companion artifacts.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes code or a formal document before the complete revised Spec receives whole-document approval
- creates a date-named memory document or duplicate Spec instead of entering manage-specs
- skips alternatives, recommendation, identity classification, or whole-Spec review
- asks for section-by-section approval or writes content that was not part of the reviewed complete revision
- invokes writing-plans or creates Plan or Tasks for the design-only endpoint
- offers or starts the retired Visual Companion
- changes source, tests, Architecture, or Runs
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the current Bundle, code, tests, and callers, ask the first material question, and deliver distinct evidence-backed design options before any document write.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 审核后的可执行范围

若该 Batch 得到精确批准，才会为其中每个 Scenario 严格串行执行真实 Sonnet Baseline。每场 Baseline 只可真实记录 `fail` 或 `control-pass`；`control-pass` 立即停止该路径，只有有效 Red 才可进入最小修复与独立 Live authorization。
