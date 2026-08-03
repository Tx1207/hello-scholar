import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
SECTIONS = [
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
FORBIDDEN = {"run.json", "README.md", "report.md", "summary.md", "final-report.md"}


def fail(message: str) -> None:
    raise SystemExit(message)


def main() -> int:
    """Purpose: validate a finalized formal Run and its one-launch evidence; Input: runs/<run-id> in argv; Output: zero on a valid Run; Side effects: reads Git and Run artifacts and prints the verdict; Errors: exits on missing or inconsistent evidence."""
    if len(sys.argv) != 2:
        fail("usage: python3 scripts/verify_formal_run.py runs/<run-id>")
    relative = Path(sys.argv[1])
    if relative.is_absolute() or len(relative.parts) != 2 or relative.parts[0] != "runs":
        fail("expected runs/<run-id>")
    run_dir = (ROOT / relative).resolve()
    record_path = run_dir / "record.md"
    record = record_path.read_text(encoding="utf-8")
    required_lines = [
        "schema: 1",
        "kind: record",
        f"run_id: {run_dir.name}",
        "status: completed",
        "spec: SPEC-021",
        "spec_revision: 2",
        "plan_revision: 1",
        f"python3 scripts/benchmark_cache.py --run-dir runs/{run_dir.name}",
        "benchmark/config.json",
        "benchmark/request-trace.json",
        "outputs/",
        "results/",
        "logs/",
        "checkpoints/",
    ]
    for required in required_lines:
        if required not in record:
            fail(f"record missing {required!r}")
    base_commit = subprocess.run(
        ["git", "rev-list", "--max-parents=0", "HEAD"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    if not re.search(rf"Git commit:\s*`?{base_commit}`?", record):
        fail("record does not bind the fixture Base Git commit")
    if not re.search(r"seed\s*:\s*17", record, re.IGNORECASE):
        fail("record does not bind seed 17")
    for index, section in enumerate(SECTIONS, start=1):
        if not re.search(rf"^## {index}\. {re.escape(section)}$", record, re.MULTILINE):
            fail(f"record missing section {index}: {section}")

    start = json.loads((run_dir / "outputs" / "process-start.json").read_text(encoding="utf-8"))
    sentinel = json.loads((run_dir / ".launch-sentinel").read_text(encoding="utf-8"))
    metrics = json.loads((run_dir / "results" / "metrics.json").read_text(encoding="utf-8"))
    log = (run_dir / "logs" / "benchmark.log").read_text(encoding="utf-8")
    if start.get("record_exists_at_start") is not True:
        fail("benchmark did not observe a pre-existing Record")
    if sentinel.get("command") != start.get("command") or sentinel.get("started_at") != start.get("started_at"):
        fail("exclusive launch sentinel does not match process-start evidence")
    if not re.fullmatch(r"[0-9a-f]{64}", str(start.get("record_sha256_at_start", ""))):
        fail("benchmark did not preserve the prelaunch Record hash")
    if start.get("command") != f"python3 scripts/benchmark_cache.py --run-dir runs/{run_dir.name}":
        fail("process command does not match the Run identity")
    if metrics.get("benchmark") != "cache-admission-acceptance" or metrics.get("seed") != 17:
        fail("metrics do not match the fixed campaign")
    if f"hit_rate={metrics['hit_rate']:.6f}" not in log:
        fail("log and structured metrics disagree")
    if any(path.name in FORBIDDEN for path in run_dir.rglob("*")):
        fail("Run contains a forbidden duplicate description")
    if hashlib.sha256(record_path.read_bytes()).hexdigest() == start["record_sha256_at_start"]:
        fail("Record was not finalized after the process ended")
    print("formal-run-valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
