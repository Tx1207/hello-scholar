---
schema: 1
kind: record
run_id: 20260730-0900-int8-oom
title: INT8 Batch 16 Memory Trial
status: failed
spec: null
spec_revision: null
plan_revision: null
started: 2026-07-30T09:00:00+00:00
completed: 2026-07-30T09:04:18+00:00
decision: inconclusive
summary: The process exhausted device memory before quality metrics were produced.
---

# INT8 Batch 16 Memory Trial

## Purpose

Measure INT8 quality and throughput at batch size 16.

## Method

Launch one evaluation process with the committed INT8 configuration and stop on any process failure.

## Result

The process exited non-zero during model warmup with an out-of-memory error. No quality or throughput metric is valid for this Run. See `outputs/stderr.log` and `results/failure.json`.

## Conclusion

This execution failed and is inconclusive. Do not repeat the same INT8 batch-16 configuration without a new hypothesis and separately authorized Run.
