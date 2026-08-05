# Manage Specs: Successor Session Token Model — Sonnet v3 Successor

## Project Background

This Node.js session service issues opaque random tokens and resolves every request through a server-side token store. The accepted token Spec owns that model. A separate audit Spec owns security-event records. The proposed signed stateless token model removes the store lookup from the formal authentication path and has a staged revocation migration.

## Original User Request

先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

## Required Stop

Round one is read-only. Inspect Indexes, plausible Specs, code, tests, and local rules; report one evidence-backed classification and stop. A later user decision is not included in this request.

After the user approves the current classification, update only the relationship-bearing Spec documents and generated Indexes that classification requires.

## Allowed Scope After Approval

- Justified Spec files under `hello-scholar/specs/session-auth/`.
- Generated global and Topic Indexes through the supplied absolute hello-scholar CLI.

## Forbidden Scope

- Any write before the classification approval.
- Source, tests, package files, Architecture, Plan, Tasks, or Runs.
- Reusing an existing Spec ID, creating a relation cycle, or leaving a one-way supersession link.
- Treating creation approval as acceptance of the new design.
- `hello-scholar/memory/` or hand-written generated tables.

## Verification

Run `npm test` and the supplied absolute `hello-scholar docs check`. Existing runtime behavior stays unchanged, supersession is reciprocal and acyclic, and generated Indexes are current.

## Interaction

This Sonnet v3 successor uses two rounds: classification stop, then a later user decision.
