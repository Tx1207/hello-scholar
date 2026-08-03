import unittest

from src.retrieval import retrieve


class RetrievalTests(unittest.TestCase):
    def test_hybrid_score_and_filter(self) -> None:
        """Purpose: verify hybrid ranking and publication filtering; Input: representative paper facts; Output: none; Errors: assertion failure on regression."""
        documents = [
            {"id": "lexical", "title": "graph retrieval", "vector_score": 0.1, "published": True},
            {"id": "vector", "title": "neural search", "vector_score": 0.9, "published": True},
            {"id": "draft", "title": "graph retrieval", "vector_score": 1.0, "published": False},
        ]
        self.assertEqual(["lexical", "vector"], retrieve("graph retrieval", documents))

    def test_limit_validation(self) -> None:
        """Purpose: verify invalid result limits fail clearly; Input: zero limit; Output: none; Errors: assertion failure on regression."""
        with self.assertRaises(ValueError):
            retrieve("query", [], limit=0)


if __name__ == "__main__":
    unittest.main()
