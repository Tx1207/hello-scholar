#!/usr/bin/env python3
"""Confirm that all three owned indexes are intentionally stale fixtures."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEXES = [
    ROOT / "hello-scholar/specs/INDEX.md",
    ROOT / "hello-scholar/specs/retrieval-evaluation/INDEX.md",
    ROOT / "runs/INDEX.md",
]
MARKER = "<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->"


def main() -> int:
    for path in INDEXES:
        text = path.read_text(encoding="utf-8")
        assert text.splitlines()[0] == MARKER, path
        assert "STALE SNAPSHOT" in text, path
    print("stale-generated-indexes: 3")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
