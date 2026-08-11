from collections import OrderedDict


class LruCache:
    def __init__(self, capacity: int) -> None:
        if capacity < 1:
            raise ValueError("capacity must be positive")
        self.capacity = capacity
        self._values: OrderedDict[str, str] = OrderedDict()

    def access(self, key: str) -> bool:
        hit = key in self._values
        if hit:
            self._values.move_to_end(key)
            return True
        self._values[key] = key
        if len(self._values) > self.capacity:
            self._values.popitem(last=False)
        return False


def evaluate_trace(capacity: int, requests: list[str]) -> dict[str, float | int]:
    cache = LruCache(capacity)
    hits = sum(1 for key in requests if cache.access(key))
    request_count = len(requests)
    return {
        "capacity": capacity,
        "request_count": request_count,
        "hits": hits,
        "hit_rate": hits / request_count if request_count else 0.0,
    }
