import json
from pathlib import Path


class ExportFormatError(ValueError):
    pass


def read_events(path: Path) -> list[dict]:
    if path.suffix != ".jsonl":
        raise ExportFormatError(f"unsupported archive suffix: {path.name}")
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines()]
