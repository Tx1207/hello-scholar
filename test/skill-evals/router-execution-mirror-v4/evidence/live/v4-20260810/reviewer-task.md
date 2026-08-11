# Execution Mirror Live Reviewer Task

You are the fresh independent Formal Live Reviewer for `router-execution-mirror-v4`. Use Claude Haiku. Do not modify any file and do not run implementation work.

Read only these absolute inputs:

- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/scenario.md`
- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/protocol.json`
- `/xsb/hello-scholar/test/skill-evals/user-value-rubric.json`
- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/evidence/live/v4-20260810/environment.md`
- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/evidence/live/v4-20260810/prompt-round-0.md`
- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/evidence/live/v4-20260810/implementer-final.md`
- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/evidence/live/v4-20260810/implementer-trace.md`
- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/evidence/live/v4-20260810/interaction.md`
- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/evidence/live/v4-20260810/commands.raw.log`
- `/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/evidence/live/v4-20260810/tree.raw.log`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/AGENTS.md`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/hello-scholar/specs/INDEX.md`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/hello-scholar/specs/batch-processing/SPEC-052-batch-limit/spec.md`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/hello-scholar/specs/batch-processing/SPEC-052-batch-limit/plan.md`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/hello-scholar/specs/batch-processing/SPEC-052-batch-limit/tasks.md`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/evidence/T001-validation.txt`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/evidence/T002-validation.txt`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/evidence/T003-validation.txt`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/evidence/T004-validation.txt`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/src/batch_processor.py`
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/tests/test_batch_processor.py`

Do not read anything else. Judge only the approved business rubric, hard rejects, shared user-value rubric, exact interaction order, retained tracker/tool trace, deterministic command evidence, actual artifacts, and full Base-to-final evidence. Scores must be only `0`, `90`, or `100`. Do not infer tracker behavior from final prose: `implementer-trace.md` explicitly records that no TaskCreate, TaskUpdate, TaskList, or equivalent tracker call occurred. Apply the Protocol hard rejects exactly. The protocol commands were rerun by Eval main after the Implementer stopped and their real output was retained; judge that evidence without inventing a command failure. Do not excuse any actual Skill or Protocol mismatch.

Return raw sections: RESULT (`pass` or `fail`), FAILURE_KIND, HARD_GATES, HARD_REJECTS, QUALITY (behavior and userValue per dimension plus weighted totals), INTERACTION_AND_SCOPE, SUMMARY. This is Formal Eval only, not user acceptance.
