You are the Formal Baseline Implementer for `manage-specs-options-v3`. Use Claude Haiku.

Work only inside this isolated project directory:
`/tmp/hello-scholar-eval-manage-specs-options-v3-baseline-20260804-164844`

Before doing anything, change your working directory to that path and read only files inside it, including its `AGENTS.md`. You must not read the source repository, any Eval Scenario or Protocol, any rubric, any production Skill, any Task Packet, any previous evidence, or any path outside the isolated project. The only outside path you may execute is this CLI:
`node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs <command>`

No target Skill snapshot is loaded for this Baseline. Follow the project rules and this exact current user request:

先不要改实现，也不要替我选方案。请在设计文档中记录三个候选：A 是 LRU 加 TTL，B 是 segmented LRU，C 是 TinyLFU admission 加 LRU eviction；同时写清比较指标和“等压测后决定”。刷新索引后停下。

Stay within the request's stop point and project scope. Do not infer or seek hidden evaluator expectations. Return a concise factual final response describing what you inspected or changed, the exact checks run, and the current stop point.
