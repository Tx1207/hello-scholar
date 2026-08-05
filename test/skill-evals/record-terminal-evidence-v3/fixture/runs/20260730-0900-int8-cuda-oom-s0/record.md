---
schema: 1
kind: record
run_id: 20260730-0900-int8-cuda-oom-s0
title: INT8 CUDA calibration
status: running
spec: null
spec_revision: null
plan_revision: null
started: 2026-07-30T09:00:00Z
completed: null
decision: pending
summary: Calibration process ended and awaits terminal evidence review
---
# INT8 CUDA Calibration

## 1. Purpose

Measure whether `scholar-reranker-1.3b` can be calibrated to INT8 on the 16 GiB lab GPU.

## 2. Hypothesis

The fixed 2,048-sample calibration fits within the configured device-memory limit.

## 3. Experimental Variables

- Quantization bits: 8
- Calibration samples: 2,048

## 4. Controls

- Model: `scholar-reranker-1.3b` at `sha256:6f51b4c8e4d84c1e`
- Seed: 0

## 5. Execution Information

- Command: `python3 tools/quantize.py --config configs/int8-calibration.json`
- CWD: project root
- Git commit: capture from the fixture Base commit during closeout
- Config: `configs/int8-calibration.json`

## 6. Artifact Locations

- Log: `runs/20260730-0900-int8-cuda-oom-s0/logs/stderr.log`
- Failure evidence: `runs/20260730-0900-int8-cuda-oom-s0/results/failure.json`
- Checkpoint: none produced

## 7. Execution Events

- 2026-07-30T09:00:00Z: calibration process started.

## 8. Key Results

Pending terminal review.

## 9. Observations

Pending terminal review.

## 10. Conclusion

Pending terminal review.

## 11. Decision

Pending terminal review.

## 12. Next Actions

Pending terminal review.
