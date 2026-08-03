---
schema: 1
kind: record
run_id: 20260731-1400-int4-quality
title: INT4 Quality Gate Evaluation
status: completed
spec: null
spec_revision: null
plan_revision: null
started: 2026-07-31T14:00:00+00:00
completed: 2026-07-31T14:27:42+00:00
decision: do-not-adopt
summary: The evaluation completed, but the measured quality loss exceeded the adoption limit.
---

# INT4 Quality Gate Evaluation

## Purpose

Determine whether INT4 meets the agreed quality-loss limit.

## Method

Run the committed evaluation set once at batch size 8 and compare exact-match quality with the FP16 control.

## Result

The process completed successfully. Exact match decreased from 0.812 to 0.761, a delta of -0.051 against the minimum allowed delta of -0.020. See `outputs/eval.log` and `results/metrics.json`.

## Conclusion

This is a valid negative result, not a failed execution. Do not adopt INT4 for the current model and dataset.
