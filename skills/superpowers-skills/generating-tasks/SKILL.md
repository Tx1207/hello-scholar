---
name: generating-tasks
description: Decomposition of an Accepted Spec and its current Approved Plan into one reviewable, independently executable tasks.md. Use when an existing Spec Bundle needs Tasks created, revised, audited, or approval-recorded before implementation.
---

# Generating Tasks

Turn the current approved Plan into an execution contract. Preserve decisions already made upstream; return missing design to the Spec or Plan instead of deciding it inside Tasks.

A top-level Task is a **tracer task**: the smallest dependency-complete slice that advances one observable Plan outcome, fits a fresh context, and leaves the repository independently verifiable. Its `Work` section contains concrete 2–5 minute actions.

## 1. Establish the contract

1. Locate the target Spec Bundle. Read `spec.md`, then `plan.md` in full. Read relevant Architecture, source, tests, configuration, or persisted formats only to confirm facts the Plan already depends on.
2. Run `docs check` through the absolute hello-scholar CLI. Continue when the Spec is `accepted`, the Plan is `approved`, and `plan.spec_revision` equals the current Spec `revision`.
3. Build an obligation ledger covering every Spec acceptance criterion and every Plan requirement: scope, files, interfaces, phases, tests or experiments, migration, cleanup, rollback, `Must Not Touch`, and Tasks-generation rules.

If a material choice remains open or the documents conflict, leave `tasks.md` unchanged and name the exact decision that belongs in the Spec or Plan.

**Complete this step when:** every accepted requirement has one ledger entry, all paths and commands needed for decomposition are grounded in project facts, and no Task would need to invent design.

## 2. Draft tracer tasks

Default to vertical, behavior-bearing slices. A tracer task may cross test, source, configuration, and documentation files when those edits together produce one independently checkable outcome.

A **horizontal slice** such as “write all tests,” “change the data layer,” or “update documentation” is not a Task unless the approved Plan makes that layer an independently valuable and verifiable deliverable. Keep an indivisible repository change together; split a Task when it contains more than one outcome, cannot fit a fresh context, or cannot be validated on its own.

For each Task:

- Use a unique `TNNN` ID and a plain-language outcome.
- Map exact AC IDs or Spec sections in `Spec Coverage`.
- Name every created, modified, moved, and deleted path in `Files`.
- Put ordered 2–5 minute actions in `Work`. Each action names the exact symbol, interface, data shape, or file region and the concrete edit. Include code or configuration snippets when the approved Plan or current project facts fix their content; return a new design choice upstream.
- Give executable commands and observable expected signals in `Validation`.
- Make `Completion` a repository or behavior state the executor can inspect, including preserved invariants and required absence checks.
- Make the Task standalone: define its inputs, preconditions, recovery action, and relevant fixed decisions without referring to this conversation or “Task above.”

The template's required fields — `Spec Coverage`, `Depends On`, `Parallel`, `Files`, `Work`, `Validation`, and `Completion` — are mandatory on every top-level Task. Replace every placeholder with project facts.

**Complete this step when:** any Task can be handed by itself to an Agent with no conversation history, completed inside one fresh context, and judged done from its own Validation and Completion fields.

## 3. Build blocking edges

`Depends On` records only genuine blocking edges. The **frontier** is the set of Tasks whose blockers are complete.

Mark `Parallel: Yes` only when Tasks can share the same frontier, have no dependency path between them, write no common file or mutable state, and preserve the Plan's ordering constraints. Use `Parallel: No` for every other Task. The resulting graph must be acyclic.

Use **expand–migrate–contract** for a wide migration or removal that cannot stay green as one tracer task:

1. **Expand:** introduce the new form or compatibility window while the old form remains valid.
2. **Migrate:** move callers, data, configuration, tests, and writers in independently verifiable batches sized by blast radius.
3. **Contract:** remove the old form only after executable search, regression, and cleanup gates prove no caller or persisted dependency remains.

Give rollback, final integration, and cleanup their own Tasks when they have distinct evidence or blocking edges. If migrate batches cannot be green independently, serialize them and make the final integration Task the first promised full-green gate; state that fact explicitly.

**Complete this step when:** every Task is reachable in a DAG, each edge names a real prerequisite, every `Parallel: Yes` pair is conflict-free, and migration, deletion, regression, cleanup, final verification, and rollback obligations all have an owner.

## 4. Write one Tasks document

Before drafting, read exactly one authoritative template:

- Chinese repository: `assets/tasks-template.zh_CN.md`
- Other repository: `assets/tasks-template.md`

Write `tasks.md` beside the current `spec.md` and `plan.md`. This transaction semantically edits only Tasks; generated Index changes come only from the CLI.

For a new document, bind the current Spec ID, Spec revision, and Plan revision, and initialize exactly:

```yaml
revision: 1
approval: pending-review
approved_revision: null
status: pending
```

When the user or the approved Plan explicitly requires TDD for a specific outcome, add only to that Task:

```markdown
  - Process: `test-driven-development`
  - Red-Green-Refactor:
    - Red: run the exact focused command and observe the named behavior failure for the expected reason before production edits.
    - Green: make the smallest named implementation change and observe the focused command pass.
    - Refactor: improve structure only while the focused and full checks remain green.
    - Signal: record the exact passing output or state.
```

A Task without an explicit TDD requirement uses ordinary project validation and omits both TDD fields.

Use exactly `PYTHONDONTWRITEBYTECODE=1 python3 -B ...` for every Python command you execute during this transaction and every Python command written into `Validation`; preserve the command's remaining arguments. This keeps verification outside the project diff.

**Complete this step when:** one same-Bundle `tasks.md` contains the full ledger coverage, every template marker is gone, its metadata is current and pending user review, and no other core document has a semantic edit.

## 5. Prove the review candidate

1. Audit every ledger entry against at least one Task and every Task against the approved Plan. Include ACs, regressions, migration, deletion, cleanup, rollback, and final gates.
2. Check unique IDs, DAG acyclicity, frontier conflicts, exact paths, interface consistency, command executability, expected signals, and forbidden scope.
3. Run `docs sync`, then `docs check`, through the absolute hello-scholar CLI.
4. Run the Plan's project checks. Apply the artifact-free Python form above to each Python command.
5. Compare final Git state with the initial state. The write set must be `tasks.md` plus CLI-generated Indexes, and the transaction must add no `__pycache__` directory or `.pyc` file.
6. Lead the response with the `tasks.md` path and pending-review result. Summarize AC coverage, blocking edges/frontier, and validation evidence, then stop for user review.

<REVIEW-GATE>
The terminal state is a complete `tasks.md` awaiting user review. Creating or approving Tasks does not start implementation; implementation requires a separate explicit request.
</REVIEW-GATE>

**Complete this step when:** `docs check` reports no errors, required project checks pass, the diff and runtime-artifact checks prove the write boundary, and the user has the complete current Tasks revision to review.

## Later lifecycle branches

- **Semantic revision:** increment `revision`, reset `approval: pending-review` and `approved_revision: null`, update `updated`, rerun the complete audit, and present the whole document again.
- **Explicit approval of unchanged content:** change only `approval: approved` and `approved_revision` to the current `revision`; run `docs sync` and `docs check`, then report that implementation still awaits separate authorization.
- **Audit request:** report concrete coverage, dependency, validation, or scope defects against the current revision. Apply semantic fixes only as a new pending-review revision.
