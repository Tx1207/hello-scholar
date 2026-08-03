# Base-to-final Tree Evidence

- Base commit: `1d410a8aa9d0085f5156747e8b92ba2720a6f105`
- Final `HEAD`: `1d410a8aa9d0085f5156747e8b92ba2720a6f105`

## Committed diff: `base..HEAD`

No output.

## Index diff: `HEAD..index`

No output.

## Working-tree diff: `index..working tree`

```diff
diff --git a/hello-scholar/specs/INDEX.md b/hello-scholar/specs/INDEX.md
index 26ed405..3b63d1d 100644
--- a/hello-scholar/specs/INDEX.md
+++ b/hello-scholar/specs/INDEX.md
@@ -3,5 +3,5 @@
 
 | Topic | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
-| relevance-ranking | [SPEC-006](relevance-ranking/SPEC-006-confidence-aware-reranking/spec.md) | system-design | accepted | 2 | Missing | Missing | - | Blend lexical and feature scores according to deterministic query confidence |
+| relevance-ranking | [SPEC-006](relevance-ranking/SPEC-006-confidence-aware-reranking/spec.md) | system-design | accepted | 3 | Missing | Missing | - | Blend lexical and feature scores according to deterministic query confidence |
 | relevance-ranking | [SPEC-014](relevance-ranking/SPEC-014-feature-snapshot-freshness/spec.md) | capability | accepted | 1 | Missing | Missing | - | Reject feature snapshots older than the configured publication window |
diff --git a/hello-scholar/specs/relevance-ranking/INDEX.md b/hello-scholar/specs/relevance-ranking/INDEX.md
index a6b0521..bc796db 100644
--- a/hello-scholar/specs/relevance-ranking/INDEX.md
+++ b/hello-scholar/specs/relevance-ranking/INDEX.md
@@ -3,5 +3,5 @@
 
 | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary | Relations |
 | --- | --- | --- | --- | --- | --- | --- | --- | --- |
-| [SPEC-006](SPEC-006-confidence-aware-reranking/spec.md) | system-design | accepted | 2 | Missing | Missing | - | Blend lexical and feature scores according to deterministic query confidence | - |
+| [SPEC-006](SPEC-006-confidence-aware-reranking/spec.md) | system-design | accepted | 3 | Missing | Missing | - | Blend lexical and feature scores according to deterministic query confidence | - |
 | [SPEC-014](SPEC-014-feature-snapshot-freshness/spec.md) | capability | accepted | 1 | Missing | Missing | - | Reject feature snapshots older than the configured publication window | - |
diff --git a/hello-scholar/specs/relevance-ranking/SPEC-006-confidence-aware-reranking/spec.md b/hello-scholar/specs/relevance-ranking/SPEC-006-confidence-aware-reranking/spec.md
index 847007e..48fbc8e 100644
--- a/hello-scholar/specs/relevance-ranking/SPEC-006-confidence-aware-reranking/spec.md
+++ b/hello-scholar/specs/relevance-ranking/SPEC-006-confidence-aware-reranking/spec.md
@@ -6,10 +6,10 @@ title: Confidence-aware relevance reranking
 title: Confidence-aware relevance reranking
 topic: relevance-ranking
 type: system-design
 status: accepted
-revision: 2
+revision: 3
 summary: Blend lexical and feature scores according to deterministic query confidence
 created: 2026-06-04
-updated: 2026-07-16
+updated: 2026-08-02
 supersedes: []
 superseded_by: null
 ---
@@ -17,61 +17,75 @@ superseded_by: null
 
 ## 1. Problem
 
-The same blend is not appropriate for both precise and ambiguous queries.
+低置信度短查询使用 lexical fallback。候选 lexical score 完全相同时，现有排序以传入候选的位置打破并列，因此同一候选集合以不同输入排列传入时，结果顺序可能变化。
 
 ## 2. Goals
 
-Own query confidence, score blending, and low-confidence fallback behavior.
+在不改变公开调用接口的前提下，使低置信度路径对相同候选 ID 与分数集合产生可复现的排序，并保留当前高置信度路径。
 
## 3. Non-goals

-Feature snapshot refresh and candidate retrieval are separate concerns.
+本 Spec 不调整 candidate retrieval、query-confidence 的上游估计、feature snapshot freshness、分数归一化或排序模型。

## 4. Current State

-Confidence below 0.45 uses lexical score only; higher confidence uses a fixed lexical/feature blend.
+confidence 小于 0.45 时仅使用 `lexical_score`；否则使用 `lexical_score * 0.65 + feature_score * 0.35`。当前并列候选按输入位置维持原顺序。

## 5. Target Design

-Confidence selects one of two deterministic scoring paths with stable ties.
+confidence 小于 0.45 时，先按 lexical score 降序排序；lexical score 完全相同时，再按 `candidate_id` 升序排序。该次级规则不使用 feature score，不设近似同分阈值。
+
+confidence 大于或等于 0.45 时，继续使用现有 lexical/feature 固定混合与既有并列行为。

## 6. Implementation Boundary

-Confidence estimation and blending inside `RankingPipeline`.
+变更仅属于 `RankingPipeline` 内的低置信度 lexical fallback 排序规则。公开方法 `rank(candidates, confidence) -> list[str]` 保持不变。

## 7. Interfaces And Data

-`rank(query, candidates)` returns candidate IDs ordered by final score.
+`Candidate` 继续包含 `candidate_id`、`lexical_score` 与 `feature_score`。低置信度路径将 `candidate_id` 作为 lexical score 完全相等时的确定性次级排序键。

## 8. Invariants And Constraints

-The public return type is stable and identical inputs produce identical ordering.
+- 相同候选 ID、lexical score、feature score 与 confidence 的集合，无论候选输入排列如何，低置信度结果均一致。
+- 低置信度路径只以 lexical evidence 决定主排序。
+- `candidate_id` 仅用于 lexical score 完全相等时的次级排序。
+- 高置信度混合公式、阈值 0.45、公开接口和返回类型不变。
+- feature freshness 继续由 `SPEC-014` 独立拥有，不能成为本次排序条件。

## 9. Options And Decision

-Adopt a bounded two-path blend rather than an external model call.
+采用确定性 `candidate_id` 次级排序。
+
+未采用近似同分分桶：它需要新增桶宽合同，并会改变 lexical score 不完全相等的排序。
+
+未采用低置信度 feature 次级权重：它违反当前 lexical-only fallback，并在 confidence 已低时重新引入不可靠 feature 信号。

## 10. Acceptance Criteria

-High-confidence queries use both scores; low-confidence queries fail back to lexical evidence.
+- confidence 小于 0.45 且 lexical score 不同时，结果按 lexical score 降序。
+- confidence 小于 0.45 且 lexical score 相同时，结果按 `candidate_id` 升序，且不依赖输入排列。
+- confidence 大于或等于 0.45 时，现有混合排序结果保持不变。
+- `rank` 的参数和返回类型保持不变。

## 11. Verification

-Unit tests cover both confidence paths and stable ties.
+覆盖低置信度的 lexical 主排序、相同 lexical score 的 `candidate_id` 次级排序、候选输入排列互换后的相同输出，以及高置信度现有 feature 混合路径回归。

## 12. Migration And Cleanup

-No persisted data migration.
+无持久化数据、接口调用方或 feature snapshot 合同迁移。

## 13. Rollback

-Restore the previous thresholds and build.
+恢复低置信度并列时按输入位置保序的规则；不影响高置信度路径。

## 14. Evidence

-`tests/test_pipeline.py`.
+`src/pipeline.py`、`tests/test_pipeline.py` 与 `hello-scholar/architecture.md`。

## 15. Revision History

 - Revision 1: fixed lexical/feature blend.
 - Revision 2: deterministic confidence threshold and lexical fallback.
+- Revision 3: low-confidence lexical ties use `candidate_id` for input-order-independent results.
```

## Untracked files

No output.

## Final tracked and untracked file hashes

```text
625300ec41571789cbe805881bf30671e08c5b7c34179c09ad5dc4a7ee3ef202  AGENTS.md
4484cf32de9fe1500f01862a845fa11559d707799adce24df4ee766024cce2f1  hello-scholar/architecture.md
cbf66d1baa096d865e5737d756f9924e21b92ee576e453ce310b90a29773338d  hello-scholar/specs/INDEX.md
8fecfef6af9e085a3fb74ba6619359392b2aa89140c206a534e7af6a9db49494  hello-scholar/specs/relevance-ranking/INDEX.md
ce7c05602115a7c92a568e10e381352168e9506735aac7b7ae9f8bbed25efc7e  hello-scholar/specs/relevance-ranking/SPEC-006-confidence-aware-reranking/spec.md
cde5e1d94bddfaf3bbfaae8c5e31979b748bd37ddff0a9bba01e979155fabac9  hello-scholar/specs/relevance-ranking/SPEC-014-feature-snapshot-freshness/spec.md
cbe59cd4efcfe2a63926dd5a27dd416c37d47ca2369495487cb571bdf11f0826  src/pipeline.py
9dddb353f4e9510eccc0c9aa54f02326b3620236dd192b11a304aacfe748917a  tests/test_pipeline.py
```
