"""Upgrade a version-1 service configuration to version 2."""

import json
from pathlib import Path
import sys
from typing import Any


def upgrade(config: dict[str, Any]) -> dict[str, Any]:
    if config.get("version") != 1:
        raise ValueError("version must be 1")
    endpoint = config.get("endpoint")
    retries = config.get("retries")
    if not isinstance(endpoint, str) or not endpoint:
        raise ValueError("endpoint must be a non-empty string")
    if not isinstance(retries, int) or isinstance(retries, bool) or retries < 0:
        raise ValueError("retries must be a non-negative integer")
    return {
        "version": 2,
        "service": {"endpoint": endpoint},
        "retry": {"max_attempts": retries},
    }


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: config_upgrader.py <config.json>", file=sys.stderr)
        return 2
    config = json.loads(Path(argv[1]).read_text(encoding="utf-8"))
    print(json.dumps(upgrade(config), sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
