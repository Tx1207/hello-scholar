#!/usr/bin/env python3
"""Launch the formal paged-cache Benchmark once with prelaunch provenance."""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def resolve_run_dir(value: str) -> Path:
    """Purpose: resolve one root Run identity; Input: runs/<run-id> text; Output: absolute Run directory; Errors: ValueError for absolute or escaping paths."""
    relative = Path(value)
    if relative.is_absolute() or len(relative.parts) != 2 or relative.parts[0] != "runs":
        raise ValueError("run directory must be runs/<run-id>")
    resolved = (PROJECT_ROOT / relative).resolve()
    if resolved.parent != (PROJECT_ROOT / "runs").resolve():
        raise ValueError("run directory escapes the project runs root")
    return resolved


def launch(run_dir: Path, blocks: int, request_blocks: int) -> int:
    """Purpose: launch and preserve one formal Benchmark exactly once; Input: prepared Run directory and fixed allocation sizes; Output: child exit code; Side effects: exclusively writes sentinel, raw output, and metrics; Errors: rejects missing provenance or a repeated launch."""
    record_path = run_dir / "record.md"
    output_path = run_dir / "outputs" / "benchmark.json"
    metrics_path = run_dir / "results" / "metrics.json"
    if not record_path.is_file() or not output_path.parent.is_dir() or not metrics_path.parent.is_dir():
        raise RuntimeError("record.md, outputs/, and results/ must exist before launch")

    relative_run = run_dir.relative_to(PROJECT_ROOT).as_posix()
    command = (
        "python3 -B scripts/run_formal_benchmark.py "
        f"--run-dir {relative_run} --blocks {blocks} --request-blocks {request_blocks}"
    )
    record_bytes = record_path.read_bytes()
    if command not in record_bytes.decode("utf-8"):
        raise RuntimeError("the prelaunch Record must contain the exact formal command")

    started_at = datetime.now(timezone.utc).isoformat()
    sentinel = {
        "benchmark": "paged-cache-fragmentation",
        "command": command,
        "record_sha256_at_start": hashlib.sha256(record_bytes).hexdigest(),
        "started_at": started_at,
    }
    try:
        with (run_dir / ".launch-sentinel").open("x", encoding="utf-8") as stream:
            json.dump(sentinel, stream, indent=2, sort_keys=True)
            stream.write("\n")
    except FileExistsError as error:
        raise RuntimeError("the formal paged-cache Benchmark has already been launched") from error

    completed = subprocess.run(
        [
            sys.executable,
            "-B",
            "scripts/benchmark_cache.py",
            "--blocks",
            str(blocks),
            "--request-blocks",
            str(request_blocks),
        ],
        cwd=PROJECT_ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    with output_path.open("x", encoding="utf-8") as stream:
        stream.write(completed.stdout)
    if completed.returncode == 0:
        metrics = json.loads(completed.stdout)
        metrics.update(
            {
                "command": command,
                "exit_code": completed.returncode,
                "record_sha256_at_start": sentinel["record_sha256_at_start"],
                "started_at": started_at,
            }
        )
        with metrics_path.open("x", encoding="utf-8") as stream:
            json.dump(metrics, stream, indent=2, sort_keys=True)
            stream.write("\n")
    if completed.stderr:
        sys.stderr.write(completed.stderr)
    if completed.stdout:
        sys.stdout.write(completed.stdout)
    return completed.returncode


def main() -> int:
    """Purpose: parse the fixed formal-launch command; Input: CLI arguments; Output: Benchmark child exit code; Side effects: delegates one launch."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-dir", required=True)
    parser.add_argument("--blocks", required=True, type=int)
    parser.add_argument("--request-blocks", required=True, type=int)
    args = parser.parse_args()
    return launch(resolve_run_dir(args.run_dir), args.blocks, args.request_blocks)


if __name__ == "__main__":
    raise SystemExit(main())
