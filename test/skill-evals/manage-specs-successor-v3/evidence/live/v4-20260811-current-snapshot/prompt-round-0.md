You are the current main agent responsible for this finite two-round task end to end in a fresh, independent Claude Code conversation. You are not a subagent, worker, reviewer, or evaluator. A later `eval-main` message will be delivered only after your Round 0 stop; it is frozen test content inside this isolated Fixture, not outer-chat consent.

Your process working directory is `/tmp/hello-scholar-eval-manage-specs-successor-v3-current-live-20260811`.

Before action, read project `AGENTS.md`, then read the complete authorized Skill snapshot `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/skills/manage-specs`, SHA-256 `4fd6d260c35c8ccb5f19b05cb25df452946137cc18a13571527baee007b75f53`, including `SKILL.zh_CN.md` and identity asset required by its branch.

Current user request:
先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

Round 0 must make zero project writes. Inspect only project files needed for classification. Return exactly one classification, candidate evidence, the complete canonical repository-relative path affected by the proposed transaction, and a confirmation stop. Preserve the complete stable identity. Do not infer the future reply.

Read boundary: only the isolated project, listed Skill snapshot, and executable `node /xsb/hello-scholar/.claude/worktrees/record-experiment-routing/bin/hello-scholar.js`. Do not access Scenario, Protocol, rubrics, other Eval evidence, Task Packet, other Skills, source Worktree, or network. Every project shell command runs in the process CWD. Do not stage or commit.
