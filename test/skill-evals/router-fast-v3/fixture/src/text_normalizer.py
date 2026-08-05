"""Normalization used by search-result summaries."""


def normalize_text(value: str) -> str:
    """Trim surrounding whitespace while preserving words."""

    if not isinstance(value, str):
        raise TypeError("value must be a string")
    return " ".join(value.strip().split(" "))
