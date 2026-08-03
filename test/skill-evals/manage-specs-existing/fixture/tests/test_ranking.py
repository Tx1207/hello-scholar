from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from ranking import Document, rank_documents


class RankingTests(unittest.TestCase):
    def test_exact_score_remains_strongest_signal(self) -> None:
        documents = [
            Document("exact", 1.0, 0.0, 0.0),
            Document("semantic", 0.1, 1.0, 0.0),
        ]
        self.assertEqual(["exact", "semantic"], rank_documents(documents))

    def test_intent_below_threshold_is_ignored(self) -> None:
        documents = [
            Document("first", 0.4, 0.61, 0.0),
            Document("second", 0.39, 0.9, 0.0),
        ]
        self.assertEqual(["second", "first"], rank_documents(documents))


if __name__ == "__main__":
    unittest.main()
