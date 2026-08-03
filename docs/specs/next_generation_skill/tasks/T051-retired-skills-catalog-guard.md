# T051：安全清理九个淘汰 Skill 的已安装副本

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T024, T025, T026, T027, T028, T029, T030, T031, T032
- Parallel: No。九个源目录删除后，才能验证悬空 link 和旧 copy 的升级清理；当前清单/共享 reference 由 T065 单独负责。

## 为什么要做

当前 `install()` / `uninstall()` 只遍历仓库仍能 discover 的 Skill。九个源目录删除后，旧版本用 copy 安装的目录和 link 模式留下的悬空链接将不再进入循环，目标项目仍会暴露已淘汰 Skill。

这项工作只清理能用本地证据证明由 hello-scholar 创建的精确 Skill target。它不扫描用户项目文档、不猜目录归属、不重新加入 retired discovery，也不处理 README/Router/catalog。

## 当前实现与目标行为比较

| 当前行为 | 本 Task 目标 |
|---|---|
| 只遍历当前 discover 的 Skill | 另有九项精确 retired `{name, sourceRelativePath}` 清理表，不参与 discovery |
| copy 只校验 marker 的 `tool` | 同时校验 target/marker/SKILL 节点类型、`mode: copy`、tool、精确 source 和 Skill name |
| link 用 `existsSync/realpath`，源删除后看不到 | 用 `lstat/readlink` 和词法绝对路径比较，即使旧源不存在也能证明 |
| 无目标也计 skipped | 只有真实存在但无法证明 ownership 才计 skipped |

## 已淘汰的精确清单

```text
executing-plans
subagent-driven-development
requesting-code-review
receiving-code-review
dispatching-parallel-agents
systematic-debugging
finishing-a-development-branch
verification-before-completion
writing-skills
```

实施时必须从 T024-T032 删除前的实际组路径建立一份常量，不允许用 glob、目录扫描或相似名称扩大范围。

## 文件边界

### Modify

- `src/install.js`
- `src/fs-ops.js`
- `src/cli.js`：只同步 install summary 中 retired `removed/skipped` 的显示。
- `test/test_cli_install.js`

### Add

- `test/test_retired_install_contract.py`

### Must Not Modify

- `src/skill-discovery.js`、`src/project-root.js`、`src/instruction-blocks.js`
- 任何 Skill、Router reference、AGENTS、README
- `docs/need_skills/`（T065 owner）
- 用户项目的 `hello-scholar/`、`runs/` 或源码
- package scripts、Skill Eval 场景

## Copy target 的 ownership 证明

只有以下条件全部满足才允许递归删除：

1. target 名称精确等于九项之一，`lstat` 是普通目录而不是 link/junction。
2. `.hello-scholar-install.json` 本身是目录内的普通文件；缺失、symlink、目录、损坏 JSON 都保留 target。
3. marker 的 `mode` 精确为 `copy`，`tool` 精确等于本次 `codex|claude`。
4. marker `source` 解析后的绝对词法路径精确等于当前 `repoRoot/<sourceRelativePath>`；错误 source、另一个 clone、只同 basename、`..` 路径伪装都不算 ownership。
5. target 内 `SKILL.md` 是普通文件，Front Matter `name` 精确等于 target name。缺失或不同名时保留，不能仅凭一份被复制进来的 marker 删除用户目录。

额外 marker 字段可以忽略，但不能替代以上条件。符合条件的 managed copy 即使内容后来不完整，仍按现有 uninstall 的 managed artifact 语义清理；无法证明时一律保留并计 `skipped`。

## Link/junction target 的 ownership 证明

1. 对精确 target 使用 `lstatSync`，不能用会把悬空链接当不存在的 `existsSync` 作为首个判断。
2. 只有 link/junction 节点才读 `readlinkSync`；相对 link 按 target 父目录解析，再做绝对词法规范化。
3. 解析结果必须精确等于 `repoRoot/<sourceRelativePath>`。不要求旧源实际存在，也不调用 `realpathSync`。
4. 指向另一个仓库、用户目录、当前保留 Skill、同名不同组或路径前缀相似的位置都保留并计 `skipped`。

## Install/uninstall 接线

1. `install()` 在安装当前 Skills 前清理 owned retired targets；`uninstall()` 在移除当前 Skills 时也运行同一 helper。helper 接收明确 `repoRoot/projectRoot/tool`，不读取全局环境猜路径。
2. install summary 增加明确 retired `removed` 计数；存在但未证明的 target 增加 `skipped`。完全没有旧 target 时不平白增加九个 skipped。uninstall 沿用 removed/skipped 语义。
3. 当前保留 Skill 的 link/copy 安装、重复安装确认门和失败回滚保持原行为。
4. 清理只到 `.agents/skills/<name>` 或 `.claude/skills/<name>`；Instruction block 与用户项目文件按原 owner 处理。
5. 绝对 `source` 指向另一个 checkout 或仓库已搬迁时证据不足，必须保留旧 target 并计 `skipped`。不要为提高自动清理率放宽到 basename、仓库名或 Skill name 推断；T045 在 README 明示这类残留需要用户核对后人工处理。

## 测试要求

在临时项目覆盖 Codex/Claude、install/uninstall：

1. 九个正确旧 link，其中至少一个源已不存在，全部可清理。
2. 九个正确 managed copy，marker 四项与 Skill name 完整匹配，全部可清理。
3. 无 marker、坏 JSON、marker symlink、marker directory、错误 mode、错误 tool、错误 source、另一个 clone source、路径前缀伪装、缺失/错名 SKILL、指向其他路径的 link，全部保留并准确计 skipped。
4. 同时预置 Architecture、Spec Bundle、Handoff、根目录 Run 和 unowned Skill，清理前后逐字节不变。
5. 先用失败测试证明当前代码漏掉 retired target，再实现；不能靠 expected failure/skip 等后续 Task 转绿。

## 验证

- `python3 -m unittest test/test_retired_install_contract.py`
- `node --test test/test_cli_install.js`
- 运行当前 Skill discovery/install 聚焦测试和 `npm test`。
- 人工核对所有删除目标都能追溯到精确 ownership 证据；任何保留目标没有被部分修改。

## 完成标准

- 重新安装或卸载会清理 hello-scholar 可证明拥有的九个 retired copy/link target，包括悬空旧 link。
- 仅 tool 相同、同名或 marker 存在都不足以触发删除；不确定目标保持原样。
- 当前 Skill 安装和用户文档保护无回归。
- 换 checkout 后的旧副本可能保留，这个保守限制在 README 可见，不伪装成全部自动清理。
- 本 Task 没有修改 catalog、Router、Skill 或产品文档。
