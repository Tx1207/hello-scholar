"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const { QueryService } = require("../src/query-service");

test("query validates and delegates one request", async () => {
  const seen = [];
  const service = new QueryService({
    async search(text) {
      seen.push(text);
      return [{ id: "doc-1", score: 0.9 }];
    },
  });

  assert.deepEqual(await service.query("  vector cache "), [
    { id: "doc-1", score: 0.9 },
  ]);
  assert.deepEqual(seen, ["vector cache"]);
});

test("query rejects empty text without calling the adapter", async () => {
  const service = new QueryService({
    async search() {
      throw new Error("adapter should not be called");
    },
  });

  await assert.rejects(service.query("   "), /non-empty/);
});
