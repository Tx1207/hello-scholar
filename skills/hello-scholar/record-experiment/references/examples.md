# record-experiment examples

## Common decision cheatsheet

| Situation | Decision | Reason |
|---|---|---|
| Fix one invalid row, add a tiny supplemental cache, combine a manifest, or print a future launch command | No record | Prepared input, record at launch |
| `--help`, import check, config parse, unit test, static check, or smoke test with no durable output | No record | Engineering evidence is not a Run |
| A smoke test or tiny eval writes metrics or a result file | Full record | Small durable research evidence is still evidence |
| Train, eval, benchmark, ablate, reproduce, or export model predictions | Full record | A new experiment identity crosses a durable evidence boundary |
| Query an existing Run's tmux, TensorBoard, latest loss, or known checkpoints | No record | Read-only unless it reveals a material event |
| Discover completion, OOM, a new artifact path, or a citeable metric on an existing Run | Append event | Preserve the durable change in the same identity |
| A completed valid eval underperforms baseline | Full record or Append event | Keep `completed` and make a non-adoption decision |
| A report becomes durable research material | Full record | Preserve input, upstream, and derived-artifact provenance |

## 1. Formal Benchmark prelaunch

Before launching:

```sh
python eval.py --config configs/base.yaml --seed 0 --split test
```

Create `runs/20260803-0900-baseline-eval-s0/record.md` with `status: planned`, the exact command, CWD, config, seed, expected `logs/baseline-eval-s0.log`, expected `results/baseline-eval-s0.json`, expected and failure signals, and a stop rule. This is a formal prelaunch Record: do not launch until those facts exist.

## 2. Qualified exploration with bounded backfill

A quick exploratory script may start before its Record only after proving all of these facts: no production-data modification, irreversible operation, public API change, or persistent-format change; an explicit 15-minute and $5 cap; isolation in an existing temporary directory; and no direct use of the result in the formal path.

Create `runs/20260803-1015-cache-probe/record.md` before session close, conclusion, a dependent Spec, a dependent experiment, merge, or external sharing. If the probe begins to change a persistent format or its result will support formal acceptance, stop and create the formal Record first.

## 3. Exploration that does not qualify

A request to try a dataset conversion that changes a persistent format is not qualified exploration. Create a planned formal Record with command, CWD, intended logs/results, and stop rule before starting. Do not treat urgency as evidence that the formal gate is optional.

## 4. Existing Run read-only query

An existing `runs/20260803-0900-baseline-eval-s0/record.md` already records its log and TensorBoard URL. For “Show the latest loss” or “Is tmux still alive?”, read the existing evidence and answer. Do not create another Run or write an event unless the query discovers a material milestone, error, terminal state, or user-requested durable snapshot.

## 5. Same-minute identity collisions

For a same identity, inputs, key configuration, and user intent, append an event to the existing `runs/20260803-1100-router-ablation-s0/record.md`.

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
decision: retry-smaller-batch
summary: CUDA OOM during validation; no usable metrics were produced.
```

Put the concise error, log path, attempted configuration, and next action in the terminal sections. Keep the full error log under the Run's `logs/` directory.

## 7. Valid negative result

When a valid eval scores 81.2 against a baseline of 82.0, record:

```yaml
status: completed
decision: do-not-adopt
summary: The configured ablation underperformed the baseline on the same split.
```

The Key Results, Observations, and Conclusion explain the comparison and caveats. This is a valid negative result, not a failed Run.

## 8. Derived report provenance

Before creating a durable comparison report from existing predictions, create or recover the upstream Run Record. In the report Run, list:

- Input artifacts: `outputs/model_a_predictions.jsonl`; `outputs/model_b_predictions.jsonl`
- Upstream Run ID: `20260803-1300-model-inference-s0`
- Derived artifacts: `results/prediction-comparison.html`; `results/prediction-comparison.zip`

Use `Unknown` with a reason for unrecoverable upstream launch facts. A quick prediction export that loads a checkpoint and writes outputs is a Full record before launch.
