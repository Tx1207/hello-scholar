# T025：删除 `subagent-driven-development`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T019
- Parallel: No。Writing Plans 必须先移除对它的执行 Handoff。

## 用户已确认的决定

完整删除 `subagent-driven-development` 及其三个角色模板。产品主流程不再要求“每 Task 一个 Implementer + Spec Reviewer + Code Quality Reviewer”。主 Agent可以按平台能力临时使用 subagent，但这不是 Skill 合同或完成门。

## 原 Skill 的价值与删除原因

原 Skill 对旧模型很有价值：Controller 预读 Plan、每 Task 创建新 Implementer、先 Spec Review 再 Code Quality Review、由同一 Agent 修复并复审、最后整体 Review。代价是每 Task 至少三次 Agent 调用、复杂 Agent ID/状态机和强制 TDD/分支依赖。

当前方案选择更直接的责任链：

| 原行为 | 删除后做法 |
|---|---|
| Controller 从 Plan 提取 Tasks | `generating-tasks` 预先生成可独立读取的 `tasks.md` |
| 每 Task 新 Implementer | 当前主 Agent直接执行；真正独立时可按需委派，不强制 |
| 固定双 Review | 主 Agent核对 Spec Coverage、真实 diff、Validation；用户可直接要求 review |
| Final Reviewer | `converge-to-spec` 做 Bundle 语义审计；Skill Eval 仍有独立 Reviewer |
| 角色状态和模型选择 | 平台原生 Agent 管理，不写进产品合同 |

这里必须区分两类 subagent：T001 的 Eval Implementer/Reviewer 继续保留，用来测试 Skill；被删除的是“产品执行必须再嵌套多层 subagent”的规则。

## 文件边界

### Delete

- `skills/superpowers-skills/subagent-driven-development/SKILL.md`
- `skills/superpowers-skills/subagent-driven-development/SKILL.zh_CN.md`
- `skills/superpowers-skills/subagent-driven-development/implementer-prompt.md`
- `skills/superpowers-skills/subagent-driven-development/spec-reviewer-prompt.md`
- `skills/superpowers-skills/subagent-driven-development/code-quality-reviewer-prompt.md`

目录为空后删除目录本身。

### Add

- `test/test_no_subagent_driven_development_skill.py`

### Must Not Modify

- `test/skill-evals/WORKFLOW.md` 或任何 Scenario 的 Eval Agent 合同
- `skills/superpowers-skills/using-git-worktrees/`
- 其他待删除 Skill、AGENTS、README、`src/`
- 共享 Router/catalog 引用（T065 统一更新）

## 实施细节

1. 删除整个目录，不把三个 Prompt 复制到 `generating-tasks`、Converge 或 AGENTS。
2. 不把“主 Agent按需派发 subagent”写成新 Skill；这是平台能力，由当前任务的依赖、文件冲突和风险决定。
3. 不修改 T001/T002 的 Eval `agents` 数量和隔离合同。Eval 外层仍必须有全新 Implementer 和独立 Reviewer。
4. 测试用 Skill discovery 断言目录/五个文件和安装条目不存在，并确认 `test/skill-evals/WORKFLOW.md` 仍明确要求 Eval Agent 隔离。

## 验证

- `python3 -m unittest test/test_no_subagent_driven_development_skill.py`
- 运行 Skill discovery/install 聚焦测试。
- `npm test`

## 完成标准

- 产品目录、角色模板和安装入口全部消失。
- Skill Eval 的 subagent 工作流没有被误删。
- 没有创建替代 Controller Skill 或强制 Review 链。
