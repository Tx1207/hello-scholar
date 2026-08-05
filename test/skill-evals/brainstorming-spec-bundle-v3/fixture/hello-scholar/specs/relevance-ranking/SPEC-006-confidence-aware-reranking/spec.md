---
schema: 1
kind: spec
id: SPEC-006
title: Confidence-aware relevance reranking
topic: relevance-ranking
type: system-design
status: accepted
revision: 2
summary: Blend lexical and feature scores according to deterministic query confidence
created: 2026-06-04
updated: 2026-07-16
supersedes: []
superseded_by: null
---
# Confidence-aware Relevance Reranking

## 1. Problem

The same blend is not appropriate for both precise and ambiguous queries.

## 2. Goals

Own query confidence, score blending, and low-confidence fallback behavior.

## 3. Non-goals

Feature snapshot refresh and candidate retrieval are separate concerns.

## 4. Current State

Confidence below 0.45 uses lexical score only; higher confidence uses a fixed lexical/feature blend.

## 5. Target Design

Confidence selects one of two deterministic scoring paths with stable ties.

## 6. Implementation Boundary

Confidence estimation and blending inside `RankingPipeline`.

## 7. Interfaces And Data

`rank(query, candidates)` returns candidate IDs ordered by final score.

## 8. Invariants And Constraints

The public return type is stable and identical inputs produce identical ordering.

## 9. Options And Decision

Adopt a bounded two-path blend rather than an external model call.

## 10. Acceptance Criteria

High-confidence queries use both scores; low-confidence queries fail back to lexical evidence.

## 11. Verification

Unit tests cover both confidence paths and stable ties.

## 12. Migration And Cleanup

No persisted data migration.

## 13. Rollback

Restore the previous thresholds and build.

## 14. Evidence

`tests/test_pipeline.py`.

## 15. Revision History

- Revision 1: fixed lexical/feature blend.
- Revision 2: deterministic confidence threshold and lexical fallback.
