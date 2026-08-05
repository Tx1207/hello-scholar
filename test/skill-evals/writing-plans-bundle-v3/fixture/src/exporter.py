from dataclasses import dataclass
import json
from pathlib import Path

from event_schema import validate_event


@dataclass(frozen=True)
class ExportResult:
    path: Path
    event_count: int
    byte_count: int


def _write_plaintext(events: list[dict], destination: Path) -> int:
    payload = "".join(
        json.dumps(event, sort_keys=True, separators=(",", ":")) + "\n"
        for event in events
    )
    destination.write_text(payload, encoding="utf-8")
    return len(payload.encode("utf-8"))


def export_events(events: list[dict], destination: Path) -> ExportResult:
    for event in events:
        validate_event(event)
    byte_count = _write_plaintext(events, destination)
    return ExportResult(destination, len(events), byte_count)
