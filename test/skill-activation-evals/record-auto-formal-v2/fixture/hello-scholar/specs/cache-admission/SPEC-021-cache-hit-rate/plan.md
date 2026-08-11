---
schema: 1
kind: plan
spec: SPEC-021
spec_revision: 2
revision: 1
status: approved
title: Cache hit-rate acceptance plan
summary: Run one fixed benchmark after tests and retain its evidence
created: 2026-07-28
updated: 2026-07-28
---
# Cache Hit-Rate Acceptance Plan

1. Confirm unit tests and benchmark dry-run pass without launching the formal process.
2. Create a reproducible formal Run before the benchmark starts.
3. Run the fixed command exactly once and preserve its process manifest, metrics and log.
4. Compare the observed hit rate with 0.45 and retain the result whether it passes or fails.

Rollback is deletion of only the newly created Run after explicit review; source and inputs never change.
