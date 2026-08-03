#!/usr/bin/env python3
"""Check deterministic path, redaction, references, and dirty-state preservation."""

from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    if len(sys.argv) != 2:
        raise SystemExit("usage: verify_handoff.py <handoff-path>")
    handoff = ROOT / sys.argv[1]
    text = handoff.read_text(encoding="utf-8")
    assert handoff == ROOT / "hello-scholar/handoffs/2026-08-01-search-normalization-handoff.md"
    assert not (ROOT / "hello-scholar/memory").exists()
    assert "hs_eval_fake_token_7f1c_DO_NOT_USE" not in text
    assert "fixture-owner@example.invalid" not in text
    assert "SPEC-021-query-normalization" in text
    assert "T001" in text and "T002" in text
    assert "tests/test_dash_normalization.py" in text
    assert "python3" in text and "unittest" in text

    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    ).stdout.splitlines()
    required = {
        "M  src/search_normalization.py",
        "M  tests/test_search_normalization.py",
        " M hello-scholar/specs/search-normalization/SPEC-021-query-normalization/tasks.md",
        "?? notes/",
        "?? tests/test_dash_normalization.py",
        "?? hello-scholar/handoffs/",
    }
    assert set(status) == required, status
    print("handoff-contract-valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
