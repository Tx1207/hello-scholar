---
name: record-experiment
description: Preserve one research run's actual conditions, results, and interpretation when they have research, reproduction, recovery, or decision value; also record existing execution evidence or update material facts in a Run.
---

# Record Experiment

Make one execution understandable and recoverable: what question it addressed, what actually ran, which evidence it produced, and what that evidence can support. Keep the research design and cross-Run decisions with the main agent and the owning Spec. Recording a Run does not authorize launching it, changing the study, expanding its budget, or starting the next experiment.

## Decide what is worth preserving

Judge by how the evidence will be used, not the command's name, runtime, hardware, or presence of output files. Preserve a comparison, ablation, or other calculation that informs a research conclusion or subsequent choice, even if it is tiny or negative. Preserve preparation or failure evidence when it materially supports reproduction, recovery, or a resource-boundary decision.

Ordinary imports, connectivity checks, configuration checks, startup smoke, static checks, and repeated polling create no separate Run; keep them in task verification, existing logs, or the planned Record of the experiment they prepare. A remote or GPU smoke does not become a Run merely because it costs money. A check named `smoke` can deserve a Record when it actually tests a consequential hypothesis. Summarizing existing material or writing a weekly report creates no new Run; a new calculation that produces research evidence may.

Create a planned Record before a new Run that deserves preservation. For an existing Run, update the same identity only with material new facts within the authorized maintenance scope. For retrospective recording, preserve the available evidence and its gaps without rerunning. A read-only query remains read-only even when it discovers a new fact. Read [references/status-and-fields.md](references/status-and-fields.md) before creating or closing a Record; read [references/examples.md](references/examples.md) for boundary cases.

## Create one identity

Use `runs/<run-id>/record.md`, where `<run-id>` is `YYYYMMDD-HHMM-<short-topic>` with a seed suffix when useful. The directory, `run_id`, and Run-owned paths must agree. Never overwrite or repurpose an existing or ambiguous directory; add a numeric suffix for a distinct run.

A Run identifies one research execution worth preserving. Its ordinary startup checks, errors, fixes, and retries may be appended to the same planned Record, which continues when the research execution starts. If that research execution fails or ends, an authorized new execution gets a new Run even when its arguments are unchanged; preserve the earlier evidence.

A new Record uses `schema: 2`. `spec` and `spec_revision` must both be null or both identify an existing Spec revision; association with a draft Spec is allowed. Do not add `plan_revision`. Preserve historical schema 1 Records as evidence; when an active historical Run must be updated, it may be converted in place to schema 2 while retaining the old Plan provenance in the body.

Before an authorized launch, capture the exact command and CWD, effective inputs and versions, configuration and overrides, seed, code/Git state, environment and backend, model/checkpoint, upstream provenance, expected artifacts, separate stdout/stderr destinations, expected and failure signals, and stop rule. Link the agreed question and comparison; do not silently redesign them. Later Spec changes never rewrite this Run's actual conditions or recorded revision.

Use [assets/run-record-template.md](assets/run-record-template.md) for English or [assets/run-record-template.zh_CN.md](assets/run-record-template.zh_CN.md) for Chinese, following the requested language and otherwise the project language. Start the body with the current finding and what it means. Before results exist, say that the Run is planned or running and no conclusion is available; keep expectations distinct from observations. Put detailed reproduction information after the explanation.

## Follow the evidence from execution to interpretation

Execute only when the existing authorization covers the command and its resources. If cancelled before the research execution starts, close the schema 2 Record with `started: null` and the actual cancellation time; distinguish any startup-check evidence from the unexecuted research command. Otherwise, execute the documented research command once with stdout and stderr captured separately to the recorded paths. Never run bare and repeat merely to collect logs. For remote work, retain submission output and actual remote job and artifact URIs; claim local evidence only after it is downloaded.

Reconstruct what actually took effect, including deviations from the launch plan. Record real timestamps, process status, artifacts, measurements, and failures. Append observations when they change interpretation or recovery, rather than turning every polling result into an event.

Before making a comparative claim, establish whether data, evaluation, resource conditions, and the chosen controls make the comparison meaningful. State the question-relative limit: an OOM may establish a resource constraint without testing the algorithmic hypothesis; a successful process may still produce an invalid comparison. Report material values, units, conditions, and the evidence behind the judgment, including negative or conflicting results. Do not infer a broad causal claim from one Run.

Separate execution status, research interpretation, and adoption. A valid negative result is `completed`; a failure that prevents the intended evidence is `failed`, even if it teaches a useful operational lesson. Retain failed and interrupted evidence. Record an adoption or next-action decision only when it was actually made; otherwise keep the decision pending and identify what must be resolved. The main agent integrates this Run with the other evidence before choosing a broader research direction.

## Finish at the agreed boundary

Report the result or current state, the evidence supporting it, the interpretation limit, the canonical Record path, and the next action already decided or still needed. Do not launch another Run to make the conclusion more satisfying.

After a material Record change, use `hello-scholar docs check` when available. Run `hello-scholar docs sync` only when its generated Index writes fit the original task's authorization; a narrowly authorized Run write does not authorize project-wide indexes. If unavailable or out of scope, report skipped maintenance without blocking a valid Run.
