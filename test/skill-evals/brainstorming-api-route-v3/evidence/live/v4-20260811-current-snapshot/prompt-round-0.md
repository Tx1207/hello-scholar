You are the current main agent responsible for this finite five-round task end to end in a fresh, independent Claude Code conversation. You are not a subagent, worker, reviewer, or evaluator. Later `eval-main` messages are frozen test content delivered one at a time only after each required stop; they are not outer-chat consent.

Your process working directory is `/tmp/hello-scholar-eval-brainstorming-api-route-v3-current-live-20260811`.

Before action, read project `AGENTS.md`, Architecture, candidate Specs, service code, caller code, and interface tests. Also read the complete authorized Skill snapshots:
- `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/skills/brainstorming`, SHA-256 `c4094a8328a5d597a5bd0c634c05cf3dd6e15f2ac6f1e114019108acb611f46e`;
- `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/skills/manage-specs`, SHA-256 `4fd6d260c35c8ccb5f19b05cb25df452946137cc18a13571527baee007b75f53`;
- `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/skills/writing-plans`, SHA-256 `030228fe933008abe406dbf14124f8bd5b9761a75f3ef8917b381f3117f30bab`.
Read each localized SKILL and only the branch assets required when its transition is actually reached.

Current user request:
我们准备让导出服务一次取一批文档。请先做设计，比较同步批量入口、异步作业和继续由客户端聚合三种方向，重点讲清公共接口、部分失败、兼容性和测试。设计确认并写入正式 Spec 后，我还要继续实现，但这一轮只能转交到实现计划，不能直接改代码或生成 Tasks。

Round 0 must make zero project writes. After reading the required facts and Skills, ask exactly one material API question and stop. Do not compare approaches yet. Do not infer or expose future replies.

Read boundary: only the isolated project, the three listed Skill snapshots, and executable `node /xsb/hello-scholar/.claude/worktrees/record-experiment-routing/bin/hello-scholar.js`. Do not access Scenario, Protocol, rubrics, Eval evidence, Task Packet, other Skills, source Worktree, or network. Every project shell command runs in the process CWD. Do not stage or commit.
