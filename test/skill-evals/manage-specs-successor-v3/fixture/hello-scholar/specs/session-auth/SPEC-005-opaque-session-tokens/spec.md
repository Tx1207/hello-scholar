---
schema: 1
kind: spec
id: SPEC-005
title: Opaque server-side session tokens
topic: session-auth
type: system-design
status: accepted
revision: 2
summary: Issue random opaque tokens resolved through a revocable server-side store
created: 2026-05-08
updated: 2026-07-10
supersedes: []
superseded_by: null
---
# Opaque Server-side Session Tokens

## 1. Problem

Authenticated sessions need server-controlled expiry and immediate revocation.

## 2. Goals

Issue unpredictable tokens and resolve every request through one authoritative token store.

## 3. Non-goals

Security audit event formatting is owned by another Spec.

## 4. Current State

The runtime stores `{subject, issuedAt, expiresAt}` by a random token string.

## 5. Target Design

Opaque token lookup remains the formal authentication path. Deleting a stored entry revokes it immediately.

## 6. Implementation Boundary

Token issuance, lookup, expiry, and deletion in `src/token-store.js`.

## 7. Interfaces And Data

`issue(subject, now)` returns a token. `verify(token, now)` returns a subject or `null`.

## 8. Invariants And Constraints

Tokens reveal no subject data and expired or deleted tokens do not verify.

## 9. Options And Decision

Adopt server-side storage for direct revocation.

## 10. Acceptance Criteria

Issued tokens verify until expiry or deletion; unknown tokens fail closed.

## 11. Verification

Node unit tests cover issue, expiry, and revocation.

## 12. Migration And Cleanup

No previous token format remains in production.

## 13. Rollback

Deploy the previous token-store build while preserving stored sessions.

## 14. Evidence

`test/token-store.test.js`.

## 15. Revision History

- Revision 1: opaque issuance and verification.
- Revision 2: explicit expiry and immediate deletion semantics.
