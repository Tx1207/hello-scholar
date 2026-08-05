---
schema: 1
kind: plan
spec: SPEC-000
spec_revision: 1
revision: 1
status: draft
title: <Clear implementation plan title>
summary: <Concrete implementation strategy summary>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Clear implementation plan title>

## 1. Implementation Goal

<State the accepted outcome this Plan will implement.>

## 2. Scope

<Name covered Spec sections, deferred sections, and explicit non-goals.>

## 3. Technical Strategy

<Describe the implementation approach without reopening accepted product decisions.>

## 4. Affected Modules

<List each affected module and its responsibility in the strategy.>

## 5. File Change Boundaries

- Add: <paths or None with reason>
- Modify: <paths or None with reason>
- Move or Migrate: <paths or None with reason>
- Delete: <paths or None with reason>
- Must Not Touch: <paths or boundaries>

## 6. Interface Changes

<Describe public interfaces, data contracts, compatibility behavior, or state that changes; state None with a reason when applicable.>

## 7. Implementation Phases

<Describe dependency-ordered phases and their observable outcomes.>

## 8. Test and Experiment Strategy

<Describe unit, integration, regression, benchmark, Eval, or formal experiment evidence required by the Spec.>

## 9. Migration Sequence

<Describe the compatibility window, conversion order, and cutover gate; state None with a reason when no migration exists.>

## 10. Cleanup

<Name obsolete callers, configuration, data, flags, dependencies, or files and the evidence required before removal; state None with a reason when applicable.>

## 11. Rollback

<Describe recovery actions, preserved evidence, and the boundary that triggers rollback; state None with a reason when applicable.>

## 12. Tasks Generation Rules

<Describe the required tracer-task coverage, dependencies, parallel boundaries, validation, and explicit TDD selections for generating-tasks.>

## Plan Self-Review

<Confirm alignment with the current Accepted Spec revision, exact file boundaries, migration/cleanup/rollback coverage, and unresolved design decisions.>

Plan written in the current Spec Bundle. It awaits whole-file user review; after approval, invoke `$generating-tasks`.
