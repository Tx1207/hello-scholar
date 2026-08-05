"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { buildCacheKey } = require("../src/cache-key");

test("builds a tenant-scoped key", () => {
  assert.equal(
    buildCacheKey("tenant-7", { resource: "paper", id: 12 }),
    'tenant-7:{"resource":"paper","id":12}',
  );
});

test("rejects an empty namespace", () => {
  assert.throws(() => buildCacheKey("", "value"), /namespace/);
});
