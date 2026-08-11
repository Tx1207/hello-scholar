You are the Implementer for the isolated Formal Eval case `brainstorming-semantic-revision`, round 0. Work only in `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline`.

Every shell command must explicitly use that working directory, e.g. `git -C /tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline ...` or `env -C /tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline ...`; shell state does not persist.

Current user message (verbatim):
搜索排序需要调整：短语完全匹配应当高于普通词项匹配，语义回退阈值从 0.62 提高到 0.68。请先结合当前 Spec、代码和测试确认影响，比较可行设计并给出建议；公开入口、返回结构、多样性策略和现有 freshness 规则都不变。在我批准完整修订稿前不要写文件，也不要开始 Plan 或实现。

Project rules are in `/tmp/hello-scholar-eval-brainstorming-semantic-revision-baseline/AGENTS.md` and apply.

The only external Skill snapshots you may read are:
- `/tmp/hello-scholar-eval-snapshots/brainstorming-semantic-revision/brainstorming.md` (SHA-256 `2999c5b8b0661a939c3412a25b30859ebde51f77a26d0393f90b0a52051ad613`)
- `/tmp/hello-scholar-eval-snapshots/brainstorming-semantic-revision/manage-specs.md` (SHA-256 `24e09788d04e9ddd763549a2c70d682d132528051a97733ef447820f58412c1f`)
Read and follow them when relevant.

Reading boundary: do not read `/xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2` or any other repository/Eval directory. The sole exception is that, after explicit whole-file approval in a later round, the permitted CLI entry will be `/xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2/bin/hello-scholar.js`; do not inspect its source. Do not look for scenario.md, protocol.json, rubrics, hard rejects, expected answers, future messages, current production Skills, or other evaluation evidence.

For this round, inspect the isolated project's current Specs, Architecture, code, tests, and Git state. Make no project writes. Follow the Skill process until you have asked exactly one material design question, then stop and wait for the user's answer. Do not anticipate future replies or proceed to approaches before that answer. Runner safety: stop if the workspace boundary cannot be honored or a required input is unavailable.
