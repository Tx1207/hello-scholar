---
name: converge-to-spec
description: Traceability and convergence audit for a completed Spec Bundle. Use when the user explicitly asks to compare implementation with its Spec/Plan contract or append findings from the just-completed convergence audit as Convergence Tasks.
---

# Converge to Spec

Audit a Bundle; do not execute its repair.

## 0. Select one entry branch

Before scanning implementation or running `hello-scholar docs check`, classify the current request.

- **Convergence audit:** Select this branch when the user explicitly asks to compare implementation with its Spec/Plan contract. Read only the Spec, Plan, and Tasks lifecycle fields plus top-level Task checkboxes. Continue to Section 1 only when the Spec is `accepted`, the Plan is `approved`, the Plan and Tasks are Current, and Tasks have `approval: approved`, `approved_revision` equal to `revision`, `status: completed`, and every required top-level Task is checked. Otherwise report the first unmet gate and return the Bundle to `using-helloscholar` for Task continuation.
- **Append audit findings:** Select this branch when the user explicitly asks to save findings from the just-completed convergence audit as `Convergence` Tasks. When the findings and their recorded Bundle revisions remain in context and the recorded Spec, Plan, and Tasks revisions still match, skip Sections 1–3 and continue to Section 4. Otherwise report that no current audit can be reused and stop for an explicit new-audit request.
- **Task continuation:** Route progress, completion status, remaining work, and continuation requests to `using-helloscholar`, which restores state from `tasks.md` and TodoWrite.

**Complete when:** exactly one branch is selected; an ineligible audit ends at its lifecycle gate without scanning implementation or running the full document check.

## 1. Establish the evidence boundary

1. Record the initial Git status and Git diff baseline plus the allowed write set. Default to an empty write set. Use that baseline to identify the transaction delta; pre-existing changes remain out of scope.
2. Read only target-Bundle facts in this order: relevant Architecture, `spec.md`, `plan.md`, `tasks.md`, Git diff/status, related code/tests/configuration, then the Spec-referenced `runs/<run-id>/record.md` files.
3. Run `hello-scholar docs check`.

If the Spec is not `accepted`, the Plan is not `approved`, or the Plan or Tasks are Missing or Stale, stop a Ready conclusion. Report the exact revision/state, its owner, and every other directly observable blocker; do not repair the contract.

**Complete when:** the audit has a bounded Bundle, a recorded write set, and current document diagnostics.

## 2. Audit convergence

Build a compact traceability table in the response:

`Spec AC → Plan phase/file boundary → Task → implementation/test/Record evidence`

Compare the real tree with the Bundle. Classify every finding with exactly one of these deviation types:

- `Missing` — a required behavior or artifact is absent.
- `Partial` — only part of a required behavior, path, or invariant exists.
- `Contradictory` — implementation, public interface, or persisted form conflicts with the contract.
- `Unrequested` — a new entry point, configuration, abstraction, dependency, or behavior lacks contract support.

For each finding give: severity, controlling Spec/Plan/Task reference, `file:line`, observed evidence, and an implementable repair direction. Check actual Plan file scope, interfaces, phase order, migration, cleanup, and rollback—not just checked boxes or green tests.

Search the relevant surfaces for obsolete implementations, callers, configuration, tests, feature flags, temporary compatibility layers, unused dependencies/files, and unselected candidate implementations.

**Complete when:** every material AC and Plan obligation has traceability evidence or one classified finding, including observable cleanup debt.

## 3. Decide completion readiness

Return `Ready for completion evidence` only when evidence establishes all of the following:

1. Spec Accepted; Plan Approved; Plan and Tasks Current.
2. Every required Task's Validation and Completion are satisfied; any skipped/cancelled item has an approved reason that preserves every AC.
3. No unresolved blocking deviation or cleanup finding remains.
4. Each Spec-required formal Benchmark, Eval, or training run has a valid root `runs/<run-id>/record.md` with terminal status, results, and a decision. Do not require a Record for ordinary unit tests.
5. Required migration and legacy cleanup are complete.

Otherwise return `Not Ready` and route work in dependency order: Spec owner for new design, Plan owner for an invalid technical approach, synchronization owner for stale contracts, then Tasks review, implementation/cleanup, formal Record work, and the owning implementation session's fresh verification.

Always state the exact verification commands the main Agent must actually run and read for AGENTS fresh evidence; historical summaries can locate work but cannot supply it. When the user requested the audit, or a completed Bundle has material structural change, separately say whether Architecture maintenance is worth proposing and why. Wait for user confirmation before any `docs-maintenance architecture` work; it is not a readiness prerequisite.

**Complete when:** the response gives an evidence-backed Ready/Not Ready result, blockers or satisfied conditions, fresh-command next actions, and any conditional Architecture reminder.

## 4. Save audit findings as Convergence Tasks

Use this branch only when the user explicitly asks to save findings from the just-completed audit, or Section 0 selected a still-current audit. Confirm that the recorded Spec, Plan, and Tasks revisions still match before writing; a reusable audit skips Sections 1–3, while a mismatch stops for an explicit new-audit request.

1. Classify the finding first: return new design to the Spec; return an invalid technical approach to the Plan; ask the relevant owner to synchronize a Stale contract. Append only directly implementable work within the current Spec and Plan.
2. Append a `Convergence` Phase to the existing `tasks.md`; continue its `TNNN` sequence. Every new unchecked Task contains a goal, `Spec Coverage`, `Depends On`, `Parallel`, `Files`, `Work`, `Validation`, and `Completion`. Include Red-Green-Refactor only when the approved contract explicitly requires TDD.
3. Increment `revision`; set `approval: pending-review`, `approved_revision: null`, `status: pending`; update `updated`.
4. Run `hello-scholar docs sync` once. Against the recorded baseline, verify the transaction delta contains only `tasks.md` and CLI-generated Indexes.
5. Present the new revision and coverage change, then stop for user review. Approval of this revision and authorization to implement are separate future decisions.

**Complete when:** only the allowed Tasks transaction and generated Indexes changed, all appended Tasks are reviewable and unchecked, and the response stops at the review gate.

## Boundaries

- The default audit and readiness branches are read-only; report in chat rather than creating an audit artifact.
- Do not modify code, tests, Spec, Plan, Record, Architecture, existing Task completion, or generated Indexes by hand.
- Do not turn a prior passing test summary into current verification evidence.
- Use `PYTHONDONTWRITEBYTECODE=1 python3 -B ...` for every Python command executed or written into appended Task validation.
