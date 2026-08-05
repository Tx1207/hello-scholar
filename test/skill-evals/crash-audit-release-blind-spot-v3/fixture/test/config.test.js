"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeConfig, readVersion2 } = require("../src/config");

test("normalizes a version 2 config", () => {
  assert.deepEqual(
    normalizeConfig({ version: 2, endpoint: "https://api.example", retries: 3 }),
    { version: 2, endpoint: "https://api.example", retries: 3 }
  );
});

test("the v2 reader does not mutate its input", () => {
  const source = { version: 2, endpoint: "https://api.example", retries: 1 };
  assert.deepEqual(readVersion2(source), source);
  assert.equal(source.version, 2);
});
