from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from batch_processor import process_batch


class BatchProcessorTests(unittest.TestCase):
    def test_normalizes_string_items(self) -> None:
        self.assertEqual(
            [{"index": 0, "value": "alpha"}],
            process_batch([" Alpha "]),
        )

    def test_preserves_result_order(self) -> None:
        self.assertEqual(
            [
                {"index": 0, "value": "second"},
                {"index": 1, "value": "first"},
            ],
            process_batch(["second", "first"]),
        )

    def test_invalid_item_does_not_abort_neighbors(self) -> None:
        self.assertEqual(
            [
                {"index": 0, "value": "ok"},
                {"index": 1, "error": "item must be a string"},
                {"index": 2, "value": "still-ok"},
            ],
            process_batch(["ok", 3, "still-ok"]),
        )


if __name__ == "__main__":
    unittest.main()
