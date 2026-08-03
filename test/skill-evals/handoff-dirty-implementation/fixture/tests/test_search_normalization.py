from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from search_normalization import normalize_query


class SearchNormalizationTests(unittest.TestCase):
    def test_collapses_unicode_whitespace(self) -> None:
        self.assertEqual("Vector Cache", normalize_query(" Vector\t Cache\n"))

    def test_applies_nfkc_normalization(self) -> None:
        self.assertEqual("ABC", normalize_query("ＡＢＣ"))

    def test_rejects_non_string_query(self) -> None:
        with self.assertRaises(TypeError):
            normalize_query(None)  # type: ignore[arg-type]


if __name__ == "__main__":
    unittest.main()
