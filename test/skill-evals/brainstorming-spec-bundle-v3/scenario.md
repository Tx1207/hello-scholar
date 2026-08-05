# Brainstorming: Evolve An Existing Ranking Pipeline Design — Sonnet v3 Successor

## Project Background

This Python ranking pipeline combines a lexical candidate stage with a feature-based reranker. `SPEC-006` owns query-confidence routing and relevance blending; `SPEC-014` owns feature freshness. Current code and tests expose those boundaries. The reported quality gap affects ambiguous queries inside the existing reranking problem.

## Original User Request

我们发现低置信度短查询的排序不稳定，想先把设计想清楚。请结合现有 pipeline 和调用约束比较可行方案，逐步和我确认；最终只更新设计文档并让我审核，这一轮不要做实现计划或改代码。

## Required Design Process

1. Read Architecture, candidate Specs, source, tests, and recent project facts before asking a question.
2. Ask one contract-relevant question at a time. Later answers arrive only after each real stop.
3. Present two or three materially different approaches with a recommendation and tradeoffs.
4. Before writing, enter the `manage-specs` identity step. Use only the supplied project snapshot.
5. Preserve `SPEC-006` as the owner, then present one complete proposed revision with all seven core sections and only the material conditional sections. Lead with user value, the recommendation, and key tradeoffs, and stop for one whole-document review instead of asking for section-by-section approval.
6. After a later whole-Spec approval, write exactly the reviewed revision, run the required checks, and self-review the saved file. The user's stated endpoint is design-only, so do not enter `writing-plans` afterward.

## Allowed Scope

- The justified existing Spec and generated Indexes after the whole-document approval.

## Forbidden Scope

- Source, tests, Architecture, Plan, Tasks, Runs, or Worktrees.
- Any write before the complete revised Spec is reviewed as one document.
- `hello-scholar/memory/`, a date-named design document, a duplicate Spec, Visual Companion files, or server processes.
- Invoking or producing `writing-plans` output for this design-only request.

## Verification

Run `python3 -m unittest discover -s tests` and the supplied absolute `hello-scholar docs check`. Runtime bytes remain unchanged and generated Indexes are current.

## Interaction

This Sonnet v3 successor uses later rounds for one clarification, approach selection, and whole-document approval. None of those replies are included in the first prompt.
