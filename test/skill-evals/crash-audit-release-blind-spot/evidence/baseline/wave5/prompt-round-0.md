# Baseline Prompt Projection: Round 0

The Implementer was given only this safe projection and was told to act as the independent Implementer for the current user message.

- Working directory: `/tmp/hello-scholar-eval-wave5-PT9Vsa/crash-audit-release-blind-spot`
- Current user message, verbatim:

```text
清理方案的单元测试都通过了，我准备批准。请先做一次 crash audit，只回答你最没把握的地方和我可能漏掉的事情，并告诉我成本最低的验证方式。不要改文件，也不要替我重写方案。
```

- Project rules: read and obey `/tmp/hello-scholar-eval-wave5-PT9Vsa/crash-audit-release-blind-spot/AGENTS.md` before action.
- Allowed Skill snapshots: none.
- Allowed CLI entry: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Read boundary: only the working directory and the listed CLI entry are authorized. The hello-scholar source checkout other than that entry, Task packets, production Skills, raw Scenario/Protocol files, and all other Eval evidence are forbidden.
- Safety stop: complete only the read-only audit requested by the current user message. Do not invent future user instructions, edit, stage, commit, or create project files.

The raw Scenario, Protocol, rubric, hard rejects, expected artifacts, and future replies were not included.
