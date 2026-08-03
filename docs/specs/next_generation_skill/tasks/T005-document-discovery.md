# T005：实现文档发现与扫描边界

- Status: `completed`
- PR: `PR 1 - 文档解析、校验和 Index`
- Depends On: T004
- Parallel: No。T006 使用本 Task 的结构化输出。

## 目标

从一个项目根目录中确定性地找到下一代五类文档，同时把旧 `hello-scholar/memory/` 和错误 `hello-scholar/runs/` 作为待报告路径暴露给校验层。运行产物目录不得被当作文档树递归扫描。

## 事实源

- 执行 plan 第 9.1 节 `document-discovery.js`。
- 最终目标结构：`hello-scholar/architecture.md`、`hello-scholar/specs/**`、根目录 `runs/**`。
- `src/project-root.js`：项目根目录解析方式。
- T004 的 `parseFrontMatter` 合同。

## 文件边界

### Add

- `src/document-discovery.js`
- `test/test_document_discovery.js`

### Must Not Modify

- `src/project-root.js`
- `src/skill-discovery.js`
- `src/install.js`
- 任何 Skill

## 公开合同

CommonJS 导出 `discoverDocuments(projectRoot)`。返回对象至少包含：

- `documents`：按 POSIX 相对路径升序的文档数组；每项包含 `kind`、`absolutePath`、`relativePath`、`attributes` 和 `body`。
- `legacyPaths`：`hello-scholar/memory/` 下发现的旧核心文档相对路径，只报告，不解析、不移动。
- `misplacedPaths`：例如 `hello-scholar/runs/**/record.md` 或不在 Spec Bundle 中的 `plan.md` / `tasks.md`。
- `forbiddenRunDocuments`：每个 Run 目录中的 `run.json`、`README.md`、`report.md`、`summary.md`、`final-report.md`。
- `unsafePaths`：文档根、Bundle、Run、核心文档或生成 Index 路径上的 symlink/junction、越出项目根目录的真实路径，以及其他不能作为普通项目文件安全读取的节点。每项包含相对路径和原因，交给 T006 形成 error。

## 扫描规则

1. 只把以下目标解析为核心文档：`hello-scholar/architecture.md`、`hello-scholar/specs/*/SPEC-*/spec.md`、同 Bundle 的 `plan.md` / `tasks.md`、`runs/*/record.md`。
2. 为了让 T006 报告路径错误，可以发现更深层的 `record.md` 和散落 `plan.md` / `tasks.md`，但必须标记为 misplaced，不得悄悄当成合法文档。
3. 遍历 `runs/` 时必须剪枝 `outputs/`、`results/`、`logs/`、`checkpoints/`，其中再多 Markdown/JSON 也不进入核心文档集。
4. 缺少 `hello-scholar/`、`specs/` 或 `runs/` 是合法空状态，返回空数组，不在安装时或发现时创建目录。
5. 核心文档、三类 Index 及其从项目根到目标的父目录（包括 `hello-scholar/`、`specs/`、Topic、Bundle、`runs/` 和 Run 目录本身）都必须是普通目录/文件，不跟随 symlink 或 junction。即使链接最终仍落在项目内，也进入 `unsafePaths`，避免扫描和写入使用不同真实目标；发现器不得读取链接目标正文。
6. 上一条不要求递归检查已经明确剪枝的 Run 产物目录。`outputs/`、`results/`、`logs/`、`checkpoints/` 节点可以是指向外部大盘的 symlink/junction，因为它们既不是核心文档父路径，也不会被 docs CLI 读取或写入；发现器只在 Run 目录列举名称后立即剪枝，不跟随、不解析目标。把整个 `runs/` 或单个 Run 目录做成链接仍必须拒绝。
7. 每个候选路径都先做词法边界检查，再用 `lstat` 逐段检查父目录。权限、循环链接、损坏链接和节点类型错误必须带 POSIX 相对路径报告，不能静默跳过或泄露临时绝对路径。
8. `INDEX.md` 只作为派生文件状态被发现，不进入 `documents`，也不从表格反向构造事实。其 marker/内容所有权由 T007/T008 校验。
9. `kind` 来自 Front Matter，但发现器不根据 `kind` 修正路径；路径与 `kind` 不一致留给 T006 报错。

## 测试要求

- 用 `TemporaryDirectory` 创建合法 Bundle、根目录 Run、Architecture、旧 memory 文档、错位 Run 和产物目录内伪 `record.md`。
- 断言合法文档只出现一次，结果排序稳定，产物目录被剪枝，旧路径只进入 `legacyPaths`。
- 构造父目录 symlink、核心文件 symlink、悬空链接和指向项目外的链接，断言不读取目标、全部进入 `unsafePaths`，项目外内容 bytes 不变；另构造四类已剪枝产物目录的外部链接，断言不跟随但也不误报，整个 `runs/` 或 Run 目录链接仍报错。
- 断言空项目不创建任何目录。
- 先运行 `node --test test/test_document_discovery.js` 观察 Red，再实现到通过；最后运行 `npm test`。

## 完成标准

- 发现结果完全由项目文件决定，排序稳定。
- 旧文档可被报告但不被自动迁移，运行产物不被误当文档。
- 扫描不会穿过链接边界，后续 `docs sync` 不可能借发现结果写到项目外。
- 本 Task 不做字段、引用、Stale 或完成度校验。
