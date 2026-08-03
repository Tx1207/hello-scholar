from pathlib import Path
import sys
import unittest


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from retrieval_api import Document, RetrievalApi


class RetrievalApiTests(unittest.TestCase):
    def test_retrieves_one_document_or_none(self) -> None:
        api = RetrievalApi([Document("doc-1", "alpha")])
        self.assertEqual(Document("doc-1", "alpha"), api.retrieve_one("doc-1"))
        self.assertIsNone(api.retrieve_one("missing"))


if __name__ == "__main__":
    unittest.main()
