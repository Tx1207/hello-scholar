---
name: docs-maintenance
description: 通过四种显式模式维护下一代文档。当用户要检查文档健康状态、重建生成的 Index、更新 Current Architecture，或在损坏/长期未维护后恢复可审核文档时使用。
---

# Docs Maintenance

只能选择 `check`、`index`、`architecture` 或 `recover` 之一。写入集合不同的模式不得组合。

## 建立事务

1. 确认项目/Worktree 根目录，读取项目指令，并确定用户的明确请求。
2. 用户指定模式时严格使用；只有一个模式明确匹配时，先声明该模式再执行；请求涉及多个写入集合时，请用户选择。
3. 只有用户明确要求时进入 `architecture`；或已完成 Bundle 在项目结构、关键模块职责、公共运行流程或持久位置发生材料性变化时，先说明证据和拟更新范围，等待确认后进入。
4. 操作前记录初始 Git status 和 Git diff 基线，以及模式的允许写入集合。结束时相对该基线检查本次事务增量；发现新变更位于范围外路径则停止并报告，既有变更不在范围内，也不顺手修复相邻文档。
5. 只按需读取相关 Index、Architecture、Bundle、Run 和代码事实。直接调用已安装的 `hello-scholar` 命令。

| 模式 | 用途 | 允许写入 | 完成条件 |
| --- | --- | --- | --- |
| `check` | 只读诊断 | 无 | 报告命令、退出码、errors、notices 和相对路径。 |
| `index` | 派生导航 | 仅 CLI 生成的 `hello-scholar/specs/INDEX.md`、各 Topic `INDEX.md` 与 `runs/INDEX.md` | CLI 完成；本次事务增量只包含生成的 Index。 |
| `architecture` | 当前已实现系统 | 第一轮无；获批准的第二轮仅 `hello-scholar/architecture.md` | 先返回 Proposal，只有批准当前 Hash 后才写入。 |
| `recover` | 可审核恢复 | 仅 CLI 生成的 Index | 报告恢复发现，并在回复中给出草稿。 |

## `check`

1. 只运行 `hello-scholar docs check`。
2. 返回精确命令、退出码、errors、notices 和项目相对路径。没有文档的 Fast Path 合法；缺少 Architecture 只有在 CLI 报错时才是 error。
3. 保持所有文件和 mtime 不变。不得运行 sync、修复 Front Matter 或生成报告产物。

**完成条件：** 已报告诊断，且本次事务增量为空。

## `index`

1. 只运行 `hello-scholar docs sync`。解析、校验、排序、链接和原子 Index 更新由 CLI 负责。
2. 失败时报告 diagnostics 并保留旧 Index。不得编辑源文档或重建表格。
3. 核对本次事务增量仅含生成的全局、Topic 和 Run `INDEX.md`。

**完成条件：** 已报告 CLI 结果，且最终允许范围内的本次事务增量已核对。

## `architecture`

起草或写入前，英文项目读取 `assets/architecture-template.md`，中文项目读取 `assets/architecture-template.zh_CN.md`。

### Proposal 轮

1. 读取现有 Architecture、当前代码和目录结构、与变更相关的 Git 状态/历史、Completed Spec/Plan/Tasks、有效 Record 和必要的 Converge 结果。
2. 排除 Draft 或 Rejected Spec、失败且未采纳的 Prototype、未合并分支和只在聊天中讨论的未来设计。
3. 在回复中给出语义 Proposal：当前 `hello-scholar/architecture.md` 的 SHA-256（缺失则明确说明）、事实来源、逐节 Add/Change/Keep、待删除陈述、未确认事实和预计本次事务增量。本次事务增量必须为零。
4. 停止并等待用户明确批准这个 Proposal 与文件 Hash。内容改变、没有批准的“继续”、Architecture Hash 改变或 Git 事实改变都会使 Proposal 失效，必须重新提案。

**完成条件：** 返回未写入的 Proposal，或到达批准门。

### 获批准的写入轮

1. 重新检查获批 Architecture SHA-256 和 Proposal 依赖的事实；任一改变即回到 Proposal 轮。
2. 仅更新已获批准且受事实影响的 `hello-scholar/architecture.md` 章节；保留其他已验证内容。只描述已实现现实，并为每项重要技术选择引用来源 Spec。
3. 使用模板规定的精确 Front Matter 和全部九节；将 `updated` 设为当前日期。
4. 核对本次事务增量只包含 `hello-scholar/architecture.md`。

**完成条件：** 一个已获批准的 Architecture 文件反映已验证当前事实，本次事务增量没有其他路径。

## `recover`

1. 运行 `hello-scholar docs check`。源文档可解析时运行 `hello-scholar docs sync` 重建生成的 Index；解析失败时保留现有 Index 并报告 blocker。
2. 报告孤立 Spec、Stale Plan 和 Tasks、无关联 Run、缺失或可能漂移的 Architecture，以及 legacy-path notices。
3. 读取适用的 Architecture 模板。根据当前代码、Git 和可信的 Completed/Record 事实，在回复中给出完整九节 Architecture 草稿，标题为 `Needs Human Review`；区分已验证的当前事实与推断，并标明事实来源。
4. 草稿只留在回复中，不能放入 `INDEX.md`。不得将“继续”视为批准；审核后，必须使用独立的 `architecture` 事务写正式 Architecture。
5. 核对本次事务增量只含 CLI 生成的 Index（如有）。

**完成条件：** 返回恢复发现和 `Needs Human Review` 草稿，不写正式 Architecture 或其他仓库报告。

## 边界

- Architecture 是独立单文档事务；不得与 Spec、Plan、Tasks 或 Record 的语义同步合并。
- 不增加 `docs migrate` 入口、parser 实现、手写 Index 流程、`architecture-recovery.md`、`recovery-report.md` 或其他仓库内恢复报告。
- 生成的 Index 由 CLI 拥有，不手工编辑。
