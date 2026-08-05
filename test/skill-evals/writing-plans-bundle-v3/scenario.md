# Writing Plans: Deterministic Event Export Migration

## Project Background

This Python event-export library currently writes plaintext JSONL archives. Accepted `SPEC-017` revision 3 defines the gzip format, public compatibility rules, migration window, cleanup gate, error behavior, and rollback boundary. The source, tests, and replay client show the current implementation. The Spec Bundle contains neither a Plan nor Tasks.

## Original User Request

请使用 `$writing-plans`，从当前 Accepted `SPEC-017` revision 3 生成同一 Spec Bundle 下可单独审核的高层 `plan.md`。Plan 要写清实现目标、范围、技术方案、模块和文件边界、接口、阶段、测试/实验、迁移、清理、回滚和 Tasks 生成规则，但不要写 Task 复选框、逐步源码、微操作清单、逐步 commit 或执行器选择，也不要创建 `tasks.md` 或开始实现。先生成 `draft` 并停下来等我审核。

## Evaluation Context

Read the Architecture, the complete accepted Spec, source, tests, replay client, and project rules as the current project facts. The evaluation supplies an immutable pre-change `writing-plans` snapshot for the baseline. Do not inspect repository-wide task packets, unrelated skill files, or other evaluation directories.

## Allowed Scope

- `hello-scholar/specs/event-export/SPEC-017-deterministic-gzip-archives/plan.md`.
- Generated global and topic indexes produced through the absolute hello-scholar CLI.

## Prohibited Scope

- Changes to the Spec, Architecture, source, tests, callers, dependencies, or Runs.
- `tasks.md`, global `tasks/`, `hello-scholar/memory/`, implementation reports, or code changes.
- Approval before a separate review decision, or implementation after approval.

## Expected Result

The initial Plan is a high-level `draft` bound to `SPEC-017` revision 3. It maps all accepted constraints without reopening design decisions or substituting an implementation checklist for a strategy. After an authorized review decision, only Plan approval state may change, and the response names `$generating-tasks` as the next owner before stopping.

## Verification

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` and the absolute `hello-scholar docs check`. The Spec, Architecture, source, tests, and replay client remain byte-identical.

## Interaction

The first request ends at the draft review stop. A later evaluator-side review message is delivered only after that stop condition is observed.
