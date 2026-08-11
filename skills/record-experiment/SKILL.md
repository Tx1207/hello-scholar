---
name: record-experiment
description: "Use before launching or updating a clearly formal, costly, or retained-evidence research run: a full/baseline/release Benchmark or Eval, full training, a long-running or expensive GPU/remote job, retained checkpoints/predictions/results, evidence for acceptance/publication/product decisions/downstream experiments, or a material event on an existing Run."
---

# Record experiment

Preserve material experiment provenance in one recoverable Run Record without delaying ordinary tests or small experiments. Keep experiment identity, execution evidence, and generated Indexes in their owners.

## 1. Classify the evidence boundary

Read `references/status-and-fields.md` before a Full record or terminal update. Decide record granularity before launching or writing.

| Decision | Use when | Completion |
|---|---|---|
| Full record | A clearly formal, costly, long-running, remote, or retained-evidence experiment; missing upstream provenance; or a durable derived report | One valid root Record contains reproducible prelaunch facts |
| Append event | The same Run gains a material status, path, metric, error, decision, or terminal-evidence change | One concise event preserves the new durable fact without redefining identity |
| No record | Ordinary code/tests, static checks, read-only queries, preparation, or a low-risk small experiment with no clear formal, cost, or retained-evidence signal | Run directly and state briefly why no durable Run was created |

**Default to No record.** Run ordinary tests, smoke checks, and low-risk small experiments directly. Do not create a Run merely because a command or file name contains `eval`, `benchmark`, `inference`, or `experiment`. Do not ask the user to classify ambiguous low-risk work. Ask only when unclear production data, irreversible operations, or significant cost changes the safety decision.

An unrecorded small experiment remains a temporary observation. If formal evidence is needed later, create a Record for a subsequent formal Run; do not backfill the earlier scratch experiment. An existing branch, temporary directory, or Worktree may provide isolation, but this Skill does not create a Worktree automatically.

**Formal prelaunch record.** Before a clearly formal/baseline/release Benchmark or Eval, full training, long-running or expensive GPU/remote job, retained checkpoints/predictions/results, or evidence for acceptance, publication, product decisions, external sharing, or downstream experiments, create a minimum reproducible Record. Missing an exact command, CWD, intended raw stdout/stderr paths, or intended result locations blocks launch.

**Completion:** the work has a formal prelaunch Record, an Append event, or an explicit No record reason, without a delayed backfill obligation.

## 2. Establish experiment identity

Treat purpose, exact command, script, config, CLI overrides, seed, data version/split, preprocessing, input artifacts, upstream Run, model/checkpoint, evaluation or generation settings, backend, and intended log/result/checkpoint paths at launch as identity-defining facts.

A changed intended output path before launch creates a different identity. Actual paths discovered during the same Run are Append events. Loading a model or checkpoint to write predictions, generations, or other research outputs is an experiment command when the result crosses the Full record boundary above.

For a durable derived report, record consumed input artifacts, the upstream Run ID, and derived artifacts. If its retained input artifacts lack an upstream Record, recover provenance for those retained inputs with known facts and `Unknown` plus a reason for missing facts. This does not backfill an earlier disposable small experiment.

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

A Run has one explanatory document: `record.md`. Put artifacts only where needed under its `outputs/`, `results/`, `logs/`, or `checkpoints/` directories. Every Recorded Run reserves `logs/stdout.log` and `logs/stderr.log` for raw process output. Do not create `run.json`, `README.md`, `report.md`, `summary.md`, or `final-report.md` beside it.

Historical locations are read-only evidence. This Skill neither moves them nor creates aliases or double writes; reviewed migration belongs to T046.

**Completion:** exactly one safe root Record target represents the experiment identity.

## 4. Create or revise the canonical Record

Read the selected template before writing:

- Chinese repository language preference: `assets/run-record-template.zh_CN.md`
- Otherwise: `assets/run-record-template.md`

user-readable Record prose follows the repository language preference; do not infer its language from the task prompt. Preserve code symbols, field names, status values, paths, commands, and template-required headings as written.

Use the template's required Front Matter and all twelve body sections. Keep `spec`, `spec_revision`, and `plan_revision` all present with valid values or all `null`. For a planned prelaunch Record, keep `started: null`, `completed: null`, `decision: pending`, and a summary limited to current known facts.

Put exact command, CWD, script/configuration, CLI overrides, seed, data/preprocessing, Git state, environment, backend, model/checkpoint, upstream provenance, intended artifacts, intended raw stdout/stderr paths, expected signal, failure signal, and stop rule in the Record. Keep full logs and metrics in Run-owned artifacts; link their paths and summarize only material evidence in `record.md`.

**Completion:** the Record validates as a complete planned, running, or terminal document without invented facts.

## 5. Launch once and retain process evidence

Execute a Recorded Run's documented command once through a capture method that writes raw stdout to `runs/<run-id>/logs/stdout.log` and raw stderr to `runs/<run-id>/logs/stderr.log` without changing the command's effective arguments or CWD. Record the actual paths and exit code or terminating signal. Do not run the command bare and rerun it merely to capture logs.

After the process actually starts, write the real timezone-qualified `started` time and `running` status. Append an event only for a material state or evidence change: actual artifact path, PID/job/backend detail, citeable metric, crash/OOM/NaN, stop, completion, or changed decision.

For a remote job, retain the local submission stdout/stderr, exit status, and remote job ID or URI. Link remote logs and artifacts by their actual URI until they are intentionally downloaded; never claim that remote evidence exists under the local Run when it does not.

Repeated loss checks, GPU/RSS snapshots, tmux liveness checks, TensorBoard opens, and checkpoint listings are not automatically events. Answer from existing evidence unless the observation becomes durable.

At completion, failure, interruption, or cancellation, write the actual terminal timestamps, results, observations, conclusion, decision, next actions, raw stdout/stderr paths, and exit code or signal together. Preserve failed evidence. A valid negative result remains `completed`; make its non-adoption decision explicit instead of calling it failed.

**Completion:** the current durable state, raw process output, exit status, and artifacts are recoverable from one Record without monitoring noise.

## 6. Synchronize the generated Index

After creating a Record or materially changing its status, decision, or summary, run:

```sh
hello-scholar docs check
hello-scholar docs sync
```

`runs/INDEX.md` is generated by the document CLI. Do not directly edit `runs/INDEX.md` or create a manual Index template.

**Completion:** `docs check` succeeds before `docs sync`, and only the Record plus CLI-generated Index changes represent durable documentation.

## 7. Report the durable outcome

After each decision, tell the user the decision and brief reason. If a Record was created or updated, give its canonical Record path and `docs check`/`docs sync` status; for a formal prelaunch Record, say whether the documented command is unblocked. For No record, state its reason and that no Run or Index changed. Report durable facts, not transient monitoring.

See `references/status-and-fields.md` for exact fields and lifecycle rules. See `references/examples.md` for classification, capture, collision, terminal-evidence, and provenance examples.
