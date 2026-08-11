---
schema: 1
kind: plan
spec: SPEC-003
spec_revision: 3
revision: 2
status: approved
title: Feature policy precedence implementation plan
summary: Preserve explicit deny and compatibility migration while adding bounded audit callback wiring
created: 2026-07-29
updated: 2026-08-09
---
# Feature Policy Precedence Plan

## 1. Implementation Goal

Implement `SPEC-003` revision 3 without changing `evaluate(feature, tenant) -> bool`, adding one audit callback after each selected rule result.

## 2. Scope

Preserve the explicit-deny precedence and constructor migration. Add callback wiring and callback verification; exclude persistence, networking, and Architecture.

## 3. Technical Strategy

Keep rule selection pure, then call the injected callback exactly once with the selected source and returned boolean. Existing callers receive a no-op default.

## 4. Affected Modules

`PolicyRules` and `PolicyEngine` remain in `src/policy.py`; policy and migration tests remain under `tests/`.

## 5. File Change Boundaries

Modify `src/policy.py` and `tests/test_policy.py`; add `tests/test_policy_migration.py` and `tests/test_policy_audit.py`. Must not touch Architecture, packaging, networking, or persistent storage.

## 6. Interface Changes

The public `evaluate(feature, tenant) -> bool` signature is unchanged. Construction accepts an optional `audit(feature, tenant, source, result)` callback and defaults it to a no-op.

## 7. Implementation Phases

1. **Precedence behavior with explicit TDD:** preserve the completed AC-1 and AC-2 implementation and evidence.
2. **Default and public compatibility:** remove the former standalone phase because its coverage is now part of the completed precedence result and final regression.
3. **Constructor migration:** update remaining test callers to `PolicyRules`, then remove the temporary dictionary constructor after an empty caller search.
4. **Audit callback integration:** update the existing policy test outcome and validation for AC-5, then add callback wiring to `src/policy.py` without changing precedence.
5. **Final verification and rollback check:** run the full Python suite, empty legacy-constructor search, and `git diff --check`.

## 8. Test and Experiment Strategy

Keep the approved Red-Green-Refactor process only for explicit-deny precedence. Audit callback integration uses focused ordinary regression because the upstream contract is fixed and rule selection already has coverage.

## 9. Migration Sequence

Keep the no-op callback default throughout. Update callers before deleting dictionary compatibility; no data migration exists.

## 10. Cleanup

Delete the temporary dictionary constructor only after caller search and full-suite gates pass. Remove no callback compatibility behavior.

## 11. Rollback

Revert callback wiring and audit tests while retaining the completed precedence behavior and migrated policy object. No persistent data is affected.

## 12. Tasks Generation Rules

Preserve completed valid Tasks and evidence. Remove unfinished work that revision 2 no longer requires. Keep IDs when only Work, Validation, or Completion changes; use new, never-reused IDs for new outcomes. Rebuild the DAG and reset a semantic Tasks revision to pending review.
