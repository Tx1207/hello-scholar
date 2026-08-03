# Writing Plans: Deterministic Event Export Migration

## Project Background

This Python event-export library currently writes plaintext JSONL archives. Accepted `SPEC-017` revision 3 has already decided the target format, public compatibility, migration window, cleanup gate, error contract, and rollback boundary. The code and tests expose the current writer and reader paths. The Bundle has no Plan or Tasks.

## Original User Request

请使用 `$writing-plans`，从当前 Accepted `SPEC-017` revision 3 生成同一 Spec Bundle 下可单独审核的高层 `plan.md`。Plan 要写清实现目标、范围、技术方案、模块和文件边界、接口、阶段、测试/实验、迁移、清理、回滚和 Tasks 生成规则，但不要写 Task 复选框、逐步源码、微操作清单、逐步 commit 或执行器选择，也不要创建 `tasks.md` 或开始实现。先生成 `draft` 并停下来等我审核；我批准当前 Plan 后，只记录 `approved` 并说明下一步是 `$generating-tasks`。

## Evaluation Boundary

The Baseline receives an immutable pre-change `writing-plans` copy. Read Architecture, the complete Accepted Spec, source, tests, callers, and project rules. Do not inspect the hello-scholar Task Packet, current production Skills, or other Eval evidence.

## Allowed Scope

- `hello-scholar/specs/event-export/SPEC-017-deterministic-gzip-archives/plan.md`.
- Generated global and Topic Indexes through the absolute hello-scholar CLI.

## Forbidden Scope

- Spec, Architecture, source, tests, callers, dependencies, or Runs.
- `tasks.md`, global `tasks/`, `hello-scholar/memory/`, implementation reports, or code changes.
- Plan approval before the future review reply, or implementation after approval.

## Required Result

The first Plan revision is a high-level `draft` bound to `SPEC-017` revision 3. It covers every accepted decision without reopening design or embedding implementation Tasks. After the Eval main agent approves the current Plan at the real review stop, only its approval state changes; the Implementer stops with `$generating-tasks` as the next owner.

## Verification

Run `python3 -m unittest discover -s tests` and the absolute `hello-scholar docs check`. Spec, Architecture, source, tests, and callers remain byte-identical.

## Interaction

The approval reply is withheld from the first prompt and sent only after the draft Plan summary and clean later-stage state are observed.
