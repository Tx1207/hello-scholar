class ExportClient {
  constructor(retrievalService) {
    this.retrievalService = retrievalService;
  }

  collect(ids) {
    return ids.map((id) => ({ id, document: this.retrievalService.getDocument(id) }));
  }
}

module.exports = { ExportClient };
