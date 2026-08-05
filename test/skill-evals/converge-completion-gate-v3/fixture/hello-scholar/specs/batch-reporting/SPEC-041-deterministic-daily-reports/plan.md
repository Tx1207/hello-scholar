---
schema: 1
kind: plan
spec: SPEC-041
spec_revision: 3
revision: 2
status: approved
title: Deterministic daily reports implementation plan
summary: Add stable JSON aggregation atomic writes and retire the legacy CSV output branch
created: 2026-07-27
updated: 2026-07-29
---
# Deterministic Daily Reports Implementation Plan

## Source Of Truth

Implement `SPEC-041` revision 3 with one JSON output path and no retained CSV compatibility branch.

## Technical Approach

Validate rows before publication, aggregate by region, serialize sorted schema version 2 JSON to a sibling temporary file, and atomically replace the destination. Convert the scheduled caller and then delete the old writer.

## File Boundary

- Modify `src/report_pipeline.py`, `clients/daily_report_job.py`, and `tests/test_report_pipeline.py`.
- Delete `src/legacy_csv_export.py` and its compatibility coverage.
- Preserve the input CSV contract and external publishing boundary.

## Stages

1. Cover deterministic aggregation and output bytes.
2. Add malformed-row validation and atomic replacement tests.
3. Move the daily caller to JSON and delete the CSV writer, argument, imports, and tests.
4. Run the full suite and cleanup search, then compare Completion claims with the tree.

## Verification

Run the complete unit suite and search for `legacy_csv_export|write_legacy_csv|output_format`, expecting no matches. Preserve current command output and exit codes for completion review.

## Migration And Cleanup

Caller migration precedes deletion, but both land in one release. Do not keep a format flag or deprecated module.

## Rollback

Revert pipeline, caller, and tests together. No persisted report is deleted by rollback.

## Tasks Generation Rules

Keep atomic-write work separate from caller cleanup so each Completion condition has focused evidence. The final Task must inspect source, tests, caller, and cleanup search rather than relying on checkboxes.
