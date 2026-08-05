from src.vector_index import VectorIndex


def search(index: VectorIndex, tenant_id: str, query_vector: list[float]) -> list[str]:
    return index.query(tenant_id, query_vector, limit=10)
