# Manage Specs: Existing Ranking Design — Sonnet v3 Successor

## Project Background

This Python search service ranks documents with one public `rank_documents` entry. The accepted ranking Spec already owns intent-aware relevance weights. A separate accepted Spec owns result diversity. Current code and tests make those ownership boundaries observable.

## Original User Request

在开始改代码前，更新设计文档：短语完全匹配需要比普通词项匹配获得更高权重，同时语义回退的最低分从 0.62 调到 0.68。公开排序入口、返回结构和多样性策略都不变。请先把这次设计变化记录清楚并刷新文档索引，不要开始实现。

## Evaluation Boundary

This Sonnet v3 successor starts from the supplied project snapshot. Inspect generated Indexes, relevant Specs, current code, tests, and project rules before deciding the document identity. Do not use materials outside the supplied project snapshot.

## Allowed Scope

- Existing Spec files under `hello-scholar/specs/` when justified by current ownership.
- Generated `hello-scholar/specs/INDEX.md` and Topic indexes through the supplied absolute hello-scholar CLI.

## Forbidden Scope

- Source or test changes.
- A date-named Spec, a second Spec for the same ranking problem, or any file under `hello-scholar/memory/`.
- Plan, Tasks, Run, or Architecture changes.
- Reading hello-scholar source files other than the supplied absolute CLI entry.

## Verification

Run `python3 -m unittest discover -s tests` and the supplied absolute `hello-scholar docs check`. The source suite must remain green, the final docs graph must be valid, and generated Index files must come only from `docs sync`.

## Interaction

This is a single-round documentation request.
