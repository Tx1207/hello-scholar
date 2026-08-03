# T029：删除 `systematic-debugging`

- Status: `completed`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: None
- Parallel: Yes。目录自包含；共享 Router/catalog 引用由 T065 统一清理。

## 用户已确认的决定

完整删除 `systematic-debugging` 及其示例、脚本和历史材料。根因定位仍是强制工程要求，但由 AGENTS 的 Debugging 章节直接约束主 Agent，不再自动加载一个近 300 行的重复 Skill。

## 原 Skill 与新做法比较

原 Skill 的四阶段是：读完整错误并复现、找工作模式和差异、提出单一假设做最小实验、修根因并验证；三次失败后质疑架构。它还附带 root-cause tracing、defense in depth、condition-based waiting 和 polluter 脚本。

AGENTS 已明确要求读完整错误/栈、先复现、一次改一个变量、不能用 null/retry/swallow 掩盖根因，并把难测试视为设计信号。下一代选择一个短而全局生效的事实源。Task 如需某个具体调试技术，应把步骤和命令直接写入自身 Work/Validation，而不是依赖自动触发的通用 Skill。

## 文件边界

### Delete

- `skills/superpowers-skills/systematic-debugging/SKILL.md`
- `skills/superpowers-skills/systematic-debugging/SKILL.zh_CN.md`
- `skills/superpowers-skills/systematic-debugging/CREATION-LOG.md`
- `skills/superpowers-skills/systematic-debugging/root-cause-tracing.md`
- `skills/superpowers-skills/systematic-debugging/defense-in-depth.md`
- `skills/superpowers-skills/systematic-debugging/condition-based-waiting.md`
- `skills/superpowers-skills/systematic-debugging/condition-based-waiting-example.ts`
- `skills/superpowers-skills/systematic-debugging/find-polluter.sh`
- `skills/superpowers-skills/systematic-debugging/test-academic.md`
- `skills/superpowers-skills/systematic-debugging/test-pressure-1.md`
- `skills/superpowers-skills/systematic-debugging/test-pressure-2.md`
- `skills/superpowers-skills/systematic-debugging/test-pressure-3.md`

### Add

- `test/test_no_systematic_debugging_skill.py`

### Must Not Modify

- AGENTS 的现有 Debugging 规则
- `test-driven-development`（保留并由 T036-T038调整触发）
- Router/catalog shared files（T065 处理）
- `src/`、其他 Skill

## 实施与验证

1. 删除整个目录，不搬运 supporting files 到新 Skill，也不把示例脚本留在仓库根目录。
2. 新测试断言目录/所有 12 个文件和 Skill discovery name 不存在，并对 AGENTS 做最小正向断言：仍要求读错误、复现、找根因和验证。
3. 测试不冻结 AGENTS 的整段措辞，也不要求普通 Bug 自动调用 TDD。
4. 运行 `python3 -m unittest test/test_no_systematic_debugging_skill.py` 和 `npm test`。

## 完成标准

- Skill、supporting docs、脚本和安装入口全部删除。
- 根因优先仍由 AGENTS 可观察地约束。
- 没有创建替代 Debugging Skill 或把脚本移动到无 owner 位置。
