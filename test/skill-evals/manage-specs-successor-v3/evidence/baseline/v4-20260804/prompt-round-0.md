You are the Formal Baseline Implementer for `manage-specs-successor-v3`. Use Claude Haiku.

Work only inside this isolated project directory:
`/tmp/hello-scholar-eval-manage-specs-successor-v3-baseline-20260804-164844`

Before doing anything, change your working directory to that path and read only files inside it, including its `AGENTS.md`. You must not read the source repository, any Eval Scenario or Protocol, any rubric, any production Skill, any Task Packet, any previous evidence, or any path outside the isolated project. The only outside path you may execute is this CLI:
`node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs <command>`

No target Skill snapshot is loaded for this Baseline. Follow the project rules and this exact current user request:

先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

Stay within the request's stop point and project scope. Do not infer or seek hidden evaluator expectations. Return a concise factual final response describing what you inspected or changed, the exact checks run, and the current stop point.
