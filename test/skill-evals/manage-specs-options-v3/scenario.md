# Manage Specs: Cache Policy Options — Sonnet v3 Successor

## Project Background

This Node.js cache service uses one LRU policy for admission and eviction. Its accepted eviction Spec owns policy selection and metrics. A separate Spec owns asynchronous cache warming. The user wants three candidate eviction strategies documented for an upcoming benchmark, without selecting one yet.

## Original User Request

先不要改实现，也不要替我选方案。请在设计文档中记录三个候选：A 是 LRU 加 TTL，B 是 segmented LRU，C 是 TinyLFU admission 加 LRU eviction；同时写清比较指标和“等压测后决定”。刷新索引后停下。

## Evaluation Boundary

This Sonnet v3 successor starts from the supplied project snapshot. Inspect Indexes, plausible Specs, code, tests, and local rules before deciding how many Spec identities the request represents. The user prompt does not name a classification or target file.

## Allowed Scope

- Justified Spec updates under `hello-scholar/specs/`.
- Generated Index files written through the supplied absolute hello-scholar CLI.

## Forbidden Scope

- Source, test, package, Architecture, Plan, Tasks, or Run changes.
- One Spec per candidate option, date-named documents, or `hello-scholar/memory/`.
- Claiming that A, B, or C was selected.

## Verification

Run `npm test` and the supplied absolute `hello-scholar docs check`. Existing behavior and source bytes must remain unchanged, and generated Indexes must be current.

## Interaction

This is a single-round request because the user explicitly defers the option decision.
