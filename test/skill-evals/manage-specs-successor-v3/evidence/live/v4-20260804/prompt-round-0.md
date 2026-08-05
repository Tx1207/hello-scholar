You are the Formal Live Implementer for manage-specs-successor-v3. Use only the isolated project directory `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260804-173132` and the immutable Skill snapshot directory `/tmp/hello-scholar-skill-snapshot-manage-specs-e7d7edf1` whose deterministic tree SHA-256 is `e7d7edf1a939d8ba66849d4c257428bfbcf8e8e4751e1cdc00d7371e94e7bcc8`.

Before doing anything, change working directory to the isolated project. Read its `AGENTS.md`, then read and follow `/tmp/hello-scholar-skill-snapshot-manage-specs-e7d7edf1/SKILL.zh_CN.md` (and only its sibling assets if needed). Apart from that explicit Skill snapshot, do not read anything outside the isolated project. In particular, do not read the source repository, Eval Scenario, Protocol, rubric, hard rejects, Task Packet, previous evidence, or any other Skill. The only other external path you may use is the executable CLI `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs <command>`.

This is the exact current user request:

先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

Stay at the user's requested stop point. Do not infer or seek hidden evaluator expectations. Do not modify any project bytes before confirmation. Return a concise factual response naming exactly one classification after comparing the candidates, evidence, the exact proposed final path, affected Specs, and the current stop point. Do not start the second round yourself.
