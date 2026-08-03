---
schema: 1
kind: spec
id: SPEC-007
title: Reject Unknown V1 Configuration Keys
topic: config-upgrade
type: engineering
status: accepted
revision: 1
summary: Reject unknown top-level keys before upgrading a version-1 service config.
created: 2026-08-01
updated: 2026-08-01
supersedes: []
superseded_by: null
---

# Reject Unknown V1 Configuration Keys

## 1. Problem

The current upgrader silently drops unknown top-level keys, so a misspelled safety option can disappear without warning.

## 2. Goal

Reject any version-1 input containing keys outside `version`, `endpoint`, and `retries`, while preserving valid output.

## 3. Non-Goals

Nested extension schemas, compatibility modes, and batch migration are excluded.

## 4. Current State

Required values are validated and projected into version 2; extra keys are ignored.

## 5. Target Design

Validate the exact top-level key set before building output. Report sorted unknown key names in `ValueError`.

## 6. Implementation Boundary

### Allowed

The upgrader and focused tests.

### Forbidden

The valid output schema, dependencies, and alternate upgrader implementations.

## 7. Interface And Data

`upgrade(config)` returns the existing version-2 dictionary or raises `ValueError` before output.

## 8. Invariants And Constraints

Valid version-1 inputs retain endpoint and retry values exactly.

## 9. Options And Decision

Use a fixed allowed-key set rather than silently carrying or dropping unknown fields.

## 10. Acceptance Criteria

- AC-1: An unknown top-level key is rejected and named.
- AC-2: Valid input produces the unchanged version-2 shape.

## 11. Verification

Focused unit evidence and the full `unittest` suite.

## 12. Migration And Cleanup

No persisted migration is performed by this change.

## 13. Rollback

Revert the implementation and test commit together.

## 14. Evidence

Implementation evidence is pending.

## 15. Revision History

- Revision 1: Accepted exact-key validation.
