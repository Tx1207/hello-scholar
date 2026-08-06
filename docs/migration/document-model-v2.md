# Document Model v2 迁移说明

当用户要求将现有项目文档迁移到 v2 文档模型时使用本说明。它定义的是带用户审核门的流程，不新增命令、脚本或自动工作流。当前版本不存在 `docs migrate`。

新工作使用当前 owner 和路径。现有文档在用户批准特定 Mapping Proposal 行之前保持原位。不创建新旧路径 alias，不双写，不建立迁移数据库或自动搬运工具。

## v2 Canonical 目录结构与迁移目标

一个项目通常按以下结构组织：

```text
<project-root>/
├── AGENTS.md
├── CLAUDE.md
│
├── hello-scholar/
│   ├── architecture.md
│   ├── handoffs/
│   │   └── YYYY-MM-DD-<topic>-handoff.md
│   └── specs/
│       ├── INDEX.md
│       └── <topic>/
│           └── SPEC-001-<design-name>/
│               ├── spec.md
│               ├── plan.md
│               └── tasks.md
│
└── runs/
    ├── INDEX.md
    └── <run-id>/
        ├── record.md
        ├── outputs/
        ├── results/
        ├── logs/
        └── checkpoints/
```

Mapping Proposal 的 `Proposed Target` 必须相对于 `<project-root>` 填写，并落在上述 canonical path 中。`hello-scholar/memory/...` 只保存 legacy source，不能作为 v2 迁移目标；在该目录内把文件改名为 `record.md` 不会改变其 legacy 身份。

按当前 owner 确认的身份选择目标：

- Spec 使用 `hello-scholar/specs/<topic>/SPEC-<nnn>-<design-name>/spec.md`；关联的 Plan 和 Tasks 分别位于同一 Bundle 的 `plan.md` 和 `tasks.md`。
- Record 使用项目根目录的 `runs/<run-id>/record.md`，而不是 `hello-scholar/memory/experiment-records/runs/<run-id>/record.md`。
- Handoff 使用 `hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md`。
- Visual Companion 产物不自动分配 v2 目标，仍按获批 Proposal 的 `keep` 或 `delete` 处理。

该目录结构只约束获批行的目标路径，不替代 Mapping Proposal、用户批准或当前 owner 的身份判断。

## 范围与安全边界

本说明只处理可能位于以下位置的既有文档：

- `hello-scholar/memory/specs/YYYY-MM-DD-*.md`
- `hello-scholar/memory/plans/*.md`
- `hello-scholar/memory/experiment-records/runs/<run-id>.md`
- `hello-scholar/memory/handoffs/*.md`
- `hello-scholar/memory/brainstorm/visual/`

路径本身不能证明文档身份、Revision 关系、owner 或删除安全性。不得按日期或文件名猜测一对一目标。

建议在可行时保留可恢复提交或分支，但工作区不干净不是覆盖或删除源材料的许可。敏感信息脱敏：不得将 Token、密码或私有凭证复制到新 Record 或 Handoff。

## 阶段 A：Inventory 与 Mapping Proposal，只读

1. 确认项目根目录、适用项目规则和当前 Git 状态。
2. 运行：

   ```sh
   node <hello-scholar-repo>/bin/hello-scholar.js docs check
   ```

   将 legacy notices 作为输入，再只读检查列出的旧路径、相关文档正文和必要的 Git 历史。
3. 按证据而非文件名分组：同一问题的 Revision、同一问题的候选方案、可独立批准的能力、根本替代，或无法判断的分类。
4. 只生成一个 Mapping Proposal。表格前写 `Proposal ID`、源 Git commit/工作树状态和生成时间。表格发生任何语义修改都生成新的 Proposal ID，旧批准不能沿用。
5. 使用下表；每一行的 `User Decision` 初始为 `pending`：

   | Source Path(s) | Kind | Topic/Run | Proposed Target | Operation | Lifecycle / Status Mapping | Merge/Revision Decision | Evidence | Uncertainty | User Decision |
   |---|---|---|---|---|---|---|---|---|---|

   `Operation` 只能提议 `merge`、`copy`、`move`、`keep`、`delete-after-approved-copy` 或 `delete`。`delete` 只用于没有迁移目标且用户明确决定丢弃的源材料。Record 行必须填写 `Lifecycle / Status Mapping`：历史状态、结论和终止事件；提议的 v2 `status`；`started` / `completed` 的证据；以及在目标正文中保留原始语义的位置。该映射是获批的语义转换，不只是目标路径。
6. 在表后列出不确定分类、提议删除、目标冲突和待回答问题。本阶段只输出映射表，不写文件。没有逐项或明确整表批准，不进入阶段 B。

### 分类准则

- **旧 Spec：** 同一问题的日期文件通常提议合并为同一稳定 Spec 的 Revision 历史；同一问题的 A/B/C 方案放入该 Spec 的候选方案与决定。只有能独立批准、实施、验证和回滚的能力才提议独立 Spec；只有根本替代才提议 successor。证据不足时使用 `keep` 并请用户判断。
- **旧 Plan：** 只有能明确关联到某个 Spec/Revision 时，才提议写入其 Bundle `plan.md`。映射表必须说明细粒度任务内容的去向；旧 Plan 的存在不等于新的 Approved Plan。
- **旧 Record：** 迁移到 `runs/<run-id>/record.md` 时保持已知 Run ID。Proposal 必须将历史生命周期映射到当前 owner 的合法 `status`，不能因旧状态名不在当前 enum 中自动保留源文件。根据历史事件的语义而不是标签名选择：有完整可用或有效负面证据的 Run 映射为 `completed`；运行故障导致没有可用证据的 Run 映射为 `failed`；运行被外力或未完成工作中断的 Run 映射为 `interrupted`；因用户、目标或范围决定主动停止的 Run 映射为 `cancelled`。历史 `abandoned`、`invalid`、`superseded` 或其他旧标签必须保留为原始事实，写入目标的 Execution Events、Observations 或 Conclusion，并说明映射理由；它们不能直接成为 v2 `status`。从历史事件提取真实的 `started` / `completed`；不得以文件创建时间、迁移时间或推测值补造 terminal 时间。只有缺少开始、结束或终止原因等必要证据，致使合法映射会猜测或篡改历史语义时，才提议 `keep` 并请求用户决定。只对已知 outputs、logs、results、checkpoints 提议 Run 子目录或外部引用；不移动未知的大型产物。
- **旧 Handoff：** 提议路径为 `hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md`；保留有用内容、去重并继续脱敏。
- **Visual Companion 产物：** 不自动迁移，也不因产品代码已删除而自动删除用户产物。按行或目录提议 `keep` 或 `delete`，等待用户决定。

## 阶段 B：Approved Migration，只执行批准映射

开始写入前，复述获批 Proposal ID、完整映射表和本轮允许操作。将当前源状态和目标与获批表核对。未批准、被修改或仍 `pending` 的行保持只读；不自动移动、合并或删除。表、源状态或目标冲突变化时，提交新 Proposal。

每一行都读取当前 owner 和模板，而不是从本说明复制 Schema：

- `manage-specs` 负责 Spec 分类、身份、Revision、successor 关系和模板。
- `writing-plans` 负责同 Bundle Plan 结构和模板。
- `generating-tasks` 负责独立可执行的 Tasks。
- `record-experiment` 负责 Run 布局和记录时机。
- `handoff` 负责 Handoff 路径、模板和脱敏行为。

找不到当前 owner/模板、Hash 已变化，或 Proposal 未批准必要的身份、路径或生命周期映射时停止对应行。旧状态名不在当前 owner enum 中本身不是 owner 冲突：先按历史事件提出当前合法状态，再由用户批准 `Lifecycle / Status Mapping`；获批后用当前模板写入，并保留原始状态与结论。只有必要证据不足、目标路径已冲突，或映射会篡改历史语义时才停止。不得根据记忆猜测替代格式。

### 按依赖顺序执行已批准行

1. 先 Spec 身份/Bundle，再生成或改写 draft Plan：通过 `manage-specs` 建立或修订获批的 Spec 后，只通过 `writing-plans` 生成或修订 draft Plan。
2. Plan 经用户按当前内容批准后，才生成 pending-review Tasks：通过 `generating-tasks` 生成，随后仍等待用户批准。
3. 旧 Plan 存在不等于迁移后 Plan 已获批准。继续遵守每份当前文档的门：`draft -> accepted`、`draft -> approved` 和 `pending-review -> approved`。
4. 随后处理 Record 和 Handoff，最后生成 Index。没有明确所属 Spec 的 Plan 保持源路径并报告。
5. 获批操作是直接 `move` 时优先使用可由 Git 追踪的 rename。语义 `merge` 先写入并验证目标；源文件保留到精确行批准 `delete-after-approved-copy` 或 `delete`。
6. 不在新旧路径双写，不创建兼容 alias，不在获批行之外自动移动、合并或删除。

Mapping Proposal 的批准只授权行中精确的分类、目标和操作，不自动批准新的 Spec 正文、Plan 或 Tasks。只有内容与 Hash 未变化时，已有批准才能作为当前 owner 的分类或创建确认。

### Canonical path 验收

每个获批行只有同时满足以下条件，才能报告迁移完成：

- 目标位于当前 owner 声明的 canonical path，且能被当前 `document-discovery` 发现为 v2 文档；
- 源路径处理与获批 Operation 一致；
- Record 的 v2 `status`、时间戳和正文中的历史状态说明均符合获批 `Lifecycle / Status Mapping`；
- 该行预期消除的 `legacy-path` notice 已消失，或保留该 notice 的原因已在 Proposal 中明确获批。

对于 Run Record，唯一合法目标是 `runs/<run-id>/record.md`。仅在 `hello-scholar/memory/...` 下创建或重命名 `record.md` 不算迁移完成。

### 验证、报告与回滚

已批准写入后运行：

```sh
node <hello-scholar-repo>/bin/hello-scholar.js docs check
node <hello-scholar-repo>/bin/hello-scholar.js docs sync
node <hello-scholar-repo>/bin/hello-scholar.js docs check
```

检查 diff、引用、Revision、Stale notices、Run 结构、canonical path 和预期的 `legacy-path` notices。`docs check` 没有 errors 不能单独证明迁移完成，因为旧路径可能只产生 notices。`docs check` 出错、canonical path 验收失败、目标将被覆盖或已批准映射不再符合现实时，停止该行和所有依赖行；保留其他已独立验证行的状态。

向用户分别报告已执行、未执行、仍不确定、等待文档审核的行，并提供验证结果和恢复点。回滚使用迁移前 Git commit 或 branch 与逐批 diff；不将未经确认的源删除与大范围不可逆语义合并放在同一步。

## 当前模型约束

- `runs/<run-id>/record.md` 是一个 Run 唯一的说明性 Record；旧 Index 不迁移为事实源，由 `docs sync` 重建生成 Index。
- Handoff 不进入 Spec 或 Run Index。
- 本说明只指导已审核迁移，不添加 CLI command、script、API、自动迁移服务、shim 或 dual-write configuration。
- Router 和公共文档可在其各自任务完成后链接本说明，但不得复制这份详细映射合同。
