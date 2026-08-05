---
schema: 1
kind: spec
id: SPEC-011
title: Session security audit events
topic: session-auth
type: capability
status: accepted
revision: 1
summary: Emit stable security events for session issue verify revoke and expiry outcomes
created: 2026-07-24
updated: 2026-07-24
supersedes: []
superseded_by: null
---
# Session Security Audit Events

## Problem

Security operations need stable records of session lifecycle outcomes.

## Goal

Emit versioned events for issue, verify, revoke, and expiry.

## Boundary

This Spec observes token operations but does not choose opaque versus signed token representation.

## Acceptance Criteria

Each lifecycle outcome emits one event with subject, timestamp, result, and schema version.

## Revision History

- Revision 1: accepted audit event contract.
