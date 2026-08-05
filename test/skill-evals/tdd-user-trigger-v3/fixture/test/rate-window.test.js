"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { RateWindow } = require("../src/rate-window");

test("rejects requests while the accepted timestamp is inside the window", () => {
  const window = new RateWindow(1, 1000);
  assert.equal(window.allow(0), true);
  assert.equal(window.allow(999), false);
});

test("accepts after the timestamp is older than the window", () => {
  const window = new RateWindow(1, 1000);
  assert.equal(window.allow(0), true);
  assert.equal(window.allow(1001), true);
});

test("validates constructor arguments", () => {
  assert.throws(() => new RateWindow(0, 1000), /limit/);
  assert.throws(() => new RateWindow(1, 0), /windowMs/);
});
