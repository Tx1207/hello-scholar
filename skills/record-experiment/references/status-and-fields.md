# record-experiment fields and lifecycle

`hello-scholar docs check` enforces the field types and lifecycle combinations below. This page explains what each value means so the Record stays truthful.

## Front Matter

```yaml
schema: 2
kind: record
run_id: <directory name>
title: <human-readable title>
status: planned
entry: <entry script or command, e.g. scripts/train.py>
derived_from: null
spec: null
spec_revision: null
started: null
completed: null
decision: pending
summary: <question or condition, plus current known facts>
```

- `run_id` equals the Run directory name.
- `entry` names the script or command entry point the Run executes. Use the same spelling across Runs of one entry so the Index groups them; use null only when a retrospective Record cannot recover it.
- `derived_from` is null, one Run ID, or a list of Run IDs whose code, configuration, checkpoints, or results this Run reuses or modifies. Explain the difference in the body.
- `spec` and `spec_revision` are both null or both identify an existing Spec revision; a draft Spec is allowed.
- `decision` stays `pending` until a decision is actually made on sufficient evidence; a usable result alone is not adoption.
- `summary` states the condition and the current fact, for example "λ72 step 8000 on UVG96: DISTS 0.081", not status alone. The Index uses it to find similar Runs.

## Status

| Status | Meaning | `started` | `completed` |
|---|---|---|---|
| `planned` | Launch record exists; the research execution has not started. Startup checks may have run. | null | null |
| `running` | The research process or job actually started. | real | null |
| `completed` | Ended with usable evidence, including a valid negative result. | real | real |
| `failed` | A crash, OOM, or missing output prevented the intended evidence. | real | real |
| `interrupted` | Stopped before completion; retained evidence explains why. | real | real |
| `cancelled` | Intentionally cancelled. Before launch, `started` stays null and the body says the research command never ran. | real or null | real |

Timestamps are timezone-qualified ISO 8601 and real; `completed` is never earlier than `started`. When an outer launcher runs checks before research, `started` is the research stage's start. An invalid comparison is not evidence against the hypothesis, and an OOM establishes a resource limit, not that the method fails.

## Body and artifacts

Order the body as: current finding and interpretation, question and comparison (including the difference from `derived_from`), execution information, artifact locations, material events. These are aids for locating information; merge or rename sections as the content needs, and do not reformat existing Records only to match a newer template.

Raw process output goes to `logs/stdout.log` and `logs/stderr.log` under the Run. Startup checks keep separate logs such as `logs/startup-01.stdout.log`, or cite their existing locations. Bulky metrics stay in `results/` or `outputs/`; the Record keeps concise values, paths, and the exit code or signal. For remote jobs, use actual remote URIs until artifacts are downloaded.

## Historical and retrospective Records

New Records contain no `plan_revision`. A historical schema 1 Record keeps it as provenance. An active historical Run may be converted in place to schema 2 with the old Plan revision noted in the body; terminal historical Records remain unchanged by default.

A retrospective Record says it was written afterward, links the original logs where they are, and marks unrecoverable facts `Unknown`. If required facts such as the actual start time cannot be recovered, report the gap instead of inventing a valid terminal Record. Do not rerun to complete it.
