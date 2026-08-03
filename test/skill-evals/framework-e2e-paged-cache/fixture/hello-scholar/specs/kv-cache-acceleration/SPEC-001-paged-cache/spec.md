---
schema: 1
kind: spec
id: SPEC-001
topic: kv-cache-acceleration
status: accepted
revision: 1
summary: Replace contiguous KV cache allocation with paged blocks while preserving the public entry point.
---

# SPEC-001: Paged KV Cache Allocation

## 1. Problem

The current allocator rejects requests when free blocks are fragmented, even when total free capacity is sufficient.

## 2. Goal

Allocate a request from any set of free physical blocks and preserve the existing public `CacheAllocator` entry point and method semantics.

## 3. Non-Goals

- Distributed cache coordination.
- Persistence across process restarts.
- Concurrency or GPU-specific optimization.

## 4. Current State

`CacheAllocator` searches for one contiguous span and stores the resulting block tuple by request ID. The supplied Benchmark deterministically creates fragmented free capacity that cannot satisfy a six-block request.

## 5. Target Design

Add one paged allocator as the formal implementation. A logical request owns an ordered tuple of distinct physical block IDs; those IDs need not be adjacent. Keep the existing import as a thin compatibility entry and remove the contiguous span search from the formal path.

## 6. Implementation Boundary

Implementation may change allocator internals, add focused tests, and update the existing Benchmark. It must not change this Accepted Spec or create parallel versioned implementations.

## 7. Interface

`CacheAllocator(total_blocks)` validates positive capacity. `allocate(request_id, block_count)` returns a tuple of block IDs or raises `MemoryError`; duplicate active IDs raise `ValueError`. `release(request_id)` returns all owned blocks and raises `KeyError` for an unknown ID. `blocks_for(request_id)` returns the current tuple.

## 8. Invariants

- No physical block belongs to two active requests.
- Allocation succeeds whenever `block_count` does not exceed total free blocks.
- Allocation and reuse are deterministic for the same operation sequence.
- A failed allocation leaves state unchanged.

## 9. Decision

Use a sorted free-block set and per-request block tuples. Keep one implementation rather than a permanent contiguous/paged mode flag.

## 10. Acceptance Criteria

- AC-1: In the supplied fragmented state, a six-block request succeeds when at least six blocks are free in total.
- AC-2: Allocated tuples contain distinct blocks and active requests never overlap.
- AC-3: Released blocks are reusable and unknown releases fail without mutation.
- AC-4: The existing public import and method behavior remain valid.
- AC-5: The formal Benchmark stores raw output and structured metrics in one root Run and reports zero fragmentation failures.
- AC-6: The old contiguous search is absent from the formal execution path and no mode flag keeps both implementations alive.

## 11. Verification

Run all unit tests, the deterministic Benchmark, docs validation, and a full-tree diff review. Every command must have a current exit status and saved evidence.

## 12. Migration And Cleanup

Introduce the paged implementation behind the public entry, switch tests and Benchmark, then delete the contiguous search logic. No persisted data migration is required.

## 13. Rollback

Revert the implementation commit and Run artifacts together. The public interface remains unchanged, so callers require no rollback migration.

## 14. Evidence

Current evidence is the fixture code, tests, and deterministic fragmentation Benchmark. Implementation evidence belongs to the future root Run.

## 15. Revision History

- Revision 1: Accepted paged allocation target and cleanup boundary.
