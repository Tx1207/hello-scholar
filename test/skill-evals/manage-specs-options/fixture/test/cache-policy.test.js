const assert = require("node:assert/strict");
const test = require("node:test");

const { CachePolicy } = require("../src/cache-policy");

test("evicts the least recently used key", () => {
  const cache = new CachePolicy(2);
  cache.put("a", 1);
  cache.put("b", 2);
  assert.equal(cache.get("a"), 1);
  assert.equal(cache.put("c", 3), "b");
  assert.equal(cache.get("b"), undefined);
  assert.equal(cache.get("c"), 3);
});
