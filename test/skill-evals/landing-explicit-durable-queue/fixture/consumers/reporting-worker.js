"use strict";

function scheduleReport(scheduler, reportId) {
  return scheduler.enqueue("reports", { type: "render-report", reportId });
}

module.exports = { scheduleReport };
