# Record fields and lifecycle

Read this reference before creating a Full record, backfilling exploration, or closing a Run.

## Front Matter

Every `runs/<run-id>/record.md` begins with these fields:

```yaml
schema: 1
kind: record
run_id: <directory name>
title: <human-readable title>
status: planned
spec: null
spec_revision: null
plan_revision: null
started: null
completed: null
decision: pending
summary: <current known facts only>
```

- `run_id` must equal the Run directory name.
- `spec`, `spec_revision`, and `plan_revision` must all be set or all be null. When present, use a valid `SPEC-NNN` ID and positive revisions.
- `planned` requires `started: null` and `completed: null`.
- `running` requires a real timezone-qualified ISO 8601 `started` value and `completed: null`.
- `completed`, `failed`, `interrupted`, and `cancelled` require real `started` and `completed` values, with completion no earlier than start.
- Keep `decision: pending` until evidence supports a conclusion. Keep `summary` factual; do not predeclare success.

## Statuses and terminal evidence

Use exactly one status:

- `planned`: the reproducible launch record exists and the command has not started.
- `running`: the process or job actually started.
- `completed`: the run ended with usable evidence, including a valid negative result.
- `failed`: a crash, OOM, missing required output, or other failure prevented usable evidence.
- `interrupted`: work stopped before completion and retained evidence explains the interruption.
- `cancelled`: the Run was intentionally cancelled before completion.

A valid negative result is not failed: keep `status: completed`, state the evidence in Key Results and Observations, and make the non-adoption decision explicit. Preserve failures, interruptions, and cancellations with their evidence and next action.

## Required body sections

Keep the template's twelve sections in order:

1. Purpose
2. Hypothesis
3. Experimental Variables
4. Controls
5. Execution Information
6. Artifact Locations
7. Execution Events
8. Key Results
9. Observations
10. Conclusion
11. Decision
12. Next Actions

Use Artifact Locations for paths under the same Run: `outputs/`, `results/`, `logs/`, and `checkpoints/` when they exist. Keep full logs and bulky metrics in those artifacts; the Record stores concise evidence and paths.

## Execution Information

A formal prelaunch Record needs the following before launch:

- Exact command and `CWD`.
- Script or entry point, config, CLI overrides, seed, data version/split, and preprocessing.
- Input artifacts, upstream Run ID, derived artifacts, model/checkpoint, and evaluation/generation settings when relevant.
- Git branch, commit, working-tree state, backend, machine/GPU, and Python/environment.
- Intended log, result, checkpoint, and dashboard/tracking paths.
- Expected signal, failure signal, and stop rule.

Write `Unknown` with a short reason for unavailable facts; never reconstruct them from memory. Do not launch a formal Run when the exact command, CWD, or intended log/result locations are missing.

## Granularity and event density

`Full record` establishes a new identity or durable research boundary. `Append event` preserves a material fact inside the same identity. `No record` covers ordinary engineering work, static checks, read-only queries, and preparation that has not launched an evidence-producing command.

Prepared input, record at launch: a small cache or manifest fix is No record until a future experiment uses it. Runtime and compute cost are risk amplifiers, not standalone triggers: a short prediction export can need a Full record, while a long read-only log review can remain No record.

For an Append event, record only new durable facts: real start/end time, status, actual artifact path, PID/job ID, backend detail, citeable metric, error, decision, or next action. Repeated loss checks, TensorBoard opens, tmux liveness checks, GPU/RSS snapshots, and checkpoint listings remain read-only unless they reveal a material event.

## Provenance and derived artifacts

A command that loads a model or checkpoint and writes predictions, generations, or other research output is an experiment command. A durable derived report lists its consumed input artifacts, upstream Run ID, and newly written artifacts. If upstream provenance is missing, create a retroactive Record with known facts and `Unknown` for facts that cannot be recovered.
