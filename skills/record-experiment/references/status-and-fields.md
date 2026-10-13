# record-experiment fields and lifecycle

Read this reference before creating or closing a Record. Work without preservation value uses no Record and creates no later backfill obligation. Small, decision-bearing experiments still use this schema.

## Front Matter

Every `runs/<run-id>/record.md` begins with these fields:

```yaml
schema: 2
kind: record
run_id: <directory name>
title: <human-readable title>
status: planned
spec: null
spec_revision: null
started: null
completed: null
decision: pending
summary: <current known facts only>
```

- `run_id` must equal the Run directory name.
- `spec` and `spec_revision` must both be set or both be null. When present, use an existing `SPEC-NNN` ID and a positive revision no newer than that Spec. A formal exploration may reference a draft Spec.
- New Records do not contain `plan_revision`. A historical schema 1 Record may retain it as provenance. If an active historical Run must be updated, it may be converted in place to schema 2 while preserving the old Plan revision in the body; terminal historical Records remain unchanged by default.
- `planned` requires `started: null` and `completed: null`.
- `running` requires a real timezone-qualified ISO 8601 `started` value and `completed: null`.
- `completed`, `failed`, and `interrupted` require real `started` and `completed` values, with completion no earlier than start.
- In schema 2, cancellation before launch uses `status: cancelled`, `started: null`, and `completed` set to the actual cancellation time. If the process started, retain its real start and a completion time no earlier than start. Historical schema 1 cancellation still requires both timestamps.
- Keep `decision: pending` until an actual decision has been made on sufficient evidence. A usable result alone does not establish adoption. Keep `summary` factual; do not predeclare success.

## Statuses and terminal evidence

Use exactly one status:

- `planned`: the reproducible launch record exists and the research execution has not started; ordinary startup checks may already have run.
- `running`: the research process or job actually started; `started` is that real start time.
- `completed`: the run ended with usable evidence, including a valid negative result.
- `failed`: a crash, OOM, missing required output, or other failure prevented the intended usable evidence, even if the failure establishes an operational limit worth retaining.
- `interrupted`: work stopped before completion and retained evidence explains the interruption.
- `cancelled`: the Run was intentionally cancelled before completion, including before the research execution starts in schema 2. For a prelaunch cancellation, state that the research command never started and why; any startup-check logs belong to preparation, not that command. Do not fabricate research output or launch merely to obtain it.

A valid negative result is not failed: keep `status: completed` and explain the result and its limits. State a non-adoption decision when one was made; otherwise retain the pending decision. Preserve failures, interruptions, and cancellations with their evidence and any known next action. Do not interpret an invalid comparison as evidence against the scientific hypothesis.

## Body organization

Begin with the current finding, decisive evidence, interpretation limit, and any actual decision or next unresolved choice. A planned or running Record explicitly says when results are unavailable. Explain what the Run tested relative to its baseline or prior conditions before expanding reproduction details. Keep expectations separate from measurements.

The template groups findings, question and comparison, execution information, artifacts, and material events. These are an aid to locating information, not mandatory headings or a request to repeat facts. Merge or rename sections while retaining applicable launch facts, evidence, and interpretation. Existing Records need no template-only reformatting; preserve headings required by a confirmed external consumer.

Use Artifact Locations for paths under the same Run: `outputs/`, `results/`, `logs/`, and `checkpoints/` when they exist. Every launched Recorded Run uses `logs/stdout.log` and `logs/stderr.log` for raw process output. Prelaunch cancellation retains intended paths as intended, not as existing evidence. Keep full logs and bulky metrics in artifacts; the Record stores concise evidence, paths, and exit status.

For an experiment worth preserving, append ordinary startup errors, fixes, and retries to its planned Record. Keep separate logs such as `logs/startup-01.stdout.log` and `logs/startup-01.stderr.log`, or cite their existing locations; retain each check's actual command, time, and exit status without overwriting earlier evidence. Keep `started` and `completed` null until the research execution starts. If an outer launcher includes checks and research, identify that boundary and use the research stage's actual start, not the launcher's start. Refresh the formal launch conditions after fixes while preserving the preparation history.

## Execution Information

A formal prelaunch Record needs the following before launch:

- Exact command and `CWD`.
- Script or entry point, config, CLI overrides, seed, data version/split, and preprocessing.
- Input artifacts, upstream Run ID, derived artifacts, model/checkpoint, and evaluation/generation settings when relevant.
- Git branch, commit, working-tree state, backend, machine/GPU, and Python/environment.
- Intended raw stdout, raw stderr, result, checkpoint, and dashboard/tracking paths.
- Expected signal, failure signal, and stop rule.

After launch, add actual raw stdout and stderr paths plus the exit code or terminating signal. For remote jobs, retain local submission output and the remote job ID/URI; use actual remote URIs until artifacts are downloaded.

Record effective conditions rather than copying nominal configuration that runtime overrides changed. Write `Unknown` with a short reason for unavailable facts; never reconstruct them from memory. Distinguish an inapplicable field from an unknown one. Do not launch a formal Run when the exact command, CWD, intended stdout/stderr, or intended result locations are missing. An execution request must already cover the command, resource use, and stop conditions; documenting them does not grant that authority.

## Retrospective recording

When the user requests a Record of an already executed experiment, preserve its actual identity and available evidence, state that the Record was written afterward, and distinguish known facts from unavailable ones. Link original logs where they are; missing capture stays missing. Do not rerun merely to complete the Record. The same schema and lifecycle constraints apply: if required facts such as actual start or end time cannot be recovered, report the missing facts rather than inventing a valid terminal Record.

## Granularity and event density

Create a Record when actual evidence will inform a research conclusion, an acceptance or adoption judgment, or a later experiment; or when reconstructing the execution matters to reproduction, recovery, or resource planning. Size is not a useful dividing line. A tiny controlled comparison can qualify; an expensive remote startup check with no such use can remain ordinary verification.

Hardware, duration, remote execution, command names, and retained temporary files are not sufficient triggers. Ordinary preparation, imports, configuration checks, unit tests, static checks, polling, and disposable observations need no independent Record. Keep their relevant verification in the task, existing logs, or the planned Record of the experiment they prepare. Planning a study without executing it, summarizing existing results, and writing a weekly report produce no executed Run.

For low-risk work with no indicated preservation need, proceed within the original task without asking for a recording preference. Ask only when unresolved cost, production-data use, or irreversible effects change the execution authorization. An explicit request to preserve an existing experiment uses the retrospective rules; lack of a Record does not create an automatic obligation to backfill history.

Within authorized Run maintenance, append only facts that matter to interpretation or recovery: real start/end time, status, actual artifact path, PID/job ID, effective configuration, citeable metric, error, decision, or next action. Repeated polling does not create another Record. A read-only loss check, TensorBoard query, tmux liveness check, GPU/RSS snapshot, or checkpoint listing remains read-only even when it reveals a material event; report the discovery without assuming permission to persist it.

## Process capture invariant

When the research execution starts, a Recorded Run's documented research command executes once. Capture raw stdout and raw stderr during that execution without changing its effective command or CWD, then retain its exit code or signal. Ordinary startup retries before that boundary remain preparation in the same Record. An authorized new research execution after failure or completion gets a new Run even if the command is unchanged. Never rerun an experiment merely to collect missing process output.

## Provenance and derived artifacts

A prediction or generation command qualifies when its output supplies research evidence, not merely because it writes a file. A new derived calculation that creates such evidence records consumed inputs, upstream Run IDs, the calculation and its conditions, and newly produced artifacts. A prose summary or presentation of already computed results instead cites the existing sources and creates no Run.

Recover relevant upstream provenance from available evidence and mark unavailable facts as `Unknown`; do not invent or require an unrelated upstream Record. Preserve the actual Spec revision, input versions, and outcome of each distinct execution. Later synthesis may change the interpretation but cannot rewrite the original conditions or discard a valid negative result.
