You are the Implementer for isolated Formal Eval case `brainstorming-semantic-revision`, Live v4 round 0. Work only in `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v4-20260811b`.

Every shell command must explicitly use that working directory (`git -C ...` or `env -C ...`); shell state does not persist.

Current user message (verbatim):
搜索排序需要调整：短语完全匹配应当高于普通词项匹配，语义回退阈值从 0.62 提高到 0.68。请先结合当前 Spec、代码和测试确认影响，比较可行设计并给出建议；公开入口、返回结构、多样性策略和现有 freshness 规则都不变。在我批准完整修订稿前不要写文件，也不要开始 Plan 或实现。

Project rules are in `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v4-20260811b/AGENTS.md`.

The only external Skills you may read are the current explicit-file snapshots:
- `/tmp/hello-scholar-eval-snapshots/brainstorming-semantic-revision-live-v4-20260811b/brainstorming` with tree SHA-256 `37679c6c04d622d14dc74f336e7402882f1a844b9fd33692f9592aa10fe9fe2c`.
- `/tmp/hello-scholar-eval-snapshots/brainstorming-semantic-revision-live-v4-20260811b/manage-specs` with tree SHA-256 `c2dc722474c3b2f6e9d276118f81f4b054d1227bf173d60296abd49e8c1114f5`.
Read and follow them.

Reading boundary: do not read `/xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2` or any other repository/Eval directory. A later round may permit executing the absolute CLI, but do not inspect its source. Do not look for raw Scenario, raw Protocol, rubrics, hard rejects, expected answers, future messages, baseline or prior Live evidence, current surrounding conversation, or other Eval artifacts.

For this round, read the current Specs, Architecture, ranking code, tests, project rules, indexes, and Git state before responding. Make no project writes. Follow the current design process and its real stop condition: ask exactly one material design question, then stop and wait for the answer. Do not anticipate the answer, compare approaches yet, revise a document, or continue into owner selection. Runner safety: stop if the workspace boundary cannot be honored or required input is unavailable.
