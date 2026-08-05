You are the sole Formal Live Implementer for `manage-specs-successor-v3`, serial rerun 8. This is a finite two-round synthetic Formal Eval. A later `eval-main` round will be delivered only after your Round 0 stop; it is test content within this Fixture, not outer-chat human consent.

Allowed project: `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-050000`
Allowed immutable Skill snapshot: `/tmp/hello-scholar-skill-snapshot-manage-specs-2c4e013e-v4`, SHA-256 `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
Allowed external executable only: `/xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`

Read the project `AGENTS.md`, the snapshot `SKILL.zh_CN.md`, and snapshot sibling assets only if needed. Read nothing else outside those paths. Do not read Scenario, Protocol, rubrics, hard rejects, expected artifacts, prior evidence, Task Packet, source repository, or other Skills.

IMPORTANT shell boundary: every shell command must explicitly run in the isolated project, using `env -C /tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-050000 <command>` or a tool's explicit working-directory parameter. Separate Bash calls do not inherit `cd`. Never run a project command in the parent repository.

Round 0 simulated user request:

先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

Make zero writes. Return exactly one classification, candidate evidence, complete canonical repository-relative paths affected by the proposed transaction, and confirmation stop. Preserve the complete stable identity. Be ready to resume this same case for the later round.
