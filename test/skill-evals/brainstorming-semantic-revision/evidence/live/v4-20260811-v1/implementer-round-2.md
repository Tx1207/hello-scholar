已确认 `manage-specs` 分类为 **Update Existing Spec**：

- Owner：`SPEC-001`
- Canonical path：`hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`
- 依据：短语 lexical bonus 与 semantic fallback 都属于同一相关性评分能力和生命周期；`SPEC-004` 只负责 relevance ranking 之后的 source diversity，不受本次修订影响。
- `hello-scholar docs check` 已通过，errors 为 0；仅有现有的 Plan/Tasks 缺失 notices。
- 工作区保持无写入。

以下是基于当前 `SPEC-001` Revision 2 的 Baseline、以及已批准的 bounded phrase bonus 方案形成的完整 Revision 3 草稿。它仅作为整份审核稿展示，尚未写入文件。

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
summary: Rank exact query phrases, ordinary lexical terms, and semantic matches through one stable scoring contract
created: 2026-06-10
updated: 2026-08-11
supersedes: []
superseded_by: null
---

# Intent-aware Search Ranking

## 1. Problem

Keyword-only ranking misses semantically relevant documents, while unconstrained semantic matches can outrank exact query terms. The ranking contract must also distinguish a deterministic complete-query-phrase match from ordinary lexical term matching.

## 2. Goals

Own relevance weights and threshold behavior for lexical, phrase, intent, and freshness signals behind `rank_documents`.

A complete query phrase match must receive a fixed, positive, bounded lexical bonus over ordinary lexical term matching. Semantic fallback must activate only when `intent_score` is at least `0.68`.

## 3. Non-goals

Result diversity and pagination are owned elsewhere.

This revision does not change the public ranking entry, return structure, ordinary lexical scoring semantics, freshness rule, semantic weight, tie ordering, or the post-ranking source-diversity strategy.

## 4. Current State

Revision 2 added an `intent_score` fallback when lexical score is below the configured threshold, with the threshold set to `0.62`.

The current ranking input exposes a combined `lexical_score`; it does not separately represent complete-query-phrase matching. The ranking function otherwise combines lexical, semantic, and freshness components with weights `0.7`, `0.2`, and `0.1`.

## 5. Target Design

The ranking score remains the sum of lexical, semantic intent, and freshness components.

The lexical component includes the existing ordinary lexical score plus a deterministic, fixed, positive, bounded phrase bonus when the document is marked as matching the complete query phrase. The phrase bonus is applied only to complete-query-phrase matches and is not applied to ordinary term matches.

The semantic component is:

- `intent_score` when `intent_score >= 0.68`;
- `0.0` otherwise.

The freshness component and its existing weight remain unchanged.

The resulting score preserves the existing descending-score ordering. When scores tie, documents retain their stable input order.

## 6. Implementation Boundary

Only relevance scoring and its configuration belong to this Spec.

The implementation may add the minimum internal/precomputed signal needed to identify a complete query phrase match and apply the bounded phrase bonus. It must not add a public parameter to `rank_documents`.

The implementation must not modify result diversity, pagination, source caps, or any post-ranking behavior owned by `SPEC-004`.

## 7. Interfaces And Data

`rank_documents(query, documents, policy)` returns document IDs ordered by descending score and stable input order for ties. The public entry and return structure remain stable.

The ranking data must make the complete-query-phrase match available as an internal or precomputed lexical signal without requiring a new public ranking parameter.

The ordinary lexical score, phrase bonus, semantic intent score, and freshness score are combined deterministically for the same inputs and policy.

## 8. Invariants And Constraints

The public function and return type remain stable.

A complete query phrase match receives a positive bounded lexical bonus and therefore ranks above an otherwise equivalent ordinary lexical term match.

The phrase bonus does not replace ordinary lexical, semantic, or freshness signals.

Semantic fallback activates at `0.68` or above and is ignored below `0.68`.

Freshness continues to participate under its existing rule and weight.

Scores are deterministic for the same inputs.

Equal final scores preserve stable input order.

Source diversity remains a separate post-ranking concern owned by `SPEC-004`.

## 9. Options And Decision

Adopt a bounded deterministic phrase bonus within the existing relevance scorer.

The bonus is preferred over:

- merging phrase behavior invisibly into an undifferentiated `lexical_score`, because that would prevent the ranking contract and tests from distinguishing phrase matches from ordinary term matches;
- relying on hidden metadata or implicit input conventions, because the phrase signal would not have a verifiable data boundary.

The selected design preserves the public ranking entry and return structure while making the new lexical precedence explicit and testable.

## 10. Acceptance Criteria

- Complete-query-phrase matches outrank otherwise equivalent ordinary lexical term matches.
- The phrase bonus is fixed, positive, bounded, and deterministic.
- Ordinary lexical terms continue to participate in the existing lexical component.
- Semantic fallback activates when `intent_score == 0.68`.
- Semantic fallback is ignored when `intent_score < 0.68`.
- Existing semantic, lexical, and freshness relative behavior remains unchanged apart from the approved phrase bonus and threshold update.
- Equal final scores retain input order.
- The public ranking entry and return structure are unchanged.
- Source-diversity behavior remains owned by and unchanged under `SPEC-004`.

## 11. Verification

Unit tests must cover:

- complete-query-phrase versus ordinary lexical term precedence;
- ordinary lexical scoring without a phrase match;
- semantic fallback below `0.68`;
- semantic fallback at `0.68`;
- semantic fallback above `0.68`;
- freshness participation under the existing rule;
- stable input order for ties;
- unchanged public return structure.

The full Python test suite must pass after the documentation and implementation work is complete.

## 12. Migration And Cleanup

The phrase-match signal and bounded bonus are deployed with the ranking service and its ranking configuration.

The semantic fallback threshold changes from `0.62` to `0.68`.

No stored data migration exists. Existing callers continue using the stable public ranking entry and return structure.

## 13. Rollback

Restore the previous ranking implementation and configuration, including the semantic fallback threshold of `0.62`, and remove the phrase-bonus behavior.

## 14. Evidence

`src/ranking.py`, `tests/test_ranking.py`, current production ranking configuration, and the `SPEC-004` boundary confirming that diversity is applied after relevance ranking.

## 15. Revision History

- Revision 1: lexical and freshness scoring.
- Revision 2: bounded semantic intent fallback at threshold `0.62`.
- Revision 3: add a bounded deterministic complete-query-phrase lexical bonus and raise the semantic fallback threshold to `0.68` while preserving the public ranking entry, return structure, freshness rule, diversity boundary, and stable tie ordering.
```

请对以上 **完整 Revision 3 草稿**进行整份审核并明确接受或提出修改；在收到明确接受前，我不会写入 Spec、运行 `docs sync`、创建 Plan/Tasks 或开始实现。

needs input: 请审核并明确接受或修改以上 `SPEC-001` Revision 3 完整草稿。
