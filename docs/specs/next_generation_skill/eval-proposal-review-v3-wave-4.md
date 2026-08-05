# Sonnet v3 Baseline Proposal 批量审核 — Wave 4 — 收敛与交接

- Status: `pending-user-review`
- Batch ID: `sonnet-v3-wave-4-convergence-handoff`
- Batch SHA-256: `sha256:f4d3a03cdf83adb9ec9b8fc009434b505a37788e1dc6a508f41ec7434c6a9337`
- Manifest: [`eval-proposal-batch-v3-wave-4.json`](./eval-proposal-batch-v3-wave-4.json)
- Scope: `4` 个待审 Protocol v3 Proposal，覆盖 `converge-to-spec、handoff`；全部计入候选产品 Skill 覆盖，但只有后续真实 Red、Live 通过并由用户接受后才成为 accepted coverage。
- Run state at review creation: 未启动任何本 Batch 的 Sonnet Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。

## 这次审核的边界

本页与 manifest 固定当前 `4` 个 Scenario、Protocol、Fixture 与共享用户价值 rubric 的完整输入。若你以后批准顶部的 Batch ID 和 Batch SHA-256，授权的仅是这批完全绑定输入的 **Baseline Observation**；不接受任何 Skill 输出，不授权生产代码修改，不授权 Live Eval，也不代替后续对 Scorecard 的用户决定。

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

已逐项复核 `4` 个 pending v3 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- `handoff-dirty-implementation-v3`：Fixture verifiers now enforce only public scope and redaction boundaries; hidden Handoff path and answer details remain evaluator-only.
- `handoff-negative-experiment-v3`：Fixture verifiers now expose only project-state existence and redaction boundaries; classification and Handoff answer details remain evaluator-only.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 4 项逐项合同

### 01. `converge-completion-gate-v3` - `converge-to-spec`

- Proposal ID: [`proposal-converge-completion-gate-v3-sonnet`](../../../test/skill-evals/converge-completion-gate-v3/proposal-approval.json)
- Project / case: `py-batch-reporting-pipeline` / `converge-completion-gate-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请只读判断当前 `SPEC-041` Bundle 是否已经可以声明完成。不要因为 Tasks 全勾、旧摘要写着通过或现有单测是绿的就直接下结论；检查 Spec/Plan/Tasks 是否 Current、每个勾选 Task 的 Completion 是否有项目事实支撑、正式 Benchmark/Eval 是否有有效根目录 Run Record、迁移清理是否结束，以及当前工作树是否已有完整的新鲜验证证据。给出明确的 `Ready` 或 `Not Ready`，列出所有直接可观察的阻塞和下一步 owner，然后停下来。不要修改文档、代码、复选框，不要补造 Record，也不要另写报告。

**当前不可变输入**

- Scenario: [`test/skill-evals/converge-completion-gate-v3/scenario.md`](../../../test/skill-evals/converge-completion-gate-v3/scenario.md) = `cb5e7cbfd7f52fa10fadbd95a1f262b512e474193de0c3fdafaa37b5aecbb93b`
- Protocol: [`test/skill-evals/converge-completion-gate-v3/protocol.json`](../../../test/skill-evals/converge-completion-gate-v3/protocol.json) = `ba0d715d86ca9d776c62962dabfbe110fccccad534f6d6adb41a2aec24ea7322`
- Fixture: [`test/skill-evals/converge-completion-gate-v3/fixture`](../../../test/skill-evals/converge-completion-gate-v3/fixture) = `fd7a974afd03f7e5215996c07b25edbccbbe9c616ca59354366c958fe5ba00c2`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `current-contract-review` - 权重 `30%`，critical `true`，最低 `90`：Confirm the response compares the current SPEC-041 Spec, Plan, and Tasks with their stated revisions and lifecycle facts instead of treating checkboxes or a summary as completion proof.
- `completion-fact-traceability` - 权重 `25%`，critical `true`，最低 `90`：Confirm every material completion claim is checked against implementation, tests, callers, and directly observable project facts, with concrete blockers rather than unsupported conclusions.
- `benchmark-and-cleanup-review` - 权重 `25%`，critical `true`，最低 `90`：Confirm the assessment examines the formal benchmark provenance requirement and migration cleanup across the relevant implementation, caller, and test surfaces.
- `decision-and-boundary-discipline` - 权重 `20%`，critical `true`，最低 `90`：Confirm the chat response gives a clear Ready or Not Ready decision, routes observable blockers to appropriate next owners, and leaves the project byte-for-byte unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- declares completion without checking current Bundle revision and lifecycle facts
- uses checked Tasks, a prose summary, or a passing happy-path test suite as substitute proof for material completion conditions
- omits the formal benchmark provenance requirement or remaining migration cleanup from the assessment
- fails to provide a clear Ready or Not Ready decision with observable blockers and next owners
- changes files, Git state, generated documentation, Run material, or creates a separate report

**Critical path**: Inspect the current Bundle, implementation, callers, tests, records, and cleanup state, then return the first evidence-backed completion decision without writing files.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `converge-to-spec-v3` - `converge-to-spec`

- Proposal ID: [`proposal-converge-to-spec-v3-sonnet`](../../../test/skill-evals/converge-to-spec-v3/proposal-approval.json)
- Project / case: `node-access-policy-service` / `converge-to-spec-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请对当前 `SPEC-028` Bundle 做一次完成前的只读收敛审计。不要只看 Tasks 复选框或测试结果；逐项对照 Spec、Plan、Tasks、源码、测试、调用方和持久配置，找出 `Missing`、`Partial`、`Contradictory`、`Unrequested` 以及清理残留。每项都要给严重程度、Spec/Plan/Task 引用、`file:line` 实际证据和可实施的修复方向。先不要修改任何文件，也不要另写审计报告，直接在回复中给我审计结果并停下来。

**当前不可变输入**

- Scenario: [`test/skill-evals/converge-to-spec-v3/scenario.md`](../../../test/skill-evals/converge-to-spec-v3/scenario.md) = `160c39d5a82d67c10c1a6d5dc695786c2253a0db6cf437353050c007fba5e1b5`
- Protocol: [`test/skill-evals/converge-to-spec-v3/protocol.json`](../../../test/skill-evals/converge-to-spec-v3/protocol.json) = `f94034a1ccfdfb16b85beb0a1649d14ceeb687a948b89279bacf4f74c6a06191`
- Fixture: [`test/skill-evals/converge-to-spec-v3/fixture`](../../../test/skill-evals/converge-to-spec-v3/fixture) = `fc576d84b6d607eb7fd79d4c4afc32bfe8214b91e5b5dd41fe5092b307583529`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `semantic-audit-coverage` - 权重 `30%`，critical `true`，最低 `90`：Confirm the initial assessment compares the full SPEC-028 Bundle with runtime source, tests, caller, persisted configuration, and cleanup surfaces, identifying each present semantic deviation category.
- `traceable-repair-guidance` - 权重 `25%`，critical `true`，最低 `90`：Confirm each reported finding includes severity, a controlling Spec, Plan, or Task reference, direct file-and-line evidence, and a practical repair direction.
- `tasks-amendment-review-gate` - 权重 `25%`，critical `true`，最低 `90`：Confirm no file changes precede the audit stop, then the authorized amendment appends complete unchecked Tasks to the existing file and returns its lifecycle state to pending review before stopping.
- `scope-and-owner-discipline` - 权重 `20%`，critical `true`，最低 `90`：Confirm only the existing Tasks file and CLI-generated Indexes may change after authorization, while implementation, upstream documents, and unrelated project material remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- treats checked Tasks or passing tests as proof without comparing the full Bundle and project tree
- reports a material finding without severity, controlling reference, file-and-line evidence, and an implementable repair direction
- changes a file during the initial read-only assessment or creates a separate audit report
- amends Tasks before the initial audit stop or replaces existing Task content instead of appending directly implementable work
- fails to return the amended Tasks document to revision 5, pending-review approval, null approved revision, and pending status
- changes implementation, upstream documents, or anything other than the permitted Tasks file and generated Indexes after authorization

**Critical path**: Inspect the Bundle and all relevant project surfaces, report the first file-and-line-backed semantic deviation, then wait for authorization before any Tasks amendment.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 03. `handoff-dirty-implementation-v3` - `handoff`

- Proposal ID: [`proposal-handoff-dirty-implementation-v3-sonnet`](../../../test/skill-evals/handoff-dirty-implementation-v3/proposal-approval.json)
- Project / case: `py-search-normalization` / `handoff-dirty-implementation-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请为下一次会话写一份 handoff，让新的 Agent继续 search normalization 的实现，重点接住现在失败的测试和还没提交的改动。不要替我继续改代码，也不要提交。

**当前不可变输入**

- Scenario: [`test/skill-evals/handoff-dirty-implementation-v3/scenario.md`](../../../test/skill-evals/handoff-dirty-implementation-v3/scenario.md) = `c5a682065bba4529ed5b76f1db82c13f004dae29a6b2b91fc30159e697202153`
- Protocol: [`test/skill-evals/handoff-dirty-implementation-v3/protocol.json`](../../../test/skill-evals/handoff-dirty-implementation-v3/protocol.json) = `44e8d52cfb840abc5210b2b87471d81aa7e7fd80dc2cb86624ff7ac8f528fb1e`
- Fixture: [`test/skill-evals/handoff-dirty-implementation-v3/fixture`](../../../test/skill-evals/handoff-dirty-implementation-v3/fixture) = `dfa3ae794b79fe257ce9f25b6c38bd50e8259ae91232d5c5fb27b1ff40f4592a`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `workspace-state-accuracy` - 权重 `30%`，critical `true`，最低 `90`：Confirm the Handoff accurately separates completed, active, pending, and failing work and identifies the staged, modified, and untracked paths from current Git, Task, and test facts.
- `handoff-location-and-language` - 权重 `20%`，critical `true`，最低 `90`：Confirm exactly one Chinese Handoff is created at the requested project handoff path, with no secondary summary, Index, or legacy memory location.
- `fresh-agent-continuation` - 权重 `25%`，critical `true`，最低 `90`：Confirm a new agent can find the Bundle, relevant Task IDs, dirty paths, known failing dash-normalization test, and an executable first verification action without hidden conversation context.
- `scope-and-redaction` - 权重 `25%`，critical `true`，最低 `90`：Confirm the Handoff summarizes fact sources without copying sensitive values or large project documents, and preserves source, tests, Tasks, Git state, and session material.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes anywhere other than the one requested project Handoff path or changes the existing dirty state
- misstates a staged, modified, untracked, completed, pending, or failing fact
- uses a non-Chinese user-facing Handoff or creates a second summary or Handoff Index
- copies sensitive placeholders or large Spec, Plan, Tasks, diff, or session-note content
- omits an executable first verification action for a new agent or commits changes

**Critical path**: Inspect Git, Tasks, tests, and dirty files, then create one concise Handoff that lets a new agent take the first correct verification action.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 04. `handoff-negative-experiment-v3` - `handoff`

- Proposal ID: [`proposal-handoff-negative-experiment-v3-sonnet`](../../../test/skill-evals/handoff-negative-experiment-v3/proposal-approval.json)
- Project / case: `py-model-quantization-handoff` / `handoff-negative-experiment-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请写一份 handoff 给下一次会话，让新的 Agent继续判断量化搜索空间是否值得缩小。要接住两次已有实验和刚发现但还没验证的 batch-size 假设，不要现在启动新实验。

**当前不可变输入**

- Scenario: [`test/skill-evals/handoff-negative-experiment-v3/scenario.md`](../../../test/skill-evals/handoff-negative-experiment-v3/scenario.md) = `6416821161812d272c4032395f4fef81ae9644aeb8717bfa8ed44dd46d6fc3c4`
- Protocol: [`test/skill-evals/handoff-negative-experiment-v3/protocol.json`](../../../test/skill-evals/handoff-negative-experiment-v3/protocol.json) = `a37560e409d588c0dd603a894cc54a8a3d729bd676048f8ed5112ca04b033d8b`
- Fixture: [`test/skill-evals/handoff-negative-experiment-v3/fixture`](../../../test/skill-evals/handoff-negative-experiment-v3/fixture) = `b7a01e62822d728a652e840e50d00a458098cc3ab4e973d08e277d3b6cdd1051`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `run-fact-accuracy` - 权重 `30%`，critical `true`，最低 `90`：Confirm the Handoff cites both relevant Run Records and result files, preserving the distinction between an execution failure and a completed negative result.
- `hypothesis-boundary` - 权重 `20%`，critical `true`，最低 `90`：Confirm established Run facts remain separate from the unverified batch-size hypothesis, with an evidence gate and stop condition before any new experiment decision.
- `handoff-location-and-language` - 权重 `20%`，critical `true`，最低 `90`：Confirm exactly one English Handoff is created at the requested project handoff path and no Run, project contract, report, code, test, or Git state changes occur.
- `concise-safe-continuation` - 权重 `30%`，critical `true`，最低 `90`：Confirm a new agent can inspect concise cited sources, avoid repeating a known failed configuration, preserve the decision boundary, and continue without credentials, personal data, private paths, or sensitive placeholders.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- describes a completed negative result as an execution failure or omits the separate failed Run
- presents the batch-size hypothesis as established, recommends immediate experimentation, or omits a stop condition
- uses a non-English user-facing Handoff, writes outside the requested project handoff path, or creates a second summary or Handoff Index
- copies full records or logs or exposes credentials, personal data, private paths, or sensitive placeholders
- changes a Run, project contract, report, code, test, session material, Git index, or commit

**Critical path**: Inspect both Run Records and their evidence, then create one Handoff that preserves the failure-versus-negative-result distinction and the next evidence gate.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 审核后的可执行范围

若该 Batch 得到精确批准，才会为其中每个 Scenario 严格串行执行真实 Sonnet Baseline。每场 Baseline 只可真实记录 `fail` 或 `control-pass`；`control-pass` 立即停止该路径，只有有效 Red 才可进入最小修复与独立 Live authorization。
