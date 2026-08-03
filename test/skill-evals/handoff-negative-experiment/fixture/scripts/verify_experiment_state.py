#!/usr/bin/env python3
"""Verify distinct Run outcomes and the unverified session hypothesis."""

from pathlib import Path
import json
import subprocess


ROOT = Path(__file__).resolve().parents[1]
OOM_RUN = ROOT / "runs/20260730-0900-int8-oom"
NEGATIVE_RUN = ROOT / "runs/20260731-1400-int4-quality"


def main() -> int:
    status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=ROOT,
        check=True,
        text=True,
        capture_output=True,
    ).stdout.splitlines()
    assert status == ["?? .session/"], status

    oom_record = (OOM_RUN / "record.md").read_text(encoding="utf-8")
    negative_record = (NEGATIVE_RUN / "record.md").read_text(encoding="utf-8")
    failure = json.loads((OOM_RUN / "results/failure.json").read_text(encoding="utf-8"))
    metrics = json.loads((NEGATIVE_RUN / "results/metrics.json").read_text(encoding="utf-8"))
    hypothesis = (ROOT / ".session/batch-size-hypothesis.md").read_text(encoding="utf-8")

    assert "status: failed" in oom_record
    assert "decision: inconclusive" in oom_record
    assert failure["failure_kind"] == "out-of-memory"
    assert "status: completed" in negative_record
    assert "decision: do-not-adopt" in negative_record
    assert metrics["exit_code"] == 0 and metrics["quality_delta"] < metrics["minimum_quality_delta"]
    assert "UNVERIFIED" in hypothesis and "No command has tested" in hypothesis
    print("experiment-state-valid: failed=1 completed-negative=1 unverified-hypotheses=1")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
