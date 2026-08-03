# T007：生成三类 Index 并保证批量更新安全

- Status: `completed`
- PR: `PR 1 - 文档解析、校验和 Index`
- Depends On: T006
- Parallel: No。T008 只负责把本 Task 接到 CLI。

## 目标

从 T006 的结构化结果确定性生成全局 Spec Index、Topic Index 和 Run Index。Index 是派生视图，不是第二份事实源；任一生成或写入失败时，旧 Index 不得留下一部分新、一部分旧的状态。

## 事实源

- 执行 plan 第 7 节的固定列、`Missing/Current/Stale`、完成度、排序和相对链接合同。
- PRD 第 9 节和 `FR-INDEX-*`。
- T006 的 `validateDocumentSet` 输出。
- `src/fs-ops.js`：当前同步文件操作集中位置。

## 文件边界

### Add

- `src/index-generator.js`
- `test/test_index_generator.js`

### Modify

- `src/fs-ops.js`：只增加 Index 批量写入需要的通用、小型原子文件替换帮助函数，不改安装/卸载语义。

### Must Not Modify

- `src/install.js`
- `src/cli.js`
- 任何用户源文档或 Skill

## 输出合同

1. `hello-scholar/specs/INDEX.md` 列固定为 `Topic | Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary`。
2. `hello-scholar/specs/<topic-id>/INDEX.md` 列固定为 `Spec | Type | Spec Status | Revision | Plan | Tasks | Completion | Summary | Relations`。
3. `runs/INDEX.md` 列固定为 `Run | Status | Spec | Spec Revision | Decision | Summary | Record`。
4. 每个文件第一行是 `<!-- GENERATED FILE — DO NOT EDIT MANUALLY. -->`，使用 LF，文件末尾一个换行。
5. `Plan` / `Tasks` 单元格显示 `Missing`、`Current` 或 `Stale`。文件存在时该文本链接到相对 `plan.md` / `tasks.md`；缺失时是普通 `Missing`。
6. `Completion` 为 `completed/total (percent%)`，缺失 Tasks 为 `-`。所有表格文本要转义 `|` 和换行，防止 Summary 破坏 Markdown 表格。
7. 所有 Spec、Plan、Tasks、Run/Record 链接都从当前 Index 所在目录计算 POSIX 相对路径，不出现绝对路径或 Windows `\` 分隔符。
8. 全局 Index 按 Topic 升序，再按 Spec ID 数字部分升序；Topic Index 按 Spec ID 数字部分升序；Run Index 按 `started` 降序，并用 `run_id` 降序打破平局。
9. 只在对应源目录已存在或已发现源文档时生成 Index；空项目不因 `docs sync` 被强制创建整套目录。
10. 已存在的目标只有在首行是精确 generated marker 且整条父路径通过 T005 的普通节点检查时才能替换。没有 marker、marker 损坏、目标是 symlink/junction 或父目录含链接时，返回具体 error 并保持所有 Index 不变；不能把用户手写 `INDEX.md` 当作可覆盖缓存。
11. 源集合消失后，对应 Topic/全局/Run Index 可能成为孤儿。只有目标首行仍是精确 generated marker、目标及整条父路径都是普通节点、并且本轮结构化发现能证明已无对应源目录/文档时，才把它列入删除集合。手写 Index、坏 marker、symlink/junction 或来源不确定时保留并报错，不能用“看起来像旧缓存”猜 ownership。

## 原子更新

1. `index-generator.js` 先在内存中生成全部目标 `{ path, content }`；T006 `errors` 非空时不准备写入。
2. `fs-ops.js` 将同目录、唯一命名且以 exclusive create 打开的临时文件写完并刷新后，再替换正式文件。临时名不使用可被 Index 发现器误读的正式名，也不能跟随已存在链接。
3. 替换或删除前把已存在的 generated Index 复制到同目录唯一备份并刷新；本轮新建、替换和孤儿删除属于同一个操作批次。任一可捕获错误发生时，按逆序恢复已替换/删除文件、删除本轮新建目标并清理临时/备份，再抛出带目标相对路径的错误。这里承诺的是单进程操作级 all-or-rollback，不虚构跨多个目录的文件系统事务或进程崩溃原子性。
4. 不备份、重写或删除任何 `spec.md`、`plan.md`、`tasks.md`、`record.md` 或 `architecture.md`。

## 测试要求

- 使用多 Topic、数字顺序不同的 Spec ID、Missing/Current/Stale、不同完成度和带 `|` Summary 的 Fixture 断言完整 bytes。
- 从全局、Topic 和 Run Index 三个不同位置断言相对链接。
- 连续生成两次并比较 bytes，证明结果确定。
- 注入解析错误、临时写入错误和中途替换错误，断言旧 Index 全部不变且没有残留临时/备份文件。
- 覆盖手写无 marker Index、marker 损坏、Index symlink、父目录 symlink 和并发临时名碰撞，断言拒绝覆盖且链接目标/用户文件 bytes 不变。
- 删除最后一个 Topic/Spec 或最后一个 Run 后，精确 generated 的孤儿 Index 被删除；注入中途删除/替换错误时全部恢复。相同位置的手写、坏 marker 或链接 Index 必须保留并让整批失败。
- 先运行 `node --test test/test_index_generator.js` 观察 Red，再实现到通过；最后运行 `npm test`。

## 完成标准

- 三个 Index 的列、状态、完成度、排序和链接与 plan 完全一致。
- 同一输入字节级稳定，源消失后的 generated 孤儿不会残留，任一错误不会导致部分 Index 更新或删除。
- `src/fs-ops.js` 的安装/卸载旧行为由原测试证明无回归。
