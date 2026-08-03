import unittest

from formatter import format_invalid_token


class FormatterTests(unittest.TestCase):
    def test_formats_invalid_token_for_cli_users(self):
        self.assertEqual("Bad token '@' at 7", format_invalid_token("@", 7))

    def test_rejects_non_positive_columns(self):
        with self.assertRaisesRegex(ValueError, "column must be positive"):
            format_invalid_token("@", 0)

    def test_public_snapshot_matches(self):
        with open("snapshots/error-output.txt", encoding="utf-8") as snapshot:
            self.assertEqual(snapshot.read().strip(), format_invalid_token("@", 7))


if __name__ == "__main__":
    unittest.main()
