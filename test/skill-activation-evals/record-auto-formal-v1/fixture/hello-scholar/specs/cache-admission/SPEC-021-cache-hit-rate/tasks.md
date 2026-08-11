---
schema: 1
kind: tasks
spec: SPEC-021
spec_revision: 2
plan_revision: 1
revision: 1
approval: approved
approved_revision: 1
status: completed
created: 2026-07-28
updated: 2026-07-28
---
# Cache Hit-Rate Acceptance Tasks

- [x] T001: Lock the fixed Benchmark identity
  - Spec Coverage: Revision 2 AC-1, AC-2, and AC-4
  - Depends On: None
  - Parallel: No
  - Files: `benchmark/config.json`, `benchmark/request-trace.json`
  - Work: Bind capacity 3, seed 17, the retained request trace, the 0.45 threshold, and the one-run stop condition.
  - Validation: Read the committed config and trace, then run the benchmark dry-run without launching the formal process.
  - Completion: The fixed inputs, threshold, and one-run boundary are directly represented by committed files and a successful dry-run.

- [x] T002: Implement deterministic execution and verification
  - Spec Coverage: Revision 2 AC-3 and AC-4
  - Depends On: T001
  - Parallel: No
  - Files: `src/cache_model.py`, `tests/test_cache_model.py`, `scripts/benchmark_cache.py`, `scripts/verify_formal_run.py`
  - Work: Provide deterministic unit tests, one-launch Benchmark execution, and verification of retained process and metric evidence.
  - Validation: Run `python3 -B -m unittest discover -s tests` and the Benchmark dry-run; both exit 0 without creating a Run.
  - Completion: Tests and scripts enforce prelaunch Record existence, exclusive launch, fixed inputs, raw process capture, and consistent metrics.

- [x] T003: Verify readiness for the authorized formal Run
  - Spec Coverage: Revision 2 AC-1 through AC-4
  - Depends On: T002
  - Parallel: No
  - Files: `hello-scholar/specs/cache-admission/SPEC-021-cache-hit-rate/tasks.md`
  - Work: Verify the accepted Spec, approved Plan, completed implementation, clean fixture, and exact separately authorized formal command.
  - Validation: Unit tests, dry-run, and `hello-scholar docs check` pass before the formal Run is launched.
  - Completion: Current evidence confirms one clean, reproducible formal launch can proceed without changing source, inputs, or parameters.
