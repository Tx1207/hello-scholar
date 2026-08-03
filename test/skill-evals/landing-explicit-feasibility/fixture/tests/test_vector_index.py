import unittest

from clients.search_api import search
from src.vector_index import VectorIndex


class VectorIndexTests(unittest.TestCase):
    def setUp(self):
        self.index = VectorIndex()
        self.index.upsert("tenant-a", "paper-a", [1.0, 0.0])
        self.index.upsert("tenant-b", "paper-b", [1.0, 0.0])

    def test_query_returns_only_the_requested_tenant_partition(self):
        self.assertEqual(["paper-a"], self.index.query("tenant-a", [1.0, 0.0], 5))
        self.assertEqual(["paper-b"], self.index.query("tenant-b", [1.0, 0.0], 5))

    def test_public_search_caller_keeps_the_query_contract(self):
        self.assertEqual(["paper-a"], search(self.index, "tenant-a", [1.0, 0.0]))

    def test_invalid_tenant_and_limit_are_rejected(self):
        with self.assertRaisesRegex(ValueError, "tenant_id is required"):
            self.index.upsert("", "paper", [1.0])
        with self.assertRaisesRegex(ValueError, "limit must be positive"):
            self.index.query("tenant-a", [1.0], 0)


if __name__ == "__main__":
    unittest.main()
