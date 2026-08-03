# Ranking Benchmark Project Rules

- Formal benchmarks require a root `runs/<run-id>/record.md` before the benchmark process starts.
- Preserve raw command output under `outputs/` and derived metrics under `results/` in the same Run.
- This campaign measures the current implementation. Do not modify code, tests, scripts, or data during the run.
- Experiment-first Runs use null Spec, Spec Revision, and Plan Revision together.
- Use Node.js built-ins only, and do not create `run.json` or a second Run summary.
