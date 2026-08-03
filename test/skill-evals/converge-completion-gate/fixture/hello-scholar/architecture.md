---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-30
---
# Current Architecture

`src/report_pipeline.py` aggregates persisted CSV order exports into a deterministic grouped JSON report. `clients/daily_report_job.py` is the scheduled caller. The job writes reports to a local staging directory before an external publisher uploads them.
