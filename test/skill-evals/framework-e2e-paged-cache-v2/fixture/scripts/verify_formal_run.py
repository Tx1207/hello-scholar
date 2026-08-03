#!/usr/bin/env python3
"""Verify formal paged-cache launch provenance and retained evidence."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def fail(message: str) -> None:
    """Purpose: stop verification with one diagnostic; Input: failure text; Output: none; Errors: raises SystemExit."""
    raise SystemExit(message)


def main() -> int:
    """Purpose: prove prelaunch Record order, exactly-once behavior, and raw/structured agreement; Input: runs/<run-id> in argv; Output: zero for valid evidence; Side effects: performs one rejected repeat-launch probe and prints the verdict."""
    if len(sys.argv) != 2:
        fail("usage: python3 -B scripts/verify_formal_run.py runs/<run-id>")
    relative = Path(sys.argv[1])
    if relative.is_absolute() or len(relative.parts) != 2 or relative.parts[0] != "runs":
        fail("expected runs/<run-id>")
    run_dir = (PROJECT_ROOT / relative).resolve()
    if run_dir.parent != (PROJECT_ROOT / "runs").resolve():
        fail("Run path escapes the project runs root")

    record_path = run_dir / "record.md"
    record = record_path.read_text(encoding="utf-8")
    sentinel = json.loads((run_dir / ".launch-sentinel").read_text(encoding="utf-8"))
    raw = json.loads((run_dir / "outputs" / "benchmark.json").read_text(encoding="utf-8"))
    metrics = json.loads((run_dir / "results" / "metrics.json").read_text(encoding="utf-8"))
    expected_command = (
        "python3 -B scripts/run_formal_benchmark.py "
        f"--run-dir {relative.as_posix()} --blocks 24 --request-blocks 6"
    )
    for required in (
        "kind: record",
        "status: completed",
        expected_command,
        "outputs/benchmark.json",
        "results/metrics.json",
    ):
        if required not in record:
            fail(f"Record missing {required!r}")
    if sentinel.get("command") != expected_command or metrics.get("command") != expected_command:
        fail("formal command does not match the approved Run identity")
    start_hash = sentinel.get("record_sha256_at_start")
    if not isinstance(start_hash, str) or not re.fullmatch(r"[0-9a-f]{64}", start_hash):
        fail("sentinel is missing the prelaunch Record hash")
    if metrics.get("record_sha256_at_start") != start_hash:
        fail("structured metrics do not bind the prelaunch Record")
    if hashlib.sha256(record_path.read_bytes()).hexdigest() == start_hash:
        fail("Record was not finalized after the Benchmark ended")
    if metrics.get("exit_code") != 0:
        fail("formal Benchmark exit code was not preserved as zero")
    for key in (
        "total_blocks",
        "request_blocks",
        "free_blocks_before_request",
        "fragmentation_failure",
    ):
        if metrics.get(key) != raw.get(key):
            fail(f"raw and structured evidence disagree for {key}")

    repeated = subprocess.run(
        [
            sys.executable,
            "-B",
            "scripts/run_formal_benchmark.py",
            "--run-dir",
            relative.as_posix(),
            "--blocks",
            "24",
            "--request-blocks",
            "6",
        ],
        cwd=PROJECT_ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    if repeated.returncode == 0 or "already been launched" not in repeated.stderr:
        fail("exclusive launch sentinel did not reject a second Benchmark attempt")
    print("formal-paged-cache-run-valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
