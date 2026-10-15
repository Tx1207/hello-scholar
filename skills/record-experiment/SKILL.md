---
name: record-experiment
description: Before launching a research execution, find prior Runs to reuse or derive from; preserve one Run's actual conditions, results, and interpretation when they have research, reproduction, recovery, or decision value; also record existing execution evidence or update material facts in a Run.
---

# Record Experiment

Make one execution understandable, recoverable, and reusable: what question it addressed, what it reused, what actually ran, and what the evidence supports. The main agent and the owning Spec keep the research design and cross-Run decisions.

## Start from prior Runs

Before planning a new execution, scan `runs/INDEX.md` by entry point and topic, then search Records, configs, and `results/` for the same or an overlapping question. Prefer reusing a result, running only the missing cells, or rerunning an existing entry point with changed arguments over writing a new script. When a new Run builds on an earlier one, set `derived_from` to that Run and state what differs and which artifacts are reused, so a reader sees the change without comparing two Records.

## Decide what is worth preserving

Judge by how the evidence will be used, not by the command name, runtime, hardware, or output files. Preserve a comparison, ablation, or calculation that informs a research conclusion or later choice, even when tiny or negative, and preparation or failure evidence that materially supports reproduction, recovery, or a resource decision. Imports, connectivity and configuration checks, startup smoke, static checks, and polling create no separate Run; keep them in task verification or in the planned Record of the experiment they prepare. Summaries and reports create no Run. A read-only query stays read-only even when it discovers a new fact. Read [references/examples.md](references/examples.md) for boundary cases.

## Create one identity

Use `runs/<run-id>/record.md`, where `<run-id>` is `YYYYMMDD-HHMM-<short-topic>` with a seed suffix when useful. Never overwrite or repurpose an existing directory; add a numeric suffix for a distinct Run. Read [references/status-and-fields.md](references/status-and-fields.md) before creating or closing a Record; `hello-scholar docs check` enforces its fields and lifecycle.

One Run is one research execution. Startup errors, fixes, and retries before it starts are appended to its planned Record. After a research execution fails or ends, another execution is a new Run that sets `derived_from` to the earlier one, reuses its launch plan, and resumes from completed stages or checkpoints when conditions allow. For an already executed experiment, record the available evidence and its gaps afterward without rerunning.

Before an authorized launch, capture what reproduction needs: exact command and CWD, entry point, effective config and overrides, seed, data and input artifacts, code version, environment and hardware, model or checkpoint, intended stdout, stderr, and result paths, expected and failure signals, and the stop rule. Write `Unknown` with a reason instead of guessing. Use [assets/run-record-template.md](assets/run-record-template.md) for English or [assets/run-record-template.zh_CN.md](assets/run-record-template.zh_CN.md) for Chinese, following the requested or project language.

## Execute and interpret

Execute the documented research command once, with stdout and stderr captured separately to the recorded paths; never run bare and repeat it to collect logs. For remote jobs, keep the submission output and the real job and artifact URIs. Record the conditions that actually took effect, deviations from the plan, real timestamps, artifacts, measurements, and failures. Append an event only when it changes interpretation or recovery.

Before a comparative claim, check that data, evaluation, resources, and controls make the comparison meaningful. A valid negative result is `completed`; a failure that prevents the intended evidence is `failed`. Keep `decision: pending` until a decision is actually made, and do not infer a broad causal claim from one Run.

## Finish

Lead the Record with the current finding and what it means; while planned or running, say that no result exists yet. Report the result or state, its evidence and limits, the Record path, and the next action decided or still needed. Do not launch another Run to make the conclusion more satisfying. After a material change, run `hello-scholar docs check` when available.
