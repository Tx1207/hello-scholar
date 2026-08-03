# T028：删除 `dispatching-parallel-agents`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T016, T025
- Parallel: Yes。先由 `generating-tasks` 接住 Depends On/Parallel/Files 合同，并删除旧 subagent 执行消费者；共享平台说明由后续 catalog/Router Task 收口。

## 用户已确认的决定

完整删除 `dispatching-parallel-agents`。并行委派继续是 Codex/Claude 等平台的原生能力，由主 Agent根据任务依赖、共享状态和文件冲突判断，不再由产品 Skill 自动触发。

## 原 Skill 与新做法比较

原 Skill 的核心判断是“多个问题是否真正独立、能否并行、是否共享状态”，并给每个 Agent 一个聚焦、自包含的 Prompt。下一代 `tasks.md` 已显式提供 `Depends On`、`Parallel` 和 Files，主 Agent也必须核对写入冲突。因此保留同名 Skill只会重复平台调度规则。

删除不代表禁止 subagent：Skill Eval 仍按 T001 创建隔离 Implementer/Reviewer；主 Agent遇到三个真正独立的只读调查也可直接并行派发。框架只是不把并行本身包装成必经产品流程。

## 文件边界

### Delete

- `skills/superpowers-skills/dispatching-parallel-agents/SKILL.md`
- `skills/superpowers-skills/dispatching-parallel-agents/SKILL.zh_CN.md`

### Add

- `test/test_no_dispatching_parallel_agents_skill.py`

### Must Not Modify

- `test/skill-evals/WORKFLOW.md`
- `skills/superpowers-skills/using-helloscholar/references/`（T065 统一清理示例）
- AGENTS、README、`src/`、其他 Skill

## 实施与验证

1. 删除两个文件和空目录，不创建 `parallel-tasks` 别名。
2. 测试断言 Skill discovery 不再返回该 name，同时确认 T001 Workflow 与 Protocol 的 Agent 角色合同仍存在。
3. 运行 `python3 -m unittest test/test_no_dispatching_parallel_agents_skill.py`、Skill discovery 测试和 `npm test`。

## 完成标准

- Skill 不再安装或自动触发。
- `tasks.md` 的 Parallel 字段和平台原生并行能力未被误删。
- 没有新增调度器、Runner 或 API。
