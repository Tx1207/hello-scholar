"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { Scheduler } = require("../src/scheduler");
const { scheduleReport } = require("../consumers/reporting-worker");

test("leases jobs in FIFO order within a queue", () => {
  const scheduler = new Scheduler();
  const first = scheduler.enqueue("reports", { reportId: "r-1" });
  const second = scheduler.enqueue("reports", { reportId: "r-2" });
  assert.equal(scheduler.lease("reports").id, first);
  assert.equal(scheduler.lease("reports").id, second);
});

test("failed leases are delivered again", () => {
  const scheduler = new Scheduler();
  const id = scheduler.enqueue("reports", { reportId: "r-3" });
  assert.equal(scheduler.lease("reports").id, id);
  assert.equal(scheduler.fail(id), true);
  const retried = scheduler.lease("reports");
  assert.equal(retried.id, id);
  assert.equal(retried.attempts, 2);
});

test("the reporting consumer uses the public enqueue contract", () => {
  const scheduler = new Scheduler();
  const id = scheduleReport(scheduler, "r-4");
  assert.deepEqual(scheduler.lease("reports"), {
    id,
    queue: "reports",
    payload: { type: "render-report", reportId: "r-4" },
    attempts: 1,
  });
});
