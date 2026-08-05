import csv
import json
from pathlib import Path


class ReportInputError(ValueError):
    pass


def build_report(source: Path) -> dict:
    totals: dict[str, dict[str, int]] = {}
    with source.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            amount = int(row["amount_cents"])
            group = totals.setdefault(row["region"], {"orders": 0, "amount_cents": 0})
            group["orders"] += 1
            group["amount_cents"] += amount
    return {
        "schema_version": 2,
        "groups": [
            {"region": region, **totals[region]}
            for region in sorted(totals)
        ],
    }


def write_report(source: Path, destination: Path) -> Path:
    report = build_report(source)
    destination.write_text(json.dumps(report, sort_keys=True) + "\n", encoding="utf-8")
    return destination
