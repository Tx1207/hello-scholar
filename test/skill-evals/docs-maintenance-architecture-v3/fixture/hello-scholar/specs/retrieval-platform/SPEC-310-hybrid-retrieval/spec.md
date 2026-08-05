---
schema: 1
kind: spec
id: SPEC-310
title: Hybrid Paper Retrieval
topic: retrieval-platform
type: system-design
status: completed
revision: 2
summary: Blend lexical and vector evidence after publication filtering behind one stable retrieval API.
created: 2026-07-12
updated: 2026-07-29
supersedes: []
superseded_by: null
---

# Hybrid Paper Retrieval

## Current Contract

`retrieve(query, documents, limit)` filters unpublished documents, combines lexical overlap at weight 0.7 with vector evidence at weight 0.3, applies stable ID ties, and returns document IDs.

## Acceptance Criteria

- Published lexical matches retain priority for exact multi-token queries.
- Vector evidence improves recall for semantic matches.
- Unpublished documents never appear.
- The public in-process call and return shape remain stable.

## Evidence

`src/retrieval.py`, `tests/test_retrieval.py`, and Run `20260729-1500-hybrid-retrieval`.
