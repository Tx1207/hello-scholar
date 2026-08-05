from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from pipeline import Candidate, RankingPipeline


class RankingPipelineTests(unittest.TestCase):
    def test_low_confidence_uses_lexical_order(self) -> None:
        values = [Candidate("lexical", 0.9, 0.0), Candidate("feature", 0.4, 1.0)]
        self.assertEqual(["lexical", "feature"], RankingPipeline().rank(values, 0.2))

    def test_high_confidence_blends_features(self) -> None:
        values = [Candidate("lexical", 0.7, 0.0), Candidate("feature", 0.4, 1.0)]
        self.assertEqual(["feature", "lexical"], RankingPipeline().rank(values, 0.8))


if __name__ == "__main__":
    unittest.main()
