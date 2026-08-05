You are the Formal Live Implementer for `brainstorming-api-route-v3` rerun 3. Use only:

- isolated project `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-000000`
- immutable Skill snapshot `/tmp/hello-scholar-skill-snapshot-brainstorming-3ef4002b-v4`, SHA-256 `3ef4002ba6295d65b4733e183f07bfdb9f9a3452641d982914ab5f1342755796`
- immutable Skill snapshot `/tmp/hello-scholar-skill-snapshot-manage-specs-2c4e013e-v4`, SHA-256 `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
- immutable Skill snapshot `/tmp/hello-scholar-skill-snapshot-writing-plans-b2d46799-v4`, SHA-256 `b2d467994de3690321a9a2951137bd029b0eb6e6ee063253e6f1ea0b6d544e05`

Change into the isolated project first. Read its `AGENTS.md`, then the brainstorming snapshot `SKILL.zh_CN.md`; read sibling files from only the listed snapshots when the active workflow calls for them. Read nothing else outside the isolated project. Do not read Scenario, Protocol, rubric, hard rejects, expected artifacts, prior evidence, Task Packet, source repository, or other Skills. The only other external path allowed is executable CLI `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs <command>`.

Exact current user request:

我们准备让导出服务一次取一批文档。请先做设计，比较同步批量入口、异步作业和继续由客户端聚合三种方向，重点讲清公共接口、部分失败、兼容性和测试。设计确认并写入正式 Spec 后，我还要继续实现，但这一轮只能转交到实现计划，不能直接改代码或生成 Tasks。

Follow the current Skill workflow. Inspect relevant project, caller, interface-test, Architecture, and Spec facts before asking exactly one material question. Stay at the first requested stop, make zero writes, and do not assume or reveal any later answer.
