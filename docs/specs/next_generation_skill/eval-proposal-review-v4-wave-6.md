# Haiku v4 Baseline Proposal 批量审核 — 6 router

- Status: `pending-user-review`
- Batch ID: `haiku-v4-wave-6-router`
- Batch SHA-256: `sha256:ccaf9fee5f46c72706db7099e3e458e75c9196e4d74838aaf965aebea7b992fa`
- Manifest: [`eval-proposal-batch-v4-wave-6.json`](./eval-proposal-batch-v4-wave-6.json)
- Scope: `5` 个待审 Protocol v4 Proposal，覆盖 `using-helloscholar`；全部计入候选产品 Skill 覆盖，但只有后续真实 Red、Live 通过并由用户接受后才成为 accepted coverage。
- Run state at review creation: 未启动任何本 Batch 的 Haiku Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。

## 这次审核的边界

本页与 manifest 固定当前 `5` 个 Scenario、Protocol、Fixture 与共享用户价值 rubric 的完整输入。批准顶部的 Batch ID 和 Batch SHA-256 后，授权的仅是这批完全绑定输入的 **Baseline Observation**；不接受任何 Skill 输出，不授权生产代码修改，不授权 Live Eval，也不代替后续对 Scorecard 的用户决定。

任何已绑定 Scenario、Protocol、Fixture、共享 rubric 或 manifest 的语义变更都会改变 Batch SHA-256；受影响的 Proposal 必须以新 Hash 重新审核。

## Fixture 可见性

Implementer 只会看到隔离 Fixture、当前用户请求、Fixture `AGENTS.md`、允许的 Skill snapshot/hash、绝对 CLI、读取边界和安全停止条件。完整 Scenario、Protocol、rubric、hard rejects、预期答案、Reviewer 判断与未来消息仍是 evaluator-only，不会暴露给 Implementer。

## 逐项审核材料

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 5 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `5` 个 pending v4 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- `router-experiment-v3`：The run verifier checks retained evidence consistency and one-launch behavior without exposing a fixed benchmark answer or hidden sentinel artifact.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 5 项逐项合同

### 01. `router-design-v3` - `using-helloscholar`

- Proposal ID: [`proposal-router-design-v3-haiku-v4`](../../../test/skill-evals/router-design-v3/proposal-approval.json)
- Project / case: `node-batch-query-api` / `router-design-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 查询服务需要增加公开的批量查询 API，HTTP 调用方会在一次请求中提交多条查询。请先把输入校验、单项失败语义和 service/transport 的职责谈清楚；在我批准设计前不要改实现。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-design-v3/scenario.md`](../../../test/skill-evals/router-design-v3/scenario.md) = `0a4b96886255de26cbd55d5bbd5e73395cef865a1d2bfb113784f5c667745e0c`
- Protocol: [`test/skill-evals/router-design-v3/protocol.json`](../../../test/skill-evals/router-design-v3/protocol.json) = `3dd70c986d616418f4c06984a84d0fe218ef10efeb42be20442ffdf7489b9422`
- Fixture: [`test/skill-evals/router-design-v3/fixture`](../../../test/skill-evals/router-design-v3/fixture) = `f273a1a2f6f18e647b64e6aca35416452d5873f8a641365dcc6c36c04fea9103`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-selection` - 权重 `25%`，critical `true`，最低 `90`：Confirm the novel public API and cross-layer contract are routed to Design, with brainstorming before manage-specs ownership rather than a direct implementation path.
- `constraint-discovery` - 权重 `20%`，critical `true`，最低 `90`：Confirm the Implementer asks one material question before writing and incorporates the 50-item limit, ordered per-item results, partial failure semantics and single-query compatibility into the design.
- `design-tradeoffs` - 权重 `20%`，critical `true`，最低 `90`：Confirm multiple viable service and transport designs are compared on validation, error semantics and ownership, with a reasoned recommendation for the synchronous batch service API.
- `approval-and-spec-ownership` - 权重 `20%`，critical `true`，最低 `90`：Confirm each scripted stop is respected, manage-specs identifies an independent identity before writing, and only one final whole-document approval allows creation of the exact reviewed draft Spec and generated indexes.
- `implementation-boundary` - 权重 `15%`，critical `true`，最低 `90`：Confirm source, tests and package metadata remain unchanged and the run ends after the draft Spec without implementation or downstream planning artifacts.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- chooses a direct implementation, experiment, or maintenance path for the public API design
- writes source, tests, package metadata, or downstream planning artifacts before authorization
- skips clarification and meaningful alternatives before recommending a design
- writes a formal Spec without entering the manage-specs ownership step
- asks for section-by-section approval or writes a Spec that was not reviewed as one complete document
- includes future user decisions in the first prompt or continues past a real stop point

**Critical path**: Classify the request as Design, ask the first material API question, and reach an approved draft Spec through the required design stops without entering implementation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `router-execution-v3` - `using-helloscholar`

- Proposal ID: [`proposal-router-execution-v3-haiku-v4`](../../../test/skill-evals/router-execution-v3/proposal-approval.json)
- Project / case: `py-cache-allocator` / `router-execution-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: Cache 的 Spec、Plan 和 Tasks 都已审过。本轮明确授权你按当前 Tasks 完成实现；完成后把任务状态和验证结果收口。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-execution-v3/scenario.md`](../../../test/skill-evals/router-execution-v3/scenario.md) = `a2343949a173d62009ec1c06885d9d9dcd69f893da969264907e45b3ffa7981c`
- Protocol: [`test/skill-evals/router-execution-v3/protocol.json`](../../../test/skill-evals/router-execution-v3/protocol.json) = `83ff946c1a5b5d3c6c380cc08cb1cc837cab11b5f82697099d17c1480c936c02`
- Fixture: [`test/skill-evals/router-execution-v3/fixture`](../../../test/skill-evals/router-execution-v3/fixture) = `9b7d2df4a759e3000cc21198266e6ce23e896f498f298cd6e3ba164c066faf61`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-and-gates` - 权重 `25%`，critical `true`，最低 `90`：Confirm implementation begins only after reading an accepted Spec, Current approved Plan, currently approved Tasks revision and the user's separate current-session implementation authorization.
- `task-directed-implementation` - 权重 `30%`，critical `true`，最低 `90`：Confirm the current main Agent follows the existing Tasks dependencies, file ownership, validation and completion conditions directly without redesign, duplicate documents or nested implementation agents.
- `behavioral-correctness` - 权重 `25%`，critical `true`，最低 `90`：Confirm get() refreshes recency, capacity evicts the least-recently-used key, and updating an existing key refreshes it without evicting another entry, all covered by passing tests.
- `bundle-convergence` - 权重 `20%`，critical `true`，最低 `90`：Confirm Tasks statuses reflect actual dependency-ordered completion and fresh tests and bundle checks, while the accepted Spec, approved Plan and one-Bundle identity remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- repeats design or creates a second Spec Bundle instead of executing the Current approved Tasks
- implements without confirming accepted Spec, approved Current Plan, current Tasks approval, and this-session authorization
- changes the Accepted Spec or Approved Plan or writes outside source, tests, and Tasks status
- marks Tasks complete without current full-suite and bundle-state evidence

**Critical path**: Verify the current-session authorization and approved Bundle, then begin the first dependency-ready Task directly and continue to fresh convergence evidence.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 03. `router-experiment-v3` - `using-helloscholar`

- Proposal ID: [`proposal-router-experiment-v3-haiku-v4`](../../../test/skill-evals/router-experiment-v3/proposal-approval.json)
- Project / case: `node-ranking-benchmark` / `router-experiment-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 请现在启动这次正式 ranking Benchmark，按现有 campaign 采集当前实现的基线。把原始输出、结构化指标和结论留好，代码不要改。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-experiment-v3/scenario.md`](../../../test/skill-evals/router-experiment-v3/scenario.md) = `8004c60dfc7ce9065170b0a526eb54a0db77ed90894738c15cd99330e88fc6ef`
- Protocol: [`test/skill-evals/router-experiment-v3/protocol.json`](../../../test/skill-evals/router-experiment-v3/protocol.json) = `475a4d5df3ba81947f71ba42a2c825c0810f8ec9c8a0058e48005cda3fa08b29`
- Fixture: [`test/skill-evals/router-experiment-v3/fixture`](../../../test/skill-evals/router-experiment-v3/fixture) = `5e1c1497e8a223a2dc3d25fa531101a20bed27cdde4d1174631e54e22e117a5b`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-selection` - 权重 `25%`，critical `true`，最低 `90`：Confirm the authorized formal baseline uses record-experiment before launch, without creating a speculative Spec workflow, and retains intentionally null Spec and Plan association.
- `prestart-record` - 权重 `25%`，critical `true`，最低 `90`：Confirm one root Run Record containing the fixed campaign command, inputs, stop rule and intended output paths exists before the benchmark process starts.
- `evidence-provenance` - 权重 `25%`，critical `true`，最低 `90`：Confirm the exact authorized command and exit status are preserved with raw benchmark output and matching structured metrics while campaign, dataset, source, tests and scripts remain unchanged.
- `result-interpretation` - 权重 `15%`，critical `true`，最低 `90`：Confirm the finalized Record reports the observed metrics, status, evidence-based conclusion and next action honestly rather than inferring success without retained output.
- `scope-preservation` - 权重 `10%`，critical `true`，最低 `90`：Confirm the only writes are one root Run's Record, outputs and results, with no duplicate summary, Spec, Architecture or implementation change.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- starts the formal benchmark before creating the root Run record
- creates a Spec merely because benchmark results may inform later work
- modifies code, tests, benchmark scripts, campaign facts, or dataset during the run
- creates run.json, a second Run summary, or omits raw or structured evidence
- claims a completed result without the actual command, exit status, output, metrics, and honest conclusion

**Critical path**: Create the minimum reproducible root Record, launch the fixed benchmark once, and finish its evidence without changing the measured implementation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 04. `router-fast-v3` - `using-helloscholar`

- Proposal ID: [`proposal-router-fast-v3-haiku-v4`](../../../test/skill-evals/router-fast-v3/proposal-approval.json)
- Project / case: `py-text-normalizer` / `router-fast-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 搜索摘要里复制进来的文字有时会留下连续空格和换行。请直接修好这个问题，补上能复现的测试，并把相关测试跑完。不要改变 `normalize_text()` 的调用方式。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-fast-v3/scenario.md`](../../../test/skill-evals/router-fast-v3/scenario.md) = `98e8541fe4bd69c88eac1621d3e4673fe1e5a87a65626925b5a7d3bc980ea6ab`
- Protocol: [`test/skill-evals/router-fast-v3/protocol.json`](../../../test/skill-evals/router-fast-v3/protocol.json) = `75c7a3836e338c10453c81d2aa7586130496e827f0a18be22d2dce3ed685c04b`
- Fixture: [`test/skill-evals/router-fast-v3/fixture`](../../../test/skill-evals/router-fast-v3/fixture) = `7f9f383f6dec198c85b3ea40b33e29640cd322fd3efb1a58bf5a4d6ea9420800`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-selection` - 权重 `30%`，critical `true`，最低 `90`：Confirm the localized compatible bug fix is handled directly without creating unrelated design, document, experiment, or multi-stage workflow artifacts.
- `scoped-fix` - 权重 `30%`，critical `true`，最低 `90`：Confirm the smallest implementation collapses consecutive spaces, tabs and newlines while preserving normalize_text()'s public signature, existing behavior and dependency set.
- `regression-evidence` - 权重 `25%`，critical `true`，最低 `90`：Confirm a focused regression test reproduces all reported whitespace forms and the current complete unittest suite passes after the fix with saved command output.
- `state-preservation` - 权重 `15%`，critical `true`，最低 `90`：Confirm only the named source and test files change, with no parallel implementation, dependency, project document, Run or other repository state mutation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates or changes a Spec, Plan, Tasks, Record, Run, or Architecture file
- changes the normalize_text public signature or adds a dependency
- claims completion without a focused regression test and current full test output
- writes outside the two allowed source and test files

**Critical path**: Inspect the named code and tests, make the first focused regression action, and preserve the public interface without creating project documents.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 05. `router-maintenance-v3` - `using-helloscholar`

- Proposal ID: [`proposal-router-maintenance-v3-haiku-v4`](../../../test/skill-evals/router-maintenance-v3/proposal-approval.json)
- Project / case: `py-research-doc-index` / `router-maintenance-v3`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 项目里的文档导航还是上一次的旧内容。请把它恢复成当前状态，别顺手改研究代码或正文。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-maintenance-v3/scenario.md`](../../../test/skill-evals/router-maintenance-v3/scenario.md) = `3d71dcb2854a4a0310de9a80045f0059134b8e0ab1c261e872bb354ace94571e`
- Protocol: [`test/skill-evals/router-maintenance-v3/protocol.json`](../../../test/skill-evals/router-maintenance-v3/protocol.json) = `3bf8ba2a4280490e7e1c96782dd1e01e8a53df15caa63c4da9595b64d8a93a94`
- Fixture: [`test/skill-evals/router-maintenance-v3/fixture`](../../../test/skill-evals/router-maintenance-v3/fixture) = `24f72dc2e6e6baaf6d7191fda20b910bf591488bf492054b9385a51a28e000ac`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-and-mode-selection` - 权重 `30%`，critical `true`，最低 `90`：Confirm stale generated navigation is handled by docs-maintenance index mode rather than a design or general implementation workflow.
- `generated-index-correctness` - 权重 `25%`，critical `true`，最低 `90`：Confirm the absolute docs sync CLI deterministically rebuilds the global Spec, Topic and Run indexes with current rows, statuses, ordering and relative links.
- `write-boundary` - 权重 `25%`，critical `true`，最低 `90`：Confirm exactly the three generated Index files change and every Spec, Record, Architecture, source, test, script and project-rule byte remains unchanged.
- `idempotent-evidence` - 权重 `20%`，critical `true`，最低 `90`：Confirm a second absolute docs sync exits successfully and full-tree evidence proves it produces no additional content or metadata diff.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- uses a design or general implementation workflow instead of generated-index maintenance
- manually edits generated table content instead of using the absolute hello-scholar docs sync CLI
- changes a Spec, Record, Architecture, source, test, project rule, or any non-Index file
- creates a new core document, Run, recovery report, or Handoff
- omits the second sync or claims idempotence without full-tree evidence

**Critical path**: Run the canonical sync, then prove the second sync makes no further full-tree change without changing source documents.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 审核后的可执行范围

若该 Batch 得到精确批准，才会为其中每个 Scenario 严格串行执行真实 Haiku Baseline。每场 Baseline 只可真实记录 `fail` 或 `control-pass`；`control-pass` 立即停止该路径，只有有效 Red 才可进入最小修复与独立 Live authorization。
