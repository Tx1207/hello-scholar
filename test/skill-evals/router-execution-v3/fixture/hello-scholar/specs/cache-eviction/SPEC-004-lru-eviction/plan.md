---
schema: 1
kind: plan
spec: SPEC-004
spec_revision: 1
revision: 1
status: approved
title: LRU Cache Eviction Implementation
summary: Refresh recency on reads and updates without changing the public cache API.
created: 2026-07-29
updated: 2026-07-30
---

# LRU Cache Eviction Implementation

## 1. Implementation Goal

Implement the accepted recency semantics with the standard ordered dictionary behavior.

## 2. Scope

Modify only the allocator, focused unit tests, and Tasks completion state.

## 3. Technical Approach

On successful reads, remove and reinsert the current item. On writes, remove an existing key first, evict only for a new key at capacity, and insert the new value last.

## 4. Affected Modules

`src/cache_allocator.py` and `tests/test_cache_allocator.py`.

## 5. File Change Scope

### Add

No files.

### Modify

The allocator, its test module, and `tasks.md` completion state.

### Delete

No files.

### Must Not Touch

`spec.md`, `plan.md`, project rules, dependencies, and public signatures.

## 6. Interface Changes

Only recency behavior changes; method names and return types remain stable.

## 7. Implementation Stages

Protect read recency first, then update recency and the full regression matrix.

## 8. Test Strategy

Add behavior tests that distinguish LRU from FIFO and cover updates at capacity.

## 9. Migration Order

No migration.

## 10. Cleanup

Do not retain a FIFO mode or parallel implementation.

## 11. Rollback

Revert the implementation and focused tests together.

## 12. Tasks Generation Rules

Keep the two changes serial because they share both source and test files.
