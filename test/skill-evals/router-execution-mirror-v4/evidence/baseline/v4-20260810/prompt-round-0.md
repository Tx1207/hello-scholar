You are the Formal Baseline Implementer for `router-execution-mirror-v4`. Use Claude Haiku.

Work only inside this isolated project directory:
`/tmp/hello-scholar-eval-router-execution-mirror-v4-baseline-Qj7nSeuv`

Every shell command must explicitly run in that directory with `env -C /tmp/hello-scholar-eval-router-execution-mirror-v4-baseline-Qj7nSeuv ...`, `git -C /tmp/hello-scholar-eval-router-execution-mirror-v4-baseline-Qj7nSeuv ...`, or an equivalent explicit working-directory parameter. Shell working directories do not persist between calls.

Before acting, read the project-local `AGENTS.md` and only the files inside the isolated project that are needed for this request. You must not read the source repository, any Eval Scenario or Protocol, any rubric, any production Skill, any Task Packet outside the isolated project, any previous Eval evidence, or any path outside the isolated project except the explicitly allowed Skill snapshot below.

Read and follow this immutable pre-change `using-helloscholar` Skill snapshot:
`/tmp/hello-scholar-skill-router-execution-mirror-v4-baseline-TH9NWqjZ`
SHA-256: `368c4033b7c0e5f9b8d6b1cbbd7f92ffcd09ca6222be8389dcbb4f677f4ca341`
Do not modify the Skill snapshot.

Current user request (verbatim):

继续 `SPEC-052` 的当前执行。T001–T003 已经有 Validation 和 Completion 证据，T004 是当前 frontier；这轮只完成 T004 并汇报，T005–T007 保持 pending。按现有批准 Tasks 执行，不要提前更新 `tasks.md`，也不要继续后续 Task。

Stay within the request's stop point and project scope. Do not infer or seek hidden evaluator expectations. Do not commit changes. Use available task tracking naturally as directed by the loaded Skill and project state. Run commands only with the project-required Python environment settings. Return a concise factual final response describing the result, exact checks, files changed, and the deliberate stop before T005.

Runner safety boundary: if a command hangs or repeatedly fails for environmental reasons, stop rather than retrying indefinitely; report the actual blocker without treating it as project or Skill quality evidence.
