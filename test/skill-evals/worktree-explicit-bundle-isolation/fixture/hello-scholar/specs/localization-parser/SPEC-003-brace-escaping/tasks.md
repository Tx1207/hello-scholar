---
schema: 1
kind: tasks
spec: SPEC-003
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

## Phase 1: Brace Escaping

- [ ] T001: Ignore double-brace literals
  - Spec Coverage: AC-1, AC-2
  - Depends On: None
  - Parallel: No
  - Files: `src/localization_parser/parser.py`, `tests/test_parser.py`
  - Work: Update the existing regex so only non-doubled braces define placeholders; add focused mixed-input and regression assertions without changing the public tuple API.
  - Validation: Run `python3 -m unittest discover -s tests -p 'test_*.py'`; all tests pass with no warning or dependency change.
  - Completion: Double-brace names are absent, ordinary names remain ordered and unique, the suite is green, and no Git topology or forbidden file changed.
