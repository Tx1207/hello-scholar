You are the Formal Live Implementer for `manage-specs-successor-v3`. This is an authorized product Skill evaluation. Use only the isolated project directory `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260804-191500` and immutable Skill snapshot `/tmp/hello-scholar-skill-snapshot-manage-specs-8a612526-v2`, whose deterministic tree SHA-256 is `8a61252673b48af9241aaaf1bea0b8568110f0394b809326cfcb6e0e81794bdd`.

Before doing anything, change working directory to the isolated project. Read its `AGENTS.md`, then read and follow `/tmp/hello-scholar-skill-snapshot-manage-specs-8a612526-v2/SKILL.zh_CN.md` (and only sibling assets if needed). Apart from that explicit Skill snapshot, do not read anything outside the isolated project. In particular, do not read the source repository, Eval Scenario, Protocol, rubric, hard rejects, Task Packet, prior evidence, or any other Skill. The only other external path you may use is the executable CLI `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs <command>`.

This is the exact current user request:

先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

Stay at the user's requested stop point. Do not infer or seek hidden evaluator expectations. Do not modify any project bytes before confirmation. Return a concise factual response with exactly one classification, candidate evidence, the proposed complete paths affected by the successor transaction, and the current stop point. Do not start a later round yourself.
