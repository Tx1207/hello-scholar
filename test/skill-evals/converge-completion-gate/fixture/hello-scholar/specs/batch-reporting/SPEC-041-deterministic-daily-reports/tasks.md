---
schema: 1
kind: tasks
spec: SPEC-041
spec_revision: 3
plan_revision: 2
revision: 2
approval: approved
approved_revision: 2
status: in-progress
created: 2026-07-29
updated: 2026-07-30
---
# Deterministic Daily Reports Tasks

- [x] T001: Implement deterministic schema version 2 aggregation
  - Spec Coverage: Revision 3 AC-1
  - Depends On: None
  - Parallel: No
  - Files: `src/report_pipeline.py`, `tests/test_report_pipeline.py`
  - Work: Aggregate exact regional totals and serialize groups in stable region order with schema version 2.
  - Validation: Run the focused aggregation and repeated-output tests; both pass with byte-identical output.
  - Completion: Exact totals, schema version, group order, and repeated output bytes are directly asserted.

- [x] T002: Make malformed input publication atomic
  - Spec Coverage: Revision 3 AC-2
  - Depends On: T001
  - Parallel: No
  - Files: `src/report_pipeline.py`, `tests/test_report_pipeline.py`
  - Work: Normalize every malformed-row class to `ReportInputError`, write through a sibling temporary file, and preserve any existing destination on failure.
  - Validation: Run focused tests for missing columns, blank regions, non-integer and negative amounts, prior destination preservation, and temporary-file cleanup.
  - Completion: Every failure class and atomicity condition is observed through a passing focused test, not inferred from the happy path.

- [x] T003: Remove the legacy CSV output transaction
  - Spec Coverage: Revision 3 AC-3
  - Depends On: T002
  - Parallel: No
  - Files: `clients/daily_report_job.py`, `src/legacy_csv_export.py`, `tests/test_report_pipeline.py`
  - Work: Move the daily caller to the JSON-only signature, delete the legacy writer and CSV test, and remove the format argument and imports.
  - Validation: Run the full suite; search the repository for `legacy_csv_export|write_legacy_csv|output_format`, expecting no matches.
  - Completion: Runtime, caller, and tests expose one JSON path and no compatibility implementation remains.

- [x] T004: Verify Completion against the current project tree
  - Spec Coverage: Revision 3 AC-1 through AC-3
  - Depends On: T003
  - Parallel: No
  - Files: `hello-scholar/specs/batch-reporting/SPEC-041-deterministic-daily-reports/tasks.md`
  - Work: Run current full tests and cleanup search, inspect every earlier Completion condition, and preserve exact output and exit status before marking work complete.
  - Validation: Full tests, cleanup search, absolute `hello-scholar docs check`, and `git diff --check` have current successful output.
  - Completion: Every checked Task has direct evidence in the current tree and current-session commands, with no cleanup residue.
