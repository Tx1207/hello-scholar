"""Process a request batch while preserving ordered per-item outcomes."""


def process_batch(items: list[object]) -> list[dict[str, object]]:
    results: list[dict[str, object]] = []
    for index, item in enumerate(items):
        if not isinstance(item, str):
            results.append({"index": index, "error": "item must be a string"})
            continue
        results.append({"index": index, "value": item.strip().lower()})
    return results
