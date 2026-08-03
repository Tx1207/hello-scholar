from dataclasses import dataclass


@dataclass(frozen=True)
class Document:
    document_id: str
    text: str


class RetrievalApi:
    def __init__(self, documents: list[Document]) -> None:
        self._documents = {document.document_id: document for document in documents}

    def retrieve_one(self, document_id: str) -> Document | None:
        return self._documents.get(document_id)
