"""Normalize user search queries before tokenization."""

import unicodedata


def normalize_query(value: str) -> str:
    if not isinstance(value, str):
        raise TypeError("query must be a string")
    normalized = unicodedata.normalize("NFKC", value)
    return " ".join(normalized.split())
