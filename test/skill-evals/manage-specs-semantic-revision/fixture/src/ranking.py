from dataclasses import dataclass


@dataclass(frozen=True)
class Document:
    document_id: str
    lexical_score: float
    intent_score: float
    freshness_score: float


def rank_documents(documents: list[Document], intent_threshold: float = 0.62) -> list[str]:
    def score(document: Document) -> float:
        semantic = document.intent_score if document.intent_score >= intent_threshold else 0.0
        return document.lexical_score * 0.7 + semantic * 0.2 + document.freshness_score * 0.1

    ranked = sorted(enumerate(documents), key=lambda item: (-score(item[1]), item[0]))
    return [document.document_id for _, document in ranked]
