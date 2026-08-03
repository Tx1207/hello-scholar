# T006：实现文档合同、引用、Stale 和完成度校验

- Status: `completed`
- PR: `PR 1 - 文档解析、校验和 Index`
- Depends On: T004, T005
- Parallel: No。T007 和 T008 使用本 Task 的 diagnostics 和派生状态。

## 目标

将发现到的 Spec、Plan、Tasks、Record 和 Architecture 转换为一个经过语义校验的文档图，并统一计算 `Missing` / `Current` / `Stale` 和 Tasks 完成度。校验只报告，不改写用户文档。

## 事实源

- 执行 plan 第 5.4、6、7 和 9.1 节。
- PRD `FR-PLAN-004`、`FR-TASK-005`、`FR-TASK-006`、`FR-INDEX-*` 和第 15.4 节。
- T004/T005 的输出合同。

## 文件边界

### Add

- `src/document-validation.js`
- `test/test_document_validation.js`

### Must Not Modify

- `src/frontmatter.js`
- `src/document-discovery.js`
- `src/cli.js`
- 任何 Index 文件或 Skill

## 公开合同

CommonJS 导出 `validateDocumentSet(discoveryResult)`，返回：

- `errors`：会阻止 Index 同步的结构/引用错误；每项有 `code`、`path`、`message`。
- `notices`：合法但需显示的 `Missing`、`Stale`、旧路径和 Architecture 漂移线索；不阻止 Index 生成。
- `specs`、`records`、`architecture`：供 Index 生成使用的结构化对象。
- 每个 Spec 对象的 `planState`、`tasksState` 为 `Missing | Current | Stale`，`completion` 为 `{ completed, total, percent } | null`。

## 固定字段与类型

实施者不得只校验示例中的几个字段。五类文档的 Front Matter 最小合同如下；所有必填字符串都必须非空，`revision`、`spec_revision` 和 `plan_revision` 在非 `null` 时必须是正整数。

| kind | 必填字段 | 固定枚举或类型 |
|---|---|---|
| `spec` | `schema`, `kind`, `id`, `title`, `topic`, `type`, `status`, `revision`, `summary`, `created`, `updated`, `supersedes`, `superseded_by` | `type`: `research \| prototype \| capability \| system-design`；`status`: `draft \| accepted \| completed \| rejected \| withdrawn \| superseded`；`supersedes` 为字符串数组，`superseded_by` 为 Spec ID 或 `null` |
| `plan` | `schema`, `kind`, `spec`, `spec_revision`, `revision`, `status`, `title`, `summary`, `created`, `updated` | `status`: `draft \| approved \| completed \| cancelled` |
| `tasks` | `schema`, `kind`, `spec`, `spec_revision`, `plan_revision`, `revision`, `approval`, `approved_revision`, `status`, `created`, `updated` | `revision` 为正整数；`approval`: `pending-review \| approved`；`approved_revision` 为正整数或 `null`；`status`: `pending \| in-progress \| completed \| cancelled` |
| `record` | `schema`, `kind`, `run_id`, `title`, `status`, `spec`, `spec_revision`, `plan_revision`, `started`, `completed`, `decision`, `summary` | `status`: `planned \| running \| completed \| failed \| interrupted \| cancelled`；三项 Spec/Plan 关联必须全部为合法值或全部为 `null` |
| `architecture` | `schema`, `kind`, `status`, `applies_to`, `updated` | `status` 只能为 `current`；`applies_to` 为非空字符串 |

所有文档的 `schema` 必须是整数 `1`，`kind` 必须与实际类型相同。`created` / `updated` 使用 `YYYY-MM-DD`；Record 的非空 `started` / `completed` 使用带时区的 ISO 8601 时间。`planned` 允许两者为 `null`，`running` 要求 `started` 非空且 `completed: null`，四个终态要求两者非空且结束时间不早于开始时间。`decision` 是非空字符串而不是第一版固定枚举，尚无结论时使用 `pending`。

## 语义校验

1. 五类文档都要求 `schema: 1` 和正确 `kind`。路径所属类型与 `kind` 不一致是 error。
2. 按上表校验每类文档的完整字段、类型、日期和枚举；未知额外字段第一版保留但不参与派生状态，不能覆盖固定字段语义。Spec `id` 全局唯一，匹配 `SPEC-[0-9]{3,}`；三位是最小宽度，`SPEC-1000` 合法。`topic` 为小写 kebab-case，与目录一致；Bundle 目录以同一完整 Spec ID 开头。
3. Plan 必须与 Spec 同 Bundle，`spec` 引用该 Spec，`spec_revision` 为正整数。等于当前 Spec Revision 时 `Current`，不等时 `Stale`，缺文件时 `Missing`。
4. Tasks 必须与 Spec/Plan 同 Bundle，同时引用 `spec_revision` 和 `plan_revision`。两者都匹配时 `Current`，任一不匹配时 `Stale`；Plan 缺失但 Tasks 存在是 error。
5. Tasks 的审批与执行状态分开校验：`approval: pending-review` 时 `approved_revision` 必须为 `null`，且 `status` 只能是 `pending`；`approval: approved` 时 `approved_revision` 必须等于当前 `revision`，之后才允许 `in-progress/completed`。`completed` 还要求文档为 Current、存在至少一个必需 Task 且全部顶层 Task 已勾选；`cancelled` 不伪装成完成。
6. Tasks 仅统计形如 `- [ ] T001：...`、`- [x] T001：...`、`- [ ] T001: ...` 或 `- [x] T001: ...` 的顶层任务复选框，ID 匹配 `T[0-9]{3,}`，不把子清单当作 Task。Task ID 在同一文件中必须唯一；百分比为整数，`total = 0` 时为 `0%`。结构化输出同时提供 `approvalState` 和执行 `status`，不能用一个字段替代另一个。
7. Spec `supersedes` 和 `superseded_by` 只能引用存在的 Spec，不能自引用、不能有环；显式双向关系不一致要报错。
8. Record 必须位于 `runs/<run-id>/record.md`，`run_id` 与目录一致，并满足上表的关联和生命周期时间合同。有关联时 Spec 必须存在；历史 Record 引用旧 Revision不视为 Stale error，但引用未来或不存在的 Revision 必须报错。
9. 每个 Run 只允许一份核心说明 `record.md`。T005 报告的第二说明文档、错位 `hello-scholar/runs/` 和散落 Plan/Tasks 都是 error。
10. Architecture 全项目最多一份，路径固定，`status` 必须为 `current`。缺失 Architecture 是 notice，不阻止零文档快速路径。
11. T005 的每个 `unsafePaths` 都转为 error；校验器不得尝试重新解析或跟随该节点。`legacyPaths` 转为 notice，不自动解析或迁移。

## 测试要求

- 为每种正确和错误状态写小型 Fixture，不只测一个完美 Bundle。
- 重点覆盖：五类文档各自缺字段/错类型、日期/时间和 Record 生命周期、重复 Spec ID、`SPEC-999`/`SPEC-1000`、Topic/目录不符、无效枚举、Plan Stale、Tasks 因 Spec 或 Plan 任一变化而 Stale、审批 Revision 不匹配、未批准却开始执行、假 completed、Missing、中英文冒号 Task、重复 Task ID、替代环、错位 Run、unsafe symlink、合法历史 Record Revision和不存在/未来 Revision。
- 断言 notice 不进入 `errors`，且校验过程不修改 Fixture bytes。
- 先运行 `node --test test/test_document_validation.js` 观察 Red，再实现到通过；最后运行 `npm test`。

## 完成标准

- 结构错误、可继续状态和派生展示被清楚分开。
- Plan/Tasks 状态和完成度只由当前文件计算，不回写 Front Matter。
- 校验器只读，不生成 Index，不修复文档。
