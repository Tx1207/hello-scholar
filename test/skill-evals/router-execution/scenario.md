# Router Execution Path: Approved Cache Tasks

## 项目背景

这是一个 Python 内存 Cache 库。仓库已经有一份 Accepted Spec、与其 Current 的 Approved Plan，以及当前 Revision 已批准但尚未完成的 Tasks。当前实现按插入顺序淘汰，目标 Bundle 已决定改为真正的 LRU，并给出了文件、依赖、验证和完成条件。

## 原始用户请求

Cache 的 Spec、Plan 和 Tasks 我都已经审过了。现在明确授权你在本轮按现有 Tasks 完成实现，完成后把任务状态和验证结果收口。

## 当前状态与目标 Skill

- `SPEC-004` 为 `accepted`，Plan 为 `approved`，Tasks 为 `approval: approved` 且 `approved_revision == revision`。
- 用户在当前请求中另行给出了实施授权；合同批准本身不替代这次授权。
- 目标 Skill 是 `using-helloscholar`，应选择 Execution Path。
- 当前主 Agent直接按 Tasks 的依赖、Files、Validation 和 Completion 执行，不重复 Brainstorm，不创建新 Bundle，也不调用已淘汰的执行或 Review Skill。

## 允许范围

- `src/cache_allocator.py`
- `tests/test_cache_allocator.py`
- 原 Bundle 的 `tasks.md`，仅用于真实完成状态和勾选收口

## 预期产物

- `get()` 刷新最近使用顺序，容量满时淘汰最久未使用项。
- 更新已有 key 不错误淘汰其他项，并刷新该 key 的顺序。
- Tasks 按实际依赖完成，验证命令有当前输出；原 Bundle 数量不变。

## 禁止产物

- 新 Spec、Plan、Tasks、设计文档、Run 或 Architecture。
- 修改 Accepted Spec 或 Approved Plan 来降低目标。
- 调用 Brainstorm、专用 executing/subagent/review/finishing Skill，或为每个 Task 嵌套实现 Agent。
- 在审批或本轮授权缺失时继续实施。

## 验证与交互

初始命令为 `python3 -m unittest discover -s tests` 和 `python3 scripts/check_bundle_state.py`。实现后再次运行两条命令，并检查 Bundle 的 Spec/Plan/Tasks 各仍只有一份。本场用户首轮已经包含本轮实施授权，没有未来批准回复。
