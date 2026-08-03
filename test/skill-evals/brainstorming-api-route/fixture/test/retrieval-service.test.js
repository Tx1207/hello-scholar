const assert = require("node:assert/strict");
const test = require("node:test");

const { ExportClient } = require("../clients/export-client");
const { RetrievalService } = require("../src/retrieval-service");

test("single lookup returns a copy or null", () => {
  const service = new RetrievalService([{ id: "doc-1", text: "alpha" }]);
  assert.deepEqual(service.getDocument("doc-1"), { id: "doc-1", text: "alpha" });
  assert.equal(service.getDocument("missing"), null);
});

test("export client currently preserves one result per input id", () => {
  const service = new RetrievalService([{ id: "doc-1", text: "alpha" }]);
  const result = new ExportClient(service).collect(["doc-1", "missing"]);
  assert.deepEqual(result, [
    { id: "doc-1", document: { id: "doc-1", text: "alpha" } },
    { id: "missing", document: null },
  ]);
});
