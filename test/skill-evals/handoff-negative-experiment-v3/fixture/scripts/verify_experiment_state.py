#!/usr/bin/env python3
"""Verify that completed project records and current session material exist."""

from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    ).stdout.splitlines()
    assert status == ["?? .session/"], status
    records = sorted((ROOT / "runs").glob("*/record.md"))
    assert len(records) >= 2
    assert any((ROOT / ".session").glob("*.md"))
    print("experiment-state-valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
