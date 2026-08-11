# Haiku v4 Baseline Proposal 审核 — execution mirror

- Status: `pending-user-review`
- Batch ID: `haiku-v4-wave-7-execution-mirror`
- Batch SHA-256: `sha256:8f578a192da79b52cc541d19e60a740d02fb7f8fc2462955dea8a275f2aa3561`
- Manifest: [`eval-proposal-batch-v4-wave-7.json`](./eval-proposal-batch-v4-wave-7.json)
- Scope: `1` 个待审 Protocol v4 Proposal，验证 `using-helloscholar` 的 canonical Task execution mirror 与 frontier 同步。
- Run state at review creation: 未启动 Haiku Baseline、Live Eval、Implementer 或 Reviewer，也未生成运行证据。

## 授权边界

批准本页 Batch ID 和 Batch SHA-256 只授权对完全绑定的 Scenario、Protocol、Fixture 与共享用户价值 rubric 进行 Baseline Observation。它不接受 Skill 输出，不授权当前生产 Skill 的 Live Eval，也不代替后续 Scorecard 的用户决定。

Baseline 使用修改前的显式 Skill snapshot；只有真实 Red 才能进入当前 Skill 的独立 Live authorization。任何绑定输入或本 manifest 的语义变化都要求新的 Hash 和用户审核。

## 审核材料

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 1 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `1` 个 pending v4 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, current approved Bundle facts, retained prior Task evidence, safety limits, code, and runnable project tests.
- The project verifier checks only user-visible lifecycle, evidence, and write-boundary facts; tracker state expectations remain evaluator-only.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected tracker sequence, and future messages.
- Reviewer judgments about canonical tracker identity, status transitions, synchronization timing, and user-facing expression quality.

本轮材料性清理：

- `router-execution-mirror-v4`：The Fixture exposes authoritative T001-T003 evidence and the T004-only authorization without stating the expected TodoWrite or update_plan item sequence.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 1 项逐项合同

### 01. `router-execution-mirror-v4` - `using-helloscholar`

- Proposal ID: [`proposal-router-execution-mirror-v4-haiku-v4`](../../../test/skill-evals/router-execution-mirror-v4/proposal-approval.json)
- Project / case: `py-batch-processor` / `router-execution-mirror-v4`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 继续 `SPEC-052` 的当前执行。T001–T003 已经有 Validation 和 Completion 证据，T004 是当前 frontier；这轮只完成 T004 并汇报，T005–T007 保持 pending。按现有批准 Tasks 执行，不要提前更新 `tasks.md`，也不要继续后续 Task。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-execution-mirror-v4/scenario.md`](../../../test/skill-evals/router-execution-mirror-v4/scenario.md) = `b40180c68051ac5f69bb5f6ac5064c5d82fe3ea66265aeaeafa7ad92a77e02e2`
- Protocol: [`test/skill-evals/router-execution-mirror-v4/protocol.json`](../../../test/skill-evals/router-execution-mirror-v4/protocol.json) = `cb5c1cb1d3a2d49931864440ed992b0c718fbce504425727385596b8cce71eee`
- Fixture: [`test/skill-evals/router-execution-mirror-v4/fixture`](../../../test/skill-evals/router-execution-mirror-v4/fixture) = `2b06e75e2fa7aa2940a259d97ce3e468b15d1252dbe9f031504fc3a6e7d31589`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `current-contract-recovery` - 权重 `20%`，critical `true`，最低 `90`：Confirm the Implementer verifies the named SPEC-052 lifecycle and derives T001-T003 completion plus T004 frontier from current Tasks and evidence before implementation.
- `canonical-task-mirror` - 权重 `35%`，critical `true`，最低 `90`：Confirm the tool trace creates one ordered tracker item for every canonical T001-T007 Task with its ID and goal, marking T001-T003 completed, T004 active when execution starts, and T005-T007 pending rather than replacing them with a phase plan.
- `frontier-synchronization` - 权重 `25%`，critical `true`，最低 `90`：Confirm tracker calls occur before T004 implementation and again after T004 Validation and Completion evidence changes, with the final progress report preceded by T004 completed and T005-T007 still pending.
- `t004-scope-and-evidence` - 权重 `20%`，critical `true`，最低 `90`：Confirm T004 rejects batches above 50 while preserving exactly-50 and existing behavior, records current Validation and Completion evidence, leaves tasks.md unchanged, and does not execute T005-T007.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- starts T004 without first creating a complete canonical T001-T007 tracker
- uses phase summaries or temporary Work substeps instead of the seven canonical Task items
- marks any Task status contrary to the current Validation, Completion, active execution, or pending state
- omits synchronization after T004 evidence changes or reports progress before synchronizing it
- modifies tasks.md, executes T005-T007, writes outside T004 Files, or claims completion without current command and tree evidence
- scores tracker behavior from final prose without retained tool-call evidence

**Critical path**: Verify SPEC-052 and its evidence, create the complete T001-T007 tracker before beginning T004, then synchronize T004 completion after fresh validation without touching later Tasks or tasks.md.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 批准后的可执行范围

精确批准后，才会创建全新隔离 Fixture，使用一个全新 Haiku Implementer 和随后独立的 Haiku Reviewer 严格串行运行 Baseline。结果只可真实记录为 `fail` 或 `control-pass`。
