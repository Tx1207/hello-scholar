import csv
from pathlib import Path

from report_pipeline import build_report


def write_legacy_csv(source: Path, destination: Path) -> Path:
    report = build_report(source)
    with destination.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["region", "orders", "amount_cents"])
        writer.writeheader()
        writer.writerows(report["groups"])
    return destination
