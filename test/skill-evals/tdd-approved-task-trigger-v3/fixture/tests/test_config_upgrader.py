from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from config_upgrader import upgrade


class ConfigUpgraderTests(unittest.TestCase):
    def test_upgrades_valid_version_one_config(self) -> None:
        self.assertEqual(
            {
                "version": 2,
                "service": {"endpoint": "https://api.example"},
                "retry": {"max_attempts": 3},
            },
            upgrade(
                {
                    "version": 1,
                    "endpoint": "https://api.example",
                    "retries": 3,
                }
            ),
        )

    def test_rejects_missing_required_values(self) -> None:
        with self.assertRaisesRegex(ValueError, "endpoint"):
            upgrade({"version": 1, "retries": 2})
        with self.assertRaisesRegex(ValueError, "retries"):
            upgrade({"version": 1, "endpoint": "https://api.example"})


if __name__ == "__main__":
    unittest.main()
