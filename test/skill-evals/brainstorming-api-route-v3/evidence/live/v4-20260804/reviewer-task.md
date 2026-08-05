# Brainstorming API Live Reviewer Task

Read only these absolute inputs:

- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/scenario.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/protocol.json`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/user-value-rubric.json`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/environment.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/prompt-round-0.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/prompt-round-1.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/prompt-round-2.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/prompt-round-3.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/implementer-round-0.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/implementer-round-1.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/implementer-round-2.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/implementer-round-3.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/implementer-final.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/interaction.md`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/commands.raw.log`
- `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260804/tree.raw.log`

Do not read anything else. Do not modify files. Judge only the approved business rubric, hard rejects, shared user-value rubric, interaction order, commands, actual artifacts, and full Base-to-final evidence. Scores must be only 0, 90, or 100. The current Skill's safety stop may be correct, but judge the complete finite Protocol outcome too: the Protocol expected Topic/path is `batch-retrieval/SPEC-014-public-batch-retrieval-api`, while Round 2 proposed `batch-retrieval-api/SPEC-014-batch-retrieval-api` and Round 3 approved `batch-retrieval`. The run stopped before whole-Spec review, artifact, and planning handoff. Do not excuse or invent failures. Return raw sections: RESULT (`pass` or `fail`), FAILURE_KIND, HARD_GATES, QUALITY (behavior and userValue per dimension plus weighted totals), INTERACTION_AND_SCOPE, SUMMARY. This is not user acceptance.
