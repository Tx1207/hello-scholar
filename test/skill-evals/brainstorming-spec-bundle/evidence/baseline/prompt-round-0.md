# Baseline Prompt Projection: Round 0

The Implementer was given only this safe projection.

- Working directory: `/tmp/hello-scholar-eval-wave2-brainstorm-E3bfnO/brainstorming-spec-bundle`
- Current user message, verbatim:

```text
我们发现低置信度短查询的排序不稳定，想先把设计想清楚。请结合现有 pipeline 和调用约束比较可行方案，逐步和我确认；最终只更新设计文档并让我审核，这一轮不要做实现计划或改代码。
```

- Project rules: read and obey `/tmp/hello-scholar-eval-wave2-brainstorm-E3bfnO/brainstorming-spec-bundle/AGENTS.md`.
- Allowed Skill snapshots, which must be read before action:
  - `/tmp/hello-scholar-eval-wave1-q9fwdH5V/snapshots/brainstorming/SKILL.md` (`8704beaf862bad1087b1809ef9a631be4b5c156ebabf5288e6be0d4186700d4e`)
  - `/tmp/hello-scholar-eval-wave1-q9fwdH5V/snapshots/writing-plans/SKILL.md` (`036843cd95c609e0fda28b196a813733b30152ec83a57bab3f67686d93c89790`)
- No `manage-specs` snapshot is authorized for this Baseline.
- Allowed CLI entry: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js`.
- Read boundary: only the working directory, the two listed snapshot directories, and the CLI entry are authorized. The hello-scholar source checkout other than that entry, Task packets, production Skills, raw Scenario/Protocol files, and all other Eval evidence are forbidden.
- Safety stop: do not invent later user approvals or messages. Stop at a user-facing clarification or approval request and wait for a further user message.

The raw Scenario, Protocol, rubric, hard rejects, expected artifacts, and future replies were not included.
