"use strict";

class QueryService {
  constructor(searchAdapter) {
    this.searchAdapter = searchAdapter;
  }

  async query(text) {
    if (typeof text !== "string" || text.trim() === "") {
      throw new TypeError("query text must be non-empty");
    }
    return this.searchAdapter.search(text.trim());
  }
}

module.exports = { QueryService };
