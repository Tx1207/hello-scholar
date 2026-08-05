---
name: writing-plans
description: 当用户需要为已 Accepted 的 Spec 编写可审核实施 Plan 时使用。生成同一 Bundle 的高层 plan.md，并在 Plan 批准后转交 generating-tasks。
---

# 编写计划

为一个已 Accepted 的 `spec.md` 创建一份可审核的高层 `plan.md`。Plan 说明实施策略、边界、顺序、迁移、清理、回滚和 Tasks 生成规则。`generating-tasks` 负责可独立执行的 tracer Tasks；Tasks 获批且用户明确请求实施后，由当前主 Agent 负责执行。

## 1. 建立事实源

1. 确认项目根目录并运行：
   ```sh
   node <hello-scholar-repo>/bin/hello-scholar.js docs check
   ```
2. 读取目标 `spec.md`。它必须是 `status: accepted`；否则报告当前 Spec 状态并停止。
3. 只读取为制定已接受设计所需的 Architecture、代码、测试、配置、Record 和既有 Bundle 文档。
4. 写明 Spec ID 与 revision。Spec 定义行为、边界、不变量和验收；Plan 定义实施策略。出现材料性冲突时，回到 Spec owner 处理。

**完成条件：** 已接受的设计、当前 revision 和制定实施策略所需证据都已明确。

## 2. 设定策略边界

- 请求需要 Accepted Spec 未固定的材料性架构、公开接口、数据合同或产品决定时，指出缺失决定并停在 Spec revision 门。
- Plan 只覆盖较大 Spec 的部分内容时，写明覆盖章节和延后章节。
- 写入 Phase 前先映射受影响模块和精确文件边界。每类文件标为 `Add`、`Modify`、`Move or Migrate`、`Delete` 或 `Must Not Touch`；空类别写 `None` 并说明原因。
- 保持一次语义文档事务：规划只改 `plan.md`。既有 Tasks 变为 Stale 是正常派生状态，不因此改写 `tasks.md`。

**完成条件：** Plan 有具体且边界清晰的策略，不重新开启已接受的设计决定。

## 3. 写入 Bundle Plan

写入前先读取 `assets/` 的对应模板。根据仓库语言偏好选择：中文使用 `assets/plan-template.zh_CN.md`，否则使用 `assets/plan-template.md`。用户可读的 Plan 正文遵循仓库语言偏好；不要根据任务提示语言推断。代码符号、字段名、路径、命令和模板要求的标题保持原样。创建或修订：

```text
hello-scholar/specs/<topic>/SPEC-<number>-<design-name>/plan.md
```

使用以下 Front Matter：

```yaml
schema: 1
kind: plan
spec: SPEC-000
spec_revision: 1
revision: 1
status: draft
title: <具体的计划标题>
summary: <具体的策略摘要>
created: YYYY-MM-DD
updated: YYYY-MM-DD
```

语义 Plan 修订会递增 `revision`、将 `status` 设为 `draft` 并更新 `updated`。向用户展示前，将全部模板提示替换为具体项目事实。

正文固定包含 12 节：

1. Implementation Goal
2. Scope
3. Technical Strategy
4. Affected Modules
5. File Change Boundaries
6. Interface Changes
7. Implementation Phases
8. Test and Experiment Strategy
9. Migration Sequence
10. Cleanup
11. Rollback
12. Tasks Generation Rules

**完成条件：** 同一 Bundle 的 `plan.md` 绑定当前 Accepted Spec revision，完整描述实施策略，不含 Task checkbox、微步骤、代码清单或执行交接菜单。

## 4. 审核与交接

1. 对照 Accepted Spec 自审 Plan：事实、范围、文件边界、接口、阶段、测试、迁移、清理、回滚与未决设计缺口。
2. 运行：
   ```sh
   node <hello-scholar-repo>/bin/hello-scholar.js docs check
   node <hello-scholar-repo>/bin/hello-scholar.js docs sync
   node <hello-scholar-repo>/bin/hello-scholar.js docs check
   ```
3. 将完整 Plan 交给用户进行一次整份审核。只有用户明确批准前，它保持 `draft`。
4. 设置 `status: approved` 前，重新读取目标 Spec 的 Front Matter，并确认 Plan 的 `spec` 与 `spec_revision` 仍匹配其 accepted ID 和 revision。任一不匹配时，Plan 保持 `draft`，修订后重新审核。
5. 用户明确批准并通过该新鲜度检查后，将 `status` 设为 `approved`，通过相同 CLI 序列验证，再调用 `$generating-tasks` 生成需要独立审核的 Tasks。

**完成条件：** 终态是已审核 Plan，或阻止计划的明确设计停止点。Plan 批准不代表 Tasks 或实施获得批准。
