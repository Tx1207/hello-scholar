from pathlib import Path
import sys
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from exporter import export_events


EVENTS = [{"event_id": "e-1", "kind": "created", "payload": {"value": 3}}]


class ExporterTests(unittest.TestCase):
    def test_exports_canonical_jsonl_and_result_fields(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            destination = Path(directory) / "events.jsonl"
            result = export_events(EVENTS, destination)

            self.assertEqual(destination, result.path)
            self.assertEqual(1, result.event_count)
            self.assertEqual(destination.stat().st_size, result.byte_count)
            self.assertEqual(
                '{"event_id":"e-1","kind":"created","payload":{"value":3}}\n',
                destination.read_text(encoding="utf-8"),
            )


if __name__ == "__main__":
    unittest.main()
