# Baseline Prompt Projection: Round 0

The Implementer was given only this safe projection and was told to act as the independent Implementer for the current user message.

- Working directory: `/tmp/hello-scholar-eval-wave3-manage-ceWlVR/manage-specs-successor`
- Current user message, verbatim:

```text
先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。
```

- Project rules: read and obey `/tmp/hello-scholar-eval-wave3-manage-ceWlVR/manage-specs-successor/AGENTS.md` before action.
- Allowed Skill snapshots: none.
- Allowed CLI entry: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Read boundary: only the working directory and the listed CLI entry are authorized. The hello-scholar source checkout other than that entry, Task packets, production Skills, raw Scenario/Protocol files, and all other Eval evidence are forbidden.
- Safety stop: do not invent a later user approval. After reporting one evidence-backed classification, stop without project writes and wait for a further user message.

The raw Scenario, Protocol, rubric, hard rejects, expected artifacts, and future replies were not included.
