## Spec owner confirmation

**Classification: Update Existing Spec**

- **Owner:** `SPEC-001 — Intent-aware search ranking`
- **Canonical path:** `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`
- **Proposed revision:** `3`
- **Reason:** The request changes the same relevance-scoring capability and lifecycle already owned by `SPEC-001`: lexical ranking precedence and semantic fallback behavior.
- **Not `SPEC-004`:** `SPEC-004` owns only post-ranking source diversity and explicitly excludes lexical, phrase, semantic, and freshness weights.
- **Write status:** No files have been modified. This is a review-only draft.

# Proposed complete revision

```markdown
---
schema: 1
kind: spec
id: SPEC-001
title: Intent-aware search ranking
topic: search-ranking
type: capability
status: draft
revision: 3
summary: Rank exact phrases, ordinary lexical matches, and semantic matches through one stable scoring contract
created: 2026-06-10
updated: 2026-08-10
supersedes: []
superseded_by: null
---

# Intent-aware Search Ranking

## 1. Value and Current Decision

Search results must keep deterministic lexical relevance as the primary signal while recovering semantically relevant documents when lexical evidence is insufficient.

This Spec owns relevance scoring behind the stable `rank_documents` entry. The current decision is to retain the bounded semantic fallback model, add a deterministic bounded lexical bonus for complete-query phrase matches, and raise the semantic fallback threshold from `0.62` to `0.68`.

The public ranking entry, returned document-ID structure, source-diversity behavior, freshness rule, and stable input-order tie behavior remain unchanged.

## 2. Problem and Current Facts

Keyword-only ranking can miss semantically relevant documents. Unconstrained semantic matches can outrank documents with stronger lexical evidence. Ordinary term matches also need to remain below a deterministic complete-query phrase match.

The current implementation in `src/ranking.py`:

- accepts `documents` and the existing `intent_threshold` argument;
- computes a bounded semantic contribution only when `intent_score >= intent_threshold`;
- combines lexical, semantic, and freshness contributions with weights `0.7`, `0.2`, and `0.1`;
- sorts by descending score and then original input position;
- returns document IDs as `list[str]`.

The current default semantic threshold is `0.62`. The current `Document` fields are `document_id`, `lexical_score`, `intent_score`, and `freshness_score`. The ranking module has no separate phrase field or query argument.

## 3. Goals and Non-goals

### Goals

- Give a complete-query phrase match higher lexical precedence than an ordinary word-term match.
- Represent the phrase precedence as a deterministic, bounded bonus within the lexical signal.
- Raise the default semantic fallback threshold from `0.62` to `0.68`.
- Preserve the existing ordinary lexical, semantic, and freshness contributions.
- Preserve the stable public ranking entry and `list[str]` return structure.
- Preserve stable input-order ordering for equal final scores.
- Keep source diversity as the independent post-ranking policy owned by `SPEC-004`.
- Make the revised behavior deterministic and directly testable.

### Non-goals

- No new public ranking parameter.
- No change to the public return structure.
- No change to the `Document` public fields required by the ranking entry.
- No query parsing or phrase detection inside `rank_documents`; phrase detection belongs to the lexical-score producer.
- No replacement of the bounded semantic fallback with a semantic-only ranker.
- No change to semantic or freshness weights.
- No change to freshness calculation or freshness policy.
- No change to result pagination or source-diversity rules.
- No stored-data migration.

## 4. Current State

Revision 2 uses a bounded semantic intent fallback: `intent_score` contributes only when it meets the configured threshold, currently `0.62`.

The lexical score currently represents the lexical evidence supplied to the ranker. The existing score is:

```text
lexical_score * 0.7
+ semantic_contribution * 0.2
+ freshness_score * 0.1
```

The current implementation does not expose a separate phrase-match signal.

## 5. Target Design

The lexical-score producer deterministically identifies whether the complete query phrase matches and incorporates a bounded phrase bonus into the existing `lexical_score` before calling `rank_documents`.

Conceptually:

```text
effective_lexical_score =
    ordinary_lexical_score + bounded_complete_phrase_bonus
```

For a document without a complete-query phrase match, the bonus is zero. For a document with a complete-query phrase match, the bonus is positive, deterministic, and bounded by the lexical scoring policy. The bonus must establish phrase-match precedence over an otherwise comparable ordinary word-term match without allowing phrase status to replace the ordinary lexical evidence.

`rank_documents` continues to apply the same scoring structure:

```text
semantic_contribution =
    intent_score if intent_score >= 0.68 else 0.0

final_score =
    effective_lexical_score * 0.7
    + semantic_contribution * 0.2
    + freshness_score * 0.1
```

The threshold comparison remains inclusive. An `intent_score` of `0.67` is ignored; an `intent_score` of `0.68` contributes.

Phrase matching is lexical evidence, not semantic evidence. It therefore does not alter the semantic fallback decision and does not receive the semantic weight.

## 6. Implementation Boundary

The lexical-score producer owns:

- deterministic complete-query phrase detection;
- ordinary word-term scoring;
- application of the bounded phrase bonus;
- enforcement of the configured phrase-bonus bound.

`src/ranking.py` owns:

- application of the `0.68` semantic fallback threshold;
- combination of lexical, semantic, and freshness contributions;
- descending score ordering;
- stable input-order tie handling;
- document-ID return formatting.

`SPEC-004` continues to own any post-ranking per-source cap or diversity transformation. No diversity behavior is changed by this revision.

## 7. Interfaces, Data, and Invariants

The public ranking entry remains:

```text
rank_documents(documents, intent_threshold=0.68) -> list[str]
```

The existing entry shape and returned type remain stable. No new public parameter or return field is introduced. The existing `Document` data shape remains sufficient because phrase evidence is incorporated into `lexical_score` before ranking.

Invariants:

1. Complete-query phrase evidence contributes only through the lexical signal.
2. The phrase bonus is deterministic for the same query and document inputs.
3. The phrase bonus is bounded and cannot grow without limit as a result of repeated matching.
4. Ordinary lexical evidence remains part of the effective lexical score.
5. Semantic evidence contributes only when `intent_score >= 0.68`.
6. Freshness continues to use its existing score and `0.1` weight.
7. The lexical, semantic, and freshness weights remain `0.7`, `0.2`, and `0.1`.
8. Equal final scores preserve original input order.
9. The ranker returns document IDs only.
10. Relevance scoring runs before any independent source-diversity policy.

## 8. Options And Decision

### Option A: Add a bounded phrase bonus to `lexical_score`

The lexical-score producer adds a fixed-policy, bounded bonus for a deterministic complete-query phrase match. The ranker and public data shape remain unchanged.

**Decision: Adopt.**

This is the smallest design that expresses phrase precedence without adding a public parameter, changing the return structure, or introducing an implicit phrase channel into `rank_documents`.

### Option B: Add a phrase-match field to `Document`

The ranker would receive separate phrase evidence and calculate the bonus internally.

**Decision: Reject.**

It changes the public data shape and creates a new ranking input despite the requirement to keep the public entry contract unchanged.

### Option C: Add an internal phrase-state mapping or strategy object

Phrase state would be supplied through an additional internal channel while leaving `Document` fields unchanged.

**Decision: Reject.**

The current implementation has no query-context channel for such a mapping. This would add hidden coupling and complexity without improving the public contract.

## 9. Acceptance Criteria

- A complete-query phrase match outranks an otherwise comparable ordinary word-term match.
- A phrase match does not require a new public parameter.
- The phrase bonus is bounded and deterministic.
- Ordinary lexical evidence remains active for all documents.
- An `intent_score` of `0.67` contributes no semantic score under the default policy.
- An `intent_score` of `0.68` contributes semantic score under the default policy.
- A semantic-only result cannot displace stronger phrase lexical evidence solely because the semantic score is high.
- Freshness continues to participate with its current rule and weight.
- The public ranking entry and `list[str]` return structure remain unchanged.
- Equal final scores remain ordered by original input order.
- Source-diversity behavior remains unchanged and continues to be applied after relevance ranking.

## 10. Verification

Unit tests must cover:

- complete-query phrase match versus ordinary word-term match;
- bounded phrase bonus behavior;
- repeated or otherwise non-complete phrase text not receiving the complete-phrase bonus;
- intent score below the new threshold;
- intent score exactly at `0.68`;
- semantic contribution preserving phrase lexical precedence;
- unchanged freshness contribution;
- stable input-order ordering for equal scores;
- unchanged document-ID return structure.

The full Python test suite must run after implementation. The source diff must confirm that no diversity or freshness policy was changed.

## 11. Migration And Cleanup

No persisted data migration is required.

The lexical-score producer and ranking service must be deployed with the same phrase-bonus policy and the new default semantic threshold so that score interpretation remains consistent across the request path.

Any obsolete documentation or test language describing `0.62` as the active threshold must be updated. No compatibility alias or parallel scoring path is required because the change is to the active relevance policy and no external stored format changes.

## 12. Rollback

Rollback restores:

- the previous bounded phrase-score policy, if deployed independently;
- the previous semantic fallback default of `0.62`;
- the prior service build and associated tests.

Rollback does not require data repair because scores are computed at ranking time and no ranking state is persisted.

## 13. Evidence

Current evidence:

- `src/ranking.py` defines the stable ranking entry, score weights, threshold gate, and stable tie ordering.
- `tests/test_ranking.py` covers exact lexical precedence and threshold rejection below the current `0.62` boundary.
- `hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md` owns lexical, semantic, and freshness relevance scoring.
- `hello-scholar/specs/search-ranking/SPEC-004-result-diversity/spec.md` excludes lexical, phrase, semantic, and freshness weights.

Revision 3 adds required evidence for phrase precedence, the `0.68` threshold boundary, unchanged freshness behavior, and stable ties.

## 14. Revision History

- Revision 1: lexical and freshness scoring.
- Revision 2: bounded semantic intent fallback at threshold `0.62`.
- Revision 3 (draft): add a deterministic bounded complete-query phrase bonus within lexical scoring and raise the semantic fallback threshold to `0.68`; preserve the public ranking entry, return structure, freshness rule, source-diversity policy, and stable tie behavior.
```

这是完整修订稿的整份审核版本，尚未写入 `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`。当前停在整份 Spec 审核，不会提前标记为 accepted，也不会创建 Plan、Tasks 或修改代码。

needs input: 请审核并明确接受或要求修改上述完整 revision 3 草案。
