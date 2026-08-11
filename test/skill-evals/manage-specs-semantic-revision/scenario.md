# Manage Specs: Reconcile an Existing Ranking Spec

## Project Background

This Python search service has one accepted intent-aware ranking Spec and one separately owned result-diversity Spec. Current code and tests expose the same ownership boundary. The ranking change is local to relevance weighting and semantic fallback; public return shape, diversity, freshness, and tie behavior remain unchanged.

## Original User Request

在开始实现前，请把设计文档更新为当前方案：短语完全匹配权重高于普通词项，语义回退阈值改成 0.68。公开 `rank_documents` 入口、返回结构、多样性边界、freshness 规则和稳定 tie 行为都继续保留。请确认应更新哪个 Spec，等我确认身份后再完成修订并刷新 Index；不要创建新 Spec、Plan、Tasks 或修改代码。

## Evaluation Context

Read both candidate Specs, Architecture, ranking code, tests, and project rules before classifying identity. The evaluator supplies the pre-change `manage-specs` Skill snapshot for Baseline and the current snapshot for Live. The identity confirmation arrives only after classification stops.

## Allowed Scope

- The existing intent-aware ranking Spec after exact identity confirmation.
- Generated global and topic indexes through the absolute hello-scholar CLI.

## Prohibited Scope

- A duplicate or successor Spec, template reconstruction, loss of unaffected decisions, or retention of obsolete 0.62 text.
- Source, tests, diversity Spec, Architecture, Plan, Tasks, Runs, or memory changes.

## Expected Result

The existing owner is selected and confirmed. Its identity and `created` value remain stable; the new revision preserves unaffected normative content, modifies the threshold and affected acceptance text, adds phrase matching in the proper sections, removes obsolete references, records concise history, and stays draft for whole-file review.

## Verification

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` and the absolute `hello-scholar docs check`. Generated indexes come only from `docs sync`.

## Interaction

The first round ends after one classification and exact identity proposal. The evaluator then confirms that existing Spec identity; no other future reply is visible initially.
