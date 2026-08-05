import unittest

from src.bundle_rules import normalize_owner, owns_rule


class BundleRuleTests(unittest.TestCase):
    def test_owner_normalization(self) -> None:
        """Purpose: verify canonical owner labels; Input: representative label; Output: none; Errors: assertion failure on regression."""
        self.assertEqual("security", normalize_owner(" Security "))

    def test_rule_ownership(self) -> None:
        """Purpose: verify namespace matching; Input: matching and nonmatching rule IDs; Output: none; Errors: assertion failure on regression."""
        self.assertTrue(owns_rule("Security", "security:token-expiry"))
        self.assertFalse(owns_rule("Security", "billing:token-expiry"))


if __name__ == "__main__":
    unittest.main()
