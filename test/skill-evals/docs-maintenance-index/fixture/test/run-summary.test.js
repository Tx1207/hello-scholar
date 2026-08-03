const assert = require("node:assert/strict");
const test = require("node:test");

const { completedCount, sortRunSummaries } = require("../src/run-summary");

test("sorts summaries newest-first", () => {
  const values = [
    { id: "older", started: "2026-07-30T10:00:00Z", status: "failed" },
    { id: "newer", started: "2026-07-31T12:00:00Z", status: "completed" },
  ];
  assert.deepEqual(sortRunSummaries(values).map((run) => run.id), ["newer", "older"]);
  assert.equal(values[0].id, "older");
});

test("counts only completed runs", () => {
  assert.equal(completedCount([{ status: "completed" }, { status: "failed" }]), 1);
});
