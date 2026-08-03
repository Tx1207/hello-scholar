# T024：删除 `executing-plans`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T019, T025
- Parallel: No。必须先让 Writing Plans 移除执行器菜单，并先删除引用它的 `subagent-driven-development`。

## 用户已确认的决定

完整删除 `executing-plans`，不升级为 Bundle 执行器，也不保留同名空壳、别名或重定向。Approved/Current `tasks.md` 由当前主 Agent直接按依赖实施。

## 原 Skill 与新做法比较

原 Skill 的有效内容很简单：先读 Plan 并质疑缺口，逐 Task 执行和验证，遇到阻塞停止，最后再进入分支收尾。这些纪律没有消失，但已经分别由更准确的事实源拥有：

| 原 `executing-plans` 行为 | 删除后 owner |
|---|---|
| 读取、审查 Plan | 主 Agent按 `Architecture -> Spec -> Plan -> Tasks` 读取；Stale 由 docs check 阻止 |
| 用 Todo 列表逐项执行 | `tasks.md` 是持久任务事实源，主 Agent按 Depends On 执行 |
| 每步验证后完成 | Task 的 Validation/Completion + AGENTS Verification |
| 阻塞时停止而不猜 | AGENTS Think/Goal-Driven Execution |
| 完成后调用专门分支 Skill | 用户明确要求 merge/PR/cleanup 时，主 Agent直接使用 Git/平台工具 |

原 Skill 只有中英文各 70 行，还假设 Task 内嵌在旧 Plan、平台有 `TodoWrite`，并强制依赖即将删除的 `finishing-a-development-branch`。继续保留只会产生第二个执行入口。

## 文件边界

### Delete

- `skills/superpowers-skills/executing-plans/SKILL.md`
- `skills/superpowers-skills/executing-plans/SKILL.zh_CN.md`

目录为空后删除目录本身。

### Add

- `test/test_no_executing_plans_skill.py`

### Must Not Modify

- `skills/superpowers-skills/writing-plans/`（T019 已处理调用方）
- `skills/superpowers-skills/using-git-worktrees/`
- 其他待删除 Skill
- AGENTS、README、`src/`
- `docs/need_skills/` 和共享 Router references（T065 统一更新）

## 实施细节

1. 删除两个 Skill 文件和空目录，不移动其中 Prompt 到新 Skill。
2. 不创建 `executing-tasks`、`direct-execution` 等替代包装；主 Agent执行规则只存在于 AGENTS、Plan/Tasks 合同和 `converge-to-spec`。
3. 不删除或修改 `using-git-worktrees`。隔离工作区仍可按需使用，但不再由执行 Skill 强制调用。
4. 新测试调用仓库现有 Skill discovery，断言没有名为 `executing-plans` 的可安装 Skill，并断言目录不存在。测试不要求全仓历史文档完全没有这个词；最终活跃引用由 T065 清理、T052 守卫。

## 验证

- `python3 -m unittest test/test_no_executing_plans_skill.py`
- 运行现有 Skill discovery/install 聚焦测试，确认其余 Skill 数量和安装行为正常。
- `npm test`

## 完成标准

- 目录和两个文件不存在，安装器不再发现该 Skill。
- 当前主 Agent仍可只凭 Approved Tasks 和 AGENTS 完成执行，不存在新的执行包装。
- 未修改 `using-git-worktrees` 或其他保留 Skill。
