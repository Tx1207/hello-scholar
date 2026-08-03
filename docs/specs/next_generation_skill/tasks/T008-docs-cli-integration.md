# T008：接入 `hello-scholar docs check` 和 `docs sync`

- Status: `completed`
- PR: `PR 1 - 文档解析、校验和 Index`
- Depends On: T007
- Parallel: No。它是 PR 1 的对外收口。

## 目标

把 T004 至 T007 的内核接入现有 CommonJS CLI，新增只读 `docs check` 和确定性 `docs sync`。原有 `help`、`install`、`uninstall`、`link`、`copy` 参数、确认门和输出保持不变。

## 事实源

- `src/cli.js`、`bin/hello-scholar.js`、`src/project-root.js`、`test/test_cli_install.js`。
- T004 至 T007 导出合同。
- 执行 plan 第 9.2、9.3 节。

## 文件边界

### Add

- `src/docs.js`
- `test/test_cli_docs.js`

### Modify

- `src/cli.js`
- `package.json`

### Must Not Modify

- `bin/hello-scholar.js`，除非先用失败测试证明现有错误传递无法满足新命令；默认应复用现有 catch/exitCode。
- `src/install.js`、`src/project-root.js`、`src/instruction-blocks.js`、`src/skill-discovery.js`
- 任何 Skill

## `src/docs.js` 合同

1. 导出 `checkDocs({ projectRoot })`：调用发现和校验，并在内存渲染预期 Index 与现有 generated Index 比较，返回结构化 `{ errors, notices, counts, indexStates }`，全程不写文件。`indexStates` 只使用 `Missing | Current | Stale`，用户手写/无 marker/链接目标属于 error 而不是 Stale。
2. 导出 `syncDocs({ projectRoot })`：先完整发现/校验/渲染并计算可证明 ownership 的孤儿 generated Index，`errors` 非空时不写或删除任何 Index；否则调用 T007 原子批次，返回 `writtenPaths`、`deletedPaths` 和 notices。
3. `Missing`、`Stale`、旧路径是可读 notice，不被 `sync` 错当作解析失败；不输出虚假的“已同步 Plan/Tasks”。

## CLI 行为

1. `parseArgs(["docs", "check"])` 和 `parseArgs(["docs", "sync"])` 返回新命令结构。`docs`、`docs repair`、多余参数和与 `--mode` 混用仍返回 Usage error。
2. `usageText()` 只新增两行：`hello-scholar docs check` 和 `hello-scholar docs sync`，保留原有行与 Defaults。
3. 两个命令默认使用 `resolveProjectRoot()`，测试可通过 `options.projectRoot` 注入临时根目录。它们不触发重装确认。
4. `docs check` 输出稳定摘要与排序后 diagnostics。结构错误、不安全链接或无 owner 的目标 Index 使命令失败；只有 Missing/Stale/legacy notices 时命令成功但明确显示状态。
5. `docs sync` 分别输出写入和删除的 Index 数量/路径。全新空项目成功并报告两者均为 0，不创建空目录；从有源状态变为空时只删除满足 T007 ownership 合同的孤儿 generated Index。
6. 对用户显示的路径使用项目相对 POSIX 形式，不泄露不必要的临时绝对路径。

## Package Scripts

只在 `package.json` 增加：

```json
"docs:check": "node bin/hello-scholar.js docs check",
"docs:sync": "node bin/hello-scholar.js docs sync"
```

不增加 `eval:skill`，不改写现有 `test`、`test:js`、`test:py`。

## 测试要求

- 先在 `test/test_cli_docs.js` 写 parse/usage、空项目 check/sync、合法 Bundle、生成 Index 的 Missing/Current/Stale、结构错误不写 Index、无 marker Index/链接拒绝覆盖、generated 孤儿删除和原子失败恢复写入/删除的测试。
- 运行 `node --test test/test_cli_docs.js`、`node --test test/test_cli_install.js`。
- 直接在临时项目中执行 `node bin/hello-scholar.js docs check` 和 `docs sync`，核对退出码、stdout 和文件变化。
- 运行 `npm run docs:check -- --help` 不是合法合同，不必为此新增帮助参数。
- 最后运行 `npm test`。

## 完成标准

- 两个 docs 命令可从真实 CLI 入口使用，错误不会部分写 Index。
- 旧 CLI 的解析、确认、安装、卸载、link 和 copy 测试全部通过。
- 无新依赖，无 Live Codex 入口，无迁移命令。
