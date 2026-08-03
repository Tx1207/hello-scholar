# Generating Tasks: Feature Policy Sonnet v3 Evaluation

## Project Background

This Python feature-policy library evaluates tenant rules before returning an enabled flag. The Accepted Spec and Approved Plan define a precedence upgrade, exact file boundaries, AC IDs, migration, rollback, and one explicitly selected TDD behavior. Source and tests currently implement the pre-upgrade behavior. No `tasks.md` exists.

## Original User Request

请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。

## Evaluation Boundary

The current `generating-tasks` Skill is supplied only at the stage declared by the Protocol. Read Architecture, Spec, Plan, source, tests, and project rules. Do not read evaluator-only scenario material, Protocols, historical evidence, the hello-scholar Task Packet, or any production Skill beyond the authorized snapshot.

## Allowed Scope

- `hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md`.
- Generated global and Topic Indexes through the absolute hello-scholar CLI.

## Forbidden Scope

- Any Spec, Plan, Architecture, source, test, Run, dependency, or package change.
- Global `tasks/`, `hello-scholar/memory/`, implementation reports, or code execution beyond verification.
- Approving the Tasks or beginning implementation.

## Required Result

The new Tasks file uses `kind: tasks`, references `SPEC-003`, `spec_revision: 2`, and `plan_revision: 1`, and initializes exactly `revision: 1`, `approval: pending-review`, `approved_revision: null`, and `status: pending`. Every top-level Task has a unique ID, a plain-language goal, `Spec Coverage`, `Depends On`, `Parallel`, `Files`, `Work`, `Validation`, and `Completion`. It covers every Spec AC and every Plan migration, cleanup, regression, and rollback obligation, has an acyclic dependency graph, and gives exact paths, executable commands, and observable expected signals without placeholders or hidden context. Parallel Tasks neither depend on one another nor write the same file. Only the precedence behavior selected by the Approved Plan carries Red-Green-Refactor; the Tasks preserve the Plan's strategy instead of reopening architecture decisions.

## Verification

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` and the absolute `hello-scholar docs check`. Spec, Plan, source, and test bytes remain unchanged.

## Interaction

This is a single-round generation request that ends at the Tasks review stop.
