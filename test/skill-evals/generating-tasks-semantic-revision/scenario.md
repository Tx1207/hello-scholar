# Generating Tasks: Reconcile a Partially Completed Execution Contract

## Project Background

This Python feature-policy library has an accepted Spec revision 3, approved Plan revision 2, and approved Tasks revision 1 with partial execution evidence. `T001` is completed and remains valid. Pending `T002` is no longer needed. `T003` keeps the same outcome but needs new audit-callback validation. The revised upstream contract also introduces one new integration result.

## Original User Request

请根据当前 Accepted Spec 和 Approved Plan 修订现有 `tasks.md`：保留已完成且仍有效的 `T001`、checkbox 和证据；删除未完成且已废弃的 `T002`；`T003` 目标不变，只更新 Work、Validation 和 Completion；为新增 audit integration 使用新的更大 Task ID。修复依赖图并把整份 Tasks 重置为 pending-review，等我审核。不要改写过去执行事实，不要重排或复用 ID，也不要开始实施。

## Evaluation Context

Read project rules, Architecture, the complete Spec, Plan, current Tasks, source, tests, and confirmable Git facts. The evaluator supplies the pre-change `generating-tasks` snapshot for Baseline and the current snapshot for Live.

## Allowed Scope

- `hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md`.
- Generated global and topic indexes through the absolute hello-scholar CLI.

## Prohibited Scope

- Renumbering surviving Tasks, changing completed evidence, reusing removed IDs, or leaving dependencies on removed Tasks.
- Spec, Plan, Architecture, source, tests, packages, Runs, or memory changes.
- Tasks approval or implementation.

## Expected Result

The revised current execution contract keeps `T001` checked with evidence, removes `T002`, preserves `T003` identity while updating its execution fields, adds the new obligation with an unused ID greater than all historical IDs, rebuilds coverage and the DAG, increments Tasks revision, and resets approval metadata exactly to pending-review/null/pending.

## Verification

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` and the absolute `hello-scholar docs check`. Upstream documents and implementation remain byte-identical.

## Interaction

This is a single-round Tasks revision request ending at the review stop.
