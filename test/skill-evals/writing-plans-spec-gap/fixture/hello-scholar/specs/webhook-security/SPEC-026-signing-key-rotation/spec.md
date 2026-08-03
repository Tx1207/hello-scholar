---
schema: 1
kind: spec
id: SPEC-026
title: Webhook signing key rotation
topic: webhook-security
type: system-design
status: accepted
revision: 2
summary: Extend webhook verification from one secret to a rotating key set without weakening HMAC validation
created: 2026-06-20
updated: 2026-07-27
supersedes: []
superseded_by: null
---
# Webhook Signing Key Rotation

## Problem

The service cannot rotate its single signing secret without coordinating an instantaneous cutover with every sender.

## Goals

- Verify signatures against an active and retiring key set.
- Preserve constant-time signature comparison.
- Give callers a documented migration path.

## Non-goals

Asymmetric signatures, key generation, and remote secret storage are excluded.

## Current State

Requests carry `X-Webhook-Signature`. The verifier accepts one secret and returns a boolean. The HTTP handler maps any false result to 401, and the supplied client knows no key identifier.

## Target Direction

Load an active key plus bounded retiring keys. Select the intended verification key, validate HMAC-SHA256 in constant time, and reject signatures outside the accepted compatibility policy.

## Public Contract

The existing webhook route and signed body bytes remain stable. Key rotation may require a request key identity and more specific failure responses, but revision 2 does not choose those public details.

## Open Decisions Blocking An Implementation Plan

### OD-1: Request Key Identity

Choose whether the sender supplies a new `X-Webhook-Key-Id` header, embeds identity in the signature header, or the server tries every eligible key. This changes `clients/webhook-client.js`, request parsing, lookup cost, and unknown-key behavior.

### OD-2: HTTP Failure Contract

Choose status and response behavior for a missing identity, unknown identity, retired key, malformed signature, and validly formed mismatch. The current handler returns 401 for every failure; callers may branch on any new distinction.

### OD-3: Legacy Compatibility Window

Choose whether requests without key identity remain valid, which key set they test, and the exact removal gate or duration. This controls whether the current client can coexist with rotation and when legacy parsing can be deleted.

## Acceptance Criteria

- AC-1: The eventually selected identity contract maps one request to the intended eligible key without secret-dependent timing leakage.
- AC-2: Active and retiring keys follow an explicitly bounded compatibility policy.
- AC-3: Every missing, unknown, retired, malformed, and mismatched case follows the accepted HTTP contract.
- AC-4: Existing callers migrate under the accepted legacy window, after which the legacy branch is removed.

## Migration And Cleanup

The order depends on OD-1 through OD-3. No implementation migration or deletion sequence is accepted until those decisions are incorporated into a new Spec revision.

## Rollback

Preserve the single-secret implementation until the future migration and rollback boundary is accepted.

## Revision History

- Revision 1: Proposed a rotating key set.
- Revision 2: Accepted the direction and recorded the three unresolved public and security decisions that must be closed before planning.
