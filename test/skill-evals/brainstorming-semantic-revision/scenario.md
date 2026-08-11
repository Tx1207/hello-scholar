# Brainstorming: Reconcile an Approved Ranking Design

## Project Background

This Python search service has an accepted intent-aware ranking Spec and a separate result-diversity Spec. The current ranking Spec contains lexical, semantic, freshness, interface, acceptance, rollback, and history decisions. The requested design changes only phrase weighting and the semantic fallback threshold; the public entry point, diversity ownership, freshness signal, and stable-tie behavior remain current.

## Original User Request

搜索排序需要调整：短语完全匹配应当高于普通词项匹配，语义回退阈值从 0.62 提高到 0.68。请先结合当前 Spec、代码和测试确认影响，比较可行设计并给出建议；公开入口、返回结构、多样性策略和现有 freshness 规则都不变。在我批准完整修订稿前不要写文件，也不要开始 Plan 或实现。

## Evaluation Context

Read the current Specs, Architecture, ranking code, tests, and project rules. The evaluator supplies the pre-change `brainstorming` Skill snapshot for Baseline and the current snapshot for Live. Only the exact original request is visible initially; later design and whole-file decisions are delivered after their stop conditions.

## Allowed Scope

- `hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md` after the complete revised Spec is approved.
- Generated global and topic indexes through the absolute hello-scholar CLI.

## Prohibited Scope

- Rebuilding the existing Spec from a template, dropping unaffected current decisions, or appending a contradictory patch.
- Source, tests, Architecture, result-diversity Spec, Plan, Tasks, Runs, or memory changes.
- Any project write before whole-file approval.

## Expected Result

The design is explored before writing. The complete revision keeps unaffected current decisions, replaces the threshold and affected ranking/acceptance language, adds phrase-match behavior in the correct sections, removes superseded 0.62 references, preserves Spec identity and history, and is presented as one coherent Current Spec before any write.

## Verification

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` and the absolute `hello-scholar docs check`. Only the approved existing Spec and generated indexes may change.

## Interaction

The evaluator answers one material design question, selects the recommended approach, and finally approves one complete revised Spec. Each future message is delivered only after the preceding stop condition.
