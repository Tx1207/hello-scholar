import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / "src"))

from cache_model import evaluate_trace


def load_inputs() -> tuple[dict[str, object], list[str]]:
    config = json.loads((ROOT / "benchmark" / "config.json").read_text(encoding="utf-8"))
    trace = json.loads((ROOT / "benchmark" / "request-trace.json").read_text(encoding="utf-8"))
    requests = trace.get("requests")
    if not isinstance(requests, list) or not requests or not all(isinstance(item, str) for item in requests):
        raise ValueError("request trace must contain non-empty string requests")
    if not isinstance(config.get("capacity"), int) or not isinstance(config.get("seed"), int):
        raise ValueError("benchmark capacity and seed must be integers")
    return config, requests


def resolve_run_dir(value: str) -> Path:
    relative = Path(value)
    if relative.is_absolute() or len(relative.parts) != 2 or relative.parts[0] != "runs":
        raise ValueError("run directory must be runs/<run-id>")
    resolved = (ROOT / relative).resolve()
    if resolved.parent != (ROOT / "runs").resolve():
        raise ValueError("run directory escapes the project runs directory")
    return resolved


def run_benchmark(run_dir: Path, config: dict[str, object], requests: list[str]) -> dict[str, object]:
    """Purpose: run one formal cache benchmark exactly once; Input: prepared Run directory, fixed config, and request trace; Output: observed metrics; Side effects: exclusively creates launch, result, and log evidence; Errors: rejects incomplete or previously launched Runs."""
    record_path = run_dir / "record.md"
    required_dirs = [run_dir / name for name in ("outputs", "results", "logs")]
    if not record_path.is_file() or any(not directory.is_dir() for directory in required_dirs):
        raise RuntimeError("record.md and process-write artifact directories must exist before benchmark start")
    record_text = record_path.read_text(encoding="utf-8")
    command = f"python3 scripts/benchmark_cache.py --run-dir runs/{run_dir.name}"
    for required in ("kind: record", f"run_id: {run_dir.name}", command, "checkpoints/"):
        if required not in record_text:
            raise RuntimeError(f"prelaunch record is missing {required!r}")

    started = datetime.now(timezone.utc).isoformat()
    sentinel = {
        "benchmark": "cache-admission-acceptance",
        "command": command,
        "started_at": started,
    }
    try:
        with (run_dir / ".launch-sentinel").open("x", encoding="utf-8") as stream:
            json.dump(sentinel, stream, indent=2, sort_keys=True)
            stream.write("\n")
    except FileExistsError as error:
        raise RuntimeError("this formal benchmark has already been launched") from error

    start_manifest = {
        "benchmark": "cache-admission-acceptance",
        "command": command,
        "record_exists_at_start": True,
        "record_sha256_at_start": hashlib.sha256(record_path.read_bytes()).hexdigest(),
        "started_at": started,
    }
    with (run_dir / "outputs" / "process-start.json").open("x", encoding="utf-8") as stream:
        json.dump(start_manifest, stream, indent=2, sort_keys=True)
        stream.write("\n")

    metrics = evaluate_trace(int(config["capacity"]), requests)
    metrics.update({
        "benchmark": "cache-admission-acceptance",
        "minimum_hit_rate": config["minimum_hit_rate"],
        "seed": config["seed"],
        "passed_threshold": metrics["hit_rate"] >= float(config["minimum_hit_rate"]),
    })
    with (run_dir / "results" / "metrics.json").open("x", encoding="utf-8") as stream:
        json.dump(metrics, stream, indent=2, sort_keys=True)
        stream.write("\n")
    with (run_dir / "logs" / "benchmark.log").open("x", encoding="utf-8") as stream:
        stream.write(
            f"started_at={started}\nrequests={metrics['request_count']}\nhit_rate={metrics['hit_rate']:.6f}\n"
        )
    return metrics


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-dir")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    config, requests = load_inputs()
    if args.dry_run:
        print(json.dumps({"dry_run": "valid", "requests": len(requests), "seed": config["seed"]}))
        return 0
    if not args.run_dir:
        parser.error("--run-dir is required unless --dry-run is used")
    metrics = run_benchmark(resolve_run_dir(args.run_dir), config, requests)
    print(json.dumps(metrics, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
