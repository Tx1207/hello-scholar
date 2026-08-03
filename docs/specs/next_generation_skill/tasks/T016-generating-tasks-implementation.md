# T016：实现 `generating-tasks` Skill

- Status: `approved`
- PR: `PR 3 - Plan 与 Tasks 拆分`
- Depends On: T008, T015
- Parallel: No。需要 docs 校验和已确认的 Red 场景。

## 目标

新增一个只把 Approved Plan 拆成可执行 Tasks 的 Skill。它承接原 `writing-plans` 中的细粒度任务 Prompt，但不重做 Spec 或 Plan 已确定的设计。

## 与原 Skill 的比较

| 原 `writing-plans` 中的内容 | 新 owner |
|---|---|
| Source-of-Truth Gate、Scope Boundary、文件结构、高层测试/迁移/回滚 | 仍属于 `writing-plans` |
| 合适粒度动作、精确代码/命令/预期输出、Task 复选框、Spec Coverage、No Placeholders | 移到 `generating-tasks` |
| Plan/用户明确要求的 TDD 顺序 | 只传递到对应 Task，不升级为所有 Feature/Bugfix 的默认要求 |
| 计划完成后直接选执行器 | 改为先生成并审核 `tasks.md`，批准后由当前主 Agent直接执行 |

“移动”意味着 T019 删掉后，这些约束必须在本 Skill 完整存在，不能两边都剩半套。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `generating-tasks` 是 model-invoked，因为 Approved Plan 会主动转交；description 的 leading word 是 `decomposition`，只覆盖“把 Plan 拆成可执行 Tasks”。
- `普通 Task | 明确 TDD Task | 迁移/删除/最终门` 是主要 branch；每个 Task 的 completion criterion 必须让单独收到文件的 Agent 能判断是否完成。
- 模板和字段说明放在 `assets/`，核心读取顺序、审批门、依赖和单文档事务留在 `SKILL.md`。
- 从 `writing-plans` 移入的规则只有一个 owner；删除重复、no-op 和过度细分造成的 sprawl，不把未来执行步骤暴露成提前实施诱因。

## 文件边界

### Add

- `skills/superpowers-skills/generating-tasks/SKILL.md`
- `skills/superpowers-skills/generating-tasks/SKILL.zh_CN.md`
- `skills/superpowers-skills/generating-tasks/assets/tasks-template.md`
- `skills/superpowers-skills/generating-tasks/assets/tasks-template.zh_CN.md`
- `test/test_generating_tasks_skill.py`

### Must Not Modify

- `skills/superpowers-skills/writing-plans/`（T019 处理）
- `src/`
- 其他 Skill

## Skill 流程

1. 找到目标 Spec Bundle，按 `spec.md -> plan.md` 顺序读取。可读相关 Architecture 和代码来确认路径，但不为此改设计。
2. 运行 `hello-scholar docs check`，确认 Spec `status: accepted`、Plan `status: approved`、Plan 引用当前 Spec Revision。Plan Stale、Spec 未 Accepted、Plan 未 Approved 或重大设计缺失时停止。
3. 读 Plan 的范围、文件变更、接口、阶段、测试、迁移、清理、回滚和 Tasks 生成规则，建立 AC -> Task 覆盖表。
4. 任务按可独立理解/执行/验证的行为边界拆分，不把大型功能只写成一项，也不把单个不可分割改动拆成多个会临时破坏仓库的 Task。
5. 每个 Task 必须包含唯一 `TNNN`、目标、Spec Coverage、Depends On、Parallel、Files、Work、Validation 和 Completion。Validation 要有精确命令和可观察通过信号。只有用户或 Approved Plan 明确要求 TDD 时，对应 Task 才写清 Red-Green-Refactor、预期失败原因和通过信号；未指定时不得自动加入 `$test-driven-development`。
6. 依赖图必须无环。`Parallel: Yes` 只能给无依赖且不写同一文件/共享可变状态的 Task；其他一律 `No`。
7. 删除、迁移、旧路径退出、回归、文档和最终集成验收也必须是明确 Task，不只写为顶层备注。
8. 禁止占位语、“参考 Task N”和只有“测试通过”的验收。每个 Task 被单独派发时也必须可读。
9. 写入同 Bundle `tasks.md`，Front Matter 复制当前 Spec ID/Revision 和 Plan Revision；新文件精确使用 `revision: 1`、`approval: pending-review`、`approved_revision: null`、`status: pending`。只改 Tasks 这一类核心文档。
10. 自审：检查全部 AC 覆盖、依赖环、文件冲突、占位、禁止范围、验证可执行性和类型/接口一致性。
11. 运行 docs check/sync，先完整自审当前 Tasks Revision 的覆盖、依赖和可执行性，再向用户提交整份 `tasks.md` 审核。用户明确批准后可以只做审批状态迁移：`approval: approved`、`approved_revision` 等于当前 `revision`，不借机改正文；若用户要求语义修改，则 `revision + 1`、重置为 `pending-review/null` 并重新整份审核。合同批准仍不等于本轮实施授权；另获明确实施请求后，才由当前主 Agent按依赖直接执行，不路由到已淘汰的执行 Skill，也不强制执行/子代理/评审 Skill。

## 模板

- Front Matter 与 PRD 一致。
- 模板提供 Phase 和单 Task 完整结构，包含依赖/并行/验证/完成条件，不把实例中的业务名称残留到新文档。
- 中英文模板和 Skill 语义对齐，使用项目默认语言选择。

## 测试

- 静态测试检查前置门、输出路径、Front Matter、任务字段、AC 覆盖、依赖/并行规则、No Placeholders、单文档事务、用户审核门和 TDD 显式传递边界。
- 测试同一 Fixture 中“Plan 明确要求 TDD”的 Task 包含完整顺序，未明确要求的 Task 不调用 TDD；不能用删除所有 Red/Green 信息来通过禁止自动触发的断言。
- 用 T004 解析两个模板 Front Matter，使用 T006 的 Tasks 计数规则验证模板结构。
- 运行 `python3 -m unittest test/test_generating_tasks_skill.py`、`npm test`。

## 完成标准

- 原 `writing-plans` 的任务级严格性在新 Skill 中完整存在，且没有新的架构决策权。
- 产出 `tasks.md` 可以单任务派发，依赖和验证可由程序/人复核。
- 没有修改 `writing-plans`，没有连带实施代码。
