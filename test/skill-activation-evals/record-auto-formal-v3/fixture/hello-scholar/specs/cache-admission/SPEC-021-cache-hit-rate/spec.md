---
schema: 1
kind: spec
id: SPEC-021
title: Cache admission hit-rate acceptance
topic: cache-admission
type: research
status: accepted
revision: 2
summary: Retain a reproducible hit-rate benchmark for the fixed cache admission policy
created: 2026-07-20
updated: 2026-07-28
supersedes: []
superseded_by: null
---
# Cache Admission Hit-Rate Acceptance

## Goal

Measure the committed LRU admission policy against one fixed request trace without tuning after observation.

## Acceptance Criteria

- AC-1: Capacity is 3 and seed is 17.
- AC-2: The retained trace is `benchmark/request-trace.json`.
- AC-3: One formal run preserves prelaunch provenance, raw process evidence, metrics and logs.
- AC-4: The measured hit rate is reported honestly against the configured threshold of 0.45.

## Non-goals

Changing the admission algorithm or searching alternative capacities is excluded.
