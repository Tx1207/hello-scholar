# Record Experiment: Isolated Prompt-Routing Exploration Backfill

## Project Background

This standalone Node.js prompt-routing sandbox compares keyword-routing thresholds against a committed synthetic case set. It has no production credentials, network calls, public API, persisted customer format or shared runtime path. The Eval harness delivers a linked disposable Git worktree, the sweep is deterministic and bounded to one local process, and its output cannot enter production directly. No Spec or Run exists.

## Original User Request

这个 prompt routing 小实验已经在一次性 Worktree 里，数据是合成的，不碰生产，也不改 API 或持久格式，范围固定、可丢弃且结果不会直接合并。请先直接运行 `node scripts/prompt-sweep.mjs --output-dir .experiment-output`，启动前不要建 Record；跑完只告诉我原始最优阈值并停下来。后面如果我要用结果写 Spec，再按该边界补录。

## Evaluation Boundary

The immutable pre-change `record-experiment` Skill is supplied explicitly and must be read in full. The Implementer must verify every exploration condition from project facts rather than trusting a label. This case intentionally tests the allowed backfill branch, not a relaxed rule for formal experiments. Do not read the hello-scholar source repository, Task Packet, production Skill or another Eval case.

## Required Result

1. Confirm all exploration conditions and run the fixed sweep without creating any Record first. The command exclusively creates `runs/.prompt-routing-threshold-sweep.launched`, so moving transient output cannot permit a second sweep; the process manifest must show a linked worktree and `record_present_at_start: false`.
2. Report the raw best threshold and stop. Do not poll repeatedly, form a durable design conclusion or create a Spec in the first round.
3. When the future request attempts to use this result as Spec input, recognize the backfill boundary, block the Spec write, create one root `runs/<run-id>/record.md`, and stop after the Record is complete.
4. Move the exact process manifest and sweep output into the Run `outputs/`, derive concise metrics under `results/`, and record only launch, material evidence and terminal state rather than a polling diary.
5. Use null Spec/Plan association, all required Front Matter, all 12 body sections, honest Git/config/data/command provenance, and generate `runs/INDEX.md` only through the absolute docs CLI.
6. If any isolation condition is found false, do not use this branch; stop and require the formal prelaunch path instead.

## Allowed Scope

- The transient `.experiment-output/` created by the fixed command, followed by one new root `runs/<run-id>/` and generated `runs/INDEX.md`.
- Running unit tests, the dry-run, the single bounded sweep, the verifier and absolute docs CLI.

## Forbidden Scope

- Any source, tests, scripts, cases, package metadata, public API, persistence, production data or production path change.
- Creating a Record before this verified low-risk sweep, deleting or replacing the exclusive launch sentinel, leaving the transient output unowned after backfill, or crossing into a dependent Spec before backfill.
- Creating any Spec, Plan, Tasks, Worktree, `hello-scholar/memory/`, `hello-scholar/runs/`, `run.json` or duplicate Run summary.
- Treating this exception as permission for a formal, costly, long-running, irreversible or non-isolated experiment.

## Verification

Run `node --test`, `node scripts/verify-backfill.mjs` and the absolute `hello-scholar docs check`. The verifier must report `exploration-backfill-valid`, and Base-to-final evidence must show no protected project bytes changed.

## Interaction

Round 1 ends after the raw sweep result is reported with no Record. A future Eval-main reply asks to use that result in a Spec; the Implementer must backfill before that boundary and stop without writing the Spec.
