`manage-specs` 结论：

- **分类：** `Update Existing Spec`
- **Owner：** `SPEC-001`
- **Canonical path：** `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v4-20260811b/hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`
- **依据：** 本次变更仍属于同一搜索 relevance 能力与生命周期；只调整 lexical/semantic/freshness 评分契约，不替换存储、协议或生命周期边界。`SPEC-004` 明确不拥有 lexical、phrase、semantic 或 freshness 权重，因此不应修改。
- **确认状态：** 用户已选择 bounded phrase bonus 方案；以下为等待整份审核的完整 `revision: 3` draft。
- **项目状态：** `hello-scholar docs check` 在目标工作区通过，Indexes current；仅有现有 Plan/Tasks 缺失 notices。本轮未写入任何文件，Git 工作区保持干净。

# 完整修订稿

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
summary: Rank exact terms and semantic matches through one stable scoring contract
created: 2026-06-10
updated: 2026-08-11
supersedes: []
superseded_by: null
---
# Intent-aware Search Ranking

## 1. Problem

Keyword-only ranking misses semantically relevant documents, while unconstrained semantic matches can outrank exact query terms. Complete-query phrase matches also need a deterministic lexical advantage over ordinary term matches without changing the public ranking entry or return structure.

## 2. Goals

Own the relevance weights and deterministic lexical phrase bonus behind `rank_documents`.

The revised contract must:

- give a complete-query phrase match a bounded deterministic lexical bonus over ordinary term matching;
- raise the semantic fallback threshold from `0.62` to `0.68`;
- continue including ordinary lexical, semantic intent, and freshness signals in the existing score;
- preserve the stable public ranking entry, return type, and input-order tie behavior.

## 3. Non-goals

Result diversity and pagination are owned elsewhere.

This revision does not:

- change the public ranking entry or add public parameters;
- change the returned document-ID structure;
- replace the combined score with a semantic-only ranker;
- introduce a new diversity policy;
- change freshness scoring or freshness weight;
- change source caps or post-ranking diversity behavior;
- persist phrase-match or semantic-derived ranking data.

## 4. Current State

Revision 2 uses the existing relevance score with a bounded semantic intent fallback. The fallback contributes `intent_score` only when `intent_score &gt;= 0.62`; otherwise its contribution is zero.

The current score is:

```text
lexical_score * 0.7
+ semantic_score * 0.2
+ freshness_score * 0.1
```

Revision 3 retains this ordinary score, adds a deterministic bonus of `0.15` for a complete-query phrase match, and activates semantic fallback only when `intent_score &gt;= 0.68`.

The phrase-match result is derived internally from the complete query phrase. It is not a new public argument, public return field, or persisted data field.

## 5. Target Design

For each document, the ranking service first determines whether the document has a deterministic lexical match for the complete query phrase.

Let:

```text
phrase_bonus = 0.15 if the complete query phrase matches
               0.00 otherwise
```

The semantic component is:

```text
semantic_component = intent_score if intent_score &gt;= 0.68
                     0.00 otherwise
```

The final score is:

```text
lexical_score * 0.7
+ semantic_component * 0.2
+ freshness_score * 0.1
+ phrase_bonus
```

The phrase bonus is bounded to `[0.00, 0.15]` per document and is applied once per document, regardless of the number of occurrences of the phrase.

A complete-query phrase match therefore receives a strict lexical advantage over an otherwise equivalent ordinary-term match with the same `lexical_score`, `intent_score`, and `freshness_score`. Ordinary lexical, semantic, and freshness signals continue to determine ordering when their combined score differences outweigh the bounded bonus; this revision does not introduce a separate lexicographic ranking tier.

Scores are sorted in descending order. Exact score ties retain stable input order.

## 6. Implementation Boundary

Only relevance scoring and its configuration belong to this Spec.

The implementation may derive the complete-query phrase-match flag inside the existing lexical evaluation path, but it must not expose a new public parameter or alter the public result shape.

The implementation must:

- replace the semantic fallback boundary `0.62` with `0.68`;
- compute the complete-query phrase-match predicate deterministically;
- add at most one `0.15` bonus to the document score;
- preserve the existing ordinary lexical, semantic, and freshness terms;
- preserve stable input-order tie resolution.

The implementation must not modify the independent post-ranking source-diversity stage owned by `SPEC-004`.

## 7. Interfaces And Data

`rank_documents(query, documents, policy)` returns document IDs ordered by descending score and stable input order for ties.

The public function signature, accepted input contract, and return structure remain unchanged.

The phrase-match indicator is internal ranking state only. It is not a public parameter, returned field, persisted field, or separate ranking result.

The existing lexical, intent, and freshness inputs remain the score inputs. The phrase bonus is a derived internal component of the relevance score.

## 8. Invariants And Constraints

- The public function and return type remain stable.
- Scores are deterministic for the same inputs.
- A complete-query phrase match contributes exactly `0.15`; a non-match contributes `0.00`.
- No document receives more than one phrase bonus.
- Semantic intent contributes only when `intent_score &gt;= 0.68`.
- An `intent_score &lt; 0.68` contributes zero semantic score.
- Ordinary lexical scoring remains weighted by `0.7`.
- Semantic scoring remains weighted by `0.2` after thresholding.
- Freshness scoring remains weighted by `0.1`.
- Freshness rules and values are unchanged.
- Exact score ties retain original input order.
- Relevance scoring completes before the independent source-diversity policy is applied.
- The phrase bonus cannot create a new public configuration surface.

## 9. Options And Decision

The approved approach is a bounded phrase bonus added to the existing combined relevance score.

A separate lexicographic phrase-priority tier was not selected because it would replace the current weighted-score comparison with a new precedence rule and could allow phrase presence to override ordinary semantic and freshness differences regardless of magnitude.

A configurable public bonus was not selected because it would change the stable public interface and create a new caller-visible policy surface.

The fixed internal bonus preserves the existing score model, keeps the change local to relevance scoring, and provides a deterministic phrase advantage without changing the public contract.

## 10. Acceptance Criteria

- A document with a complete-query phrase match scores strictly above an otherwise identical document without that phrase match because the former receives `0.15` and the latter receives `0.00`.
- A phrase match contributes no more than one `0.15` bonus even when the phrase occurs multiple times.
- A document with `intent_score = 0.67` receives no semantic contribution.
- A document with `intent_score = 0.68` receives its semantic contribution.
- Existing ordinary lexical, semantic, and freshness terms remain present with weights `0.7`, `0.2`, and `0.1`.
- Freshness does not change the relative score formula or its rule set.
- Equal final scores retain input order.
- The public ranking entry and returned document-ID structure remain unchanged.
- Relevance ranking still precedes the independent source-diversity stage.

## 11. Verification

Unit tests must cover:

- complete-query phrase match versus ordinary term match;
- the single-application and `0.15` upper bound of the phrase bonus;
- semantic fallback just below the new threshold (`0.67`);
- semantic fallback exactly at the new threshold (`0.68`);
- continued lexical, semantic, and freshness contribution;
- freshness behavior remaining unchanged;
- stable input-order behavior for equal final scores;
- unchanged public entry and returned document-ID structure;
- separation from the post-ranking source-diversity policy.

A focused score-boundary test must verify that the selected phrase bonus is applied as a numeric component of the existing score rather than as a separate ordering tier.

## 12. Migration And Cleanup

The threshold and fixed phrase-bonus value are deployed with the ranking service configuration or implementation.

No stored data migration exists because phrase matching and semantic fallback are computed during ranking.

No public caller migration is required because the ranking entry and return structure remain unchanged.

Any obsolete `0.62` threshold references in the active relevance implementation and its normative tests must be replaced with `0.68`. Historical Revision History text may retain the prior value as historical evidence.

## 13. Rollback

Restore the previous weight values and service build, including:

- remove the `0.15` phrase bonus;
- restore the semantic fallback threshold to `0.62`;
- retain the previous public interface and return structure.

Rollback does not require data migration.

## 14. Evidence

`src/ranking.py`, `tests/test_ranking.py`, `hello-scholar/architecture.md`, and the current search-ranking Spec Index establish the existing relevance boundary, score formula, stable ordering behavior, and independent diversity ownership.

Revision 3 is based on the approved design decision that complete-query phrase matching is a deterministic bounded lexical bonus, with no new public parameter and no changes to semantic, freshness, diversity, or return-shape contracts.

## 15. Revision History

- Revision 1: lexical and freshness scoring.
- Revision 2: bounded semantic intent fallback at threshold `0.62`.
- Revision 3: add a fixed `0.15` complete-query phrase bonus within the existing relevance score and raise the semantic fallback threshold to `0.68`, while preserving the public interface, return structure, freshness rules, stable ties, and independent diversity policy.
```

这是完整修订稿的整份审核停止点。当前仍未写入 Spec；在你明确接受这份精确 revision 前，不会修改文件、运行 `docs sync`、创建 Plan/Tasks 或开始实现。
