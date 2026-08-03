"""Current contiguous KV cache allocator."""


class CacheAllocator:
    def __init__(self, total_blocks: int) -> None:
        if total_blocks <= 0:
            raise ValueError("total_blocks must be positive")
        self._total_blocks = total_blocks
        self._owners: dict[str, tuple[int, ...]] = {}

    def allocate(self, request_id: str, block_count: int) -> tuple[int, ...]:
        if request_id in self._owners:
            raise ValueError(f"request already allocated: {request_id}")
        if block_count <= 0:
            raise ValueError("block_count must be positive")
        start = self._find_contiguous_span(block_count)
        if start is None:
            raise MemoryError("no contiguous cache span is large enough")
        blocks = tuple(range(start, start + block_count))
        self._owners[request_id] = blocks
        return blocks

    def release(self, request_id: str) -> None:
        if request_id not in self._owners:
            raise KeyError(request_id)
        del self._owners[request_id]

    def blocks_for(self, request_id: str) -> tuple[int, ...]:
        return self._owners[request_id]

    def free_block_count(self) -> int:
        return self._total_blocks - sum(len(blocks) for blocks in self._owners.values())

    def _find_contiguous_span(self, block_count: int) -> int | None:
        used = {block for blocks in self._owners.values() for block in blocks}
        run_start = 0
        run_length = 0
        for block in range(self._total_blocks):
            if block in used:
                run_length = 0
                run_start = block + 1
                continue
            run_length += 1
            if run_length == block_count:
                return run_start
        return None
