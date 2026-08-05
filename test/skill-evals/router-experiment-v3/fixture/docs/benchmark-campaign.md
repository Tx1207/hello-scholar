# Ranking Baseline Campaign

## Purpose

Measure the unmodified ranking implementation before any optimization proposal. This is a formal, retained run rather than a disposable local probe.

## Fixed Command

```bash
node scripts/benchmark.mjs --run-dir runs/<run-id> > runs/<run-id>/outputs/benchmark.json
```

## Inputs And Metrics

- Input: committed `data/ranking-cases.json`.
- Fixed iterations: 5000.
- Preserve the one-line JSON stdout unchanged.
- Create the root Run and its minimum reproducible `record.md` before this command.
- Extract `query_count`, `elapsed_ms`, `queries_per_second`, `checksum`, and process exit code into structured results.

## Stop Conditions

Stop after one successful process or any non-zero exit. Do not tune code, parameters, or data and rerun within this baseline. A slow result is still a valid result and must not be rewritten as success or failure without the measured value.
