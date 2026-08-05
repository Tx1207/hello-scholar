from pathlib import Path

from archive_reader import read_events
from exporter import ExportResult, export_events


def export_and_replay(events: list[dict], destination: Path) -> tuple[ExportResult, list[dict]]:
    result = export_events(events, destination)
    return result, read_events(result.path)
