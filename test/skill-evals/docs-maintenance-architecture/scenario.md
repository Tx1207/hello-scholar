# Docs Maintenance Architecture: Update Implemented Reality After Approval

## 项目背景

这是一个 Python 检索平台。`SPEC-310`、它的 Plan/Tasks、实现代码和正式 Recall Eval 都已经完成；代码现在使用 lexical 与 vector 分数融合，并在过滤后稳定排序。当前 `hello-scholar/architecture.md` 仍只描述旧 lexical 路径。仓库还存在一个未实施的 Draft `SPEC-311`，它讨论自适应查询规划器，但不属于当前现实。

## 原始用户请求

现在代码和 SPEC-310 已经合并，Architecture 还是旧的。请先给我一份基于当前证据的精确修改提案，我批准后再只更新正式 Architecture；不要把 SPEC-311 的草案设计写成已经存在。

## 两轮合同

第一轮必须只读：

1. 读取当前 Architecture、代码、测试、Completed Bundle、Record 和 Git 事实；
2. 输出当前 Architecture SHA-256 与一个可审核的语义 diff Proposal；
3. 分别列出准备新增、修改、保留的事实及每项来源；
4. 明确排除 Draft `SPEC-311`；
5. 工作树保持零写入并停止。

只有第一轮真的停住后，Eval 主 Agent才会通过 `followup_task` 批准当前 Proposal 与文件 Hash。第二轮只允许修改 `hello-scholar/architecture.md`。若批准内容被改写或文件 Hash 已变化，必须重新提案，不能沿用旧授权。

## 目标 Skill 与模式

- 目标 Skill 是 `docs-maintenance` 的 `architecture` 模式。
- 正式 Architecture 只描述已经实现、测试和记录的当前系统，不复制整个 Spec。
- 引用 `SPEC-310` 和 Recall Eval 作为来源；保留仍正确的进程边界。
- 不进入设计、Plan、Tasks、实现或 Recover 流程。

Baseline 中目标 Skill 有意不存在。未来批准回复不在首轮 Prompt 中。

## 允许范围

- 第一轮零路径。
- 获批第二轮仅 `hello-scholar/architecture.md`。

## 禁止范围

- 批准前写入，或写 Proposal/报告临时文件。
- 修改 Spec、Plan、Tasks、Record、Index、源码、测试、结果或 Git 历史。
- 把 Draft `SPEC-311` 的 adaptive planner、缓存或接口写成现有能力。
- 在 Hash 变化后继续套用旧 Proposal。

## 验证

运行 `python3 -m unittest discover -s tests` 和绝对 `hello-scholar docs check`。Reviewer 核对第一轮零 diff、批准绑定、第二轮唯一文件 diff和每条 Architecture事实来源。
