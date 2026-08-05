---
schema: 1
kind: spec
id: SPEC-041
title: Deterministic daily batch reports
topic: batch-reporting
type: capability
status: accepted
revision: 4
summary: Produce atomic deterministic JSON reports and retire legacy CSV only after a recorded production-scale benchmark
created: 2026-06-11
updated: 2026-08-01
supersedes: []
superseded_by: null
---
# Deterministic Daily Batch Reports

## Problem

Daily report retries must produce the same JSON result without leaving a partial destination. A legacy CSV output branch has outlived migration, and production-scale cost has not been captured with reproducible provenance.

## Goals

- Aggregate CSV order inputs into deterministic schema version 2 JSON.
- Reject malformed rows through a stable error without replacing a valid prior report.
- Remove the legacy CSV writer and caller option.
- Prove production-scale readiness with a formal Benchmark/Eval and associated root Run Record.

## Non-goals

Changing input storage, parallel workers, an upload protocol, and retaining multiple output formats are excluded.

## Accepted Design

`build_report(source) -> dict` returns schema version 2 with groups sorted by region. `write_report(source, destination) -> Path` validates and writes a sibling temporary file before an atomic replace. Missing columns, blank regions, non-integer amounts, and negative amounts raise `ReportInputError` and leave an existing destination byte-identical.

`run_daily_report(source, destination) -> Path` has no output-format argument and always writes JSON. `src/legacy_csv_export.py`, CSV output tests, and all CSV caller branches are deleted.

## Acceptance Criteria

- AC-1: Repeated runs over the same input produce byte-identical schema version 2 JSON with sorted region groups and exact order and amount totals.
- AC-2: Every malformed-row class raises `ReportInputError`; an existing destination remains byte-identical and no temporary file remains.
- AC-3: The daily-job public caller writes JSON without an output-format switch; the legacy CSV module, import, branch, and test are absent.
- AC-4: A formal Benchmark/Eval processes the checked-in production-shape dataset definition at 250,000 rows in no more than 8 seconds and records peak memory below 160 MiB.
- AC-5: The Benchmark has a valid `runs/<run-id>/record.md` associated with `SPEC-041` revision 4 and the Current Approved Plan revision, plus command, environment, dataset identity, raw output, metrics, conclusion, and next step.
- AC-6: Final completion uses current full tests, malformed-input tests, cleanup search, Benchmark Record, docs check, and complete Git-tree evidence; a past prose summary is insufficient.

## Test And Experiment Strategy

Use deterministic unit tests for aggregation, malformed input, atomic replacement, cleanup, and caller compatibility. The 250,000-row performance gate is a formal Benchmark/Eval: create the minimal Record before starting the non-trivial run, then complete results and conclusion once after it ends.

## Migration And Cleanup

Move the scheduled caller to JSON, remove the output-format argument, delete the legacy CSV module and tests, and require an empty repository search for `legacy_csv_export`, `write_legacy_csv`, and `output_format` before completion.

## Rollback

Revert pipeline, caller, tests, and scheduler configuration together. Restoring CSV requires a new reviewed Spec revision; it is not a compatibility fallback.

## Revision History

- Revision 1: Defined grouped daily reports.
- Revision 2: Selected deterministic JSON schema version 2.
- Revision 3: Accepted atomic malformed-input handling and CSV retirement.
- Revision 4: Added the formal production-scale Benchmark/Record gate and current completion-evidence contract.
