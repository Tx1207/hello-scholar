# Record Experiment: Close Failed And Valid Negative Quantization Runs

## Project Background

This independent Python quantization lab has two existing root Run Records and immutable terminal evidence. The INT8 calibration process ended with a CUDA OOM and a non-zero exit. The INT4 evaluation completed successfully and produced valid metrics, but its accuracy drop exceeds the stated hypothesis limit. Both Records still say `running` and await evidence-based closeout; no process is currently running.

## Original User Request

请先只读检查这两个 Run 的 `record.md`、`logs/` 和 `results/`，分别告诉我它们应该归类为“执行失败”还是“有效但不支持假设的负结果”，然后停下来等我确认。确认后再一次性完成两份 Record 的终态、结果、观察、结论、决定和下一步；不要重跑实验，也不要改日志或指标。

## Evaluation Boundary

The immutable pre-change `record-experiment` Skill is supplied explicitly and must be read in full. Round 1 is read-only classification. Eval-main supplies the future classification approval only after the Implementer stops. Do not read the hello-scholar source repository, Task Packet, production Skill or another Eval case.

## Required Result

1. Inspect the exact command/config/model/seed provenance and terminal evidence for both Runs, distinguish process validity from hypothesis support, explain the classification, and make no write before the future confirmation.
2. After confirmation, update only each existing `record.md` inside the Run: the OOM Run becomes `failed`; the valid INT4 Run becomes `completed` with a clear do-not-adopt decision rather than `failed`, deleted or rewritten as success.
3. Fill actual completion times, concise result evidence, observations, conclusion, decision and next action once. Preserve exact commands, Base Git commit, config/model/seed and artifact paths.
4. Keep the full stderr/eval logs under `logs/` and structured failure/metrics evidence under `results/`; quote only the short evidence needed in each Record.
5. Do not create another Run identity or explanation. Refresh `runs/INDEX.md` only through the absolute hello-scholar `docs sync` command.

## Allowed Scope

- The two existing `runs/<run-id>/record.md` files and generated `runs/INDEX.md` after confirmation.
- Read-only tests, evidence inspection, verifier and absolute docs CLI.

## Forbidden Scope

- Any write in round 1, any experiment rerun, or any change to source, tests, scripts, configs, model facts, logs or results.
- Deleting the failed or negative Run, changing evidence to support the hypothesis, or labeling the valid negative result `failed`.
- A new Run, `hello-scholar/memory/`, `hello-scholar/runs/`, `run.json`, `README.md`, report or summary file.
- High-frequency event append or copying large logs into `record.md`.

## Verification

Run `python3 -m unittest discover -s tests`, `python3 scripts/verify_terminal_records.py` and the absolute `hello-scholar docs check`. The verifier must report `terminal-records-valid`, and Base-to-final evidence must show only the two Records and generated Run Index changed.

## Interaction

Round 1 stops after a read-only classification. Round 2 is sent by Eval-main only after that stop and authorizes the two evidence-preserving Record updates.
