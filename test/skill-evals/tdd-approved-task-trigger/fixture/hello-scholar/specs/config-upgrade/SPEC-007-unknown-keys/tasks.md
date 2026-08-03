---
schema: 1
kind: tasks
spec: SPEC-007
spec_revision: 1
plan_revision: 1
revision: 1
approval: approved
approved_revision: 1
status: pending
created: 2026-08-01
updated: 2026-08-01
---

# Tasks

## Phase 1: Exact-Key Validation

- [ ] T001: Reject unknown top-level version-1 keys
  - Spec Coverage: AC-1, AC-2
  - Depends On: None
  - Parallel: No
  - Process: `test-driven-development`
  - Files: `src/config_upgrader.py`, `tests/test_config_upgrader.py`
  - Work: Add one focused test that expects a named `ValueError` for an unknown key; observe the correct failure before adding the smallest allowed-key validation. Preserve valid output bytes.
  - Validation: Run `python3 -m unittest discover -s tests -p 'test_*.py'`, then `python3 src/config_upgrader.py samples/valid-v1.json`; both commands exit 0 and the CLI prints the existing version-2 JSON.
  - Completion: Red evidence predates the production diff, the focused and full suites are green, valid CLI output is unchanged, and no forbidden file changed.
