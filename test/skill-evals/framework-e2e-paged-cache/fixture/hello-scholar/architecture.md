# Current Architecture

## System Goal

Provide deterministic block allocation for a small Python KV Cache engine.

## Current Modules

- `src/kv_cache/contiguous_allocator.py` owns the public `CacheAllocator` and the contiguous free-span search.
- `tests/test_contiguous_allocator.py` protects allocation, release, and the current fragmentation behavior.
- `scripts/benchmark_cache.py` produces a deterministic fragmentation baseline.

## Current Flow

Each request asks for a number of cache blocks. `CacheAllocator` scans for one contiguous free span, records that span by request ID, and returns all blocks when the request is released. A request fails when no single span is large enough, even if total free capacity is sufficient.

## Current Constraints

- Request IDs are unique while allocated.
- A block belongs to at most one active request.
- Release makes every block in the request available again.
- The public import remains `kv_cache.contiguous_allocator.CacheAllocator`.

## Design Sources

- Current code and tests.
- `SPEC-001` defines the accepted target but is not current architecture until implemented.
