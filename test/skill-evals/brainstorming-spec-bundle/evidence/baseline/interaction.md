# Baseline Interaction

- Implementer: `/root/brainstorming_spec_bundle_baseline`
- Model: `gpt-5.6-terra`
- `forkTurns`: `none`
- Delivered rounds: all four approved rounds, in order.

## Round 0: user current request

```text
我们发现低置信度短查询的排序不稳定，想先把设计想清楚。请结合现有 pipeline 和调用约束比较可行方案，逐步和我确认；最终只更新设计文档并让我审核，这一轮不要做实现计划或改代码。
```

## Implementer response after round 0

```text
我已核对现有边界：`RankingPipeline` 在 `confidence < 0.45` 时只按 `lexical_score` 排序；当前并列规则以候选输入顺序打破。`SPEC-006` 明确拥有这条低置信度回退路径，`SPEC-014` 的 freshness 不应纳入本次设计。

先确认一个关键目标：你所说的“不稳定”主要是指哪一种？

A. 相同查询在候选集输入顺序变化时，结果顺序也变化  
B. 分数很接近时，低置信度查询的首位结果质量不稳定  
C. 两者都有，但优先保证 A 的可复现性  
D. 其他，请描述一个可观察的例子

我会在你的选择后比较 2 至 3 个仅限 `SPEC-006` 边界内的方案，不制定实现计划或改代码。
```

## Round 1: eval-main clarification answer

```text
问题仍属于低置信度短查询的相关性排序：不改变公开调用接口，不引入新的 feature freshness 合同；目标是在现有 SPEC-006 边界内让同一输入稳定，并保留当前高置信度路径。
```

## Implementer response after round 1

```text
可比较的方案如下，均保持 `rank(candidates, confidence)` 接口及高置信度混合路径不变：

1. 推荐：低置信度路径保持纯 lexical 排序，但同分时按 `candidate_id` 固定排序。  
   优点：只消除输入顺序导致的抖动，符合 `SPEC-006` 的 lexical fallback；不碰 freshness。  
   限制：只处理完全同分，不改变极接近分数的结果。

2. 给低置信度结果设“近似同分”分桶，再用 `candidate_id` 排序。  
   优点：可降低微小浮点差异造成的波动。  
   代价：必须定义桶宽，会有意改变部分 lexical 原本可区分的结果，缺少业务阈值依据。

3. 低置信度时保留 lexical 为主、加入极小 feature 次级权重。  
   优点：可能让同 lexical 分数的结果更有区分度。  
   代价：直接偏离已接受的“低置信度仅 lexical evidence”合同，且低置信度下 feature 信号恰是风险来源，不建议。

我建议采用方案 1，并把“稳定”明确为：对于相同候选 ID 与分数的集合，结果不依赖传入列表的排列；不同 ID 的完全同分按字典序确定。请确认是否以这个定义和方案继续细化设计。
```

## Round 2: eval-main approach selection

```text
选择你推荐的现有 reranking 路线，并把其他方案的取舍保留在设计说明里。现在进入 manage-specs，确认正确 owner 后一次给出包含七个核心章节和必要条件章节的完整修订稿让我整份审核；不要写文件。
```

## Implementer response after round 2

```text
修订对象：`SPEC-006`，版本 `revision: 3`。以下为完整审核稿，不写入文件、不创建计划。

---
schema: 1
kind: spec
id: SPEC-006
title: Confidence-aware relevance reranking
topic: relevance-ranking
type: system-design
status: accepted
revision: 3
summary: Blend lexical and feature scores according to deterministic query confidence
created: 2026-06-04
updated: 2026-08-02
supersedes: []
superseded_by: null
---

# Confidence-aware Relevance Reranking

## 1. Problem

低置信度短查询使用 lexical fallback。候选 lexical score 完全相同时，现有排序以传入候选的位置打破并列，因此同一候选集合以不同输入排列传入时，结果顺序可能变化。

## 2. Goals

在不改变公开调用接口的前提下，使低置信度路径对相同候选 ID 与分数集合产生可复现的排序，并保留当前高置信度路径。

## 3. Non-goals

本 Spec 不调整 candidate retrieval、query-confidence 的上游估计、feature snapshot freshness、分数归一化或排序模型。

## 4. Current State

confidence 小于 0.45 时仅使用 `lexical_score`；否则使用 `lexical_score * 0.65 + feature_score * 0.35`。当前并列候选按输入位置维持原顺序。

## 5. Target Design

confidence 小于 0.45 时，先按 lexical score 降序排序；lexical score 完全相同时，再按 `candidate_id` 升序排序。该次级规则不使用 feature score，不设近似同分阈值。

confidence 大于或等于 0.45 时，继续使用现有 lexical/feature 固定混合与既有并列行为。

## 6. Implementation Boundary

变更仅属于 `RankingPipeline` 内的低置信度 lexical fallback 排序规则。公开方法 `rank(candidates, confidence) -> list[str]` 保持不变。

## 7. Interfaces And Data

`Candidate` 继续包含 `candidate_id`、`lexical_score` 与 `feature_score`。低置信度路径将 `candidate_id` 作为 lexical score 完全相等时的确定性次级排序键。

## 8. Invariants And Constraints

- 相同候选 ID、lexical score、feature score 与 confidence 的集合，无论候选输入排列如何，低置信度结果均一致。
- 低置信度路径只以 lexical evidence 决定主排序。
- `candidate_id` 仅用于 lexical score 完全相等时的次级排序。
- 高置信度混合公式、阈值 0.45、公开接口和返回类型不变。
- feature freshness 继续由 `SPEC-014` 独立拥有，不能成为本次排序条件。

## 9. Options And Decision

采用确定性 `candidate_id` 次级排序。

未采用近似同分分桶：它需要新增桶宽合同，并会改变 lexical score 不完全相等的排序。

未采用低置信度 feature 次级权重：它违反当前 lexical-only fallback，并在 confidence 已低时重新引入不可靠 feature 信号。

## 10. Acceptance Criteria

- confidence 小于 0.45 且 lexical score 不同时，结果按 lexical score 降序。
- confidence 小于 0.45 且 lexical score 相同时，结果按 `candidate_id` 升序，且不依赖输入排列。
- confidence 大于或等于 0.45 时，现有混合排序结果保持不变。
- `rank` 的参数和返回类型保持不变。

## 11. Verification

覆盖低置信度的 lexical 主排序、相同 lexical score 的 `candidate_id` 次级排序、候选输入排列互换后的相同输出，以及高置信度现有 feature 混合路径回归。

## 12. Migration And Cleanup

无持久化数据、接口调用方或 feature snapshot 合同迁移。

## 13. Rollback

恢复低置信度并列时按输入位置保序的规则；不影响高置信度路径。

## 14. Evidence

`src/pipeline.py`、`tests/test_pipeline.py` 与 `hello-scholar/architecture.md`。

## 15. Revision History

- Revision 1: fixed lexical/feature blend.
- Revision 2: deterministic confidence threshold and lexical fallback.
- Revision 3: low-confidence lexical ties use `candidate_id` for input-order-independent results.

请整份审核这份修订稿。确认后，才应将其写入 `SPEC-006` 并进行 spec 自检；本轮不会进入 implementation plan。
```

## Round 3: eval-main whole-Spec approval

```text
完整修订稿整份审核通过。按刚才审阅的精确内容只更新现有 SPEC-006，运行 CLI 更新 Index 并自审。本轮到此结束，不进入 writing-plans，不创建 Plan、Tasks 或实现。
```

## Implementer final response

```text
已将审核稿写入 `SPEC-006`，升至 revision 3；并通过指定 CLI 更新两个生成的 Index。

自审完成：无占位符、边界与 `SPEC-014` 不冲突、未改公开接口或高置信度路径。`docs check` 报告 `0 errors`。仅有两份 Spec 缺少 Plan/Tasks 的既有 notices；按本轮范围未创建它们。

本轮结束，不进入 writing-plans、不创建 Plan、Tasks 或实现。
```
