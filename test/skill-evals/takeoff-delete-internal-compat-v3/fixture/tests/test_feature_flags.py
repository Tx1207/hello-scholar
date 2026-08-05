import json
import unittest
from pathlib import Path

from src.feature_flags import FlagService, FlagStore, LegacyFlagAdapter
from src.web_app import dashboard_enabled


class FeatureFlagTests(unittest.TestCase):
    def setUp(self):
        flags = json.loads(Path("data/flags.json").read_text(encoding="utf-8"))
        self.service = FlagService(FlagStore(flags))

    def test_current_service_returns_booleans(self):
        self.assertIs(
            True,
            self.service.is_enabled("new-dashboard", {"user_id": "reader-1"}),
        )
        self.assertIs(
            False,
            self.service.is_enabled("bulk-export", {"user_id": "reader-1"}),
        )

    def test_repository_caller_uses_current_service(self):
        self.assertTrue(dashboard_enabled("reader-2"))

    def test_transitional_adapter_converts_the_same_result_to_integer(self):
        adapter = LegacyFlagAdapter(self.service)
        self.assertEqual(1, adapter.enabled_for_user("new-dashboard", "reader-3"))


if __name__ == "__main__":
    unittest.main()
