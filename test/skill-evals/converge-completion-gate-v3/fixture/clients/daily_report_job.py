from pathlib import Path

from legacy_csv_export import write_legacy_csv
from report_pipeline import write_report


def run_daily_report(source: Path, destination: Path, output_format: str = "json") -> Path:
    if output_format == "csv":
        return write_legacy_csv(source, destination)
    return write_report(source, destination)
