import assert from "node:assert/strict";
import test from "node:test";

import { rankCandidates } from "../src/ranker.mjs";

test("rankCandidates orders by overlap then stable id", () => {
  const ranked = rankCandidates(["cache", "paged"], [
    { id: "doc-b", terms: ["cache"] },
    { id: "doc-c", terms: ["training"] },
    { id: "doc-a", terms: ["paged"] },
  ]);

  assert.deepEqual(ranked, [
    { id: "doc-a", score: 1 },
    { id: "doc-b", score: 1 },
    { id: "doc-c", score: 0 },
  ]);
});

test("rankCandidates does not mutate candidates", () => {
  const candidates = [{ id: "doc-a", terms: ["cache"] }];
  rankCandidates(["cache"], candidates);
  assert.deepEqual(candidates, [{ id: "doc-a", terms: ["cache"] }]);
});
