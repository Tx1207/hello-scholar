# hello-scholar

`hello-scholar` 是一个面向 Codex 的 CLI 运行时，用来按需安装研究、写作、开发、Obsidian 和 meta-builder 工作流。

## 环境要求

- Node.js 18+
- npm
- 如果你要把它装进 Codex，本机还需要可用的 Codex CLI

## 安装方式

如果 `hello-scholar` 已经发布到 npm：

```bash
npm install -g hello-scholar
```

如果你现在就是从这个仓库源码安装：

```bash
npm install
npm run build:catalog
npm install -g .
```

安装完成后，你就可以直接在终端里使用 `hello-scholar`：

```bash
hello-scholar --help
```

需要注意：

- 只执行 `npm install`，只是给当前仓库安装依赖，不会把 `hello-scholar` 注册成全局命令。
- 如果你希望在任意终端直接输入 `hello-scholar`，要用 `npm install -g hello-scholar`，或者在当前源码仓库里执行 `npm install -g .`。

## 快速开始

查看可选 bundle：

```bash
hello-scholar list bundles
```

把当前选择安装到当前项目，使用 `standby` 模式：

```bash
hello-scholar install codex --standby
```

把当前选择安装到全局 Codex 环境：

```bash
hello-scholar install codex --global
```

检查当前安装状态：

```bash
hello-scholar status
hello-scholar doctor
```

清理安装：

```bash
hello-scholar cleanup codex --standby
hello-scholar cleanup codex --global
```

## 工作方式

- `base` 模块是默认基础层，除非显式传入 `--no-base`
- `bundles` 是按功能分组的工作流集合，比如 `research-core`、`writing-core`、`dev-core`、`obsidian-core`、`meta-builder`
- `standby` 模式会把运行时写到当前项目的 `.hello-scholar/`
- `global` 模式会把 `hello-scholar` 安装成 Codex 本地插件链

## 运行时目录

项目模式：

- `.hello-scholar/modules.json`
- `.hello-scholar/install-state.json`
- `.hello-scholar/skills/`
- `.hello-scholar/agents/`

全局模式：

- `~/.codex/.hello-scholar/`
- `~/plugins/hello-scholar/`
- `~/.codex/plugins/cache/local-plugins/hello-scholar/local/`
- `~/.codex/AGENTS.md`
- `~/.codex/config.toml`

## 常用命令

```bash
hello-scholar list bundles
hello-scholar list skills
hello-scholar list agents

hello-scholar install codex --standby
hello-scholar install codex --global

hello-scholar status
hello-scholar doctor
hello-scholar cleanup codex
```

## 开发

```bash
npm test
```

测试覆盖 catalog 解析、选择状态持久化、`standby` 安装清理，以及全局插件安装流程。
