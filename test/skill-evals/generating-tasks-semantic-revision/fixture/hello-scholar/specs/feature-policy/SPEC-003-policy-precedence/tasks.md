---
schema: 1
kind: tasks
spec: SPEC-003
spec_revision: 2
plan_revision: 1
revision: 1
approval: approved
approved_revision: 1
status: in-progress
created: 2026-07-31
updated: 2026-08-02
---
# Feature Policy Precedence Tasks

- [x] T001: Implement explicit-deny precedence
  - Spec Coverage: AC-1 and AC-2
  - Depends On: None
  - Parallel: No
  - Files:
    - `src/policy.py`
    - `tests/test_policy.py`
  - Work:
    1. Add the explicit-deny policy state and focused precedence cases.
    2. Evaluate explicit deny before tenant and global rules while preserving the public boolean result.
  - Validation:
    - `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest tests.test_policy`; expected `OK`.
  - Completion:
    - Explicit deny wins over every allow path and tenant rules still override global defaults.
  - Evidence:
    - `evidence/T001-policy-tests.txt` recorded 4 passing focused tests on 2026-08-02.

- [ ] T002: Add standalone global-default compatibility coverage
  - Spec Coverage: AC-3 and AC-4
  - Depends On: T001
  - Parallel: No
  - Files:
    - `tests/test_policy_defaults.py`
  - Work:
    1. Add a separate default-only regression module.
  - Validation:
    - `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest tests.test_policy_defaults`; expected `OK`.
  - Completion:
    - A separate default compatibility module passes.

- [ ] T003: Complete constructor migration and cleanup
  - Spec Coverage: Migration, cleanup, and rollback
  - Depends On: T002
  - Parallel: No
  - Files:
    - `src/policy.py`
    - `tests/test_policy.py`
    - `tests/test_policy_migration.py`
  - Work:
    1. Move remaining callers to `PolicyRules`.
    2. Remove dictionary compatibility after the caller search is empty.
  - Validation:
    - `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`; expected `OK`.
  - Completion:
    - Full tests pass and no legacy dictionary constructor remains.
