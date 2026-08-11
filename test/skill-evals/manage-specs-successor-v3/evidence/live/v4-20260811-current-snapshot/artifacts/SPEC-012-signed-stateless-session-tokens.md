---
schema: 1
kind: spec
id: SPEC-012
title: Signed stateless session tokens
topic: session-auth
type: system-design
status: draft
revision: 1
summary: Replace opaque stored sessions with signed stateless tokens while preserving migration-time legacy verification
created: 2026-08-11
updated: 2026-08-11
supersedes: [SPEC-005]
superseded_by: null
---
# Signed Stateless Session Tokens

## 1. Value and Current Decision

Authenticated requests can be verified without a token-store lookup by using signed tokens carrying `kid`, `sub`, `iat`, and `exp`. The migration retains verification of legacy opaque tokens until the old format is retired.

## 2. Problem and Current Facts

`SPEC-005` currently requires opaque token resolution through the server-side store. The runtime stores subject and expiry by token string. Audit event formatting is independently owned by `SPEC-011` and remains unchanged.

## 3. Goals and Non-goals

The target authentication path issues and verifies signed stateless session tokens, supports key identification through `kid`, and enforces subject and issuance and expiry claims. Legacy opaque token verification remains available during migration. Token-store removal after migration, implementation details, and audit event redesign are outside this draft's accepted implementation.

## 4. Target Design

New sessions use signed tokens containing `kid`, `sub`, `iat`, and `exp`. Verification selects the signing key using `kid`, validates the signature and time claims, and returns the subject without querying the token store. During migration, legacy opaque tokens continue through the existing verification path; after migration completion, the store is removed.

## 5. Interfaces, Data, and Invariants

The session issue and verify interfaces retain their subject-oriented behavior while changing the new token representation. Signed tokens must fail closed when the signature or required claims are invalid, and `exp` must prevent verification after expiry. Legacy verification is temporary and does not change the audit event format.

## 6. Implementation Boundaries

The session token issuance and verification implementation may change, including the current token-store boundary. Migration compatibility and eventual storage cleanup belong to this design. Audit event ownership and format in `SPEC-011` remain outside the change.

## 7. Acceptance and Validation

The complete Spec must define signed token validation, key selection and rotation expectations, migration behavior for legacy tokens, and storage cleanup criteria before acceptance. Validation must cover claim and signature failures, expiry, legacy verification during migration, and absence of token-store lookup for new signed tokens.
