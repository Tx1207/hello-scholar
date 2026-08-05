"""Small runtime rules used by the bundle validation service."""


def normalize_owner(owner: str) -> str:
    """Purpose: normalize an owner label; Input: raw owner text; Output: lowercase nonblank owner; Errors: ValueError for blank input."""
    normalized = owner.strip().lower()
    if not normalized:
        raise ValueError("owner is required")
    return normalized


def owns_rule(owner: str, rule_id: str) -> bool:
    """Purpose: test whether an owner namespace contains a rule; Input: owner and rule identifier; Output: true when the prefix matches."""
    return rule_id.startswith(f"{normalize_owner(owner)}:")
