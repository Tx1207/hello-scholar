from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from localization_parser.parser import extract_placeholders


class PlaceholderParserTests(unittest.TestCase):
    def test_extracts_placeholders_in_first_seen_order(self) -> None:
        self.assertEqual(
            ("user", "city"),
            extract_placeholders("Hello {user} in {city}; welcome {user}"),
        )

    def test_ignores_invalid_placeholder_names(self) -> None:
        self.assertEqual((), extract_placeholders("{Upper} {two-words} {}"))


if __name__ == "__main__":
    unittest.main()
