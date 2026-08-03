class RetrievalService {
  constructor(documents) {
    this.documents = new Map(documents.map((document) => [document.id, { ...document }]));
  }

  getDocument(id) {
    const document = this.documents.get(id);
    return document ? { ...document } : null;
  }
}

module.exports = { RetrievalService };
