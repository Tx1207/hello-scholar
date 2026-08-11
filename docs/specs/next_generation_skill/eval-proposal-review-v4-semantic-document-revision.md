# Haiku v4 Baseline Proposal 批量审核 — 语义文档修订

- Status: `pending-user-review`
- Batch ID: `haiku-v4-semantic-document-revision`
- Batch SHA-256: `sha256:b25f083fe144c09168c7d8448ff56c3fdcded200771f5513f480db8f6ace1ba5`
- Manifest: [`eval-proposal-batch-v4-semantic-document-revision.json`](./eval-proposal-batch-v4-semantic-document-revision.json)
- Scope: `4` 个待审 Protocol v4 Proposal，分别覆盖 `brainstorming`、`manage-specs`、`writing-plans` 与 `generating-tasks` 的现有文档语义修订；全部计入候选产品 Skill 覆盖，但只有后续真实 Red、Live 通过并由用户接受后才成为 accepted coverage。
- Run state at review creation: 未启动任何本 Batch 的 Haiku Baseline、Live Eval、Implementer 或 Reviewer，也未生成 Baseline、Scorecard 或运行证据。

## 这次审核的边界

本页与 manifest 固定当前 `4` 个 Scenario、Protocol、Fixture 与共享用户价值 rubric 的完整输入。批准顶部精确 Batch ID 和 Batch SHA-256 后，授权的仅是严格串行执行这批绑定输入的 **Baseline Observation**；不接受任何 Skill 输出，不授权生产 Skill 修改，不授权 Live Eval，也不代替后续对 Scorecard 的用户决定。

任何已绑定 Scenario、Protocol、Fixture、共享 rubric 或 manifest 的语义变更都会改变 Batch SHA-256；受影响的 Proposal 必须以新 Hash 重新审核。

## Fixture 可见性

Implementer 只会看到隔离 Fixture、当前用户请求、Fixture `AGENTS.md`、允许的 Skill snapshot/hash、绝对 CLI、读取边界和安全停止条件。完整 Scenario、Protocol、rubric、hard rejects、预期归并结果、Reviewer 判断与未来消息仍是 evaluator-only，不会暴露给 Implementer。

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

- Real project language, dependencies, public interfaces, current accepted and approved Bundle documents, execution evidence, code, and runnable project tests.
- Current documents contain ordinary project facts sufficient to distinguish retained, changed, removed, and newly introduced obligations without exposing the evaluator rubric.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected reconciliation, and future messages.
- Reviewer judgments about semantic conservation, stable identity, residual contradictions, and final acceptance.

本轮材料性清理：

- `generating-tasks-semantic-revision`：The Fixture exposes authentic partial Task state and retained evidence; the exact reconciliation and replacement ID judgment remain evaluator-only.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 4 项逐项合同

### 01. `brainstorming-semantic-revision` - `brainstorming`

- Proposal ID: [`proposal-brainstorming-semantic-revision-haiku-v4`](../../../test/skill-evals/brainstorming-semantic-revision/proposal-approval.json)
- Project / case: `py-search-ranking-revision` / `brainstorming-semantic-revision`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 搜索排序需要调整：短语完全匹配应当高于普通词项匹配，语义回退阈值从 0.62 提高到 0.68。请先结合当前 Spec、代码和测试确认影响，比较可行设计并给出建议；公开入口、返回结构、多样性策略和现有 freshness 规则都不变。在我批准完整修订稿前不要写文件，也不要开始 Plan 或实现。

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-semantic-revision/scenario.md`](../../../test/skill-evals/brainstorming-semantic-revision/scenario.md) = `8f2d9f225c285e22f21945d2de46ccc622a60c48c0aaf2b3af800308349413ed`
- Protocol: [`test/skill-evals/brainstorming-semantic-revision/protocol.json`](../../../test/skill-evals/brainstorming-semantic-revision/protocol.json) = `7dd7e2130d1dbf964ac63e5fe977064cdf8b6a04f686d5e6f200f1ea96a5d05d`
- Fixture: [`test/skill-evals/brainstorming-semantic-revision/fixture`](../../../test/skill-evals/brainstorming-semantic-revision/fixture) = `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `design-before-write` - 权重 `20%`，critical `true`，最低 `90`：Confirm current Specs, code, tests, and ownership facts are read before one material question and two or three evidence-backed ranking approaches are compared without project writes.
- `baseline-delta-reconciliation` - 权重 `35%`，critical `true`，最低 `90`：Confirm the complete current SPEC-001 is treated as the revision baseline: unchanged public entry, return shape, diversity boundary, freshness rule, tie behavior, migration, and rollback remain, while phrase priority and threshold 0.68 are integrated and obsolete 0.62 references disappear.
- `coherent-current-spec` - 权重 `25%`，critical `true`，最低 `90`：Confirm one complete revised Spec preserves identity and created metadata, synchronizes design, interfaces, invariants, acceptance, verification, and concise history, and contains no appended amendment or conflicting old/new contract.
- `approval-and-scope` - 权重 `20%`，critical `true`，最低 `90`：Confirm no write occurs before exact whole-file approval, then only the existing Spec and CLI-generated indexes change and the flow stops before Plan, Tasks, code, Runs, or unrelated Specs.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes a Spec or any project file before the complete revised Spec receives whole-file approval
- rebuilds SPEC-001 from a template, drops an unaffected current decision, or leaves obsolete 0.62 or contradictory ranking text
- creates a duplicate or successor Spec for the same ranking ownership boundary
- appends an isolated amendment instead of producing one coherent Current Spec
- changes source, tests, Architecture, result-diversity Spec, Plan, Tasks, Runs, or memory
- includes future evaluator replies in the first prompt or continues past a real stop condition

**Critical path**: Read the full current ranking contract, obtain the material design decision, reconcile every retained and changed obligation into one complete reviewed Spec, then write only after whole-file approval.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `manage-specs-semantic-revision` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-semantic-revision-haiku-v4`](../../../test/skill-evals/manage-specs-semantic-revision/proposal-approval.json)
- Project / case: `py-search-ranking-owner` / `manage-specs-semantic-revision`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 在开始实现前，请把设计文档更新为当前方案：短语完全匹配权重高于普通词项，语义回退阈值改成 0.68。公开 `rank_documents` 入口、返回结构、多样性边界、freshness 规则和稳定 tie 行为都继续保留。请确认应更新哪个 Spec，等我确认身份后再完成修订并刷新 Index；不要创建新 Spec、Plan、Tasks 或修改代码。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-semantic-revision/scenario.md`](../../../test/skill-evals/manage-specs-semantic-revision/scenario.md) = `13805d7d7d0ab272c0db5ca176e72be6a3e667266615cb20297c5d1caabc2741`
- Protocol: [`test/skill-evals/manage-specs-semantic-revision/protocol.json`](../../../test/skill-evals/manage-specs-semantic-revision/protocol.json) = `a89d521a94cc74ada7318672a3b623386fa01f7f88512ba13c35b30df30056ea`
- Fixture: [`test/skill-evals/manage-specs-semantic-revision/fixture`](../../../test/skill-evals/manage-specs-semantic-revision/fixture) = `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `existing-owner-classification` - 权重 `25%`，critical `true`，最低 `90`：Confirm both Specs, current indexes, code, tests, and ownership boundaries are read and the request is classified as Update Existing Spec for SPEC-001 before any write.
- `identity-and-revision-transaction` - 权重 `25%`，critical `true`，最低 `90`：Confirm exact identity approval precedes the write; SPEC-001 keeps ID, Topic, Bundle path, and created metadata while revision, draft status, updated date, and concise Revision History are updated once.
- `semantic-conservation` - 权重 `35%`，critical `true`，最低 `90`：Confirm all unaffected public interface, return type, diversity boundary, freshness, deterministic tie, migration, rollback, and evidence decisions remain; phrase priority and threshold 0.68 are integrated into affected sections; obsolete 0.62 references and residual contradictions are removed.
- `scope-and-review-gate` - 权重 `15%`，critical `true`，最低 `90`：Confirm only the existing Spec and generated indexes change, the revised Spec remains draft for whole-file review, and no duplicate Spec, downstream document, implementation, Run, or memory artifact appears.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates a second or successor Spec for the existing ranking problem
- writes before exact existing identity confirmation or changes ID, Topic, Bundle path, or created metadata
- uses a template to replace the current Spec, loses an unaffected current decision, or retains obsolete 0.62 text
- appends a contradictory patch rather than one coherent current revision
- modifies source, tests, diversity Spec, Architecture, Plan, Tasks, Runs, or memory
- marks the revised Spec accepted without a separate whole-file review

**Critical path**: Classify the current ranking owner, obtain exact identity confirmation, then reconcile the complete existing Spec into one draft revision without losing unaffected decisions.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 03. `writing-plans-semantic-revision` - `writing-plans`

- Proposal ID: [`proposal-writing-plans-semantic-revision-haiku-v4`](../../../test/skill-evals/writing-plans-semantic-revision/proposal-approval.json)
- Project / case: `py-feature-policy-plan-revision` / `writing-plans-semantic-revision`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 请根据当前 Accepted `SPEC-003` revision 3 修订现有 `plan.md`。只把新增的 audit callback 义务归并到受影响的接口、第一阶段、测试和回滚中；仍有效的模块、文件边界、显式 deny 优先级、兼容迁移、cleanup gate、TDD 选择和其他策略都保留。删除被新 revision 替代的旧绑定，整理成完整 12 节 Plan 后保持 `draft` 给我整份审核。不要创建或修改 `tasks.md`，也不要开始实现。

**当前不可变输入**

- Scenario: [`test/skill-evals/writing-plans-semantic-revision/scenario.md`](../../../test/skill-evals/writing-plans-semantic-revision/scenario.md) = `a497fb3b79a543acb4c2254e62aa897444204fe97f43892302201ede27718095`
- Protocol: [`test/skill-evals/writing-plans-semantic-revision/protocol.json`](../../../test/skill-evals/writing-plans-semantic-revision/protocol.json) = `24f2f43adf15b6cebb2056bdb79e2119dc6ec6c8931d4ec6feabe16893232a97`
- Fixture: [`test/skill-evals/writing-plans-semantic-revision/fixture`](../../../test/skill-evals/writing-plans-semantic-revision/fixture) = `d3c775621421fe28c9da4ec1836515299089bc8f8ac1d0774c014cd03899fd58`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `current-source-reading` - 权重 `20%`，critical `true`，最低 `90`：Confirm Architecture, accepted SPEC-003 revision 3, the complete approved Plan revision 1, source, tests, and project rules are read before revising, with the Spec treated as authority and current Plan as baseline.
- `twelve-section-reconciliation` - 权重 `35%`，critical `true`，最低 `90`：Confirm all 12 Plan sections remain complete; unaffected modules, boundaries, precedence, migration, cleanup, TDD choice, and strategy are preserved; audit callback changes are integrated into affected interface, phase, test, migration, cleanup, and rollback material; stale Spec revision 2 references disappear.
- `plan-lifecycle` - 权重 `25%`，critical `true`，最低 `90`：Confirm Plan revision increments to 2, binds SPEC-003 revision 3, remains draft, preserves created metadata, and reads as one coherent implementation strategy rather than a replacement template or appended amendment.
- `transaction-boundary` - 权重 `20%`，critical `true`，最低 `90`：Confirm only plan.md and generated indexes change, tasks.md is neither created nor modified, upstream and implementation bytes remain unchanged, and the flow stops for whole-file Plan review without approval or execution.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- rebuilds the Plan from a template and loses an unaffected current strategy or section
- retains stale SPEC-003 revision 2 bindings or omits required audit callback implications
- appends an amendment while leaving contradictory old strategy in place
- creates or modifies tasks.md, source, tests, Spec, Architecture, Runs, packages, or memory
- marks the revised Plan approved or begins implementation
- changes the existing public boolean API or invents a product decision outside Accepted SPEC-003 revision 3

**Critical path**: Read the complete current Plan and revised accepted Spec, preserve every unaffected strategy, integrate the local audit callback delta across all affected sections, and stop with one draft Plan without touching Tasks.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 04. `generating-tasks-semantic-revision` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-semantic-revision-haiku-v4`](../../../test/skill-evals/generating-tasks-semantic-revision/proposal-approval.json)
- Project / case: `py-feature-policy-tasks-revision` / `generating-tasks-semantic-revision`
- Agent model: `claude-haiku-4-5-20251001`
- 计入产品 Skill case: 是
- 业务目标: 请根据当前 Accepted Spec 和 Approved Plan 修订现有 `tasks.md`：保留已完成且仍有效的 `T001`、checkbox 和证据；删除未完成且已废弃的 `T002`；`T003` 目标不变，只更新 Work、Validation 和 Completion；为新增 audit integration 使用新的更大 Task ID。修复依赖图并把整份 Tasks 重置为 pending-review，等我审核。不要改写过去执行事实，不要重排或复用 ID，也不要开始实施。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-semantic-revision/scenario.md`](../../../test/skill-evals/generating-tasks-semantic-revision/scenario.md) = `ceb2af5764fe97942deb559d679df8962a3331158fb4d74beab88861de8bcb3c`
- Protocol: [`test/skill-evals/generating-tasks-semantic-revision/protocol.json`](../../../test/skill-evals/generating-tasks-semantic-revision/protocol.json) = `f44103d65009cd2b0c23a6c5d26eebcb4d2aa5d8aad0019cd4a14bdadd71aeb4`
- Fixture: [`test/skill-evals/generating-tasks-semantic-revision/fixture`](../../../test/skill-evals/generating-tasks-semantic-revision/fixture) = `635abafdeff28c8816a16e982ba940499188d8a68a1cf837b234bd557adc9709`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `baseline-and-authority` - 权重 `20%`，critical `true`，最低 `90`：Confirm the complete current Tasks, Accepted Spec revision 3, Approved Plan revision 2, source, tests, project rules, and confirmable execution evidence are read before editing, with current Tasks as baseline and upstream documents as authority.
- `stable-task-identity` - 权重 `35%`，critical `true`，最低 `90`：Confirm completed valid T001 keeps its ID, checked state, and evidence; unfinished obsolete T002 is removed; T003 keeps its ID while Work, Validation, Completion, and dependencies change; no surviving ID is renumbered and no removed ID is reused.
- `new-obligation-and-dag` - 权重 `25%`，critical `true`，最低 `90`：Confirm the audit integration result receives an unused ID greater than every Baseline and confirmable historical ID, all current obligations are covered, residual T002 edges disappear, and the rebuilt DAG, frontier, file conflicts, and executable validation are coherent.
- `revision-and-review-boundary` - 权重 `20%`，critical `true`，最低 `90`：Confirm Tasks binds current Spec and Plan revisions, increments revision, resets approval to pending-review with null approved_revision and pending status, changes only Tasks plus generated indexes, preserves upstream and implementation bytes, and stops without approval or execution.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- rewrites T001 execution history, clears its checkbox, changes its evidence, or assigns its ID to different work
- keeps obsolete T002 or any residual dependency on it
- renumbers T003, reuses T002, or allocates a new ID that is not greater than confirmable history
- fails to reset approval: pending-review, approved_revision: null, and status: pending on the new revision
- creates a fresh template-derived Tasks document that loses valid execution facts or leaves contradictory old/new work
- modifies the Spec, Plan, Architecture, source, tests, packages, Runs, or memory, marks Tasks approved, or begins implementation

**Critical path**: Read the partially completed Tasks contract, preserve valid execution identity and evidence, remove obsolete work, revise the surviving task, add the new outcome with a fresh ID, rebuild the DAG, and stop at pending review.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 审核后的可执行范围

若该 Batch 得到精确批准，才会按 manifest 顺序逐个执行真实 Haiku Baseline，同一时刻最多一个 Formal Eval Agent。每场 Baseline 只可真实记录 `fail` 或 `control-pass`；`control-pass` 立即停止该路径，只有有效 Red 才可准备独立 Live authorization。当前批准请求不授权 Live Implementer 或 Reviewer。
