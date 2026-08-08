---
name: converge-to-spec
description: 审计已完成 Spec Bundle 的实现追溯与收敛。仅在用户明确要求核对实现与 Spec/Plan 合同，或将刚完成的收敛审计发现追加为 Convergence Tasks 时使用。
---

# Converge to Spec

审计 Bundle，不直接实施修复。

## 0. 选择唯一入口

在扫描实现或运行 `hello-scholar docs check` 前，先分类当前请求。

- **收敛审计：** 用户明确要求核对实现与 Spec/Plan 合同时选择此分支。先只读取 Spec、Plan、Tasks 的生命周期字段与顶层 Task 复选框。仅当 Spec 为 `accepted`、Plan 为 `approved`、Plan 与 Tasks 为 Current，且 Tasks 的 `approval: approved`、`approved_revision` 等于 `revision`、`status: completed`、每个必需的顶层 Task 均已勾选时，才进入第 1 节；否则报告第一道未满足的门，并将 Bundle 返回 `using-helloscholar` 续做 Task。
- **追加审计发现：** 用户明确要求把刚完成审计的发现保存为 `Convergence` Tasks 时选择此分支。若发现及其记录的 Bundle Revision 仍在当前上下文中，且记录的 Spec、Plan 与 Tasks Revision 仍然匹配，则跳过第 1–3 节并进入第 4 节；否则报告当前没有可复用的审计，并停在明确的新审计请求门。
- **Task 续做：** 进度、完成情况、剩余工作和继续实施请求交给 `using-helloscholar`，由它从 `tasks.md` 与 TodoWrite 恢复状态。

**完成条件：** 已选择唯一分支；不符合入口条件的审计停在生命周期门，没有扫描实现，也没有运行完整文档检查。

## 1. 建立证据边界

1. 记录初始 Git status 和 Git diff 基线，以及允许写入集合。默认允许写入集合为空。以该基线识别本次事务增量；既有变更不在范围内。
2. 只按以下顺序读取目标 Bundle 相关事实：相关 Architecture、`spec.md`、`plan.md`、`tasks.md`、Git diff/status、相关代码/测试/配置、再读取 Spec 引用的 `runs/<run-id>/record.md`。
3. 运行 `hello-scholar docs check`。

若 Spec 不是 `accepted`、Plan 不是 `approved`，或 Plan/Tasks 为 Missing 或 Stale，不得给出 Ready 结论。报告精确 Revision/状态、对应 owner 及其他直接可观察的 blocker；不修复合同。

**完成条件：** 已确定有边界的 Bundle、已记录写入集合、并取得当前文档诊断。

## 2. 审计收敛

在回复中建立紧凑追溯表：

`Spec AC → Plan 阶段/文件边界 → Task → 实现/测试/Record 证据`

将真实代码树与 Bundle 对照。每个发现只归入以下一种偏差：

- `Missing`：必需行为或产物缺失。
- `Partial`：必需行为、路径或不变量只实现一部分。
- `Contradictory`：实现、公共接口或持久化形式与合同冲突。
- `Unrequested`：新的入口、配置、抽象、依赖或行为没有合同依据。

每项都给出：严重程度、控制它的 Spec/Plan/Task 引用、`file:line`、观察到的证据和可实施的修复方向。检查真实 Plan 文件范围、接口、阶段顺序、迁移、清理和回滚；不以复选框已勾选或测试全绿替代这些对照。

在相关范围内搜索旧实现、调用方、配置、测试、Feature Flag、临时兼容层、未使用依赖/文件和未选候选实现。

**完成条件：** 每项材料性 AC 与 Plan 义务都有追溯证据，或有一个已分类发现，且包含可观察的清理债务。

## 3. 判断完成就绪

只有证据同时证明以下全部条件时，才返回 `Ready for completion evidence`：

1. Spec Accepted；Plan Approved；Plan 与 Tasks Current。
2. 每个必需 Task 的 Validation 和 Completion 都满足；任何跳过/取消项都有已批准理由，且不影响任一 AC。
3. 没有未解决的阻塞偏差或清理发现。
4. Spec 要求的每个正式 Benchmark、Eval 或训练都有有效根目录 `runs/<run-id>/record.md`，其中有终态、结果和决定。普通单元测试不强制 Record。
5. 必需迁移与旧代码清理已完成。

否则返回 `Not Ready`，并按依赖顺序路由：新设计交 Spec owner，技术方案失效交 Plan owner，Stale 合同交同步 owner，之后才是 Tasks 审核、实现/清理、正式 Record 工作，以及实施会话自身的新鲜验证。

始终列出主 Agent 必须实际运行并读完、满足 AGENTS 新鲜证据门的精确验证命令；历史摘要可以定位工作，但不能替代它。若用户主动要求审计，或完成的 Bundle 出现材料性结构变化，另行说明是否值得提出 Architecture 维护及理由。任何 `docs-maintenance architecture` 工作都等待用户确认；它不是就绪前置门。

**完成条件：** 回复给出有证据的 Ready/Not Ready 结论、blocker 或已满足条件、新鲜命令下一步，以及条件性的 Architecture 提醒。

## 4. 将审计发现保存为 Convergence Tasks

仅当用户明确要求保存刚完成审计的发现，或第 0 节选择了仍然 Current 的审计时进入此分支。写入前确认记录的 Spec、Plan 与 Tasks Revision 仍然匹配；可复用的审计跳过第 1–3 节，Revision 不匹配时停在明确的新审计请求门。

1. 先分类发现：新设计回 Spec；技术方案失效回 Plan；Stale 合同先由对应 owner 同步。只追加当前 Spec 和 Plan 内可直接实施的工作。
2. 在现有 `tasks.md` 末尾追加 `Convergence` Phase，延续 `TNNN` 序号。每个新且未勾选的 Task 都包含目标、`Spec Coverage`、`Depends On`、`Parallel`、`Files`、`Work`、`Validation` 和 `Completion`。只有已批准合同明确要求 TDD 时，才加入 Red-Green-Refactor。
3. `revision` 加一；设为 `approval: pending-review`、`approved_revision: null`、`status: pending`；更新 `updated`。
4. 运行一次 `hello-scholar docs sync`。相对已记录基线，核对本次事务增量只包含 `tasks.md` 和 CLI 生成的 Index。
5. 展示新 Revision 与覆盖变化，随后停在用户审核门。批准此 Revision 与授权实施是两个未来的独立决定。

**完成条件：** 只改了允许的 Tasks 事务和生成的 Index，所有追加 Task 都可审核且未勾选，并在回复中停在审核门。

## 边界

- 默认审计和就绪分支只读；在聊天回复中报告，不创建审计产物。
- 不修改代码、测试、Spec、Plan、Record、Architecture、既有 Task 完成状态，也不手工修改生成的 Index。
- 不将过去的测试通过摘要视为当前验证证据。
- 每个执行或写入追加 Task Validation 的 Python 命令都使用 `PYTHONDONTWRITEBYTECODE=1 python3 -B ...`。
