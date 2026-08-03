from collections.abc import Mapping


class FlagStore:
    def __init__(self, flags: Mapping[str, bool]):
        self._flags = dict(flags)

    def get(self, name: str) -> bool:
        return self._flags.get(name, False)


class FlagService:
    def __init__(self, store: FlagStore):
        self._store = store

    def is_enabled(self, name: str, context: Mapping[str, str]) -> bool:
        if not context.get("user_id"):
            raise ValueError("user_id is required")
        return self._store.get(name)


class LegacyFlagAdapter:
    """Transitional integer API left after the in-repository migration."""

    def __init__(self, service: FlagService):
        self._service = service

    def enabled_for_user(self, name: str, user_id: str) -> int:
        return int(self._service.is_enabled(name, {"user_id": user_id}))
