---
schema: 1
kind: spec
id: SPEC-004
title: Least Recently Used Cache Eviction
topic: cache-eviction
type: capability
status: accepted
revision: 1
summary: Evict the least recently used key while preserving the current cache API.
created: 2026-07-28
updated: 2026-07-29
supersedes: []
superseded_by: null
---

# SPEC-004: Least Recently Used Cache Eviction

## 1. Problem

The cache evicts by insertion order. Reading a hot key does not protect it from eviction.

## 2. Goal

Make reads and updates refresh recency so capacity eviction removes the least recently used key.

## 3. Non-Goals

Persistence, thread safety, expiration, and cache statistics are excluded.

## 4. Current State

The implementation relies on dictionary insertion order and never changes order on `get()`.

## 5. Target Design

Keep one ordered mapping. A successful `get()` moves its key to the most-recent position. `set()` also makes the written key most recent, and evicts the first key only when inserting at capacity.

## 6. Implementation Boundary

Only the allocator, focused tests, and honest Tasks completion state may change.

## 7. Interface

`CacheAllocator(capacity)`, `set(key, value)`, `get(key)`, and `keys()` retain their signatures.

## 8. Invariants

- Capacity is never exceeded.
- A failed lookup does not change order.
- Updating an existing key does not evict another key.

## 9. Decision

Use standard dictionary order with explicit pop-and-reinsert operations; add no dependency.

## 10. Acceptance Criteria

- AC-1: Reading `first` after inserting `first`, `second` makes `second` the next eviction victim.
- AC-2: Updating an existing key refreshes it without evicting another entry.
- AC-3: Existing construction, validation, lookup, and `keys()` behavior remains compatible.

## 11. Verification

Run `python3 -m unittest discover -s tests` and the Bundle state checker.

## 12. Migration And Cleanup

No persisted data or compatibility layer exists.

## 13. Rollback

Revert allocator, test, and Tasks completion changes together.

## 14. Evidence

Implementation evidence is pending.

## 15. Revision History

- Revision 1: Accepted LRU behavior.
