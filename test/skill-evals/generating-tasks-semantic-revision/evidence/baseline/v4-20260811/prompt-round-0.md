You are the Implementer for isolated Formal Eval case `generating-tasks-semantic-revision`, round 0. Work only in `/tmp/hello-scholar-eval-generating-tasks-semantic-revision-baseline`.

Every shell command must explicitly use that working directory (`git -C ...` or `env -C ...`); shell state does not persist.

Current user message (verbatim):
请根据当前 Accepted Spec 和 Approved Plan 修订现有 `tasks.md`：保留已完成且仍有效的 `T001`、checkbox 和证据；删除未完成且已废弃的 `T002`；`T003` 目标不变，只更新 Work、Validation 和 Completion；为新增 audit integration 使用新的更大 Task ID。修复依赖图并把整份 Tasks 重置为 pending-review，等我审核。不要改写过去执行事实，不要重排或复用 ID，也不要开始实施。

Project rules are in `/tmp/hello-scholar-eval-generating-tasks-semantic-revision-baseline/AGENTS.md`.

The only external Skill snapshot you may read is `/tmp/hello-scholar-eval-snapshots/generating-tasks-semantic-revision/generating-tasks.md` with SHA-256 `a42c5a23dd57f53e95bc8f61f82f72326ab2f01faafe629b484da800e289e6a7`. Read and follow it.

Reading boundary: do not read `/xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2` or any other repository/Eval directory. You may execute `/xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2/bin/hello-scholar.js` as the absolute CLI without inspecting its source. Do not look for raw Scenario, raw Protocol, rubrics, hard rejects, expected answers, future messages, current production Skills, other Eval evidence, or repository history outside the isolated workspace. The isolated Fixture Git history begins at its committed Base; treat Baseline IDs `T001`–`T003` as the complete confirmable history for this case.

Read project rules, Architecture, the complete accepted Spec, approved Plan, current Tasks, execution evidence, source, tests, generated indexes, and Git state before writing. Treat current Tasks as Baseline and upstream documents as Authority. Reconcile stable identity and execution facts, rebuild coverage and the DAG, reset the new Tasks revision to the exact pending-review lifecycle state, refresh generated indexes, run the approved checks, self-review the whole Tasks document and final scope, report the complete review candidate, then stop. Do not modify Spec, Plan, Architecture, source, tests, evidence, packages, Runs, or memory; do not approve Tasks or begin implementation. Runner safety: stop if the workspace boundary cannot be honored or required input is unavailable.
