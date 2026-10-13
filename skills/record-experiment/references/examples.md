# record-experiment examples

## Preservation decisions

| Situation | Decision | Reason |
|---|---|---|
| Fix one invalid row, prepare a manifest, or print a future launch command | No record | Ordinary preparation is task work; record a later execution when its evidence has preservation value |
| `--help`, import check, config parse, unit test, static check, or startup smoke | No separate record | Preserve verification in the task, existing logs, or the planned Record of the experiment it prepares |
| An authorized GPU or remote smoke only checks connectivity or startup | No record | Cost and hardware do not by themselves give the result research or recovery value |
| A tiny controlled comparison will determine the next research choice | Full record | The comparison needs traceable conditions and results regardless of its size |
| Training, Benchmark, Eval, or prediction export supplies research or adoption evidence | Full record | Preserve evidence that later conclusions or experiments will depend on |
| Preparation or a failure establishes a recoverable artifact or consequential resource boundary | Full record when that use is real | Record what supports reproduction, recovery, or the resource decision |
| Query an existing Run's tmux, TensorBoard, latest loss, or known checkpoints | No record | Report discoveries without expanding a read-only request |
| Discover completion, OOM, a new artifact path, or a citeable metric while authorized to maintain an existing Run | Append event | Preserve the durable change in the same identity within existing write authorization |
| A completed valid eval underperforms baseline | Full record or Append event | Keep `completed`, explain the comparison, and record only decisions actually made |
| Write a research note, weekly report, or summary of already computed results | No record | Cite the existing evidence; writing creates no new experimental execution |
| A derived calculation produces new research evidence from existing predictions | Full record | Preserve inputs, calculation conditions, upstream provenance, and the new result |

Use the stated purpose and later evidence use. If low-risk work has no indicated preservation need, proceed within the original task without asking for a recording preference. Clarify only missing facts that change execution authorization, such as production writes, irreversibility, or significant cost.

## 1. Formal Benchmark prelaunch and capture

Before launching:

```sh
python eval.py --config configs/base.yaml --seed 0 --split test
```

Create `runs/20260803-0900-baseline-eval-s0/record.md` with `status: planned`, the exact command, CWD, config, seed, intended `logs/stdout.log`, intended `logs/stderr.log`, intended `results/baseline-eval-s0.json`, expected and failure signals, and a stop rule. This is a formal prelaunch Record: do not launch until those facts exist.

Execute the documented command once through a capture method that preserves separate raw streams and the original exit status. Record the actual stdout/stderr paths and exit code or signal. Do not run it bare and rerun it to fill missing logs.

## 2. Similar executions, different evidence value

A developer asks for a 20-example smoke to check config parsing and reach inference. The authorized command happens to use a remote GPU and writes temporary predictions. No subsequent comparison, recovery step, or research decision depends on those outputs. Run it within the existing authorization, report executability and relevant diagnostics, and do not create a Record.

Another 20-example run compares two preprocessing choices on a fixed diagnostic set to decide which implementation to investigate next. Preserve it because the decision depends on its actual inputs and comparison. Explain that a diagnostic set supports this narrow choice; it does not establish general model quality. The resource cost and sample count did not decide the recording boundary.

If preservation of an already executed experiment is later requested, follow [status-and-fields.md](status-and-fields.md). Recording existing evidence does not require another execution.

## 3. Unclear safety fact

A request says “run the full evaluation against production data” but does not establish whether it writes to production or incurs a significant remote charge. Ask only for the missing safety fact. Once safe execution and formal scope are known, create the prelaunch Record; do not ask merely whether the user wants documentation.

## 4. Existing Run read-only query

An existing `runs/20260803-0900-baseline-eval-s0/record.md` already records its logs and TensorBoard URL. For “Show the latest loss” or “Is tmux still alive?”, read the existing evidence and answer. A newly discovered milestone, error, or terminal state does not turn a read-only query into permission to write. Append it only when existing Run-maintenance authorization covers the write or the user requests a durable update; otherwise report the fact without creating or changing a Record.

## 5. Same-minute identity collisions

When authorized to maintain a Run, append a newly observed event from the same actual research process or remote job, with matching identity, inputs, and key configuration, to the existing `runs/20260803-1100-router-ablation-s0/record.md`. A new research execution is a new Run even when its arguments are identical; ordinary startup checks and repairs before that execution may be appended to its planned Record.

For a different identity that collides in that minute, keep the existing directory untouched and allocate the first unused suffix:

```text
runs/20260803-1100-router-ablation-s0-2/record.md
runs/20260803-1100-router-ablation-s0-3/record.md
```

Do not overwrite a directory that is unreadable, a symlink, missing a verifiable Record, or belongs to another identity.

## 6. Failed Run

A CUDA OOM after validation is evidence:

```yaml
status: failed
started: 2026-08-03T12:00:00Z
completed: 2026-08-03T12:04:00Z
decision: pending
summary: CUDA OOM during validation; no usable metrics were produced.
```

Put the concise error, attempted configuration, `logs/stdout.log`, `logs/stderr.log`, exit code or signal, and next action in the terminal sections. Keep the full raw output under the Run's `logs/` directory.

## 7. Valid negative result

Suppose a valid, comparable eval scores 81.2 against a baseline of 82.0, and the main agent's decision is to retain the baseline for now:

```yaml
status: completed
decision: do-not-adopt
summary: The configured ablation underperformed the baseline on the same split.
```

Explain the compared conditions, observed values, and interpretation limit near the start of the Record. The Run is completed, while adoption is a separate decision. If no adoption decision was made, retain `decision: pending`; do not conclude general inferiority or statistical significance from this single comparison.

## 8. Derived calculation and written synthesis

A new calculation derives subgroup error rates from retained predictions for a research decision. In that calculation's Record, preserve its actual command and conditions, relevant upstream provenance, and artifacts such as:

- Input artifacts: `outputs/model_a_predictions.jsonl`; `outputs/model_b_predictions.jsonl`
- Upstream Run ID: `20260803-1300-model-inference-s0`
- Derived artifacts: `results/subgroup-error-rates.json`

Use `Unknown` with a reason for unrecoverable upstream facts; cite original evidence where it exists, without forcing a speculative upstream Record. Writing a research note or weekly report from those already computed rates uses the existing result and Run as sources. It does not create another Run. A disposable local prediction probe remains ordinary verification.

## 9. Remote job evidence

For a remote submission, retain local submission stdout/stderr and its exit status under the local Run, plus the remote job ID or URI. Link remote logs and artifacts by their actual URI. Add local paths only after intentional download; do not imply that remote files were captured locally.

## 10. Startup preparation and a later research retry

An agreed data-size A/B comparison deserves a Record. Three ordinary startup checks fail because of a scheduler step setting, a DDP rank bug, and a validation process-group conflict; the A/B execution has not started. Keep one planned Record with `started: null` and `completed: null`, append the errors and fixes, and retain each check's command, timestamps, exit status, and separate logs under `logs/` or at their existing locations. After checks pass, update the launch conditions and continue the same Record with the actual research start and outcome. This is one research Run with preparation history.

If the formal A/B execution instead starts and fails, close that Run as `failed` with its real evidence. If another execution is authorized, create a new planned Run and cite the earlier failure, even when the arguments are unchanged. Keep a valid negative comparison as `completed`. A startup check that itself tests a consequential research or resource hypothesis can independently deserve a Run; its name and hardware do not decide that.
