---
schema: 1
kind: plan
spec: SPEC-000
spec_revision: 1
revision: 1
status: draft
title: <清晰的实施计划标题>
summary: <具体的实施策略摘要>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <清晰的实施计划标题>

## 1. Implementation Goal

<说明本 Plan 要实施的已接受结果。>

## 2. Scope

<写明覆盖的 Spec 章节、延后章节和明确非目标。>

## 3. Technical Strategy

<描述实施方法，不重新开启已接受的产品决定。>

## 4. Affected Modules

<列出每个受影响模块及其在策略中的职责。>

## 5. File Change Boundaries

- Add: <路径，或 None 与原因>
- Modify: <路径，或 None 与原因>
- Move or Migrate: <路径，或 None 与原因>
- Delete: <路径，或 None 与原因>
- Must Not Touch: <路径或边界>

## 6. Interface Changes

<描述改变的公共接口、数据合同、兼容行为或状态；不适用时写 None 与原因。>

## 7. Implementation Phases

<描述按依赖排序的阶段及其可观察结果。>

## 8. Test and Experiment Strategy

<描述 Spec 要求的单元、集成、回归、Benchmark、Eval 或正式实验证据。>

## 9. Migration Sequence

<描述兼容窗口、转换顺序和切换门；没有迁移时写 None 与原因。>

## 10. Cleanup

<写明废弃 caller、配置、数据、flag、依赖或文件，以及删除前所需证据；不适用时写 None 与原因。>

## 11. Rollback

<描述恢复动作、保留证据和触发回滚的边界；不适用时写 None 与原因。>

## 12. Tasks Generation Rules

<描述交给 generating-tasks 的 tracer Task 覆盖、依赖、并行边界、验证和明确 TDD 选择。>

## Plan Self-Review

<确认与当前 Accepted Spec revision 对齐、文件边界精确、迁移/清理/回滚已覆盖，以及未决设计决定。>

Plan 已写入当前 Spec Bundle，等待整份用户审核；批准后调用 `$generating-tasks`。
