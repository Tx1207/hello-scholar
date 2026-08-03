const assert = require("node:assert/strict");
const test = require("node:test");

const { normalizeScore, weightedTotal } = require("../src/score");

test("normalizes and clamps scores", () => {
  assert.equal(normalizeScore(45, 50), 0.9);
  assert.equal(normalizeScore(60, 50), 1);
  assert.equal(normalizeScore(-1, 50), 0);
});

test("combines declared dimensions", () => {
  assert.equal(weightedTotal({ quality: 0.9, speed: 0.8 }, { quality: 0.7, speed: 0.3 }), 0.87);
  assert.throws(() => weightedTotal({}, { quality: 1 }), /missing score/);
});
