审查建议（仅基于允许证据）：

- 非允许路径读取：无。
- `result`: `fail`
- `failureKind`: `skill-behavior`

硬门：
- 不通过：`tasks.md` 缺少必需元数据 `revision: 1`、`approval: pending-review`、`approved_revision: null`，且 `status: proposed` 不符合要求。`commands.md` 记录 `docs check` 退出 1 并明确报出这些错误。
- 不通过：每个任务未使用要求的 `Spec Coverage`、`Depends On`、`Parallel`、`Files`、`Work`、`Validation`、`Completion` 段落。文件改用 `Acceptance criteria`、`Prerequisites`、`Exact files`、`Required implementation`、`Commands and expected signals` 等标题；违反协议的精确文档契约。`tasks.md`
- 通过：迁移准备、双读证明、转换、切换门、精确清理、回归和回滚均独立成 T1-T7，串行依赖与失败恢复明确。`tasks.md`
- 通过：未实施迁移或修改禁区；树证据仅有未跟踪 `tasks.md`。`tree.md`
- 通过（无反证）：保存的投影限定了读取边界，互动和树证据未显示读取 Task Packet、生产 Skill 或其他 Eval 证据。`prompt-round-0.md`、`interaction.md`

业务评分：
- `task-document-contract`: `0`。元数据和每任务必需段落均不符合。`tasks.md`、`commands.md`
- `migration-and-cutover-sequence`: `100`。T1-T4 保留双读、转换顺序、三项切换失败测试和 dual-read 恢复。`tasks.md`
- `cleanup-regression-and-rollback`: `100`。T5 点名 `writeLegacyConfig`、flag、codec 路径和先决证据；T6/T7 定义矩阵与临时工作树回滚。`tasks.md`
- `scope-and-parallel-discipline`: `100`。T1-T7 串行，且 Base-to-final 显示仅允许的新增 Tasks 文件。`tasks.md`、`tree.md`

共享用户价值评分：
- `value-visibility`: `90`。回复先说明已生成的可审查任务和覆盖范围。`interaction.md`
- `audience-fit`: `100`。中文回复保留必要技术名，贴合请求。`interaction.md`
- `information-design`: `90`。回复简洁可扫描，但遗漏文档校验失败。`interaction.md`、`commands.md`
- `actionability`: `90`。明确“等待审核，不开始迁移”，但未披露阻止审核的 `docs check` 失败。`interaction.md`、`commands.md`
- `signal-to-noise`: `100`。无无关叙述。`interaction.md`

协议命令：
- `npm test`: 通过，退出 `0`，5/5。`commands.md`
- `node ... docs check`: 不通过，退出 `1`，5 个 Tasks 元数据错误。`commands.md`
- Base-to-final 证据：完整。包含 committed、index、working-tree、untracked 与 final hashes；最终唯一变更为未跟踪 `tasks.md`。`tree.md`

总结：任务内容的迁移序列和边界设计完整，但生成的 `tasks.md` 不满足 required metadata/section contract，且正式 `docs check` 失败，因此建议判定为 skill-behavior fail。
