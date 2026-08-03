#!/usr/bin/env python3
"""Verify the expected dirty state and the one known failing test."""

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
    expected = {
        "M  src/search_normalization.py",
        "M  tests/test_search_normalization.py",
        " M hello-scholar/specs/search-normalization/SPEC-021-query-normalization/tasks.md",
        "?? notes/",
        "?? tests/test_dash_normalization.py",
    }
    assert set(status) == expected, status

    tests = subprocess.run(
        ["python3", "-m", "unittest", "discover", "-s", "tests"],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    combined = tests.stdout + tests.stderr
    assert tests.returncode == 1, combined
    assert "test_maps_typographic_dashes_to_ascii" in combined, combined
    assert "FAILED (failures=1)" in combined, combined
    print("dirty-state-valid: staged=2 modified=1 untracked=2 expected-failures=1")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
