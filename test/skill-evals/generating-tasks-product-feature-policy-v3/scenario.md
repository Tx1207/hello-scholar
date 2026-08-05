# Generating Tasks: Feature Policy Precedence

## Project Background

This Python feature-policy library evaluates tenant rules before returning a boolean. Accepted `SPEC-003` revision 2 and its approved Plan define the explicit-deny precedence change, public interface compatibility, file boundaries, migration, rollback, and the sole behavior selected for Red-Green-Refactor. Source and tests show the pre-upgrade behavior. No `tasks.md` exists.

## Original User Request

请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。

## Evaluation Context

Read the project rules, Architecture, accepted Spec, approved Plan, source, and tests. The baseline intentionally does not provide `generating-tasks`. Do not obtain substitute instructions from repository-wide task packets, unrelated skill files, or other evaluation directories.

## Allowed Scope

- `hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md`.
- Generated global and topic indexes produced through the absolute hello-scholar CLI.

## Prohibited Scope

- Changes to the Spec, Plan, Architecture, source, tests, packages, or Runs.
- A global `tasks/` directory, `hello-scholar/memory/`, implementation reports, or implementation work.
- Approval of Tasks before review.

## Expected Result

The Tasks document is independently reviewable, binds the accepted Spec and Plan revisions, is pending review, and covers every acceptance criterion plus the Plan's migration, cleanup, regression, and rollback obligations. It has an acyclic dependency graph, does not mark overlapping writers as parallel, and carries Red-Green-Refactor only for the Plan-selected precedence behavior.

## Verification

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` and the absolute `hello-scholar docs check`. The Spec, Plan, Architecture, source, and tests remain byte-identical.

## Interaction

This is a single-round Tasks-generation request that ends at the review stop.
