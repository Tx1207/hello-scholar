---
name: generating-tasks
description: Decomposition：把 Accepted Spec 及其当前 Approved Plan 拆成一份可审核、可独立执行的 tasks.md。用于现有 Spec Bundle 在实施前创建、修订、审计 Tasks 或记录 Tasks 审批。
---

# 生成 Tasks

把当前 Approved Plan 转换为执行合同。保留上游已经确定的决定；缺失设计返回 Spec 或 Plan，不在 Tasks 中临时决定。

一个顶层 Task 是一个 **tracer task**：推进一个可观察 Plan 结果的最小依赖完备切片，能装进一个新鲜上下文，并让仓库保持可独立验证。其 `Work` 由具体的 2–5 minute actions 组成。

## 1. 建立合同

1. 定位目标 Spec Bundle，完整读取 `spec.md`，再完整读取 `plan.md`。只有为确认 Plan 已依赖的事实时，才读取相关 Architecture、源码、测试、配置或持久化格式。
2. 通过绝对 hello-scholar CLI 运行 `docs check`。只有 Spec 为 `accepted`、Plan 为 `approved`，且 `plan.spec_revision` 等于当前 Spec `revision` 时才继续。
3. 建立义务账本，覆盖每个 Spec 验收条件和每项 Plan 要求：范围、文件、接口、阶段、测试或实验、迁移、清理、回滚、`Must Not Touch` 和 Tasks 生成规则。

若仍有材料性选择未定或文档相互冲突，保持 `tasks.md` 不变，并指出应当回到 Spec 或 Plan 的确切决定。

**本步完成条件：** 每项已接受要求都有一条账本记录，拆分所需的路径和命令均有项目事实依据，并且没有 Task 需要自行发明设计。

## 2. 起草 tracer tasks

默认按纵向、承载行为的切片拆分。一个 tracer task 可以同时跨越测试、源码、配置和文档，只要这些编辑共同交付一个能独立检查的结果。

“写完所有测试”“修改数据层”“更新文档”这类 **horizontal slice** 不是 Task，除非 Approved Plan 明确把该层定义为可独立产生价值并验证的交付物。不可分割的仓库变更保持在一起；当一个 Task 包含多个结果、无法装进新鲜上下文或不能独立验证时，继续拆分。

每个 Task：

- 使用唯一 `TNNN` ID 和自然语言结果。
- 在 `Spec Coverage` 中映射精确 AC ID 或 Spec 章节。
- 在 `Files` 中列出所有新增、修改、移动和删除路径。
- 在 `Work` 中写有序的 2–5 minute actions。每个动作点名精确 symbol、interface、data shape 或文件区域以及具体编辑；当 Approved Plan 或当前项目事实已固定内容时，提供代码或配置片段，需要新设计时返回上游。
- 在 `Validation` 中给出可执行命令和可观察的预期信号。
- 把 `Completion` 写成执行者可检查的仓库或行为状态，同时包含必须保持的不变量和必要的不存在性检查。
- 让 Task 可独立阅读：写明输入、前置条件、恢复动作和相关固定决定，不引用当前对话或“上一个 Task”。

模板中的必填字段——`Spec Coverage`、`Depends On`、`Parallel`、`Files`、`Work`、`Validation` 和 `Completion`——必须出现在每个顶层 Task 中。所有占位符都替换为项目事实。

**本步完成条件：** 任意 Task 都能单独交给不了解对话的 Agent，在一个新鲜上下文中完成，并仅凭自身 Validation 和 Completion 判断是否完成。

## 3. 建立阻塞边

`Depends On` 只记录真实 blocking edges。所有 blocker 已完成的 Tasks 组成当前 **frontier**。

只有 Tasks 能位于同一 frontier、彼此没有依赖路径、不写同一文件或共享可变状态，并符合 Plan 顺序约束时，才标记 `Parallel: Yes`；其余全部标记 `Parallel: No`。最终依赖图必须无环。

无法作为单个 tracer task 持续保持 green 的宽迁移或删除，使用 **expand–migrate–contract**：

1. **Expand：** 引入新形式或兼容窗口，同时保持旧形式有效。
2. **Migrate：** 按 blast radius 把调用方、数据、配置、测试和 writer 拆成可独立验证的批次迁移。
3. **Contract：** 只有可执行搜索、回归和清理门证明不存在旧调用方或持久依赖后，才删除旧形式。

当回滚、最终集成和清理具有不同证据或阻塞边时，各自建立 Task。若 migrate 批次无法独立 green，则串行排列，并明确最终集成 Task 是第一个承诺全绿的 gate。

**本步完成条件：** 每个 Task 都能在 DAG 中到达，每条边都是实际前置条件，每对 `Parallel: Yes` Task 均无冲突，迁移、删除、回归、清理、最终验证和回滚义务都有 owner。

## 4. 写入一份 Tasks 文档

起草前只读取一个权威模板：

- 中文仓库：`assets/tasks-template.zh_CN.md`
- 其他仓库：`assets/tasks-template.md`

把 `tasks.md` 写在当前 `spec.md` 和 `plan.md` 同目录。本事务只语义修改 Tasks；Index 变化只能由 CLI 生成。

新文档绑定当前 Spec ID、Spec revision 和 Plan revision，并精确初始化：

```yaml
revision: 1
approval: pending-review
approved_revision: null
status: pending
```

只有用户或 Approved Plan 对某个结果明确要求 TDD 时，才在对应 Task 中加入：

```markdown
  - Process: `test-driven-development`
  - Red-Green-Refactor:
    - Red: 在修改生产代码前运行精确 focused command，观察命名行为因预期原因失败。
    - Green: 作出已命名的最小实现改动，观察 focused command 通过。
    - Refactor: 只在 focused 和 full checks 保持 green 时整理结构。
    - Signal: 记录精确通过输出或状态。
```

没有显式 TDD 要求的 Task 使用项目常规验证，并省略这两个字段。

本事务实际执行的每条 Python 命令，以及写入 `Validation` 的每条 Python 命令，都精确使用 `PYTHONDONTWRITEBYTECODE=1 python3 -B ...`，保留其余参数。这使验证产物留在项目 diff 之外。

**本步完成条件：** 同一 Bundle 中只有一份 `tasks.md` 覆盖完整义务账本，模板标记全部消失，元数据 current 且等待用户审核，并且没有其他核心文档语义修改。

## 5. 证明审核候选可用

1. 把每条义务账本记录映射到至少一个 Task，并把每个 Task 反向映射到 Approved Plan。覆盖 AC、回归、迁移、删除、清理、回滚和最终 gate。
2. 检查 ID 唯一、DAG 无环、frontier 冲突、精确路径、接口一致性、命令可执行性、预期信号和禁止范围。
3. 通过绝对 hello-scholar CLI 依次运行 `docs sync`、`docs check`。
4. 运行 Plan 要求的项目检查；每条 Python 命令使用上面的无产物形式。
5. 对比初始与最终 Git 状态。写入集合只能是 `tasks.md` 和 CLI 生成的 Index，本事务不能新增 `__pycache__` 目录或 `.pyc` 文件。
6. 回复先给出 `tasks.md` 路径和 pending-review 结果，再简述 AC 覆盖、blocking edges/frontier 与验证证据，然后停下来等待用户审核。

<REVIEW-GATE>
终止状态是一份等待用户审核的完整 `tasks.md`。创建或批准 Tasks 都不会启动实施；实施必须另有一条明确请求。
</REVIEW-GATE>

**本步完成条件：** `docs check` 无 errors，必需项目检查通过，diff 与运行时产物检查证明写入边界，并且用户已收到当前完整 Tasks revision 供审核。

## 后续生命周期分支

- **语义修订：** `revision` 加一，重置 `approval: pending-review` 和 `approved_revision: null`，更新 `updated`，重新运行完整审计，再提交整份文档。
- **明确批准未改变的内容：** 只把 `approval` 改为 `approved`，把 `approved_revision` 改为当前 `revision`；运行 `docs sync` 和 `docs check`，然后说明实施仍需单独授权。
- **审计请求：** 针对当前 revision 报告具体覆盖、依赖、验证或范围缺陷；语义修复必须作为新的 pending-review revision。
