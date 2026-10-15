# record-experiment examples

These cases cover judgments that the SKILL text alone leaves ambiguous.

## 1. Reuse before launching

The user asks to evaluate the λ72 model at step 8000. `runs/INDEX.md` shows `20261010-0900-l72-dists-s6000` with `entry: scripts/eval_uvg96.py` and the same evaluation set. Rerun that entry with `--step 8000` as a new Run with `derived_from: 20261010-0900-l72-dists-s6000`, and state in the Record that only the checkpoint step differs. Do not copy the script to change the constant. If the step-8000 baseline already exists under the same evaluation conditions, report it from its Record instead of running again.

If the earlier Run used a different evaluation script or data split, rerun only the part that differs and say why the old result is not comparable.

## 2. Similar executions, different evidence value

A 20-example run on a remote GPU checks config parsing and reaches inference. No later decision depends on its outputs: report executability, and create no Record. Another 20-example run compares two preprocessing choices on a fixed diagnostic set to decide which to investigate next: preserve it, and note that a diagnostic set supports this narrow choice, not general model quality. Cost and sample count did not decide either case.

## 3. Startup preparation, then a research retry

An agreed A/B comparison deserves a Record. Three startup checks fail on a scheduler setting, a DDP rank bug, and a process-group conflict before the A/B starts. Keep one planned Record with null timestamps, append each error and fix, and keep each check's logs separately. After the checks pass, continue the same Record from the actual research start.

If the A/B itself starts and then fails, close that Run as `failed`. An authorized retry is a new Run with `derived_from` pointing to the failed one; it reuses the launch plan and resumes from completed stages, such as already encoded data or saved checkpoints, when conditions allow.

## 4. Negative result versus failure

A valid, comparable eval scores 81.2 against a baseline of 82.0: `status: completed`, and `decision: do-not-adopt` only if the main agent actually decided that. A CUDA OOM during validation produced no metrics: `status: failed`, with the error, attempted configuration, logs, and exit code. The OOM establishes a resource limit for that configuration; it does not test the method.

## 5. Read-only query on an existing Run

For "show the latest loss" or "is tmux still alive", read the existing evidence and answer. A newly discovered completion or error is reported; append it to the Record only when the task already covers maintaining that Run or the user asks.
