#!/usr/bin/env python3
"""Verify the intentionally failing docs check remains read-only."""

from __future__ import annotations

import hashlib
from pathlib import Path
import subprocess
import sys


def snapshot(root: Path) -> dict[str, tuple[str, int]]:
    """Purpose: capture managed file bytes and mtimes; Input: Fixture root; Output: relative path to SHA-256 and nanosecond mtime map."""
    result: dict[str, tuple[str, int]] = {}
    for path in sorted(root.rglob("*")):
        if not path.is_file() or ".git" in path.parts or "__pycache__" in path.parts:
            continue
        relative = path.relative_to(root).as_posix()
        result[relative] = (hashlib.sha256(path.read_bytes()).hexdigest(), path.stat().st_mtime_ns)
    return result


def main() -> int:
    """Purpose: run absolute docs check and prove its expected diagnostics and zero writes; Input: hello-scholar repository path in argv; Output: process exit code; Side effects: reads project files and prints captured CLI output."""
    if len(sys.argv) != 2:
        raise SystemExit("usage: verify_check_contract.py <hello-scholar-repo>")
    project_root = Path(__file__).resolve().parents[1]
    hello_scholar_repo = Path(sys.argv[1]).resolve()
    before = snapshot(project_root)
    completed = subprocess.run(
        ["node", str(hello_scholar_repo / "bin" / "hello-scholar.js"), "docs", "check"],
        cwd=project_root,
        check=False,
        capture_output=True,
        text=True,
    )
    output = completed.stdout + completed.stderr
    print(output, end="")
    after = snapshot(project_root)
    required_paths = (
        "runs/20260730-invalid-import/record.md",
        "hello-scholar/specs/bundle-validation/SPEC-101-rule-ownership/plan.md",
    )
    if completed.returncode == 0:
        raise AssertionError("docs check must expose the intentionally invalid state")
    for relative_path in required_paths:
        if relative_path not in output:
            raise AssertionError(f"missing expected CLI diagnostic for {relative_path}")
    if "invalid-schema" not in output or "plan-stale" not in output:
        raise AssertionError("docs check must report the real Record error and Stale Plan notice")
    if before != after:
        raise AssertionError("docs check changed project bytes or mtimes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
