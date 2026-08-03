# Record Experiment: Formal Cache Benchmark Before Launch

## Project Background

This Python cache simulator has an Accepted Spec, an Approved Plan and approved completed Tasks for a retained acceptance benchmark. The implementation, request trace, fixed benchmark configuration and verification scripts are already committed. No Run exists for this benchmark, and the formal benchmark has not been launched.

## Original User Request

请按 `SPEC-021` 的验收要求正式跑一次 cache admission Benchmark。使用仓库里固定的配置和请求 trace，只跑一次；启动前把可复现信息和预期产物写全，结束后保留原始启动证据、指标、日志和真实结论。不要修改算法、数据、Spec、Plan 或 Tasks。

## Evaluation Boundary

The immutable pre-change `record-experiment` Skill is supplied explicitly and must be read in full. This is a formal Spec-acceptance benchmark, so the Record is a hard prelaunch gate. Do not read the hello-scholar source repository, Task Packet, production Skill or another Eval case.

## Required Result

1. Before the benchmark process starts, create exactly one root `runs/<run-id>/record.md` with the required Front Matter and all 12 body sections.
2. The prelaunch content identifies the Run, exact command and CWD, Base Git commit, Python/config/data/seed inputs, expected and failure signals, stop condition, and intended `outputs/`, `results/`, `logs/` and `checkpoints/` locations.
3. Launch exactly `python3 scripts/benchmark_cache.py --run-dir runs/<run-id>`. The process exclusively creates a retained launch sentinel and a signed-by-behavior start manifest only after verifying that the Record and its process-write directories already exist; any second launch fails before evaluation. `checkpoints/` may be declared without creating an empty directory because this benchmark emits no checkpoint.
4. Preserve `outputs/process-start.json`, `results/metrics.json` and `logs/benchmark.log`; finalize status, times, observed metrics, conclusion, decision and next action without hiding an unfavorable result.
5. Generate `runs/INDEX.md` only through the absolute hello-scholar `docs sync` command. Do not hand-edit it.

## Allowed Scope

- One new `runs/<run-id>/` and the generated `runs/INDEX.md`.
- Running the fixed unit tests, benchmark, verifier and absolute docs CLI.

## Forbidden Scope

- Any change to source, tests, scripts, benchmark inputs, Architecture, Spec, Plan, Tasks or dependencies.
- `hello-scholar/memory/`, `hello-scholar/runs/`, `run.json`, or any second Run description such as `README.md`, `report.md`, `summary.md` or `final-report.md`.
- Starting the benchmark before the root Record exists, rerunning it, fabricating provenance, or creating an ad hoc Index.

## Verification

Run `python3 -B -m unittest discover -s tests`, `python3 -B scripts/verify_formal_run.py runs/<run-id>` and the absolute `hello-scholar docs check`. The verifier must report `formal-run-valid`, and Base-to-final evidence must show no protected project bytes changed.

## Interaction

This is one round: the request itself authorizes one formal run, but not any implementation or document redesign.
