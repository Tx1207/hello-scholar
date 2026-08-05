from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from text_normalizer import normalize_text


class TextNormalizerTests(unittest.TestCase):
    def test_trims_surrounding_spaces(self) -> None:
        self.assertEqual("search result", normalize_text("  search result  "))

    def test_preserves_single_word_boundaries(self) -> None:
        self.assertEqual("alpha beta", normalize_text("alpha beta"))

    def test_rejects_non_string_values(self) -> None:
        with self.assertRaises(TypeError):
            normalize_text(None)  # type: ignore[arg-type]


if __name__ == "__main__":
    unittest.main()
