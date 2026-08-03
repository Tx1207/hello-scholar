import assert from "node:assert/strict";
import test from "node:test";

import { routePrompt, scoreThreshold } from "../src/router.mjs";


test("explicit experiment terms select the experiment branch above threshold", () => {
  assert.equal(routePrompt("run the accepted benchmark", 0.7, 0.65), "experiment");
  assert.equal(routePrompt("run the accepted benchmark", 0.6, 0.65), "design");
});

test("threshold scoring returns a stable bounded metric", () => {
  const cases = [
    { prompt: "summarize paper", confidence: 0.9, expected: "fast" },
    { prompt: "design an API", confidence: 0.2, expected: "design" },
  ];
  assert.deepEqual(scoreThreshold(cases, 0.65), {
    threshold: 0.65,
    correct: 2,
    total: 2,
    accuracy: 1,
  });
});
