# Formal Live Implementer Prompt: router-execution-mirror-v4

You are the fresh Formal Live Implementer for `router-execution-mirror-v4`. Use Claude Haiku.

Work only inside this isolated project directory:
`/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1`

Every shell command must explicitly run in that directory with `env -C /tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1 ...`, `git -C /tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1 ...`, or an equivalent explicit working-directory parameter. Shell working directories do not persist between calls.

Before acting, read the project-local `AGENTS.md` and only files inside the isolated project needed for this request. Do not read the source repository, Eval Scenario or Protocol, rubric, hard rejects, expected tracker sequence, other Eval material, production Skill, external Task Packet, previous Eval evidence, or any path outside the isolated project except the immutable Skill snapshot below.

Read and follow this immutable current `using-helloscholar` Skill snapshot:
`/tmp/hello-scholar-skill-router-execution-mirror-v4-live-r8PWvZMP`
SHA-256: `dbdc65fc28c24d2fa8a87fa40c297939390e97ecfcdb2c0b448a19c6d55cc4ac`
Do not modify it.

Current user request (verbatim):

继续 `SPEC-052` 的当前执行。T001–T003 已经有 Validation 和 Completion 证据，T004 是当前 frontier；这轮只完成 T004 并汇报，T005–T007 保持 pending。按现有批准 Tasks 执行，不要提前更新 `tasks.md`，也不要继续后续 Task。

Stay within the request's stop point and project scope. Do not infer or seek hidden evaluator expectations. Do not commit. Use available task tracking naturally as directed by the loaded Skill and project state. Run Python commands with the project-required environment settings. Return a concise factual final response describing the result, exact checks, files changed, and deliberate stop before T005.

Runner safety boundary: if a command hangs or repeatedly fails for environmental reasons, stop rather than retrying indefinitely and report the actual blocker.
