def format_invalid_token(token: str, column: int) -> str:
    if column < 1:
        raise ValueError("column must be positive")
    return f"Bad token {token!r} at {column}"
