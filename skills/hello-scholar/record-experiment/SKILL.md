---
name: record-experiment
description: Use when provenance needs a formal experiment launch record, time-bounded backfill for qualified exploration, or a material state/evidence event on an existing Run.
---

# Record experiment

Preserve experiment provenance in one recoverable Run Record. Keep experiment identity, execution evidence, and generated Indexes in their owners.

## 1. Classify the evidence boundary

Read `references/status-and-fields.md` before a Full record, a terminal update, or exploration backfill. Decide both record granularity and timing before launching or writing.

| Decision | Use when | Completion |
|---|---|---|
| Full record | A new experiment identity, durable metrics/results/predictions/checkpoints/reports, missing upstream provenance, or a durable derived report | One valid root Record has reproducible launch facts or bounded backfill facts |
| Append event | The same Run gains a material status, path, metric, error, decision, or terminal-evidence change | One concise event preserves the new durable fact without redefining identity |
| No record | Ordinary code/tests, static checks, read-only queries, or preparation that creates no research evidence | State why no durable experiment evidence was created |

**Formal prelaunch record.** Before a formal experiment, Benchmark, Release Eval, training run, expensive or long-running work, irreversible operation, production-data modification, or formal Spec-acceptance evidence, create a minimum reproducible Record before launch. Missing an exact command, CWD, or intended log and result locations blocks launch.

**Qualified exploration backfill.** Exploration may start without an initial Record only when every condition holds: it does not modify production data, perform an irreversible operation, change a public API or persistent format; it has an explicit time and cost cap; its code and artifacts are isolated from the formal production path; and its result does not directly enter that path. An existing branch, temporary directory, or Worktree can provide isolation; exploration does not create a Worktree automatically. If any condition is unknown or false, use the formal prelaunch record path.

Backfill a qualified exploration Run before session close, forming or sharing a conclusion, making a design decision, writing a dependent Spec, starting a dependent experiment, merging, or external sharing. Stop at that boundary until the Record exists.

**Completion:** the work has a formal prelaunch Record, a qualified exploration deadline, an Append event, or an explicit No record reason.

## 2. Establish experiment identity

Treat purpose, exact command, script, config, CLI overrides, seed, data version/split, preprocessing, input artifacts, upstream Run, model/checkpoint, evaluation or generation settings, backend, and intended log/result/checkpoint paths at launch as identity-defining facts.

A changed intended output path before launch creates a different identity. Actual paths discovered during the same Run are Append events. Loading a model or checkpoint to write predictions, generations, or other research outputs is an experiment command even when called data processing.

For a durable derived report, record consumed input artifacts, the upstream Run ID, and derived artifacts. If an upstream record is missing, create a retroactive Record with known facts and `Unknown` plus a reason for missing facts.

**Completion:** the identity either matches one existing Run or has enough facts to allocate a new Run safely.

## 3. Allocate one root Run

Write new Records only at:

```text
runs/<run-id>/record.md
```

Use `YYYYMMDD-HHMM-<short-topic>` and add `-s<seed>` when useful. The directory name, Front Matter `run_id`, and Run-owned artifact paths must use the same ID.

Inspect the target before writing:

- If a real existing `record.md` has the same identity, inputs, key configuration, and user intent, use Append event.
- If the directory belongs to another identity, lacks a verifiable Record, is a symlink, is not a directory, or cannot be classified safely, do not overwrite or reuse it.
- For a different identity in the same minute, allocate `-2`, then `-3`, and so on until the first unused directory. Recheck on creation; never delete, empty, rename, or overwrite an existing Run to claim an ID.

A Run has one explanatory document: `record.md`. Put large artifacts only where needed under its `outputs/`, `results/`, `logs/`, or `checkpoints/` directories. Do not create `run.json`, `README.md`, `report.md`, `summary.md`, or `final-report.md` beside it.

Historical locations are read-only evidence. This Skill neither moves them nor creates aliases or double writes; reviewed migration belongs to T046.

**Completion:** exactly one safe root Record target represents the experiment identity.

## 4. Create or revise the canonical Record

Read the selected template before writing:

- Chinese repository language preference: `assets/run-record-template.zh_CN.md`
- Otherwise: `assets/run-record-template.md`

user-readable Record prose follows the repository language preference; do not infer its language from the task prompt. Preserve code symbols, field names, status values, paths, commands, and template-required headings as written.

Use the template's required Front Matter and all twelve body sections. Keep `spec`, `spec_revision`, and `plan_revision` all present with valid values or all `null`. For a planned prelaunch Record, keep `started: null`, `completed: null`, `decision: pending`, and a summary limited to current known facts.

Put exact command, CWD, script/configuration, CLI overrides, seed, data/preprocessing, Git state, environment, backend, model/checkpoint, upstream provenance, intended artifacts, expected signal, failure signal, and stop rule in Execution Information. Keep full logs and metrics in Run-owned artifacts; link their paths and summarize only material evidence in `record.md`.

**Completion:** the Record validates as a complete planned, running, or terminal document without invented facts.

## 5. Update only material evidence

After the process actually starts, write the real timezone-qualified `started` time and `running` status. Append an event only for a material state or evidence change: actual artifact path, PID/job/backend detail, citeable metric, crash/OOM/NaN, stop, completion, or changed decision.

Repeated loss checks, GPU/RSS snapshots, tmux liveness checks, TensorBoard opens, and checkpoint listings are not automatically events. Answer from existing evidence unless the observation becomes durable.

At completion, failure, interruption, or cancellation, write the actual terminal timestamps, results, observations, conclusion, decision, and next actions together. Preserve failed evidence. A valid negative result remains `completed`; make its non-adoption decision explicit instead of calling it failed.

**Completion:** the current durable state and evidence are recoverable from one Record without monitoring noise.

## 6. Synchronize the generated Index

After creating a Record or materially changing its status, decision, or summary, run:

```sh
node <hello-scholar-repo>/bin/hello-scholar.js docs check
node <hello-scholar-repo>/bin/hello-scholar.js docs sync
```

`runs/INDEX.md` is generated by the document CLI. Do not directly edit `runs/INDEX.md` or create a manual Index template.

**Completion:** `docs check` succeeds before `docs sync`, and only the Record plus CLI-generated Index changes represent durable documentation.

See `references/status-and-fields.md` for exact fields and lifecycle rules. See `references/examples.md` for timing, collision, terminal-evidence, and provenance examples.
