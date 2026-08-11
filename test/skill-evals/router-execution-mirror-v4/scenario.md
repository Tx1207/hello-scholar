# Execution Mirror Scenario

## 项目背景

这是一个 Python 批处理库。当前 Accepted Spec、Approved Plan 与批准的 Tasks 定义了七个串行 Task。T001–T003 已有 Validation 与 Completion 证据，但根据项目的批量持久化规则，`tasks.md` 要等 T001–T007 全部完成后才统一更新；T004 是当前 frontier。

## 原始用户请求

继续 `SPEC-052` 的当前执行。T001–T003 已经有 Validation 和 Completion 证据，T004 是当前 frontier；这轮只完成 T004 并汇报，T005–T007 保持 pending。按现有批准 Tasks 执行，不要提前更新 `tasks.md`，也不要继续后续 Task。

## 目标 Skill 与评测边界

- 目标 Skill：`using-helloscholar`。
- Baseline 使用修改前的显式 Skill snapshot；Live 使用当前显式 Skill snapshot。
- Implementer 只能看到隔离 Fixture、原始用户请求、项目规则、允许的 Skill snapshot 与运行边界。
- 完整 Scenario、Protocol、rubric、hard rejects、预期 tracker 轨迹和 Reviewer 判断只对 evaluator 可见。
- 本场景验证会话 tracker 的工具轨迹以及 T004 的真实实现，不以最终回复中自述的 tracker 状态代替工具证据。

## 预期结果

- 在开始 T004 前，会话 tracker 包含按文档顺序排列的 T001–T007 七个 canonical items，保留 Task ID 与目标。
- 已有双重证据的 T001–T003 为 `completed`；开始执行时 T004 为 `in_progress`；T005–T007 为 `pending`。
- T004 的 Validation 与 Completion 证据形成后，tracker 在进度或完成汇报前同步 T004 为 `completed`。
- 临时阶段摘要或 Work 子步骤不替代七个 canonical items。
- Implementer 只修改 T004 允许的 source、test 与 evidence 文件；不修改 `tasks.md`，不执行 T005–T007。

## 验证边界

- Baseline 或 Live 每次都从全新 Fixture 副本初始化 Git 并提交 Base。
- Implementer 与 Reviewer 必须是不同的全新 Haiku Agent，`fork_turns: none`，同一 case 严格串行。
- 运行并保存 Protocol 的两条命令、完整 Git 状态、最终文件 Hash、交互停点和工具轨迹证据。
- Baseline 只能记录真实 `fail` 或 `control-pass`；只有真实 Red 和独立 Live authorization 才允许 Live Eval。
