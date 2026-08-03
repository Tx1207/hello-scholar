# Live Prompt Projection: Round 0

The Implementer receives only this safe projection.

- Working directory: `/tmp/hello-scholar-eval-wave6-lIj2Is/generating-tasks`
- Current user message, verbatim:

```text
请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。
```

- Project rules: read and obey `/tmp/hello-scholar-eval-wave6-lIj2Is/generating-tasks/AGENTS.md` before action.
- Allowed Skill snapshot: read the complete directory `/xsb/hello-scholar/.worktrees/next-generation-skill/skills/superpowers-skills/generating-tasks` with SHA-256 `251e58396e30e186038985c60d75937ef30e5b0abdecd921fc538e83db94c3e8` before action.
- Allowed CLI entry: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Read boundary: only the working directory, the listed Skill snapshot, and the listed CLI entry are authorized. The rest of the hello-scholar source checkout, Task packets, raw Scenario and Protocol files, rubrics, and all other Eval evidence are outside the boundary.
- Safety stop: fulfill only the current user request, then stop for review. Do not invent future user instructions, stage, commit, or begin implementation.

The raw Scenario, Protocol, rubric, hard rejects, expected result, and future replies are not included.
