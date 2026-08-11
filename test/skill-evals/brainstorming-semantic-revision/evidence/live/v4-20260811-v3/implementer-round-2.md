## `manage-specs` 分类结果

**分类：`Update Existing Spec`**

**Owner：** `SPEC-001` — `Intent-aware search ranking`  
**Canonical path：** `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v3-20260811b/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`

**依据：**

- 请求仍属于同一问题：在稳定的 `rank_documents` 相关性评分合同内调整 lexical 与 semantic 的相对行为。
- 短语完全匹配、普通词项匹配、semantic 和 freshness 共享同一相关性生命周期，可共同批准、实施、验证和回滚。
- `SPEC-004` 只拥有相关性排序后的 source diversity，且明确不拥有 lexical、phrase、semantic 或 freshness 权重。
- 本次不是替换存储、协议或生命周期边界，因此不创建 successor Spec。

以下是**不写入文件的完整修订稿**。修订号拟升至 `3`，状态保持 `draft`，等待整份文件审核。

---

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
summary: Rank phrase, term, and semantic matches through one stable scoring contract while preserving freshness and deterministic ordering
created: 2026-06-10
updated: 2026-08-10
supersedes: []
superseded_by: null
---

# Intent-aware Search Ranking

## 1. Problem

Keyword-only ranking can miss semantically relevant documents, while unconstrained semantic matches can outrank lexical matches that more directly satisfy the query.

The ranking contract must now distinguish a deterministic complete-query-phrase match from an ordinary term match. A complete phrase match should receive a bounded lexical bonus, while semantic fallback should be used only when its score meets the revised threshold.

## 2. Goals

This Spec owns relevance weights and deterministic relevance ordering behind the stable `rank_documents` entry.

The revision has two goals:

1. Give a deterministic complete-query-phrase lexical match a bounded bonus over an otherwise comparable ordinary term match.
2. Raise the semantic fallback threshold from `0.62` to `0.68`.

Ordinary term matching, semantic matching, and freshness continue to contribute through the existing scoring contract.

## 3. Non-goals

This Spec does not change:

- the public ranking entry;
- the returned document-ID structure;
- the stable input-order rule for score ties;
- the freshness signal or its weight;
- result diversity, source caps, or pagination;
- query parsing beyond the deterministic phrase-match signal required to produce the lexical score;
- the semantic model or its score-generation method;
- stored data or persistence formats.

Result diversity remains owned by `SPEC-004`.

## 4. Current State

Revision 2 uses a bounded semantic fallback when the intent score is at least `0.62` and the lexical score is below the configured threshold.

The current implementation combines:

- lexical score with weight `0.7`;
- semantic intent score with weight `0.2`;
- freshness score with weight `0.1`.

The current implementation exposes `rank_documents(documents, intent_threshold=0.62)` and returns document IDs ordered by descending score, preserving input order for ties.

The current `Document` data used by the repository contains `lexical_score`, `intent_score`, and `freshness_score`. There is no separate public phrase-match parameter or return field.

## 5. Target Design

The ranking score remains:

```text
total_score =
    lexical_component * 0.7
    + semantic_component * 0.2
    + freshness_score * 0.1
```

The lexical component is produced from the existing lexical score and a deterministic complete-query-phrase bonus:

```text
lexical_component =
    base_lexical_score + phrase_bonus
```

The phrase bonus is bounded:

```text
phrase_bonus =
    0.15 when the complete normalized query phrase matches deterministically
    0.00 otherwise
```

The phrase bonus must not exceed `0.15`. It is applied only for a complete phrase match, not for partial phrase matches, fuzzy matches, semantic similarity, or isolated ordinary terms. The phrase-match decision uses the existing lexical normalization and matching semantics; it does not introduce a new public parameter.

The bounded bonus makes a complete phrase match rank above an otherwise comparable ordinary term match while retaining the existing lexical, semantic, and freshness components. It is not an absolute override: a materially stronger ordinary lexical, semantic, or freshness score may still determine the final order according to the existing weighted score.

Semantic fallback remains bounded and changes only its activation threshold:

```text
semantic_component =
    intent_score when intent_score &gt;= 0.68
    0.00 otherwise
```

The ranking process remains deterministic. Documents are sorted by descending `total_score`, followed by their original input position for ties.

## 6. Interfaces And Data

The stable public ranking entry and return structure remain unchanged.

The effective interface remains:

```text
rank_documents(documents, intent_threshold=0.68) -&gt; list[str]
```

The default threshold changes from `0.62` to `0.68`; callers do not need to provide a new parameter.

No public phrase-match parameter, return field, or document-ID structure is added. The phrase bonus is part of the lexical scoring signal consumed by the ranking contract.

For the same document inputs and the same lexical, intent, and freshness signals, ranking produces the same ordered document IDs.

## 7. Invariants And Constraints

The following invariants remain in force:

1. The public ranking entry remains stable.
2. The return value remains a list of document IDs.
3. Scores are deterministic for the same inputs.
4. Stable input order resolves equal final scores.
5. Freshness continues to contribute at weight `0.1`.
6. Semantic intent contributes at weight `0.2` only when its score is at least `0.68`.
7. Lexical relevance remains the strongest weighted signal at weight `0.7`.
8. The complete-query-phrase bonus is deterministic and bounded to `[0.00, 0.15]`.
9. Ordinary term, semantic, and freshness signals are not removed when the phrase bonus is present.
10. Result diversity is applied after relevance ranking and remains governed by `SPEC-004`.

A phrase match must not create a new public compatibility surface or alter the returned result shape.

## 8. Options And Decision

### Option A: Fold the bounded phrase bonus into the existing lexical component

The lexical producer marks a complete normalized query phrase deterministically and adds the bounded `0.15` bonus to the existing lexical score before the score is weighted.

**Decision:** Adopt this option.

**Reason:** It preserves the public entry, `Document` shape, return structure, score formula, and ownership boundary. It keeps phrase semantics within lexical relevance instead of adding query interpretation or hidden state to the ranking layer.

### Option B: Add a separate phrase-match field to `Document`

The ranking layer would receive and score a new phrase-match field.

**Rejected:** This expands the data interface and introduces a new field despite the requirement not to add a public parameter. It also moves lexical phrase recognition into the ranking module, which currently owns score combination rather than query parsing.

### Option C: Add hidden policy or module-level phrase configuration

The ranking layer would obtain phrase-match behavior through hidden context or a new policy abstraction.

**Rejected:** Hidden inputs weaken determinism and add lifecycle and test-isolation complexity without an existing project mechanism that requires such an abstraction.

## 9. Acceptance Criteria

The revision is accepted for implementation when all of the following are true:

1. A deterministic complete-query-phrase match receives exactly the bounded `0.15` lexical bonus.
2. A document without a complete phrase match receives no phrase bonus.
3. Partial, fuzzy, semantic-only, and ordinary term matches do not receive the phrase bonus.
4. For otherwise comparable lexical matches, the complete phrase match ranks above the ordinary term match.
5. Ordinary lexical scoring remains active.
6. Semantic fallback is ignored below `0.68` and active at or above `0.68`.
7. Freshness remains weighted at `0.1`.
8. The public ranking entry and returned document-ID structure remain unchanged.
9. Equal final scores preserve stable input order.
10. Result diversity behavior remains unchanged because it continues to run after relevance ranking under `SPEC-004`.

## 10. Verification

Unit tests must cover:

- complete phrase match versus ordinary term match;
- no bonus for partial phrase matches;
- the exact semantic threshold boundary at `0.68`;
- semantic scores just below and above the threshold;
- unchanged freshness contribution;
- phrase, semantic, and freshness signals contributing together;
- stable input order for equal final scores;
- unchanged public return structure.

The full Python test suite must run after the Spec-driven implementation work. Static review must confirm that the public entry, return structure, diversity behavior, and freshness rule were not changed.

## 11. Migration And Cleanup

No stored data migration is required.

The default semantic threshold is deployed with the ranking service. The lexical scoring producer and ranking tests must use the bounded phrase-bonus contract.

No compatibility shim, alternate public entry, or parallel result format is required.

## 12. Rollback

Rollback restores:

- the previous semantic fallback threshold of `0.62`;
- the previous lexical scoring behavior without the phrase bonus;
- the previous service build and associated configuration.

Rollback does not require a data migration.

## 13. Evidence

Current evidence includes:

- `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v3-20260811b/src/ranking.py`;
- `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v3-20260811b/tests/test_ranking.py`;
- `SPEC-001` revision 2;
- `SPEC-004` revision 1;
- `hello-scholar/architecture.md`.

Implementation evidence must include focused ranking tests and the full Python suite.

## 14. Revision History

- Revision 1: lexical and freshness scoring.
- Revision 2: bounded semantic intent fallback at threshold `0.62`.
- Revision 3: add a deterministic complete-query-phrase lexical bonus bounded at `0.15`, raise semantic fallback threshold to `0.68`, and preserve the public entry, return structure, freshness rule, stable tie behavior, and post-ranking source diversity boundary.
```

此稿仍未写入文件，也未创建 Plan、Tasks 或源码。请进行这份完整 Spec 修订稿的整份审核；在获得对该精确 revision 的明确接受前，我不会进入 Spec 写入或后续流程。
