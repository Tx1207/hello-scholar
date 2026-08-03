# Baseline Prompt Projection: Round 0

The Implementer was given only this safe projection.

- Working directory: `/tmp/hello-scholar-eval-wave2-manage-7ALOPx/manage-specs-successor`
- Current user message, verbatim:

```text
先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。
```

- Project rules: read and obey `/tmp/hello-scholar-eval-wave2-manage-7ALOPx/manage-specs-successor/AGENTS.md`.
- No Skill snapshot was authorized for this Baseline: `manage-specs` was intentionally absent.
- Allowed CLI entry: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Read boundary: only the working directory and the CLI entry are authorized. The hello-scholar source checkout other than that entry, Task packets, production Skills, raw Scenario/Protocol files, and all other Eval evidence are forbidden.
- Safety stop: do not invent later user approvals or messages. Complete only the current request, stop after an evidence-backed classification, and wait for a further user message before writing project files.

The raw Scenario, Protocol, rubric, hard rejects, expected artifacts, and future reply were not included.
