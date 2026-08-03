function sortRunSummaries(runs) {
  // Purpose: order Run summaries newest-first with stable ID ties; Input: Run summary array; Output: sorted copy.
  return [...runs].sort((left, right) =>
    right.started.localeCompare(left.started) || left.id.localeCompare(right.id)
  );
}

function completedCount(runs) {
  // Purpose: count completed Run summaries; Input: Run summary array; Output: number with completed status.
  return runs.filter((run) => run.status === "completed").length;
}

module.exports = { completedCount, sortRunSummaries };
