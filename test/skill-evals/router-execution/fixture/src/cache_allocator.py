"""Small bounded cache with insertion-order eviction."""


class CacheAllocator:
    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        self._capacity = capacity
        self._values: dict[str, str] = {}

    def set(self, key: str, value: str) -> None:
        if key not in self._values and len(self._values) == self._capacity:
            oldest = next(iter(self._values))
            del self._values[oldest]
        self._values[key] = value

    def get(self, key: str) -> str:
        return self._values[key]

    def keys(self) -> tuple[str, ...]:
        return tuple(self._values)
