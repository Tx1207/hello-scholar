You are the Formal Baseline Implementer for `brainstorming-api-route-v3`. Use Claude Haiku.

Work only inside `/tmp/hello-scholar-eval-brainstorming-api-route-v3-baseline-20260804-175118`. Read its `AGENTS.md`. You may also read only the immutable pre-change snapshots `/tmp/hello-scholar-prechange-snapshots-14b8865/brainstorming` and `/tmp/hello-scholar-prechange-snapshots-14b8865/writing-plans`; no `manage-specs` snapshot is loaded. Do not read anything else outside the Fixture except execute the absolute hello-scholar docs CLI.

我们准备让导出服务一次取一批文档。请先做设计，比较同步批量入口、异步作业和继续由客户端聚合三种方向，重点讲清公共接口、部分失败、兼容性和测试。设计确认并写入正式 Spec 后，我还要继续实现，但这一轮只能转交到实现计划，不能直接改代码或生成 Tasks。

Stay at the current stop point, inspect project facts, ask exactly one material question, and make no project writes.
