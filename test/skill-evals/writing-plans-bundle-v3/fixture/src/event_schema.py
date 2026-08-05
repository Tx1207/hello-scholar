REQUIRED_FIELDS = {"event_id", "kind", "payload"}


def validate_event(event: dict) -> None:
    missing = REQUIRED_FIELDS.difference(event)
    if missing:
        raise ValueError(f"missing event fields: {sorted(missing)}")
