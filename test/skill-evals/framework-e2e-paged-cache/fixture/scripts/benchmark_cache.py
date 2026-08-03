#!/usr/bin/env python3
"""Produce a deterministic contiguous-allocation fragmentation baseline."""

import argparse
import json
from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from kv_cache.contiguous_allocator import CacheAllocator


def run(blocks: int, request_blocks: int) -> dict[str, int | bool]:
    allocator = CacheAllocator(blocks)
    chunk = request_blocks // 2
    request_count = blocks // chunk
    for index in range(request_count):
        allocator.allocate(f"seed-{index}", chunk)
    for index in range(0, request_count, 2):
        allocator.release(f"seed-{index}")

    failed = False
    try:
        allocator.allocate("fragmented-request", request_blocks)
    except MemoryError:
        failed = True
    return {
        "total_blocks": blocks,
        "request_blocks": request_blocks,
        "free_blocks_before_request": allocator.free_block_count(),
        "fragmentation_failure": failed,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--blocks", type=int, default=24)
    parser.add_argument("--request-blocks", type=int, default=6)
    args = parser.parse_args()
    if args.request_blocks < 2 or args.request_blocks % 2:
        parser.error("request-blocks must be a positive even number")
    metrics = run(args.blocks, args.request_blocks)
    print(json.dumps(metrics, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
