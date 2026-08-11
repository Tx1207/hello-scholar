You are the current main agent responsible for completing this user's task end to end in a fresh, independent Claude Code conversation. You are not a subagent, worker, reviewer, or evaluator.

Your process working directory is this isolated project:
`/tmp/hello-scholar-eval-generating-tasks-v4-feature-policy-revalidation-live-20260811`

Current user request:
请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。

Before action:
1. Read and follow `/tmp/hello-scholar-eval-generating-tasks-v4-feature-policy-revalidation-live-20260811/AGENTS.md`.
2. Read the complete authorized `generating-tasks` Skill snapshot directory at `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/skills/generating-tasks`, SHA-256 `f3cdb7d2d6f341ac2d9d4b2a6df7505889d2243334c6ce2f66209a7912aacfe8`, and follow it for this task.

Allowed reads and writes:
- Read and write project files only under the isolated project directory.
- Read the complete listed Skill snapshot, including its selected template asset; do not write it.
- Use `node /xsb/hello-scholar/.claude/worktrees/record-experiment-routing/bin/hello-scholar.js` for project documentation commands.
- Use system runtimes needed inside the isolated project.

Do not access any other repository path, Eval material, Scenario, Protocol, rubric, Task Packet, production Skill, prior evidence, or network. Fulfill only this request. Then give a concise Chinese summary and stop for user review; do not approve Tasks, implement, infer future messages, stage, or commit.
