---
schema: 1
kind: spec
id: SPEC-003
title: Cache admission and eviction policy
topic: cache-policy
type: system-design
status: accepted
revision: 1
summary: Use deterministic LRU eviction with observable hit and eviction metrics
created: 2026-06-20
updated: 2026-06-20
supersedes: []
superseded_by: null
---
# Cache Admission And Eviction Policy

## 1. Problem

The service needs bounded memory and predictable eviction under repeated reads.

## 2. Goals

Own admission, recency tracking, eviction selection, and policy comparison metrics.

## 3. Non-goals

Background prefetch scheduling is not part of this policy.

## 4. Current State

Every inserted key is admitted. Capacity overflow evicts the least recently used key.

## 5. Target Design

The current accepted target is deterministic LRU with hit, miss, and eviction counters.

## 6. Implementation Boundary

`src/cache-policy.js` and policy-specific metrics are in scope.

## 7. Interfaces And Data

`CachePolicy.get` updates recency; `CachePolicy.put` admits a key and may return one evicted key.

## 8. Invariants And Constraints

Stored entries never exceed capacity. Reads and writes remain synchronous.

## 9. Options And Decision

Decision: plain LRU. No replacement candidates are currently approved.

## 10. Acceptance Criteria

The least recently used key is evicted deterministically and recently read keys remain.

## 11. Verification

Node unit tests cover recency updates and eviction order.

## 12. Migration And Cleanup

No persisted cache entries survive service restart.

## 13. Rollback

Deploy the previous service build.

## 14. Evidence

`test/cache-policy.test.js`.

## 15. Revision History

- Revision 1: accepted plain LRU policy.
