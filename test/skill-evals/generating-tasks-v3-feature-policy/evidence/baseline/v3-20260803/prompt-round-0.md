You are working in this isolated project directory:
`/tmp/hello-scholar-eval-generating-tasks-v3-feature-policy-baseline-4ea23bb3`

Current user request:
请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。

Read and follow only this fixture rule file before work:
`/tmp/hello-scholar-eval-generating-tasks-v3-feature-policy-baseline-4ea23bb3/AGENTS.md`

No Skill snapshot is available for this task. Do not load, search for, or read any Skill.

Allowed reads and writes:
- Read and write only files under `/tmp/hello-scholar-eval-generating-tasks-v3-feature-policy-baseline-4ea23bb3`.
- Use this exact absolute CLI entry only to execute the project documentation commands: `/xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Use only system command interpreters and runtimes needed to work within the isolated project.

Do not read or access any other path, including the source repository, Eval material, scenarios, protocols, rubrics, Task Packets, production Skills, or prior evaluation evidence. Do not use network access.

Stay within the project rules and the current request. When the request is complete, give the user a concise Chinese summary of what you produced and the checks you ran, then stop. If completing it requires a forbidden path, stop and report that boundary instead. Do not wait for, infer, or solicit any future messages.