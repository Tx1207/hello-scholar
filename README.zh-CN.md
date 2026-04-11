# ScholarAGENTS

`ScholarAGENTS` 是这个仓库面向 Codex 的运行时。迁移期间，仓库内容仍可保留在 `claude-scholar` 目录下，但对外 CLI、bootstrap、配置和文档统一使用 `scholaragents` 名称。

## 当前能力

- `base` 层：多个工作流共用的底层能力
- `bundle` 层：按功能分类的按需安装包，不再一次性全装
- `standby` 模式：把选中的模块写入当前项目的 `.scholaragents/`，并把 ScholarAGENTS 受管块写入当前项目 `AGENTS.md`
- `global` 模式：按 Codex 本地插件链路安装，并同步到插件缓存
- 项目激活文件：`.scholaragents/modules.json`

## 运行时载体

- 运行时提示词现在直接以仓库内 `AGENTS.md` 作为源模板渲染
- 与 bundle 相关的章节会在安装时依据 `.scholaragents/modules.json` 动态生成
- 项目级模块激活由 `.scholaragents/modules.json` 控制
- `base` 作为共享基础设施保留，`bundle` 仍然是显式选择，且不会重复包含 base 依赖枢纽

## 默认 Base

以下 base 是多个 bundle 的依赖枢纽，所以默认安装：

- `planning-with-files`
- `daily-coding`
- `bug-detective`
- `verification-loop`
- `git-workflow`
- `codex-hook-emulation`
- `session-wrap-up`

`obsidian-project-memory`、`plugin-structure`、`skill-development`、`skill-quality-reviewer` 已移回各自 bundle，不再作为 base 默认安装。

## Bundle 分类

- `research-core`：研究启动、实验分析、文献检索
- `writing-core`：论文写作、引文校验、rebuttal、录用后内容
- `dev-core`：代码审查、架构、构建修复、Git 辅助
- `obsidian-core`：完整 Obsidian 项目记忆与文献工作流，包含 `obsidian-project-memory`
- `meta-builder`：skill / command / agent / plugin 自扩展能力，包含 `plugin-structure`、`skill-development`、`skill-quality-reviewer`
- `ui-content`：UI 生成、评审与浏览器测试

## 快速开始

```bash
npm install
node scripts/build-catalog.mjs
node cli.mjs list bundles
node cli.mjs install codex --standby
```

在交互终端中运行 `list bundles|skills|agents`，会直接进入选择界面。

按当前已保存选择安装 standby：

```bash
node cli.mjs install codex --standby
```

按当前已保存选择安装 global：

```bash
node cli.mjs install codex --global
```

查看或清理状态：

```bash
node cli.mjs status
node cli.mjs doctor
node cli.mjs cleanup codex
```

## Global 模式落盘位置

`install codex --global` 现在会建立完整的 Codex 本地插件链路：

- `~/plugins/scholaragents/`
- `~/.agents/plugins/marketplace.json`
- `~/.codex/plugins/cache/local-plugins/scholaragents/local/`
- `~/.codex/AGENTS.md` 中的受管 bootstrap 块
- `~/.codex/config.toml` 中的受管插件 / agent 配置块

## 开发验证

```bash
npm test
```

测试会覆盖 catalog 依赖解析、standby 安装/激活/清理，以及 global 插件安装链路。
