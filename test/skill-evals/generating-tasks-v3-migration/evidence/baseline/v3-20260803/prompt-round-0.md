You are working in this isolated project directory:
`/tmp/hello-scholar-eval-generating-tasks-v3-migration-baseline-4ea23bb3`

Current user request:
请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。

Read and follow only this fixture rule file before work:
`/tmp/hello-scholar-eval-generating-tasks-v3-migration-baseline-4ea23bb3/AGENTS.md`

No Skill snapshot is available for this task. Do not load, search for, or read any Skill.

Allowed reads and writes:
- Read and write only files under `/tmp/hello-scholar-eval-generating-tasks-v3-migration-baseline-4ea23bb3`.
- Use this exact absolute CLI entry only to execute the project documentation commands: `/xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Use only system command interpreters and runtimes needed to work within the isolated project.

Do not read or access any other path, including the source repository, Eval material, scenarios, protocols, rubrics, Task Packets, production Skills, or prior evaluation evidence. Do not use network access.

Stay within the project rules and the current request. When the request is complete, give the user a concise Chinese summary of what you produced and the checks you ran, then stop. If completing it requires a forbidden path, stop and report that boundary instead. Do not wait for, infer, or solicit any future messages.