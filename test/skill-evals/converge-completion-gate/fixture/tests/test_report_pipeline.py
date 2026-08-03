from pathlib import Path
import json
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT / "clients"))

from daily_report_job import run_daily_report
from report_pipeline import build_report, write_report


class ReportPipelineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.source = ROOT / "data/orders.csv"

    def test_groups_orders_with_stable_region_order(self) -> None:
        report = build_report(self.source)
        self.assertEqual(2, report["schema_version"])
        self.assertEqual(["east", "west"], [group["region"] for group in report["groups"]])
        self.assertEqual(2000, report["groups"][0]["amount_cents"])

    def test_writes_json_report_for_daily_job(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "summary.json"
            self.assertEqual(destination, write_report(self.source, destination))
            self.assertEqual(2, json.loads(destination.read_text())["schema_version"])

    def test_daily_job_still_supports_csv_output(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "summary.csv"
            run_daily_report(self.source, destination, output_format="csv")
            self.assertIn("east,2,2000", destination.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
