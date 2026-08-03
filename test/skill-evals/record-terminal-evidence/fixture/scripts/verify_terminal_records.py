import json
from pathlib import Path
import re
import subprocess


ROOT = Path(__file__).resolve().parents[1]
OOM_ID = "20260730-0900-int8-cuda-oom-s0"
NEGATIVE_ID = "20260731-1400-int4-quality-s0"
FORBIDDEN = {"run.json", "README.md", "report.md", "summary.md", "final-report.md"}


def read_record(run_id: str) -> str:
    return (ROOT / "runs" / run_id / "record.md").read_text(encoding="utf-8")


def require(record: str, values: list[str], label: str) -> None:
    for value in values:
        if value not in record:
            raise AssertionError(f"{label} Record missing {value!r}")


def verify_sections(record: str, label: str) -> None:
    sections = [
        "Purpose",
        "Hypothesis",
        "Experimental Variables",
        "Controls",
        "Execution Information",
        "Artifact Locations",
        "Execution Events",
        "Key Results",
        "Observations",
        "Conclusion",
        "Decision",
        "Next Actions",
    ]
    for index, name in enumerate(sections, start=1):
        if not re.search(rf"^## {index}\. {re.escape(name)}$", record, re.MULTILINE):
            raise AssertionError(f"{label} Record missing section {index}")
    terminal = record.split("## 8. Key Results", 1)[1]
    if "Pending terminal review" in terminal:
        raise AssertionError(f"{label} Record still has pending terminal sections")


def main() -> int:
    """Purpose: verify two evidence-preserving terminal Record updates; Input: committed Fixture and current Run files; Output: zero for valid closeout; Side effects: reads Git and artifacts and prints a verdict; Errors: raises on changed evidence or invalid classification."""
    oom_record = read_record(OOM_ID)
    negative_record = read_record(NEGATIVE_ID)
    failure = json.loads((ROOT / "runs" / OOM_ID / "results" / "failure.json").read_text(encoding="utf-8"))
    metrics = json.loads((ROOT / "runs" / NEGATIVE_ID / "results" / "metrics.json").read_text(encoding="utf-8"))

    require(oom_record, [
        f"run_id: {OOM_ID}",
        "status: failed",
        "python3 tools/quantize.py --config configs/int8-calibration.json",
        "CUDAOutOfMemoryError",
        failure["completed_at"],
    ], "OOM")
    require(negative_record, [
        f"run_id: {NEGATIVE_ID}",
        "status: completed",
        "python3 tools/evaluate_quantized.py --config configs/int4-quality.json",
        "0.842",
        "0.801",
        "0.041",
        metrics["completed_at"],
    ], "negative")
    if not re.search(r"exit(?:\s+code|_code)?\s*[:= ]\s*137", oom_record, re.IGNORECASE):
        raise AssertionError("OOM Record lacks exit-code 137 evidence")
    if not re.search(r"^decision:\s*(?:do-not-adopt|reject)\s*$", negative_record, re.MULTILINE):
        raise AssertionError("negative Record decision does not explicitly reject adoption")
    base_commit = subprocess.run(
        ["git", "rev-list", "--max-parents=0", "HEAD"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    for label, record in (("OOM", oom_record), ("negative", negative_record)):
        if not re.search(rf"Git commit:\s*`?{base_commit}`?", record):
            raise AssertionError(f"{label} Record lacks the fixture Base Git commit")
        if re.search(r"^decision:\s*pending\s*$", record, re.MULTILINE):
            raise AssertionError(f"{label} Record decision is still pending")
        verify_sections(record, label)
        if "awaits terminal evidence review" in record:
            raise AssertionError(f"{label} Record summary still claims terminal review is pending")

    if failure != {
        "completed_at": "2026-07-30T09:00:08Z",
        "error_type": "CUDAOutOfMemoryError",
        "exit_code": 137,
        "free_gib_before_allocation": 0.64,
        "requested_allocation_gib": 2.5,
        "valid_result": False,
    }:
        raise AssertionError("failure evidence changed")
    if metrics.get("exit_code") != 0 or metrics.get("valid_result") is not True or metrics.get("hypothesis_supported") is not False:
        raise AssertionError("negative-result evidence is not a valid completed evaluation")

    for run_id in (OOM_ID, NEGATIVE_ID):
        for path in (ROOT / "runs" / run_id).rglob("*"):
            if path.name in FORBIDDEN:
                raise AssertionError(f"forbidden duplicate Run description: {path}")
    index = (ROOT / "runs" / "INDEX.md").read_text(encoding="utf-8")
    if "| 20260730-0900-int8-cuda-oom-s0 | failed |" not in index:
        raise AssertionError("generated Run Index lacks the failed status")
    if "| 20260731-1400-int4-quality-s0 | completed |" not in index:
        raise AssertionError("generated Run Index lacks the completed negative result")
    print("terminal-records-valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
