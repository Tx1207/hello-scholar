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

## Source Of Truth

Implement `SPEC-003` revision 2 without changing `evaluate(feature, tenant) -> bool`.

## Scope Boundary

- Add `PolicyRules` in `src/policy.py` with global defaults, tenant overrides, and an explicit-deny set.
- Modify `PolicyEngine` in `src/policy.py` to evaluate deny, tenant, then default.
- Modify `tests/test_policy.py` for AC-1 through AC-4.
- Add `tests/test_policy_migration.py` for legacy constructor compatibility.
- Delete the legacy dictionary-only constructor branch after all fixture callers move to `PolicyRules`.
- Must not touch `hello-scholar/architecture.md`, packaging, networking, or persistent storage.

## Phases

1. **Precedence behavior with explicit TDD:** For AC-1 and AC-2, first add focused tests and observe the existing engine fail for the explicit-deny case; implement the minimal precedence; observe the focused suite pass; then simplify without changing behavior.
2. **Default and public compatibility:** Cover AC-3 and AC-4 with ordinary regression tests and update the policy object. The Plan does not select a TDD process for this phase.
3. **Constructor migration:** Add the compatibility migration test, update all test callers to `PolicyRules`, then remove the temporary legacy constructor branch after the full caller search is empty.
4. **Final verification and rollback check:** Run `python3 -m unittest discover -s tests`, expect exit 0 and all tests `OK`; run `rg -n 'PolicyEngine\(\s*\{' src tests`, expect exit 1 with no legacy dictionary constructors; run `git diff --check`, expect exit 0.

## Migration And Cleanup

The migration is in-process only. The removal gate requires current full-suite output plus an empty legacy-constructor search. If either fails, retain the compatibility branch and do not claim cleanup complete.

## Rollback

Revert `src/policy.py`, `tests/test_policy.py`, and `tests/test_policy_migration.py` as one change. No persistent data or external interface changes.

## Tasks Generation Rules

Each AC must map to at least one required Task. Preserve the explicit TDD sequence only for the precedence behavior in phase 1. Separate migration preparation, caller update, cleanup deletion, and final regression where their evidence or file ownership differs; do not mark Tasks that write `src/policy.py` as parallel.
