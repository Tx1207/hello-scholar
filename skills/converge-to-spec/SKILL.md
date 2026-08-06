---
name: converge-to-spec
description: Traceability and convergence checks for a completed Spec Bundle. Use when the user asks to audit implementation against a Bundle, decide whether a Bundle is ready for completion evidence, or append directly implementable convergence work to existing tasks.md.
---

# Converge to Spec

Audit a Bundle; do not execute its repair. Enter only on an explicit user request, or after its required Tasks and their validation are complete. Ordinary local work remains on its normal verification path.

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

## 4. Append convergence Tasks only when authorized

Use this branch only after the user explicitly asks to preserve directly implementable findings as Tasks.

1. Classify the finding first: return new design to the Spec; return an invalid technical approach to the Plan; ask the relevant owner to synchronize a Stale contract. Append only work already directly implementable within the current Spec and Plan.
2. Append a `Convergence` Phase to the existing `tasks.md`; continue its `TNNN` sequence. Every new unchecked Task contains a goal, `Spec Coverage`, `Depends On`, `Parallel`, `Files`, `Work`, `Validation`, and `Completion`. Include Red-Green-Refactor only when the approved contract explicitly requires TDD.
3. Increment `revision`; set `approval: pending-review`, `approved_revision: null`, `status: pending`; update `updated`.
4. Run `hello-scholar docs sync` then `hello-scholar docs check`. Against the recorded baseline, verify the transaction delta contains only `tasks.md` and CLI-generated Indexes.
5. Present the new revision and coverage change, then stop for user review. Approval of this revision and authorization to implement are separate future decisions.

**Complete when:** only the allowed Tasks transaction and generated Indexes changed, all appended Tasks are reviewable and unchecked, and the response stops at the review gate.

## Boundaries

- The default audit and readiness branches are read-only; report in chat rather than creating an audit artifact.
- Do not modify code, tests, Spec, Plan, Record, Architecture, existing Task completion, or generated Indexes by hand.
- Do not turn a prior passing test summary into current verification evidence.
- Use `PYTHONDONTWRITEBYTECODE=1 python3 -B ...` for every Python command executed or written into appended Task validation.
