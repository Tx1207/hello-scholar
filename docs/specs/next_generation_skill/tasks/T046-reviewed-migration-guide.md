# T046：编写“先映射、用户审核后迁移”的 v2 说明

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T008, T013, T019, T034, T049, T050
- Parallel: No。迁移说明必须以 docs CLI 和所有旧写入路径 owner 的最终行为为准，并在 Router/Public docs 接入前先存在。

## 目标

新增一份给 AI 和用户共同阅读的迁移说明及其专属静态测试。它不是命令、脚本或自动工作流：第一阶段只盘点旧文档并提交映射表，用户逐项审核；只有收到明确批准后，AI 才在第二阶段按批准内容复制、移动、合并或删除。Router 与公共文档的链接由后置 T043/T045 接入，本 Task 不同时修改它们。

## 为什么采用说明而不是命令

旧日期 Spec 可能是同一设计的多次修改，也可能是候选方案、独立能力或互相替代的设计。机械 `old path -> new path` 会制造重复 Spec、错误 Revision 和不可逆丢失。当前项目也没有可调用的额外迁移 API。

所以迁移说明承担的是判断合同和审核顺序，不新增系统复杂度。确定性 CLI 仍只负责 `docs check/docs sync`，语义映射由 AI 提议、用户决定、Git 保存历史。

## 与当前状态比较

| 当前状态 | 迁移说明提供的能力 |
|---|---|
| Skill 中曾直接写旧 `memory/`，没有统一迁移入口 | 新 Skill 已只写新路径；说明只处理存量文档 |
| 文档发现器能报告 legacy path，但不会移动 | AI 根据报告和正文生成可审核映射 |
| 用户可能一句“迁移”就触发批量改动 | 明确拆成 Mapping Review 和 Approved Migration 两个阶段 |
| Visual Companion 已从产品删除 | 旧 Visual 产物单独列为人工决定，不自动迁移或删除 |

## 文件边界

### Add

- `docs/migration/document-model-v2.md`
- `test/test_migration_guide.py`

### Must Not Add

- `src/migrate*.js`
- `scripts/migrate*`
- `hello-scholar docs migrate` 或任何 CLI 子命令
- 新旧路径双写配置、alias、shim 或迁移状态数据库

### Must Not Modify

- `src/`
- 任何 Skill
- `AGENTS.md`、`AGENTS-zh.md`、`README.md`、`test/test_shared_document_rules.py`
- 用户仓库中的旧文档或新 Bundle
- T050 已删除的 Visual Companion 文件

## 说明文件必须独立讲清的两阶段协议

### 阶段 A：Inventory 与 Mapping Proposal，只读

1. 确认项目根目录、适用项目规则和 Git 状态；建议用户先有可恢复提交/分支，但不能把“工作区不干净”静默当成删除许可。
2. 运行 `hello-scholar docs check` 收集 legacy notices，再只读扫描：
   - `hello-scholar/memory/specs/YYYY-MM-DD-*.md`
   - `hello-scholar/memory/plans/*.md`
   - `hello-scholar/memory/experiment-records/runs/<run-id>.md`
   - `hello-scholar/memory/handoffs/*.md`
   - 已存在的 `hello-scholar/memory/brainstorm/visual/` 产物。
3. 读取相关正文和 Git 历史，按“同一问题/Revision、同一问题的候选方案、独立设计、根本替代、无法判断”分组。不能只按文件名或日期一对一映射。
4. 只输出映射表，不写文件。表格前写 `Proposal ID`、源 Git commit/工作树状态和生成时间；表格内容发生任何修改都生成新的 Proposal ID，旧批准不能沿用。每一行至少包含：

   `Source Path(s) | Kind | Topic/Run | Proposed Target | Operation | Merge/Revision Decision | Evidence | Uncertainty | User Decision`

5. `Operation` 只能提议 `merge | copy | move | keep | delete-after-approved-copy | delete`；`delete` 只用于没有迁移目标且用户明确决定丢弃的存量产物。`User Decision` 初始都是 `pending`。
6. 列出需要用户回答的不确定项和预计删除项，随后停止。没有逐项或明确整表批准，不进入阶段 B。

### 阶段 B：Approved Migration，只执行批准映射

1. 复述获得批准的 Proposal ID、完整映射表和本轮允许操作；表格、源状态或目标冲突发生变化时停止并提交新 Proposal。未批准、被修改或仍 `pending` 的行保持只读。
2. 执行每类批准行前读取当前 owner，而不是在迁移说明里复制一份 Schema：Spec 分类、ID、Revision 和模板读取 `manage-specs`；Plan 结构和模板读取 `writing-plans`；细粒度 Tasks 读取 `generating-tasks`；Run 布局和记录时机读取 `record-experiment`；Handoff 路径、模板和脱敏读取 `handoff`。找不到当前 owner/模板、owner 与批准映射冲突或 Hash 已变化时停止对应行，不凭记忆补格式。
3. 按依赖顺序迁移：先 Spec 身份/Bundle，再生成或改写 draft Plan；Plan 经用户按当前内容批准后，才生成 pending-review Tasks；Tasks 再经用户批准后，才算这条旧 Plan 的结构迁移完成。随后处理 Record 和 Handoff，最后生成 Index。没有明确所属 Spec 的 Plan 保留原位并报告。
4. Mapping Proposal 的批准只授权表中精确的分类、目标和文件操作，不自动批准尚未生成的新 Spec 正文、Plan 或 Tasks。已有批准在内容和 Hash 未变化时可以充当 `manage-specs` 的分类/创建确认；新文档仍遵守各 owner 的 `draft -> accepted`、`draft -> approved` 和 `pending-review -> approved` 门。等待这些审核期间保留旧源，不能提前执行 `delete-after-approved-copy`。
5. 优先使用 Git 可追踪的 rename；需要语义合并时先 copy/写新目标并验证，旧源只有在对应行明确批准删除后才删除。
6. 不在新旧路径双写，不创建兼容 alias；迁移完成后的新写入只走 v2 Skill。
7. 运行 `hello-scholar docs check` 和 `docs sync`，检查 diff、引用、Revision、Stale、Run 结构和禁止说明文件。
8. 向用户返回“已执行/未执行/仍不确定/等待文档审核/验证/回滚点”，等待最终确认；不能自行把 Spec 标记 Accepted/Completed。

## 各类文档的映射规则

### 旧 Spec

- 同一问题的日期文件合并为同一稳定 Spec 的 Revision 历史；不要为每个日期建 Bundle。
- 同一问题的 A/B/C 方案放在一个 Spec 的“候选方案与决定”。
- 可以独立批准、实施、验证和回滚的能力才提议独立 Spec。
- 根本替代才提议 successor，并维护无环 `supersedes/superseded_by`。
- AI 无法从正文/Git 判断时使用 `keep`，不猜 ID 或删除。

### 旧 Plan

- 只有能明确关联到某个 Spec/Revision 时才提议进入该 Bundle 的 `plan.md`。
- 旧 Plan 内的细粒度任务需要按新职责拆到 `tasks.md`，但映射必须指出内容去向；不能静默丢失或把旧 Plan 原样冒充 Approved 新 Plan。
- 新状态和 Revision 需要人审，不能因文件存在自动写 `approved`。
- 新 Plan 尚未获批时，旧任务内容留在源文档或映射证据中；不得绕过 `generating-tasks` 的 Approved Plan 前置门提前落 `tasks.md`，也不得提前删除旧 Plan。

### 旧 Record

- 从 `.../runs/<run-id>.md` 提议到根目录 `runs/<run-id>/record.md`，Run ID 保持稳定。
- 原始输出/结果/日志/checkpoint 有明确路径时映射到该 Run 子目录或保留外部引用；不移动未知大文件。
- 旧状态不机械替换：根据真实生命周期提议新状态，把 invalid/negative 等语义保存在观察、结论和决定中。
- 一个 Run 不生成第二份说明，旧 Index 不迁移为真源，最终由 `docs sync` 重建。

### 旧 Handoff

- 提议到 `hello-scholar/handoffs/YYYY-MM-DD-<topic>-handoff.md`，保留内容、去重和脱敏；不进入 Spec/Run Index。

### Visual Companion 产物

- 不自动迁移，也不因产品代码已删除而自动删除用户产物。
- Mapping 表逐项或按目录提议 `keep`/`delete`，由用户在审核中决定；第一阶段绝不触碰。

## 回滚和安全

- 说明如何用迁移前 Git commit/branch 和逐批 diff 回滚；不建议把未经确认的源删除与大规模语义合并塞进同一不可恢复步骤。
- 明确敏感信息脱敏，Record/Handoff 迁移时不把 Token、密码或私有凭证复制到新文件。
- 任一 `docs check` error、目标冲突、内容覆盖或映射与现实不符时停止该行和依赖行，保留已验证的其他行状态。

## 后续接入边界

- T043 的 Maintenance 路由只放一个指向本说明的 context pointer 和“先 Proposal 后批准执行”硬门，不复制映射规则。
- T045 在 `AGENTS.md` / `AGENTS-zh.md` / README 增加同一入口和两阶段摘要，明确不存在 `docs migrate`。
- 本 Task 的专属测试只校验说明自身；公共链接由 T045 的测试拥有，避免当前 Task 对尚未修改的公共文件预期失败。

## 文档级验证

- 人工逐项检查说明包含两个阶段、映射表列、五类旧路径、五个当前 owner context pointer、Spec/Plan/Tasks 分段审核、Visual 人审、验证与回滚。
- `rg` 确认 `docs migrate` 只出现在“禁止/不存在该命令”的说明中，不能出现在可执行代码块或步骤命令里。
- 确认文件没有提供批量 Shell 脚本、伪 API 或“默认 yes”路径。
- 运行 `python3 -m unittest test/test_migration_guide.py`，确认说明文件自身的两阶段、Hash/Proposal、逐项批准、回滚和禁止自动化合同。
- 运行 `npm test`。

## 完成标准

- 一个新 Agent 只读本说明，就会先给映射并停下来等用户；获批后会按 context pointer 读取当前 owner 和模板，而不是凭说明中的过期副本开始移动文件。
- 用户可以逐项修改、批准或拒绝映射，第二阶段只执行批准范围。
- 本 Task只拥有详细迁移合同；Router/公共文档后续只增加简短入口，迁移细节不重复维护。
- 本 Task 只增加/接入说明，没有实际迁移任何用户数据。
