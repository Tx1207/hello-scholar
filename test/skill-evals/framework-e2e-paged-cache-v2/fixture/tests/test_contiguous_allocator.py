from pathlib import Path
import sys
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from kv_cache.contiguous_allocator import CacheAllocator


class ContiguousAllocatorTests(unittest.TestCase):
    def test_allocate_release_and_reuse(self) -> None:
        allocator = CacheAllocator(8)
        self.assertEqual((0, 1, 2), allocator.allocate("first", 3))
        self.assertEqual((3, 4), allocator.allocate("second", 2))
        allocator.release("first")
        self.assertEqual((0, 1, 2), allocator.allocate("third", 3))

    def test_duplicate_and_unknown_requests_are_rejected(self) -> None:
        allocator = CacheAllocator(8)
        allocator.allocate("first", 2)
        with self.assertRaises(ValueError):
            allocator.allocate("first", 1)
        with self.assertRaises(KeyError):
            allocator.release("missing")

    def test_fragmentation_can_fail_with_enough_total_capacity(self) -> None:
        allocator = CacheAllocator(12)
        for index in range(4):
            allocator.allocate(f"seed-{index}", 3)
        allocator.release("seed-0")
        allocator.release("seed-2")
        self.assertEqual(6, allocator.free_block_count())
        with self.assertRaises(MemoryError):
            allocator.allocate("fragmented", 6)


if __name__ == "__main__":
    unittest.main()
