---
schema: 1
kind: spec
id: SPEC-001
title: Intent-aware search ranking
topic: search-ranking
type: capability
status: accepted
revision: 2
summary: Rank exact terms and semantic matches through one stable scoring contract
created: 2026-06-10
updated: 2026-07-18
supersedes: []
superseded_by: null
---
# Intent-aware Search Ranking

## 1. Problem

Keyword-only ranking misses semantically relevant documents, while unconstrained semantic matches can outrank exact query terms.

## 2. Goals

Own relevance weights for lexical, intent, and freshness signals behind `rank_documents`.

## 3. Non-goals

Result diversity and pagination are owned elsewhere.

## 4. Current State

Revision 2 adds an `intent_score` fallback when lexical score is below the configured threshold.

## 5. Target Design

The ranking score is the sum of exact-term, semantic intent, and freshness components. Exact terms remain the strongest signal.

## 6. Implementation Boundary

Only relevance scoring and its configuration belong to this Spec.

## 7. Interfaces And Data

`rank_documents(query, documents, policy)` returns document IDs ordered by descending score and stable input order for ties.

## 8. Invariants And Constraints

The public function and return type remain stable. Scores are deterministic for the same inputs.

## 9. Options And Decision

Adopt a bounded semantic fallback instead of a semantic-only ranker.

## 10. Acceptance Criteria

Exact lexical hits outrank semantic-only hits; intent fallback activates only above its threshold.

## 11. Verification

Unit tests cover exact, semantic, freshness, and stable tie behavior.

## 12. Migration And Cleanup

Configuration changes are deployed with the ranking service; no stored data migration exists.

## 13. Rollback

Restore the previous weight values and service build.

## 14. Evidence

`tests/test_ranking.py` and production ranking configuration.

## 15. Revision History

- Revision 1: lexical and freshness scoring.
- Revision 2: bounded semantic intent fallback at threshold 0.62.
