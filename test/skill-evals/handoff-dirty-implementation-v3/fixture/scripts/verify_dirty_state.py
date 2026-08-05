#!/usr/bin/env python3
"""Verify that the prepared workspace has distinct unfinished-state classes."""

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
    assert any(line[0] not in {" ", "?"} for line in status), status
    assert any(line[1] not in {" ", "?"} for line in status), status
    assert any(line.startswith("?? ") for line in status), status

    tests = subprocess.run(
        ["python3", "-B", "-m", "unittest", "discover", "-s", "tests"],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    assert tests.returncode != 0, tests.stdout + tests.stderr
    print("dirty-state-valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
