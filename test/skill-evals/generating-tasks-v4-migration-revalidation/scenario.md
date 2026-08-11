# Generating Tasks: Config Format Migration Haiku v4 Revalidation

## Project Background

This standalone Node CLI stores service profiles in a project directory. It currently writes JSON v2 by default, can still write the legacy properties format through `--legacy-output`, reads both formats through one compatibility reader, and has one persisted profile in each format. The Accepted Spec and Approved Plan fix the migration sequence, compatibility window, cutover evidence, legacy writer/flag/dependency removal, regression matrix, and rollback drill. Source and tests implement the pre-migration state. No `tasks.md` exists.

## Original User Request

请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。

## Evaluation Boundary

The current `generating-tasks` Skill is supplied only at the stage declared by the Protocol. Read the project rules, Architecture, Accepted Spec, Approved Plan, persisted profiles, source, tests, and package metadata. Do not read evaluator-only scenario material, Protocols, historical evidence, the hello-scholar Task Packet, or any production Skill beyond the authorized snapshot.

## Allowed Scope

- `hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md`.
- Generated global and Topic Indexes through the absolute hello-scholar CLI.

## Forbidden Scope

- Any change to Spec, Plan, Architecture, persisted profiles, migration state, source, tests, vendored dependency, package metadata, or lockfile.
- Running the migration, changing the format switch, deleting legacy paths, installing dependencies, or beginning implementation.
- Global `tasks/`, `hello-scholar/memory/`, migration reports, backups, or approval of the Tasks.

## Required Result

The new Tasks file uses `kind: tasks`, references `SPEC-014`, `spec_revision: 3`, and `plan_revision: 2`, and initializes exactly `revision: 1`, `approval: pending-review`, `approved_revision: null`, and `status: pending`. Every top-level Task has a unique ID, a plain-language goal, `Spec Coverage`, `Depends On`, `Parallel`, `Files`, `Work`, `Validation`, and `Completion`. Required Tasks preserve the Plan's distinct migration preparation, dual-read proof, data conversion, cutover gate, exact legacy writer/flag/dependency removal, regression matrix, and rollback drill. Dependencies are acyclic; Tasks that depend on one another or write the same reader, CLI, state, profile, package, or fixture file are not parallel. Deletion work names exact symbols and paths, its prerequisite evidence, executable checks and expected signals, and the recovery action if its gate fails. Nothing reopens the accepted format design or uses placeholders, hidden context, or generic validation.

## Verification

Run `npm test` and the absolute `hello-scholar docs check`. Spec, Plan, Architecture, profile, migration-state, source, test, vendor, package, and lockfile bytes remain unchanged.

## Interaction

This is a single-round generation request that ends at the Tasks review stop.
