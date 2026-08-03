from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from policy import PolicyEngine


class PolicyEngineTests(unittest.TestCase):
    def test_tenant_rule_overrides_global_default(self) -> None:
        engine = PolicyEngine({"search-v2": False}, {"tenant-a": {"search-v2": True}})
        self.assertTrue(engine.evaluate("search-v2", "tenant-a"))

    def test_global_default_applies_without_tenant_rule(self) -> None:
        engine = PolicyEngine({"search-v2": True}, {})
        self.assertTrue(engine.evaluate("search-v2", "tenant-a"))
        self.assertFalse(engine.evaluate("unknown", "tenant-a"))


if __name__ == "__main__":
    unittest.main()
