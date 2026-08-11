from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from cache_model import LruCache, evaluate_trace


class LruCacheTests(unittest.TestCase):
    def test_hit_refreshes_recency(self) -> None:
        cache = LruCache(2)
        self.assertFalse(cache.access("a"))
        self.assertFalse(cache.access("b"))
        self.assertTrue(cache.access("a"))
        self.assertFalse(cache.access("c"))
        self.assertTrue(cache.access("a"))
        self.assertFalse(cache.access("b"))

    def test_trace_metrics_are_deterministic(self) -> None:
        self.assertEqual(
            {
                "capacity": 2,
                "request_count": 6,
                "hits": 2,
                "hit_rate": 1 / 3,
            },
            evaluate_trace(2, ["a", "b", "a", "c", "a", "b"]),
        )


if __name__ == "__main__":
    unittest.main()
