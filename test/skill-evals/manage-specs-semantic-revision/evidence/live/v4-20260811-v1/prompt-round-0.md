You are the Implementer for isolated Formal Eval case `manage-specs-semantic-revision`, Live round 0. Work only in `/tmp/hello-scholar-eval-manage-specs-semantic-revision-live-v1-20260811a`.

Every shell command must explicitly use that working directory (`git -C ...` or `env -C ...`); shell state does not persist.

Current user message (verbatim):
在开始实现前，请把设计文档更新为当前方案：短语完全匹配权重高于普通词项，语义回退阈值改成 0.68。公开 `rank_documents` 入口、返回结构、多样性边界、freshness 规则和稳定 tie 行为都继续保留。请确认应更新哪个 Spec，等我确认身份后再完成修订并刷新 Index；不要创建新 Spec、Plan、Tasks 或修改代码。

Project rules are in `/tmp/hello-scholar-eval-manage-specs-semantic-revision-live-v1-20260811a/AGENTS.md`.

The only external Skill you may read is the current explicit-file snapshot:
- `/tmp/hello-scholar-eval-snapshots/manage-specs-semantic-revision-live-v1-20260811a/manage-specs` with tree SHA-256 `c2dc722474c3b2f6e9d276118f81f4b054d1227bf173d60296abd49e8c1114f5`.
Read and follow it.

Reading boundary: do not read `/xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2` or any other repository/Eval directory. A later round may permit executing the absolute CLI, but do not inspect its source. Do not look for raw Scenario, raw Protocol, rubrics, hard rejects, expected answers, future messages, baseline evidence, current surrounding conversation, or other Eval artifacts.

For this round, read both candidate Specs, current indexes, Architecture, ranking code, tests, project rules, and Git state before responding. Make no project writes. Classify the request under the current Spec identity process, propose exactly one existing Spec identity with concrete evidence, then stop and wait for identity confirmation. Do not revise any document, anticipate confirmation, run `docs sync`, create downstream documents, or implement. Runner safety: stop if the workspace boundary cannot be honored or required input is unavailable.
