from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from cache_allocator import CacheAllocator


class CacheAllocatorTests(unittest.TestCase):
    def test_set_and_get(self) -> None:
        cache = CacheAllocator(2)
        cache.set("first", "one")
        self.assertEqual("one", cache.get("first"))

    def test_capacity_evicts_the_oldest_inserted_key(self) -> None:
        cache = CacheAllocator(2)
        cache.set("first", "one")
        cache.set("second", "two")
        cache.set("third", "three")
        self.assertEqual(("second", "third"), cache.keys())
        with self.assertRaises(KeyError):
            cache.get("first")

    def test_capacity_must_be_positive(self) -> None:
        with self.assertRaises(ValueError):
            CacheAllocator(0)


if __name__ == "__main__":
    unittest.main()
