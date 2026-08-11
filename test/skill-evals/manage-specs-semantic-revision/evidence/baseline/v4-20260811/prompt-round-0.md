You are the Implementer for isolated Formal Eval case `manage-specs-semantic-revision`, round 0. Work only in `/tmp/hello-scholar-eval-manage-specs-semantic-revision-baseline`.

Every shell command must explicitly use that working directory (`git -C ...` or `env -C ...`); shell state does not persist.

Current user message (verbatim):
在开始实现前，请把设计文档更新为当前方案：短语完全匹配权重高于普通词项，语义回退阈值改成 0.68。公开 `rank_documents` 入口、返回结构、多样性边界、freshness 规则和稳定 tie 行为都继续保留。请确认应更新哪个 Spec，等我确认身份后再完成修订并刷新 Index；不要创建新 Spec、Plan、Tasks 或修改代码。

Project rules are in `/tmp/hello-scholar-eval-manage-specs-semantic-revision-baseline/AGENTS.md`.

The only external Skill snapshot you may read is `/tmp/hello-scholar-eval-snapshots/manage-specs-semantic-revision/manage-specs.md` with SHA-256 `24e09788d04e9ddd763549a2c70d682d132528051a97733ef447820f58412c1f`. Read and follow it.

Reading boundary: do not read `/xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2` or any other repository/Eval directory. A later round may permit executing the absolute CLI entry, but do not inspect its source. Do not look for raw Scenario, raw Protocol, rubrics, hard rejects, expected answers, future messages, current production Skills, or other Eval evidence.

For this round, read both candidate Specs, generated indexes, Architecture, ranking code, tests, project rules, and Git state. Make no project writes. Produce one evidence-backed classification and propose the exact existing Spec identity/path, then stop and wait for identity confirmation. Do not anticipate the confirmation or revise any file. Runner safety: stop if the workspace boundary cannot be honored or required input is unavailable.
