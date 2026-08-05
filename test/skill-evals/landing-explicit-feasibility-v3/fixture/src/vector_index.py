class VectorIndex:
    def __init__(self):
        self._partitions: dict[str, dict[str, list[float]]] = {}

    def upsert(self, tenant_id: str, item_id: str, vector: list[float]) -> None:
        if not tenant_id:
            raise ValueError("tenant_id is required")
        if not vector:
            raise ValueError("vector must not be empty")
        self._partitions.setdefault(tenant_id, {})[item_id] = list(vector)

    def query(self, tenant_id: str, vector: list[float], limit: int) -> list[str]:
        if limit < 1:
            raise ValueError("limit must be positive")
        candidates = self._partitions.get(tenant_id, {})
        ranked = sorted(
            candidates.items(),
            key=lambda item: sum(a * b for a, b in zip(item[1], vector)),
            reverse=True,
        )
        return [item_id for item_id, _ in ranked[:limit]]
