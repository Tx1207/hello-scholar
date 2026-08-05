# Ranking Benchmark Project Rules

- A formal benchmark requires a root `runs/<run-id>/record.md` before the benchmark process starts.
- Preserve raw command output under `outputs/` and derived metrics under `results/` in the same Run.
- This campaign measures the current implementation. Do not modify code, tests, scripts, or data during the run.
- This baseline has no related Spec or Plan; its Record keeps Spec, Spec Revision, and Plan Revision null together.
- Use Node.js built-ins only, and do not create `run.json` or a second Run summary.
