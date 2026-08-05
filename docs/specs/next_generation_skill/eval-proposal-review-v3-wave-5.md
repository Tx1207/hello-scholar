# Sonnet v3 Baseline Proposal 批量审核 — Wave 5 — 显式工作流

- Status: `pending-user-review`
- Batch ID: `sonnet-v3-wave-5-explicit-workflows`
- Batch SHA-256: `sha256:d6724b2e945380033bfe603f66bbdbe02354f07c6b883ce8aa05c230ca25fadd`
- Manifest: [`eval-proposal-batch-v3-wave-5.json`](./eval-proposal-batch-v3-wave-5.json)
- Scope: `10` 个待审 Protocol v3 Proposal，覆盖 `crash-audit、landing、takeoff、test-driven-development、using-git-worktrees`；全部计入候选产品 Skill 覆盖，但只有后续真实 Red、Live 通过并由用户接受后才成为 accepted coverage。
- Run state at review creation: 未启动任何本 Batch 的 Sonnet Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。

## 这次审核的边界

本页与 manifest 固定当前 `10` 个 Scenario、Protocol、Fixture 与共享用户价值 rubric 的完整输入。若你以后批准顶部的 Batch ID 和 Batch SHA-256，授权的仅是这批完全绑定输入的 **Baseline Observation**；不接受任何 Skill 输出，不授权生产代码修改，不授权 Live Eval，也不代替后续对 Scorecard 的用户决定。

任何已绑定 Scenario、Protocol、Fixture、共享 rubric 或 manifest 的语义变更都会改变 Batch SHA-256；受影响的 Proposal 必须以新 Hash 重新审核。

## Fixture 可见性

Implementer 只会看到隔离 Fixture、当前用户请求、Fixture `AGENTS.md`、允许的 Skill snapshot/hash、绝对 CLI、读取边界和安全停止条件。完整 Scenario、Protocol、rubric、hard rejects、预期答案、Reviewer 判断与未来消息仍是 evaluator-only，不会暴露给 Implementer。

## 逐项审核材料

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 10 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `10` 个 pending v3 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- `crash-audit-calibrated-none-v3`：The specific review diff is now a hash-bound evaluator setup rather than Fixture-visible scripted answer material.
- `crash-audit-release-blind-spot-v3`：The Fixture keeps the cleanup proposal facts without stating the evaluator's missing-evidence conclusion.
- `takeoff-delete-internal-compat-v3`：Project rules require evidence-based classification without preclassifying public contracts.
- `takeoff-protect-real-contract-v3`：Project rules require evidence-based classification without preclassifying external contracts.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 10 项逐项合同

### 01. `tdd-approved-task-trigger-v3` - `test-driven-development`

- Proposal ID: [`proposal-tdd-approved-task-trigger-v3-sonnet`](../../../test/skill-evals/tdd-approved-task-trigger-v3/proposal-approval.json)
- Project / case: `py-config-upgrader` / `tdd-approved-task-trigger-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请执行当前 Approved Tasks 的 T001，并在完成后给出验证结果。不要处理后续工作，也不要修改 Spec 或 Plan。

**当前不可变输入**

- Scenario: [`test/skill-evals/tdd-approved-task-trigger-v3/scenario.md`](../../../test/skill-evals/tdd-approved-task-trigger-v3/scenario.md) = `3ced7804e87679825fb04dadfe3231e948b06012f0a4d1aaaa4094644bd47d82`
- Protocol: [`test/skill-evals/tdd-approved-task-trigger-v3/protocol.json`](../../../test/skill-evals/tdd-approved-task-trigger-v3/protocol.json) = `24e13f846ccbb29248780ca3537f1a30e168be0c649c6ac6773b3b185ca132f3`
- Fixture: [`test/skill-evals/tdd-approved-task-trigger-v3/fixture`](../../../test/skill-evals/tdd-approved-task-trigger-v3/fixture) = `f83528cdab2f7da625630675acd56696a6268698ea8e3b929c70a526ff8b9f55`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `approved-task-trigger` - 权重 `25%`，critical `true`，最低 `90`：Confirm the Implementer reads current approved Task T001 and recognizes its explicit Process: test-driven-development as the trigger even though the user does not repeat TDD.
- `red-green-sequence` - 权重 `30%`，critical `true`，最低 `90`：Confirm a focused unknown-key test is written first and fails because the key is silently accepted, followed by the minimum validation and saved focused and full Green evidence.
- `validation-correctness` - 权重 `25%`，critical `true`，最低 `90`：Confirm every top-level key outside version, endpoint and retries raises a message naming the unknown key while valid input still emits the unchanged version-2 JSON shape.
- `bundle-scope` - 权重 `20%`，critical `false`，最低 `90`：Confirm only source, focused tests and T001 completion state change, and T001 is checked only after evidence while Spec, Plan, valid sample, schema, later Tasks and dependencies remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- fails to treat the approved Task Process as an explicit TDD trigger
- changes production code before observing the focused behavior failure
- uses an invalid fixture, syntax error, or already-passing test as Red
- changes the accepted Spec, approved Plan, or valid output schema
- marks T001 complete before focused and full Green verification

**Critical path**: Read the explicit Approved Task trigger, create and observe the focused failing test, then make the minimum Green change before full validation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `tdd-user-trigger-v3` - `test-driven-development`

- Proposal ID: [`proposal-tdd-user-trigger-v3-sonnet`](../../../test/skill-evals/tdd-user-trigger-v3/proposal-approval.json)
- Project / case: `node-rate-window` / `tdd-user-trigger-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 使用 `$test-driven-development` 修复窗口边界：时间戳恰好达到 `windowMs` 时必须过期。先写一个最小测试并确认它因为边界行为缺失而失败，再做最小实现、跑绿并在需要时重构。不要改变公开 API。

**当前不可变输入**

- Scenario: [`test/skill-evals/tdd-user-trigger-v3/scenario.md`](../../../test/skill-evals/tdd-user-trigger-v3/scenario.md) = `cf999b3239f551153d6cccbc60a947b4794931ff54bdef41aed3be030bac1153`
- Protocol: [`test/skill-evals/tdd-user-trigger-v3/protocol.json`](../../../test/skill-evals/tdd-user-trigger-v3/protocol.json) = `a88a08f90e42520b0e03ec4b81d8ba838f54e879a0fb768c16319a0e35d35474`
- Fixture: [`test/skill-evals/tdd-user-trigger-v3/fixture`](../../../test/skill-evals/tdd-user-trigger-v3/fixture) = `bd6ff75d8eedb8ee39dacb19c2eec3e89f0e7edeaeec753d17d7079576755456`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `red-proof` - 权重 `30%`，critical `true`，最低 `90`：Confirm an isolated test for an accepted call at 0 followed by a call at 1000 is added first and observed failing by the intended boundary assertion before any production byte changes.
- `minimal-green` - 权重 `25%`，critical `true`，最低 `90`：Confirm the smallest production correction makes the focused test green, with any refactor occurring only after Green and without clocks, persistence, packages or unrelated behavior.
- `boundary-correctness` - 权重 `25%`，critical `true`，最低 `90`：Confirm timestamps whose age equals windowMs expire while younger timestamps still count, the public constructor and allow(nowMs) signatures stay fixed, and the final full suite passes.
- `scope-discipline` - 权重 `20%`，critical `false`，最低 `90`：Confirm only the named source and test files change and saved command chronology proves valid Red then focused and full Green without report or dependency artifacts.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- changes production code before a focused failing boundary test is observed
- uses a syntax, import, or setup error as Red
- adds a test that passes before implementation
- changes the public API or adds dependencies
- finishes without a green focused test and green full suite

**Critical path**: Honor the user TDD request, create and observe the boundary Red before any production byte changes, then reach focused and full Green.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 03. `worktree-explicit-bundle-isolation-v3` - `using-git-worktrees`

- Proposal ID: [`proposal-worktree-explicit-bundle-isolation-v3-sonnet`](../../../test/skill-evals/worktree-explicit-bundle-isolation-v3/proposal-approval.json)
- Project / case: `py-localization-parser` / `worktree-explicit-bundle-isolation-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请使用 `$using-git-worktrees` 为 `SPEC-003` 的 brace escaping 实现准备隔离 Worktree，分支名是 `fix/localization-brace-escaping`，路径使用项目已忽略的 `.worktrees/localization-brace-escaping`。确认 Git 拓扑、保护我当前的 release-copy 草稿，并在新 Worktree 跑完 baseline tests 后停下；不要实现 T001，也不要清理 Worktree。

**当前不可变输入**

- Scenario: [`test/skill-evals/worktree-explicit-bundle-isolation-v3/scenario.md`](../../../test/skill-evals/worktree-explicit-bundle-isolation-v3/scenario.md) = `6fab402e33ffe000e9508911cf5d996b007a3c8e3ad86c5643123d683c2b0bff`
- Protocol: [`test/skill-evals/worktree-explicit-bundle-isolation-v3/protocol.json`](../../../test/skill-evals/worktree-explicit-bundle-isolation-v3/protocol.json) = `70d723a822e0298b34092d07d432393b1041944447a603544dcd416d6ac1fa01`
- Fixture: [`test/skill-evals/worktree-explicit-bundle-isolation-v3/fixture`](../../../test/skill-evals/worktree-explicit-bundle-isolation-v3/fixture) = `74cf31ea1af3151b03af1feb7bb6e9740640c905702fdbc63b97ef99b640721b`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `topology-and-consent` - 权重 `20%`，critical `true`，最低 `90`：Confirm the explicit creation request is honored after inspecting Git directory, common directory, branch, superproject state, status, and registered Worktrees without asking for duplicate consent.
- `safe-project-local-creation` - 权重 `25%`，critical `true`，最低 `90`：Confirm an actually available native Worktree tool is preferred, otherwise the ignored .worktrees convention is verified before creating exactly fix/localization-brace-escaping at the requested project-local path.
- `dirty-state-isolation` - 权重 `25%`，critical `true`，最低 `90`：Confirm source-checkout hashes and status prove the release-copy draft is unchanged and uncommitted, while the new Worktree starts from committed Base and does not copy the draft line.
- `bundle-and-baseline-readiness` - 权重 `20%`，critical `true`，最低 `90`：Confirm the isolated checkout contains the committed Accepted Spec, Approved Plan and Tasks, remains implementation-clean, and passes the complete Python baseline from its own root.
- `report-and-stop-boundary` - 权重 `10%`，critical `true`，最低 `90`：Confirm the response reports the absolute Worktree path, branch, isolated Git state and exact test result, then stops without T001 implementation, Task mutation, cleanup, staging or commit.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- copies, overwrites, stages, commits, removes, or cleans the user's release-copy draft
- creates a nested Worktree without checking current Git topology and existing registered Worktrees
- uses Git fallback when a real native Worktree tool is available or skips ignore verification before project-local fallback
- uses a different branch or path, implements T001, changes the Bundle, source, tests, dependencies, or .gitignore, or performs cleanup
- reads the hello-scholar Task Packet, production Skill, or another Eval case

**Critical path**: Honor the explicit isolation request, verify repository and ignore state, create a separate worktree on the intended base, validate it, and leave the primary checkout unchanged.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 04. `worktree-explicit-create-v3` - `using-git-worktrees`

- Proposal ID: [`proposal-worktree-explicit-create-v3-sonnet`](../../../test/skill-evals/worktree-explicit-create-v3/proposal-approval.json)
- Project / case: `node-cache-key-service` / `worktree-explicit-create-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请为 cache-key normalization 修复创建一个隔离 Worktree，使用分支 `fix/cache-key-normalization`。准备好环境并跑完 baseline tests 后停下，不要实现功能，也不要清理 Worktree。

**当前不可变输入**

- Scenario: [`test/skill-evals/worktree-explicit-create-v3/scenario.md`](../../../test/skill-evals/worktree-explicit-create-v3/scenario.md) = `baa3ec7b9840b1b5a0981941678cb5b082f727d47101e56b4b5aace8dca9c35e`
- Protocol: [`test/skill-evals/worktree-explicit-create-v3/protocol.json`](../../../test/skill-evals/worktree-explicit-create-v3/protocol.json) = `490ae4f081d6f6b69ec41981d0498228a4991f7875ff8579444cffbf688e83e0`
- Fixture: [`test/skill-evals/worktree-explicit-create-v3/fixture`](../../../test/skill-evals/worktree-explicit-create-v3/fixture) = `e68d3f5c8c49db86aa14c19a4247dae067c890634752dabdba5dfe0e505741d9`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `isolation-detection` - 权重 `25%`，critical `true`，最低 `90`：Confirm Git directory, common directory, branch, superproject, status and existing Worktrees are inspected to establish a normal checkout before creating nested isolation.
- `safe-worktree-creation` - 权重 `30%`，critical `true`，最低 `90`：Confirm an actually available native Worktree tool is preferred, otherwise the ignored .worktrees convention is verified and the exact fix/cache-key-normalization branch and project-local path are created once.
- `dirty-state-preservation` - 权重 `25%`，critical `true`，最低 `90`：Confirm source-checkout hashes and Git status prove the user's dirty cache-key note is neither copied, overwritten, staged, committed nor removed and no other project byte changes.
- `baseline-and-stop` - 权重 `20%`，critical `true`，最低 `90`：Confirm node tests run successfully inside the new Worktree and the response reports its absolute path, branch and exact result before stopping without implementation or cleanup.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- overwrites, stages, commits, or removes the user's dirty documentation change
- creates a nested Worktree without checking existing isolation and submodule state
- uses Git fallback when an actual native Worktree tool is available
- skips ignore verification before project-local Git fallback
- implements the cache-key feature or cleans up without separate authorization

**Critical path**: Inspect repository topology and dirty state, create exactly one authorized isolated Worktree, run its baseline tests, and stop before implementation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 05. `crash-audit-calibrated-none-v3` - `crash-audit`

- Proposal ID: [`proposal-crash-audit-calibrated-none-v3-sonnet`](../../../test/skill-evals/crash-audit-calibrated-none-v3/proposal-approval.json)
- Project / case: `py-error-message-formatter` / `crash-audit-calibrated-none-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 我刚把 tokenizer 的错误消息改清楚了，相关测试和完整测试都过了，公开输出快照也核对过。请坠机一下，看看我是不是漏了重要问题。只做 crash audit，不要改文件。

**当前不可变输入**

- Scenario: [`test/skill-evals/crash-audit-calibrated-none-v3/scenario.md`](../../../test/skill-evals/crash-audit-calibrated-none-v3/scenario.md) = `7b5600dec27f387cbf3c3ef8541f1b91a990442755741bf83205e37532587a7e`
- Protocol: [`test/skill-evals/crash-audit-calibrated-none-v3/protocol.json`](../../../test/skill-evals/crash-audit-calibrated-none-v3/protocol.json) = `4129fb9dc8eeab3f3beea2546b0cfc04793bbd1fc56e725294cade93c1546113`
- Fixture: [`test/skill-evals/crash-audit-calibrated-none-v3/fixture`](../../../test/skill-evals/crash-audit-calibrated-none-v3/fixture) = `e86cae4d7e6cf75c7cd6ada413d9a46408515b75092629add575ed8b2fea9349`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `diff-and-contract-reading` - 权重 `25%`，critical `true`，最低 `90`：Confirm the prepared Base-to-working-tree diff, formatter, focused tests, public snapshot, README contract and current command results are all inspected before judging the change.
- `uncertainty-calibration` - 权重 `25%`，critical `true`，最低 `90`：Confirm the answer distinguishes evidence-closed behavior from any genuinely unverified surface and explicitly says when no material uncertainty remains instead of inventing one.
- `decision-relevance` - 权重 `15%`，critical `true`，最低 `90`：Confirm every reported concern would change approval or the next action; style preferences and risks already closed by the snapshot and tests are excluded.
- `fast-verification` - 权重 `10%`，critical `false`，最低 `90`：Confirm existing focused/full tests and diff-check evidence are cited, and any remaining uncertainty receives the cheapest concrete verification rather than a generic request for more testing.
- `two-question-separation` - 权重 `10%`，critical `true`，最低 `90`：Confirm the least-certain items and possibly missed items are answered as distinct questions, with no duplicate concern and no more than three items per question.
- `concise-no-fabrication` - 权重 `15%`，critical `true`，最低 `90`：Confirm the response leads with the calibrated conclusion, remains read-only, creates no report, and uses project facts without boilerplate or manufactured risk.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not inspect the actual review diff and current tests
- fabricates a major release, migration, security, or compatibility concern without project evidence
- repeats the same generic concern under both source questions
- edits, stages, commits, or creates a report in the fixture
- routes into takeoff, landing, or a full code review

**Critical path**: Read the prepared diff, public snapshot, source, tests, and rules, then tell the user whether any approval-changing blind spot remains without manufacturing work.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 06. `crash-audit-release-blind-spot-v3` - `crash-audit`

- Proposal ID: [`proposal-crash-audit-release-blind-spot-v3-sonnet`](../../../test/skill-evals/crash-audit-release-blind-spot-v3/proposal-approval.json)
- Project / case: `node-config-migration-cli` / `crash-audit-release-blind-spot-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 清理方案的单元测试都通过了，我准备批准。请先做一次 crash audit，只回答你最没把握的地方和我可能漏掉的事情，并告诉我成本最低的验证方式。不要改文件，也不要替我重写方案。

**当前不可变输入**

- Scenario: [`test/skill-evals/crash-audit-release-blind-spot-v3/scenario.md`](../../../test/skill-evals/crash-audit-release-blind-spot-v3/scenario.md) = `33ebf16fa483344998fac4547c5e7fbe620576fb966af9ea037c3e79edaa78f0`
- Protocol: [`test/skill-evals/crash-audit-release-blind-spot-v3/protocol.json`](../../../test/skill-evals/crash-audit-release-blind-spot-v3/protocol.json) = `9610ca700c4476a630c99f0c495b6157473c70fd3a8bf96e5bc043f355672097`
- Fixture: [`test/skill-evals/crash-audit-release-blind-spot-v3/fixture`](../../../test/skill-evals/crash-audit-release-blind-spot-v3/fixture) = `6e0e43a2f2eea2194d0066c860a89fc684d46b9b7b9372bd634be0c951c93282`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `fact-grounding` - 权重 `25%`，critical `true`，最低 `90`：Confirm the public compatibility promise, cleanup plan, v1/v2 reader code, persisted v1 fixture, tests and read-only smoke output are inspected and cited accurately.
- `uncertainty-calibration` - 权重 `20%`，critical `true`，最低 `90`：Confirm uncertainty is tied to the unobserved population of persisted v1 configurations and release rollout evidence, with confidence and missing facts stated plainly.
- `decision-impact` - 权重 `20%`，critical `true`，最低 `90`：Confirm the audit explains how removing the v1 reader could change release approval, ordering or rollback safety rather than listing low-impact possibilities.
- `fast-verification` - 权重 `15%`，critical `false`，最低 `90`：Confirm the answer proposes the cheapest concrete inventory or representative v1 smoke check that would resolve each material unknown before cleanup approval.
- `two-question-separation` - 权重 `10%`，critical `true`，最低 `90`：Confirm least-confidence judgments and user blind spots are separated without repetition and limited to the decision-relevant maximum requested.
- `concise-no-fabrication` - 权重 `10%`，critical `true`，最低 `90`：Confirm the response is direct, evidence-backed and read-only, with no rewritten plan, generic risk matrix, third summary or invented repository fact.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not inspect the repository facts before judging uncertainty
- misses a high-impact conflict between the proposed cleanup and an observable user contract
- rewrites the plan, edits the fixture, or starts migration work
- duplicates one concern under both source questions or invents generic risks
- routes into takeoff, landing, or a full code review

**Critical path**: Read the compatibility promise, release plan, persisted v1 sample, reader, and tests, then surface the first approval-changing unknown and its cheapest verification.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 07. `takeoff-delete-internal-compat-v3` - `takeoff`

- Proposal ID: [`proposal-takeoff-delete-internal-compat-v3-sonnet`](../../../test/skill-evals/takeoff-delete-internal-compat-v3/proposal-approval.json)
- Project / case: `py-feature-flag-core` / `takeoff-delete-internal-compat-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: Takeoff 一下，别老想着兼容。我们现在的方案是继续给 `LegacyFlagAdapter` 加一个 context shim，但我想让你重新看目标模型：哪些旧概念其实应该直接杀掉？先给高格局判断、证据问题和收益账单，不要改代码，也不要写实施步骤。

**当前不可变输入**

- Scenario: [`test/skill-evals/takeoff-delete-internal-compat-v3/scenario.md`](../../../test/skill-evals/takeoff-delete-internal-compat-v3/scenario.md) = `5e58658f99027de083e9b8ab4e402d3ddb1dbdbad9666705299b137ed210f4ab`
- Protocol: [`test/skill-evals/takeoff-delete-internal-compat-v3/protocol.json`](../../../test/skill-evals/takeoff-delete-internal-compat-v3/protocol.json) = `1baa30a291cc18fc7601c11c720cc6b268b98bf6d4f2540445a2cdbdce22cf92`
- Fixture: [`test/skill-evals/takeoff-delete-internal-compat-v3/fixture`](../../../test/skill-evals/takeoff-delete-internal-compat-v3/fixture) = `962cfb24329a462aa1f5c2c759181063717e2e507944ff5c50dd02d5815d8a20`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `repository-fact-reading` - 权重 `20%`，critical `true`，最低 `90`：Confirm README promises, refactor history, production caller, persisted flags, source and tests are inspected before classifying LegacyFlagAdapter.
- `contract-versus-inertia` - 权重 `20%`，critical `true`，最低 `90`：Confirm the adapter is identified as internal migration inertia while FlagService and current persisted data are protected as the observable contract, with a boundary for contrary evidence.
- `frame-opening-thesis` - 权重 `20%`，critical `true`，最低 `90`：Confirm the thesis reframes the problem from adding a context shim to operating one Feature Flag model and names the removable adapter concept and duplicated state.
- `proof-and-falsifier` - 权重 `15%`，critical `true`，最低 `90`：Confirm the first proof point checks for real external or persisted adapter dependence and the falsifier would reverse the delete judgment if such dependence exists.
- `payoff-ledger` - 权重 `15%`，critical `false`，最低 `90`：Confirm benefits and costs are concrete, covering removed translation/state/error surfaces, compatibility risk, evidence needed and the value of one target model.
- `direction-stage-boundary` - 权重 `10%`，critical `true`，最低 `90`：Confirm output remains at direction level with options and an asking next move, no files or ordered implementation steps, and no automatic Brainstorming or Landing.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not inspect the public surface, callers, persisted data, and refactor record before classifying compatibility
- keeps the internal adapter by default without testing whether any real contract depends on it
- gives slogans without a concrete thesis, deletion boundary, proof question, falsifier, and payoff
- edits the fixture or turns direction analysis into an ordered implementation plan
- automatically starts brainstorming or landing

**Critical path**: Read public promises, callers, persisted data, history, source, and tests, then state whether the adapter is contract or inertia before opening the target frame.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 08. `takeoff-protect-real-contract-v3` - `takeoff`

- Proposal ID: [`proposal-takeoff-protect-real-contract-v3-sonnet`](../../../test/skill-evals/takeoff-protect-real-contract-v3/proposal-approval.json)
- Project / case: `node-model-config-sdk` / `takeoff-protect-real-contract-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: Greenfield this。把 legacy 全杀掉，给我一个高格局判断，不要被兼容包袱绑住。先用 Takeoff 说清楚干净目标、替代方向、第一证据问题、什么会推翻它以及收益账单；先别改代码或列迁移步骤。

**当前不可变输入**

- Scenario: [`test/skill-evals/takeoff-protect-real-contract-v3/scenario.md`](../../../test/skill-evals/takeoff-protect-real-contract-v3/scenario.md) = `e29644d14e39ee0551f1e5c60c5d9cdf9f3d2ef9dc7d3c211303768caa5634bf`
- Protocol: [`test/skill-evals/takeoff-protect-real-contract-v3/protocol.json`](../../../test/skill-evals/takeoff-protect-real-contract-v3/protocol.json) = `886b77ff83514acd3b401e38c657006021ce1a2f9763bfd82cb37e9a583d25e7`
- Fixture: [`test/skill-evals/takeoff-protect-real-contract-v3/fixture`](../../../test/skill-evals/takeoff-protect-real-contract-v3/fixture) = `d7b3bdda2ee53a8e45e0b418c11f73d53d88447fdc94bc9749dbfd019028bdad`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `repository-fact-reading` - 权重 `15%`，critical `true`，最低 `90`：Confirm README, both versioned schemas, persisted v1/v2 fixtures, two consumer examples, SDK source, internal wrapper and tests are inspected before judgment.
- `contract-classification` - 权重 `25%`，critical `true`，最低 `90`：Confirm the internal LegacyModelConfig dual track is separated from the observable load entry point and v1 persisted format, which are priced as migration/version contracts rather than dismissed.
- `clean-target-thesis` - 权重 `20%`，critical `true`，最低 `90`：Confirm the clean target is one internal model and one normalized runtime representation while preserving an explicit boundary for supported external input versions.
- `option-tradeoffs` - 权重 `15%`，critical `true`，最低 `90`：Confirm conservative retention, immediate clean target and staged convergence are compared on user breakage, internal complexity, migration evidence and time to simplicity.
- `proof-falsifier-payoff` - 权重 `15%`，critical `true`，最低 `90`：Confirm the first proof point asks for active-version/consumer evidence, the falsifier changes the deletion boundary, and the payoff ledger quantifies removed dual-track cost without hiding compatibility work.
- `direction-stage-boundary` - 权重 `10%`，critical `true`，最低 `90`：Confirm the output stays at high-level direction with an asking next move, makes no file change or migration plan, and does not auto-enter Brainstorming or Landing.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not inspect the documented API, versioned schema, persisted v1 file, and both consumer examples
- treats a documented or persisted external contract as disposable merely because the user asked for boldness
- keeps the internal legacy wrapper forever without offering a clean target model
- writes migration steps, edits the fixture, or creates design artifacts
- automatically starts brainstorming or landing

**Critical path**: Read public entry points, schemas, persisted v1 data, consumers, and internal wrappers, then separate removable internal dual-track state from priced external contracts.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 09. `landing-explicit-durable-queue-v3` - `landing`

- Proposal ID: [`proposal-landing-explicit-durable-queue-v3-sonnet`](../../../test/skill-evals/landing-explicit-durable-queue-v3/proposal-approval.json)
- Project / case: `node-background-job-scheduler` / `landing-explicit-durable-queue-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 请使用 `$landing` 把现有 durable job log 方向压实。基于仓库里的公共合同、Takeoff thesis、调用方和运维约束，给出价值排序、现实检查、可消费的目标形态、阶段边界、最小验证、止损规则和需要我裁决的取舍。保留 FIFO、at-least-once 和现有 `enqueue` 合同，不要改文件，也不要进入设计或实施计划。

**当前不可变输入**

- Scenario: [`test/skill-evals/landing-explicit-durable-queue-v3/scenario.md`](../../../test/skill-evals/landing-explicit-durable-queue-v3/scenario.md) = `786fa531f2a2f569d9f7b001f5bfe0e4b3a3672a5e51e9641ade0c4efe95618b`
- Protocol: [`test/skill-evals/landing-explicit-durable-queue-v3/protocol.json`](../../../test/skill-evals/landing-explicit-durable-queue-v3/protocol.json) = `296da44566e138d4c81a63fb704ee165cced1694b3652a15eb51815f365ee8d3`
- Fixture: [`test/skill-evals/landing-explicit-durable-queue-v3/fixture`](../../../test/skill-evals/landing-explicit-durable-queue-v3/fixture) = `2f7adf85f968a279ee49ed83a6aca61c1210ca5c3b1bca677318dfc5397e6dea`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `direction-and-fact-grounding` - 权重 `20%`，critical `true`，最低 `90`：Confirm the answer accurately recovers the durable-log thesis and grounds every feasibility claim in the public API, consumer, scheduler behavior, tests, and operating constraints.
- `value-and-contract-ranking` - 权重 `20%`，critical `true`，最低 `90`：Confirm durable ownership, FIFO per queue, at-least-once delivery, enqueue compatibility, lease recovery, and cross-region scope are explicitly ranked by user value and contract cost rather than treated as one undifferentiated ambition.
- `reality-and-resource-pricing` - 权重 `20%`，critical `true`，最低 `90`：Confirm one owner, one persistent volume, no approved managed queue, rollback compatibility, and restart loss are priced separately without inventing infrastructure or dismissing the durable target.
- `target-shape-and-boundaries` - 权重 `20%`，critical `true`，最低 `90`：Confirm the response states a consumable target shape and staged evidence boundaries that preserve external contracts while preventing a temporary dual-write or adapter from becoming the permanent model.
- `verification-stop-and-user-decisions` - 权重 `20%`，critical `true`，最低 `90`：Confirm the smallest useful restart/redelivery proof, observable stop or shrink rules, unresolved user tradeoffs, and deliberate stop before design or implementation are clear and actionable.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- drops FIFO, at-least-once delivery, enqueue compatibility, or rollback payload compatibility without explicit project evidence and user decision
- turns the current in-memory arrays into a protected contract or assumes an unapproved managed queue or datastore
- preserves every Takeoff ambition without pricing cross-region scope, operator burden, and rollback complexity
- provides ordered files, pull requests, migration steps, implementation code, or enters Brainstorming
- modifies any Fixture file, writes a report, or reads the hello-scholar Task Packet, production Skill, or another Eval case

**Critical path**: Read the project constraints, turn the requested aggressive direction into a feasible staged option, preserve real contracts, and give the user a decision-ready next step without starting implementation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 10. `landing-explicit-feasibility-v3` - `landing`

- Proposal ID: [`proposal-landing-explicit-feasibility-v3-sonnet`](../../../test/skill-evals/landing-explicit-feasibility-v3/proposal-approval.json)
- Project / case: `py-vector-index-service` / `landing-explicit-feasibility-v3`
- Agent model: `claude-sonnet-5`
- 计入产品 Skill case: 是
- 业务目标: 用 Landing 把 `docs/takeoff-thesis.md` 里的方向压实，别丢掉多租户隔离的野心。请基于项目里的 API、容量和团队约束给价值排序、现实检查、目标形态、阶段边界、便宜验证和止损规则；需要我裁决的地方单独说。不要改文件，也不要写第一 PR 或文件步骤。

**当前不可变输入**

- Scenario: [`test/skill-evals/landing-explicit-feasibility-v3/scenario.md`](../../../test/skill-evals/landing-explicit-feasibility-v3/scenario.md) = `7f5d3146e12ec92b7835fa187a687d8a84c47caef6b355c08a437a611eab37af`
- Protocol: [`test/skill-evals/landing-explicit-feasibility-v3/protocol.json`](../../../test/skill-evals/landing-explicit-feasibility-v3/protocol.json) = `1791c4c81d93c7a0bdfbe8a3ca26e98e24b8ed2d8a4eb82ffd7b1c9c203488eb`
- Fixture: [`test/skill-evals/landing-explicit-feasibility-v3/fixture`](../../../test/skill-evals/landing-explicit-feasibility-v3/fixture) = `bc0cad6fb4ffdb423b3350ba33b0abb91d5bf64ac680daa2a6872c0bebad37f7`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `direction-recovery` - 权重 `10%`，critical `true`，最低 `90`：Confirm the answer accurately restores the asynchronous multi-tenant index thesis, current synchronous model and central one-host/no-operator feasibility problem from project evidence.
- `evidence-backed-value-ranking` - 权重 `25%`，critical `true`，最低 `90`：Confirm multi-tenant isolation, bounded async writes, cross-region replication, query compatibility and operations are placed in Must Keep, Rewrite and Keep, Defer or Delete with criterion, evidence, value and cost.
- `ambition-preservation` - 权重 `15%`，critical `true`，最低 `90`：Confirm tenant isolation and an asynchronous service remain visible in the target shape rather than being reduced to a small single-process optimization.
- `reality-and-contract-pricing` - 权重 `20%`，critical `true`，最低 `90`：Confirm public query compatibility, measured capacity, single-host budget, zero dedicated operators and maximum failure radius are priced separately and without invented resources.
- `target-boundary-verification-stop` - 权重 `20%`，critical `true`，最低 `90`：Confirm the output states a non-procedural target shape, phase boundary, cheap queue/isolation validation and observable stop or shrink rules without PR, file or migration steps.
- `user-decision-and-stage-discipline` - 权重 `10%`，critical `true`，最低 `90`：Confirm material tradeoffs are isolated for user judgment, AI recommendations are labeled as such, no files change and the run does not enter Brainstorming or implementation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not recover the prior thesis, old model, and main reality problem from the supplied context
- drops multi-tenant isolation merely to make the first move small or keeps every ambitious feature without pricing it
- omits the four value buckets or gives important retained items without project evidence and concrete payoff
- fails to separate the public query contract, deployment budget, and largest blast radius
- writes implementation order, edits the fixture, or automatically starts brainstorming

**Critical path**: Recover the Takeoff thesis and project constraints, then give the first value-ranked feasibility judgment while preserving multi-tenant isolation as the target ambition.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 审核后的可执行范围

若该 Batch 得到精确批准，才会为其中每个 Scenario 严格串行执行真实 Sonnet Baseline。每场 Baseline 只可真实记录 `fail` 或 `control-pass`；`control-pass` 立即停止该路径，只有有效 Red 才可进入最小修复与独立 Live authorization。
