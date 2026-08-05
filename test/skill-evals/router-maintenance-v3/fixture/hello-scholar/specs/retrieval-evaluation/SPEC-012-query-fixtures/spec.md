---
schema: 1
kind: spec
id: SPEC-012
title: Stable Retrieval Query Fixtures
topic: retrieval-evaluation
type: research
status: accepted
revision: 1
summary: Define a stable query set for comparing retrieval changes.
created: 2026-07-30
updated: 2026-07-31
supersedes: []
superseded_by: null
---

# SPEC-012: Stable Retrieval Query Fixtures

## 1. Problem

Ad hoc query sets make retrieval comparisons difficult to reproduce.

## 2. Goal

Keep one committed set of representative queries and stable identifiers.

## 3. Non-Goals

Ranking algorithm changes and production traffic replay are excluded.

## 4. Current State

The stable fixture set was validated by the completed Run in this repository.

## 5. Target Design

Use explicit query IDs and deterministic ordering.

## 6. Implementation Boundary

Only research fixtures were in scope; this Spec is already accepted.

## 7. Interface

Each query has a unique ID and non-empty text.

## 8. Invariants

IDs and ordering remain stable across comparisons.

## 9. Decision

Adopt the committed fixture set.

## 10. Acceptance Criteria

- AC-1: Query IDs are unique.
- AC-2: Repeated loads preserve byte order.

## 11. Verification

See the linked completed Run.

## 12. Migration And Cleanup

No migration remains.

## 13. Rollback

Revert the fixture commit and its Run together.

## 14. Evidence

`runs/20260731-1600-query-fixtures/record.md`.

## 15. Revision History

- Revision 1: Accepted stable fixture set.
