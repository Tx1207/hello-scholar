# Baseline Prompt Projection: Round 0

The Implementer was given only this safe projection and was told to act as the independent Implementer for the current user message.

- Working directory: `/tmp/hello-scholar-eval-wave5-PT9Vsa/crash-audit-calibrated-none`
- Current user message, verbatim:

```text
我刚把 tokenizer 的错误消息改清楚了，相关测试和完整测试都过了，公开输出快照也核对过。请坠机一下，看看我是不是漏了重要问题。只做 crash audit，不要改文件。
```

- Project rules: read and obey `/tmp/hello-scholar-eval-wave5-PT9Vsa/crash-audit-calibrated-none/AGENTS.md` before action.
- Allowed Skill snapshots: none.
- Allowed CLI entry: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Read boundary: only the working directory and the listed CLI entry are authorized. The hello-scholar source checkout other than that entry, Task packets, production Skills, raw Scenario/Protocol files, and all other Eval evidence are forbidden.
- Safety stop: complete only the read-only audit requested by the current user message. Do not invent future user instructions, edit, stage, commit, or create project files.

The raw Scenario, Protocol, rubric, hard rejects, expected artifacts, and future replies were not included.
