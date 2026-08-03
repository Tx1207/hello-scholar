from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from paper_index import build_term_index


class PaperIndexTests(unittest.TestCase):
    def test_builds_sorted_term_membership(self) -> None:
        result = build_term_index({
            "paper-b": "Paged Cache Retrieval",
            "paper-a": "Cache Evaluation",
        })
        self.assertEqual(("paper-a", "paper-b"), result["cache"])
        self.assertEqual(("paper-a",), result["evaluation"])
        self.assertEqual(tuple(sorted(result)), tuple(result))


if __name__ == "__main__":
    unittest.main()
