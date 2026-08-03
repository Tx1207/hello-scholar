"""Deterministic hybrid retrieval used by the paper-search service."""

from __future__ import annotations


def _tokens(value: str) -> set[str]:
    """Purpose: normalize a query or document into token facts; Input: source text; Output: lowercase token set."""
    return {token for token in value.lower().split() if token}


def retrieve(query: str, documents: list[dict], limit: int = 10) -> list[str]:
    """Purpose: rank filtered documents by hybrid lexical/vector evidence; Input: query, document dictionaries, and result limit; Output: ordered document IDs; Errors: ValueError for invalid limit."""
    if limit < 1:
        raise ValueError("limit must be positive")
    query_tokens = _tokens(query)
    ranked: list[tuple[float, str]] = []
    for document in documents:
        if not document.get("published", False):
            continue
        lexical = len(query_tokens & _tokens(document["title"]))
        vector = float(document.get("vector_score", 0.0))
        ranked.append((lexical * 0.7 + vector * 0.3, document["id"]))
    ranked.sort(key=lambda item: (-item[0], item[1]))
    return [document_id for _, document_id in ranked[:limit]]
