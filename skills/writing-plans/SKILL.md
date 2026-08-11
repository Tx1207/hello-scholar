---
name: writing-plans
description: Create a high-level implementation strategy for an Accepted Spec when the user needs a reviewable implementation Plan. Produces one Bundle plan.md and routes an approved Plan to generating-tasks.
---

# Writing Plans

Create one reviewable, high-level `plan.md` for one Accepted `spec.md`. A Plan explains implementation strategy, boundaries, sequencing, migration, cleanup, rollback, and Tasks-generation rules. `generating-tasks` owns independently executable tracer Tasks; the current main Agent owns implementation after approved Tasks and an explicit implementation request.

## 1. Establish the source of truth

1. Confirm the project root and run:
   ```sh
   hello-scholar docs check
   ```
2. Read the target `spec.md`. It must be `status: accepted`; otherwise report the current Spec state and stop.
3. Read only the Architecture, code, tests, configuration, records, and existing Bundle documents needed to plan the accepted design.
4. State the Spec ID and revision. The Spec defines behavior, boundaries, invariants, and acceptance; the Plan defines the implementation strategy. A material conflict returns to the Spec owner for resolution.

**Completion:** the accepted design, its current revision, and the evidence needed for an implementation strategy are explicit.

## 2. Set the strategy boundary

- If the request needs a material architecture, public-interface, data-contract, or product decision not fixed by the Accepted Spec, identify the missing decision and stop for a Spec revision.
- When the Plan covers only part of a broader Spec, name the covered sections and deferred sections.
- Map affected modules and exact file boundaries before writing phases. Each file category is `Add`, `Modify`, `Move or Migrate`, `Delete`, or `Must Not Touch`; an empty category says `None` and why.
- Keep one semantic document transaction: planning changes `plan.md`. Existing Tasks becoming Stale is a normal derived state, not a reason to rewrite `tasks.md`.

**Completion:** the Plan has a concrete, bounded strategy that does not reopen accepted design decisions.

## 3. Write the Bundle Plan

Choose the write branch before loading a skeleton: templates are only for new Plans. For a new Plan, read the matching template in `assets/`; choose `assets/plan-template.zh_CN.md` when the repository language preference is Chinese, otherwise choose `assets/plan-template.md`. For a revision, read the current `plan.md` in full and use the current `plan.md` as the skeleton; use the matching template only to verify that all 12 sections remain complete. user-readable Plan prose follows the repository language preference; do not infer its language from the task prompt. Preserve code symbols, field names, paths, commands, and template-required headings as written. Create or revise:

```text
hello-scholar/specs/<topic>/SPEC-<number>-<design-name>/plan.md
```

Use these Front Matter values:

```yaml
schema: 1
kind: plan
spec: SPEC-000
spec_revision: 1
revision: 1
status: draft
title: <concrete plan title>
summary: <concrete strategy summary>
created: YYYY-MM-DD
updated: YYYY-MM-DD
```

For a semantic Plan revision, the complete current Plan is the **Baseline**, the current Accepted Spec is the **Authority**, and the requested or upstream changes are the **Delta**. Reconcile every existing strategy and Delta change across all 12 sections as `Keep`, `Modify`, `Remove`, `Add`, or `Move`. `Keep` is the default: retain unaffected modules, file boundaries, tests, migration, rollback, and other valid strategy; a point not mentioned by the Delta is not removal authority. Remove superseded paths and residual references, integrate additions where they belong, and reorder only for real dependencies. In this transaction, do not rewrite `tasks.md`.

A semantic Plan revision increments `revision`, sets `status: draft`, and updates `updated`. Replace every template prompt with concrete project facts before presenting a new file.

The body always contains these 12 sections:

1. Implementation Goal
2. Scope
3. Technical Strategy
4. Affected Modules
5. File Change Boundaries
6. Interface Changes
7. Implementation Phases
8. Test and Experiment Strategy
9. Migration Sequence
10. Cleanup
11. Rollback
12. Tasks Generation Rules

**Completion:** one same-Bundle `plan.md` binds the current Accepted Spec revision and describes a complete implementation strategy without Task checkboxes, microsteps, code listings, or execution handoffs.

## 4. Review and hand off

1. Self-review the Plan against the Accepted Spec: facts, scope, file boundaries, interfaces, phases, tests, migration, cleanup, rollback, and unresolved design gaps. For a revision, complete a whole-file **semantic conservation** review: every Baseline item and Delta item has one disposition, unaffected valid strategy remains, discarded paths and residual references are absent, and every removal or broad rewrite has Authority. Make one TDD decision for the whole review: recommend TDD for outcomes involving core algorithms, critical steps or state transitions, critical business flows, or high regression risk, using tests to fix expectations before implementation and reduce AI implementation errors escaping detection; use ordinary validation for the rest. Record the choice in `Test and Experiment Strategy` and `Tasks Generation Rules` so `generating-tasks` can propagate it to the corresponding Tasks.
2. After writing or revising the Plan, run once:
   ```sh
   hello-scholar docs sync
   ```
3. Present the complete Plan for one whole-file user review. It remains `draft` until the user explicitly approves it.
4. Before setting `status: approved`, reread the target Spec Front Matter and confirm the Plan's `spec` and `spec_revision` still match its accepted ID and revision. If either differs, leave the Plan `draft` and revise and review it again.
5. After explicit approval and that freshness check, set `status: approved`, validate through the same CLI sequence, and invoke `$generating-tasks` to produce separately reviewed Tasks.

**Completion:** the terminal state is a reviewed Plan that records its test-process choice, or a clear stop at the design decision that prevents one. Plan approval does not approve Tasks or implementation.
