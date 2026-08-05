# Manage Specs: Independent Batch Retrieval Capability — Sonnet v3 Successor

## Project Background

This Python retrieval API exposes one-document lookup. Its current Specs own ranking and request tracing. A proposed batch endpoint has its own request shape, rate limit, partial-failure contract, rollout, and rollback path; none of those are implemented yet.

## Original User Request

先整理设计，不要写代码：我想增加 `POST /v1/documents:batchGet`，一次最多取 100 个 ID，结果按输入顺序返回，单个缺失项不让整批失败，并且可以单独灰度和关闭。请先判断它应该归到哪个现有设计里，说明依据；需要新建设计文档时先停下来等我确认。

## Required Stop

In round one, inspect Indexes, candidate Specs, code, tests, and project rules; report one classification with evidence and stop. No project byte may change before a later user decision.

After a genuine stop, a later user decision may approve the current classification. Only then may the Implementer write the justified Spec and generated Indexes.

## Allowed Scope After Approval

- One justified Spec identity under `hello-scholar/specs/`.
- Generated Indexes through the supplied absolute hello-scholar CLI.

## Forbidden Scope

- Any write before the classification approval.
- Source, tests, Architecture, Plan, Tasks, or Runs.
- Reusing a retired or missing global Spec ID, a date name, or `new/final/latest/v2` suffix.
- `hello-scholar/memory/` or hand-written Index tables.

## Verification

Run `python3 -m unittest discover -s tests` and the supplied absolute `hello-scholar docs check`. Existing runtime behavior remains unchanged and the final docs graph is valid.

## Interaction

This Sonnet v3 successor uses two rounds: classification stop, then a later user decision.
