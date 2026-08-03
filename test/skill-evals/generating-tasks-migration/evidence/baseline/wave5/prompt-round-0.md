# Baseline Prompt Projection: Round 0

The Implementer was given only this safe projection and was told to act on the current user request.

- Working directory: `/tmp/hello-scholar-eval-wave5-PT9Vsa/generating-tasks-migration`
- Current user message, verbatim:

```text
请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。
```

- Project rules: read and obey `/tmp/hello-scholar-eval-wave5-PT9Vsa/generating-tasks-migration/AGENTS.md` before action.
- Allowed Skill snapshots: none.
- Allowed CLI entry: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Read boundary: only the working directory and the listed CLI entry are authorized. The hello-scholar source checkout other than that entry, Task packets, production Skills, raw Scenario/Protocol files, and all other Eval evidence are forbidden.
- Safety stop: fulfill only the current user request, then stop for review. Do not invent future user instructions, stage, commit, or start the migration.

The raw Scenario, Protocol, rubric, hard rejects, expected result, and future replies were not included.
