import json
from pathlib import Path

from src.feature_flags import FlagService, FlagStore


def dashboard_enabled(user_id: str) -> bool:
    flags = json.loads(Path("data/flags.json").read_text(encoding="utf-8"))
    return FlagService(FlagStore(flags)).is_enabled(
        "new-dashboard", {"user_id": user_id}
    )


if __name__ == "__main__":
    print(f"dashboard_enabled={dashboard_enabled('demo-user')}")
