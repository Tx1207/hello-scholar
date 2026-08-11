---
schema: 1
kind: plan
spec: SPEC-003
spec_revision: 2
revision: 1
status: approved
title: Feature policy precedence implementation plan
summary: Add explicit deny with one compatibility migration and bounded cleanup
created: 2026-07-29
updated: 2026-07-30
---
# Feature Policy Precedence Plan

## 1. Implementation Goal

Implement `SPEC-003` revision 2 without changing `evaluate(feature, tenant) -> bool`.

## 2. Scope

Add explicit-deny precedence and migrate legacy constructor callers. Persistent storage, networking, and Architecture are excluded.

## 3. Technical Strategy

Introduce `PolicyRules` and make `PolicyEngine` select explicit deny, tenant rule, then global default.

## 4. Affected Modules

`PolicyRules` and `PolicyEngine` live in `src/policy.py`; behavior and migration tests live under `tests/`.

## 5. File Change Boundaries

Modify `src/policy.py` and `tests/test_policy.py`; add `tests/test_policy_migration.py`. Must not touch Architecture, packaging, networking, or persistent storage.

## 6. Interface Changes

Preserve `evaluate(feature, tenant) -> bool`. Add `PolicyRules` construction while retaining a temporary dictionary compatibility path.

## 7. Implementation Phases

1. **Precedence behavior with explicit TDD:** For AC-1 and AC-2, add focused tests, observe the explicit-deny failure, implement deny before tenant and default, then refactor while green.
2. **Default and public compatibility:** Cover AC-3 and AC-4 with ordinary regression tests.
3. **Constructor migration:** Add migration tests, update all callers to `PolicyRules`, then remove dictionary compatibility after an empty caller search.
4. **Final verification:** Run the full Python suite, legacy-constructor search, and `git diff --check`.

## 8. Test and Experiment Strategy

Use Red-Green-Refactor only for explicit-deny precedence. Use ordinary regression for default behavior and migration.

## 9. Migration Sequence

Add `PolicyRules`, retain compatibility, migrate callers, then remove compatibility after executable gates pass.

## 10. Cleanup

Delete the dictionary constructor only after full tests and an empty caller search.

## 11. Rollback

Revert `src/policy.py`, `tests/test_policy.py`, and `tests/test_policy_migration.py` together. No persistent data is affected.

## 12. Tasks Generation Rules

Map every AC to a Task. Preserve TDD only for precedence. Separate migration, caller updates, cleanup, and final regression where evidence differs; do not mark shared `src/policy.py` writers parallel.
