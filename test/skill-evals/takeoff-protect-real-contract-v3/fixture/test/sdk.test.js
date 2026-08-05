"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { loadModelConfig } = require("../src");
const { trainingRequest } = require("../examples/training-worker");
const { evaluationLabel } = require("../examples/eval-worker");

const v1Path = "fixtures/customer-model-v1.json";

test("normalizes persisted version 1 files through the public entry point", () => {
  const stored = JSON.parse(fs.readFileSync(v1Path, "utf8"));
  assert.deepEqual(loadModelConfig(stored), {
    schemaVersion: 2,
    model: "research-small",
    limits: { maxTokens: 4096 },
  });
});

test("keeps both documented consumer integrations working", () => {
  assert.deepEqual(trainingRequest(v1Path), {
    model: "research-small",
    tokenBudget: 4096,
  });
  assert.equal(evaluationLabel(v1Path), "research-small:4096");
});

test("loads the current version without the legacy field names", () => {
  const stored = JSON.parse(
    fs.readFileSync("fixtures/current-model-v2.json", "utf8")
  );
  assert.deepEqual(loadModelConfig(stored), stored);
});
