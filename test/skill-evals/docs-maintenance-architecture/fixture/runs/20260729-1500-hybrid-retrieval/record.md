---
schema: 1
kind: record
run_id: 20260729-1500-hybrid-retrieval
title: Hybrid Retrieval Recall Eval
status: completed
spec: SPEC-310
spec_revision: 2
plan_revision: 1
started: 2026-07-29T15:00:00+00:00
completed: 2026-07-29T15:18:00+00:00
decision: adopt
summary: Hybrid scoring improved Recall@10 from 0.71 to 0.83 with zero publication-filter violations.
---

# Hybrid Retrieval Recall Eval

## Purpose

Validate the accepted fixed-weight hybrid retrieval path on paper-search-v3.

## Method

Compare the committed lexical baseline with the completed hybrid implementation using the same query set and stable seed.

## Results

Metrics are saved in `results/recall-metrics.json`: Recall@10 improved to 0.83 and unpublished-result violations remained zero.

## Conclusion

Adopt the completed hybrid path. The result provides current Architecture evidence for vector scoring and internal publication filtering only.
