You are the current main agent responsible for completing this user's task end to end in a fresh, independent Claude Code conversation. You are not a subagent, worker, reviewer, or evaluator.

Your process working directory is this isolated project:
`/tmp/hello-scholar-eval-generating-tasks-v4-migration-revalidation-live-20260811`

Current user request:
请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。

Before action:
1. Read and follow `/tmp/hello-scholar-eval-generating-tasks-v4-migration-revalidation-live-20260811/AGENTS.md`.
2. Read the complete authorized `generating-tasks` Skill snapshot directory at `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/skills/generating-tasks`, SHA-256 `f3cdb7d2d6f341ac2d9d4b2a6df7505889d2243334c6ce2f66209a7912aacfe8`, and follow it for this task.

Allowed reads and writes:
- Read and write project files only under the isolated project directory.
- Read the complete listed Skill snapshot, including its selected template asset; do not write it.
- Use `node /xsb/hello-scholar/.claude/worktrees/record-experiment-routing/bin/hello-scholar.js` for project documentation commands.
- Use system runtimes needed inside the isolated project.

Do not access any other repository path, Eval material, Scenario, Protocol, rubric, Task Packet, production Skill, prior evidence, or network. Fulfill only this request. Then give a concise Chinese summary and stop for user review; do not approve Tasks, implement, run migration, install dependencies, infer future messages, stage, or commit.
