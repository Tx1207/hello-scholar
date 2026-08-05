# Generating Tasks: JSON v2 Config Migration

## Project Background

This standalone Node CLI writes JSON v2 by default, still exposes a legacy properties writer through `--legacy-output`, and reads both formats while one active profile remains in each format. Accepted `SPEC-014` revision 3 and its approved Plan define compatibility reading, migration preparation, gated cutover, cleanup, regression, rollback, and recovery. Source, tests, profiles, migration state, and vendored codec show the pre-migration project state. No `tasks.md` exists.

## Original User Request

请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。

## Evaluation Context

Read the project rules, Architecture, accepted Spec, approved Plan, persisted profiles, migration state, source, tests, vendored dependency, and package metadata. The baseline intentionally does not provide `generating-tasks`. Do not obtain substitute instructions from repository-wide task packets, unrelated skill files, or other evaluation directories.

## Allowed Scope

- `hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md`.
- Generated global and topic indexes produced through the absolute hello-scholar CLI.

## Prohibited Scope

- Changes to the Spec, Plan, Architecture, profiles, migration state, source, tests, vendor, package metadata, lockfile, or Runs.
- Migration execution, format-switch changes, legacy deletion, dependency installation, backups, reports, or implementation work.
- A global `tasks/` directory, `hello-scholar/memory/`, or Tasks approval before review.

## Expected Result

The Tasks document is independently reviewable, binds the accepted Spec and Plan revisions, is pending review, and preserves separate dependency-ordered work for compatibility proof, conversion, cutover, cleanup, regression, rollback, and failure recovery. It names exact deletion targets, prerequisite evidence, commands, expected signals, and recovery actions, while keeping dependent or overlapping writers non-parallel.

## Verification

Run `npm test` and the absolute `hello-scholar docs check`. The Spec, Plan, Architecture, profile, migration-state, source, test, vendor, package, and lockfile bytes remain unchanged.

## Interaction

This is a single-round Tasks-generation request that ends at the review stop.
