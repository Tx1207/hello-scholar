---
schema: 1
kind: record
run_id: 20260731-1400-int4-quality-s0
title: INT4 quality evaluation
status: running
spec: null
spec_revision: null
plan_revision: null
started: 2026-07-31T14:00:00Z
completed: null
decision: pending
summary: Quality evaluation ended and awaits terminal evidence review
---
# INT4 Quality Evaluation

## 1. Purpose

Evaluate whether INT4 reduces model size while keeping accuracy loss within 0.02.

## 2. Hypothesis

INT4 accuracy is at least 0.822 when the FP16 baseline is 0.842.

## 3. Experimental Variables

- Quantization bits: 4
- Evaluation samples: 1,200

## 4. Controls

- Model: `scholar-reranker-1.3b` at `sha256:6f51b4c8e4d84c1e`
- Seed: 0
- FP16 baseline accuracy: 0.842

## 5. Execution Information

- Command: `python3 tools/evaluate_quantized.py --config configs/int4-quality.json`
- CWD: project root
- Git commit: capture from the fixture Base commit during closeout
- Config: `configs/int4-quality.json`

## 6. Artifact Locations

- Log: `runs/20260731-1400-int4-quality-s0/logs/eval.log`
- Metrics: `runs/20260731-1400-int4-quality-s0/results/metrics.json`
- Checkpoint: none produced

## 7. Execution Events

- 2026-07-31T14:00:00Z: evaluation process started.

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
