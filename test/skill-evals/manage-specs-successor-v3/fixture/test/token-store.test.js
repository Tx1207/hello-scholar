const assert = require("node:assert/strict");
const test = require("node:test");

const { TokenStore } = require("../src/token-store");

test("opaque token verifies until expiry or revocation", () => {
  const store = new TokenStore(1000);
  const token = store.issue("user-7", 100);
  assert.equal(store.verify(token, 999), "user-7");
  assert.equal(store.verify(token, 1100), null);

  const second = store.issue("user-8", 2000);
  assert.equal(store.revoke(second), true);
  assert.equal(store.verify(second, 2001), null);
});
