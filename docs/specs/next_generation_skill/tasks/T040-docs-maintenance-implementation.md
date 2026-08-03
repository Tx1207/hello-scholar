# T040：实现 `docs-maintenance` 四模式 Skill

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T022, T083
- Parallel: No。它依赖 docs CLI、Converge 和四模式 Red 场景稳定；不依赖 `project-structure`。

## 目标

新增 `docs-maintenance`，用 `check | index | architecture | recover` 四个清楚模式维护下一代文档。它编排已有确定性 CLI 和事实读取，不在 Prompt 里重写 parser/index 算法，也不承担 Spec 身份、Plan/Tasks 同步或旧文档迁移。

## 预先设计思路

四种模式按“能写什么”分开，而不是按一串可选步骤拼成万能命令：

| 模式 | 语义 owner | 允许写入 |
|---|---|---|
| `check` | 只读诊断 | 无 |
| `index` | 派生导航 | 自动生成的三个 `INDEX.md` |
| `architecture` | 当前已实现系统 | Proposal 阶段零写入；用户批准当前 Hash 后仅 `hello-scholar/architecture.md` |
| `recover` | 损坏/长期未维护后的可审阅恢复 | 自动生成 Index；Architecture 草稿只放回复，不写正式文件 |

这种拆分直接落实“一次只语义维护一类核心文档”。它也让测试能用真实 diff 判断越权，而不是依赖 Agent 自称“只改了该改的”。

## 与原有能力比较

当前没有 `docs-maintenance` Skill，但 T008 已提供 `docs check/docs sync`。新 Skill 的价值不是包装两条命令，而是：

- 选择模式并守住写入集合；
- 为 Architecture 读取足够但不过量的事实；
- 防止未实现设计进入 Current Architecture；
- 在恢复时保留人工审核门；
- 报告孤立/Stale 状态而不擅自语义合并。

曾规划的 `project-structure` 已取消新增。写入边界直接由本 Task 的四模式允许集合、现有 Architecture 和项目 AGENTS 约束，不再增加一个前置 Skill。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `docs-maintenance` 保持 model-invoked，因为 Maintenance Path 会主动到达；`check | index | architecture | recover` 是四个清楚 branch，description 只列这四种用户目标。
- 每个 branch 有不同写入完成条件：check 零写入、index 字节确定、architecture 只反映已验证现实并经过必要用户确认、recover 只给待审草稿。
- Schema/模板放 assets/references，公共入口、branch 选择和写入边界留在 SKILL.md；不复制 docs CLI 或 Converge 的内部规则。
- 用四个 branch 和 completion criteria 收敛 sprawl，删除“维护一切文档”式 no-op 与重复 owner。

## 文件边界

### Add

- `skills/hello-scholar/docs-maintenance/SKILL.md`
- `skills/hello-scholar/docs-maintenance/SKILL.zh_CN.md`
- `skills/hello-scholar/docs-maintenance/assets/architecture-template.md`
- `skills/hello-scholar/docs-maintenance/assets/architecture-template.zh_CN.md`
- `test/test_docs_maintenance_skill.py`

### Must Not Add

- `docs migrate` 命令、迁移脚本或 API Client
- `architecture-recovery.md`、`recovery-report.md` 等第二份仓库真源
- Skill 内的 Index 模板或 parser 实现

### Must Not Modify

- `src/`
- 其他 Skill
- `AGENTS.md`、`README.md`
- T039 的 Scenario/Protocol/Fixture/Approval，以及 T083 保存的 Baseline/evidence

## 通用入口

1. 确定项目/Worktree 根目录，读取项目指令和用户明确请求。
2. 用户给出模式时严格使用该模式；请求只对应一个模式时可以明确声明后进入；可能对应多个写入集合时先让用户选择，不组合执行。`architecture` 只由用户主动要求进入，或在已完成 Bundle 出现材料性结构变化时先提示拟更新范围并等待用户确认。
3. 开始前记录允许写入集合，结束后核对 Git diff。发现超出模式边界的变化时停止并报告，不顺手修。
4. 默认按需读取相关 Index/Architecture/Bundle/Run 和代码，不加载全部历史。

## `check` 模式

- 只运行 `hello-scholar docs check` 并返回命令、退出码、errors、notices 和相对路径。
- 不运行 sync，不修 Front Matter，不修改 mtime，不生成报告。
- 无文档的 Fast Path 项目是合法状态；缺 Architecture 只能是 notice，除非 CLI 合同另有明确 error。

## `index` 模式

- 运行 `hello-scholar docs sync`，让 T004-T007 负责解析、验证、排序、链接和原子写入。
- 只允许 `hello-scholar/specs/INDEX.md`、各 Topic `INDEX.md` 和 `runs/INDEX.md` 变化。
- 失败时保留旧 Index；不手工修表、不修改源文档。

## `architecture` 模式

1. 读取现有 Architecture、当前代码/目录、Git、Completed Spec/Plan/Tasks、有效 Record 和必要 Converge 结果。
2. 忽略 Draft/Rejected Spec、失败且未采纳的 Prototype、未合并分支和聊天中的未来设计。
3. 第一轮只在回复中给出语义 diff Proposal：当前 Architecture SHA-256、事实来源、逐节 Add/Change/Keep、将删除的陈述、未确认项和预计最终 diff；此时 Git diff 必须为零。
4. 停止并请求用户确认。只有用户明确批准当前 Proposal 和文件 Hash 后，才进入第二轮；用户改内容、只说“继续”但未批准，或文件 Hash/Git 事实变化时重新提案。Bundle 完成或发现可能漂移本身都不是写入许可。
5. 第二轮只更新获批且受事实影响的章节，保留其他已验证内容；重要技术选择引用来源 Spec。Reviewer 或 Agent 自己不能替用户批准。
6. 文件使用固定 Front Matter：`schema: 1`、`kind: architecture`、`status: current`、`applies_to: main`、`updated`。
7. 正文固定为九节：系统目标、项目结构、当前模块、当前技术选择、关键运行流程、文件和运行产物位置、当前约束、技术债、设计来源。
8. 不自动扩散到 Spec/Plan/Tasks；未获批准时返回 Proposal 即完成本轮，不把未写文件误报为失败。

## `recover` 模式

1. 先运行 `docs check`，在源文档可解析时运行 `docs sync` 重建派生 Index；解析错误则保留现有 Index 并报告阻塞。
2. 列出孤立 Spec、Stale Plan/Tasks、无关联 Run、缺失/可能漂移的 Architecture 和旧路径 notices。
3. 根据当前代码、Git 和可信 Completed/Record 事实，在回复中给出完整九节 Architecture 草稿，并在标题前明确写 `Needs Human Review`。
4. 不创建或覆盖 `hello-scholar/architecture.md`，不把草稿藏进 `INDEX.md`，不生成额外仓库文件。
5. 用户审核草稿后，使用单独的 `architecture` 模式事务写正式文件；`recover` 自身不把“继续”理解为批准。

## 模板与语言

- 中英文模板字段、Front Matter 和九节结构一致；用户可读正文按仓库语言偏好选择。
- 模板只服务正式 `architecture` 写入和回复中的恢复草稿，不作为自动生成 Index 的输入。
- Skill 正文保持编排规则简洁，字段解释放在模板，不复制整份 PRD。

## 测试顺序

1. 读取 T083 的四份真实 Red 和当前获批 Proposal Hash；若任一为 `control-pass`、环境失败或 Hash 过期，停止并交用户裁决。
2. 实现中英文 Skill 和模板。
3. 测试每种模式的允许/禁止写入、正确 CLI、Architecture Proposal Hash/批准前零写入/批准后单文件写入、Front Matter/九节、Draft 排除、Spec 引用和 `Needs Human Review` 门。
4. 断言 Skill 不含 `docs migrate` 执行入口、手写 Index 指令或仓库内恢复报告路径。
5. 运行 `python3 -m unittest test/test_docs_maintenance_skill.py`、T008 CLI 测试和 `npm test`。

## 完成标准

- 四种模式的输入、读取范围、写入范围和停止条件都能脱离当前对话执行。
- Skill 复用确定性内核，没有创建第二套文档工具。
- Architecture 只描述当前实现，且任何正式语义写入都绑定用户批准的 Proposal/文件 Hash；恢复不会绕过人审门。
- 中英文 Skill 和模板合同一致。
