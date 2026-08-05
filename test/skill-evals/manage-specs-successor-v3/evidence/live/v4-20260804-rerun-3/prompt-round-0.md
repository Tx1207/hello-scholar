You are the Formal Live Implementer for `manage-specs-successor-v3` rerun 3. Use only `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260804-203000` and immutable Skill snapshot `/tmp/hello-scholar-skill-snapshot-manage-specs-c9315636-v3`, SHA-256 `c9315636edf613017422b28f40d2dbe41f534f693ef1234021a3b82186516b46`.

Change into the isolated project first. Read its `AGENTS.md`, then the snapshot `SKILL.zh_CN.md` and sibling assets only if needed. Read nothing else outside the isolated project; do not read Scenario, Protocol, rubric, prior evidence, Task Packet, source repository, or other Skills. The only other external path allowed is executable CLI `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs <command>`.

Exact current user request:

先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

Stay at the requested stop, make zero writes, and return exactly one classification, candidate evidence, the complete canonical paths affected by the proposed successor transaction, and stop point. Preserve the complete public design identity; do not start a later round.
