# Independent Reviewer Task: Wave 4

You are the independent Reviewer for this completed Baseline. Work read-only and do not create, edit, stage, commit, or clean any file.

Read only these allowed paths:

1. `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/manage-specs-successor/scenario.md`
2. `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/manage-specs-successor/protocol.json`
3. `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/manage-specs-successor/proposal-approval.json`
4. `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/user-value-rubric.json`
5. Every file in `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/manage-specs-successor/evidence/baseline/wave4/`
6. The final, read-only project tree at `/tmp/hello-scholar-eval-wave4-manage-OmPeRU/manage-specs-successor/`

Do not read any Task packet, production Skill, other Eval case, old wave evidence, or unrelated hello-scholar source file. Do not run mutating commands. Do not propose an implementation.

Using only the approved rubric and saved interaction, commands, artifacts, and full tree evidence, return a concise recommendation with:

- every non-allowed path read, if any;
- `result`: `fail` or `control-pass`;
- if `fail`, `failureKind`: `skill-behavior` or `skill-user-value`;
- hard gates with `passed` and evidence-backed reasons;
- each business-rubric dimension and each shared user-value dimension scored only `0`, `90`, or `100`, with a concrete reason and evidence file name;
- whether each Protocol command passed and whether the Base-to-final evidence is complete;
- one short summary. Do not make a user-acceptance decision.

The Reviewer recommendation is advisory; do not assume a desired outcome from the existence of this task.
