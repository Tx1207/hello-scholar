# T019：将 `writing-plans` 收窄为高层 Bundle Plan

- Status: `approved`
- PR: `PR 3 - Plan 与 Tasks 拆分`
- Depends On: T016, T018
- Parallel: No。只有当任务级 Prompt 已在 `generating-tasks` 完整落地后才能从原 Skill 删除。

## 目标

保留原 `writing-plans` 的事实源、范围、文件结构和自审优势，但让它只生成一份可批准的高层 `<spec-bundle>/plan.md`。细粒度实施步骤已由 T016 接管。

## 原 Skill 内容处理表

### 保留并适配 Bundle

- `Source-of-Truth Gate`、`Scope Boundary`、大范围拆分判断。
- 文件职责/模块边界、受影响文件、接口变化、测试与实验策略、迁移、清理、回滚。
- 事实源、范围、合同保留、占位和类型一致性自审。

### 移出并从原 Skill 删除

- 细粒度单步、失败/通过命令、完整源码片段、Task 复选框、每步 Commit、Task 级 Spec Coverage、面向每个 Task 的 No Placeholders。
- 直接选择 `subagent-driven-development` / `executing-plans` 的 Execution Handoff。新终点是请用户审核 Plan，批准后调用 `generating-tasks`；Tasks 获批并收到实施请求后由当前主 Agent直接执行。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `writing-plans` 保持 model-invoked，因为 Approved Spec 会主动转交；description 只触发 `implementation strategy`，不再同时宣传任务执行。
- leading word 使用 `strategy`，每步完成条件停在一份可审核的高层 Plan；后续 Tasks/Execution 不在当前步骤中制造 premature completion。
- Plan 模板是 disclosed reference；事实源门、设计缺口停止门、单文档事务和用户审批留在 `SKILL.md`。
- 删除任务级 duplication、旧执行菜单和无调用方 reviewer prompt；Plan 自审与用户审核是唯一质量路径。

## 文件边界

### Modify

- `skills/superpowers-skills/writing-plans/SKILL.md`
- `skills/superpowers-skills/writing-plans/SKILL.zh_CN.md`
- `skills/superpowers-skills/writing-plans/assets/plan-template.md`
- `skills/superpowers-skills/writing-plans/assets/plan-template.zh_CN.md`

### Delete

- `skills/superpowers-skills/writing-plans/plan-document-reviewer-prompt.md`

### Add

- `test/test_writing_plans_skill.py`

### Must Not Modify

- `skills/superpowers-skills/generating-tasks/**`（T016 已拥有 Tasks 生成合同）
- `skills/superpowers-skills/executing-plans/**`
- `skills/superpowers-skills/subagent-driven-development/**`
- `skills/superpowers-skills/requesting-code-review/**`
- `skills/superpowers-skills/receiving-code-review/**`
- `skills/superpowers-skills/dispatching-parallel-agents/**`
- `skills/superpowers-skills/systematic-debugging/**`
- `skills/superpowers-skills/finishing-a-development-branch/**`
- `skills/superpowers-skills/verification-before-completion/**`
- `skills/superpowers-skills/writing-skills/**`
- `src/`

上面九个待淘汰目录分别由 T024-T032 删除。本 Task 只删掉 `writing-plans` 自己对它们的调用和 Handoff，不得提前删除目录或代替对应删除 Task 清理其他引用。

## 新流程

1. 必须从 Accepted `spec.md` 进入，按需读相关 Architecture 和现有代码。无 Spec，或 Spec 未 Accepted 时停止，不把用户的模糊要求悄悄升格成 Approved Plan。
2. 运行 docs check，从 Spec ID/Revision 生成同 Bundle `plan.md`。同一 Spec Revision 的方案更新保持文件路径，有意义的 Plan 语义变化使 Plan Revision +1。
3. 如果需要做 Spec 未明确的重大架构/接口决策，停止并请求修订 Spec，不在 Plan 里重新设计。
4. Plan 正文按 PRD 的 12 节结构：实施目标、范围、技术方案、受影响模块、文件变更范围、接口变化、实施阶段、测试/实验、迁移顺序、清理、回滚、Tasks 生成规则。
5. 文件范围显式列 `Add`、`Modify`、`Move or Migrate`、`Delete`、`Must Not Touch`；如某类为空，用人话说明“无”及理由，不使用占位符。
6. 一次只语义修改 `plan.md`。不同步 `tasks.md`；旧 Tasks 变 Stale 由 docs 内核显示。
7. Plan 新建时 `status: draft`。先完整自审事实源、范围、文件边界、迁移、清理、回滚和设计缺口，再把整份 Plan 交用户审核；只在用户明确批准整份文件后改为 `approved`。审核前不调用 `generating-tasks`。
8. 删除无实际调用方的 `plan-document-reviewer-prompt.md`。自审检查与 Spec 一致、范围、文件边界、迁移/清理/回滚和是否偷做新设计；随后只交给用户审核。
9. 用户批准后的唯一下一步是 `$generating-tasks`。Tasks 审核通过并收到用户实施指令后，由当前主 Agent直接按依赖执行；不提供执行器选择菜单，不引用已淘汰 Skill。

## 模板修改

- 用固定 Plan Front Matter 和 12 节正文替换当前“Implementation Tasks”模板。
- 删除内嵌测试/实现代码和 Execution Handoff 中的旧 memory 路径。
- 文件末尾明确“Plan 已写入当前 Spec Bundle，等待用户审核；批准后调用 generating-tasks”。

## 测试

- 静态检查保留 Source-of-Truth/Scope/File Structure/自审原则，并确认中英文模板有固定 Front Matter 和 12 节。
- 禁止检查：`hello-scholar/memory/plans`、`## Implementation Tasks`、Task 复选框、强制微步骤拆分、执行器选择或已淘汰 Skill 名称。
- 检查 `generating-tasks` 确实存在且含被移出的任务级约束，防止“从原 Skill 删了，新 Skill 没接住”。
- 运行 `python3 -m unittest test/test_writing_plans_skill.py`、`npm test`。

## 完成标准

- `plan.md` 只描述如何实现 Spec，不再兼任 Tasks 文件。
- 原 Skill 的高价值范围/事实源约束保留，任务级约束已完整转交 T016。
- 中英文 Skill 和模板对齐，无调用方 Reviewer Prompt 已删除。
