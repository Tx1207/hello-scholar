# Writing Plans: Reconcile a Local Policy Plan Change

## Project Background

This Python feature-policy library has an accepted Spec revision 3 and an existing approved Plan revision 1. Revision 3 keeps the public boolean API, explicit-deny precedence, constructor migration, cleanup gate, rollback, and file boundaries, while adding an audit callback requirement to the precedence phase. The current Plan still expresses the otherwise valid implementation strategy for revision 2.

## Original User Request

请根据当前 Accepted `SPEC-003` revision 3 修订现有 `plan.md`。只把新增的 audit callback 义务归并到受影响的接口、第一阶段、测试和回滚中；仍有效的模块、文件边界、显式 deny 优先级、兼容迁移、cleanup gate、TDD 选择和其他策略都保留。删除被新 revision 替代的旧绑定，整理成完整 12 节 Plan 后保持 `draft` 给我整份审核。不要创建或修改 `tasks.md`，也不要开始实现。

## Evaluation Context

Read Architecture, the complete accepted Spec revision 3, the complete current Plan revision 1, source, tests, and project rules. The evaluator supplies the pre-change `writing-plans` snapshot for Baseline and the current snapshot for Live.

## Allowed Scope

- `hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/plan.md`.
- Generated global and topic indexes through the absolute hello-scholar CLI.

## Prohibited Scope

- Rebuilding from the template in a way that loses valid strategy, retaining stale Spec bindings, or appending an isolated amendment.
- Spec, Tasks, Architecture, source, tests, packages, Runs, or memory changes.
- Plan approval or implementation.

## Expected Result

Plan revision 2 binds Spec revision 3, remains draft, preserves every unaffected implementation decision, modifies only affected interface/phase/test/rollback material, removes stale references, remains complete across all 12 sections, and stops for whole-file review without touching Tasks.

## Verification

Run `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` and the absolute `hello-scholar docs check`. Source, tests, Spec, and Architecture remain byte-identical.

## Interaction

This is a single-round Plan revision request ending at the review stop.
