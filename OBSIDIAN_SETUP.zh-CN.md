# Obsidian 项目知识库配置指南

Claude Scholar 内置了 Obsidian 研究知识库工作流，不需要 MCP，也不需要 API key。

## 能做什么

Obsidian 在这里不是“文献库插件”，而是整个科研项目的默认知识库，可以统一沉淀：

- 稳定的项目背景与研究问题
- 论文笔记与文献综述
- 实验设计、runbook 与结果总结
- 每日研究日志、scratch note 与 sync queue
- 论文草稿、汇报、proposal、rebuttal 等写作资产
- 不适合继续留在主工作面的归档知识

## 依赖

### 必需
- 一个本地 Obsidian vault 路径
- 在环境变量里设置 `OBSIDIAN_VAULT_PATH`，或在 bootstrap 时显式传入

### 可选
- 安装并打开 Obsidian Desktop，便于跳转与查看
- 提供官方 `obsidian` CLI，用于 open/search/daily 等辅助动作
- 设置 `OBSIDIAN_VAULT_NAME`，便于生成更稳定的 `obsidian://` 链接和 CLI targeting

## 内置 skills

Claude Scholar 内置了官方 Obsidian 相关 skills 与项目级封装。

默认工作流最相关的是：

- `obsidian-project-memory`
- `obsidian-project-bootstrap`
- `obsidian-research-log`
- `obsidian-experiment-log`
- `obsidian-literature-workflow`
- `obsidian-project-lifecycle`
- `obsidian-markdown`
- `obsidian-cli`
- `defuddle`

仓库里可能仍保留一些可选的 graph-oriented 辅助 skills，但当前默认工作流**不依赖** `.base`、MCP 或任何 API 服务。默认会维护的图谱产物只有 `Maps/literature.canvas`；额外的 `.base` 视图或 project/experiment canvas 都需要显式触发。

## 默认行为

当 Claude Scholar 运行在一个包含 `.codex/project-memory/registry.yaml` 的仓库里时，应默认把这个仓库视为已经绑定到 Obsidian 项目知识库，并在任务过程中自动维护它。

如果仓库还没有绑定，但具备科研项目特征（如 `.git`、`README.md`、`docs/`、`notes/`、`plan/`、`results/`、`outputs/`、`src/`、`scripts/`），则应自动 bootstrap 一个项目知识库。

## Vault 中的项目结构

```text
Research/{project-slug}/
  00-Hub.md
  01-Plan.md
  Knowledge/
  Papers/
  Experiments/
  Results/
  Writing/
  Daily/
  Archive/
```

常见自动生成文件包括：

- `Knowledge/Source-Inventory.md`
- `Knowledge/Codebase-Overview.md`
- `Maps/literature.canvas`
- `.codex/project-memory/<project_id>.md`

## 仓库内 memory 绑定

每个科研仓库会在本地维护：

```text
.codex/project-memory/
  registry.yaml
  <project_id>.md
```

- `registry.yaml` 保存 repo ↔ vault 的绑定关系
- `<project_id>.md` 保存 assistant 用于增量同步的项目 memory

## 主要工作流

Codex 版不像 Claude Code 那样直接暴露 slash commands。对应能力仍然存在，但在 Codex 中应通过自然语言触发配套的 skills / agents：

- 初始化或导入项目知识库
- 将新的 Markdown 文件或目录按 classify -> promote / merge / stage-to-daily 入库
- 强制执行确定性的文件系统同步并刷新辅助 notes
- 修复或增强 canonical notes 之间的 wikilink
- 从项目笔记生成文献综述
- 规范化论文笔记并连接到项目上下文
- 对单个 canonical note 执行 archive / purge / rename
- detach / archive / purge / rebuild 一个项目知识库
- 显式生成可选的 `.base` 视图和额外 canvases

## 已绑定仓库的最小自动维护

当仓库已经通过 `.codex/project-memory/registry.yaml` 绑定后，Claude Scholar 默认应采用保守的自动维护策略：

- 当本轮对话改变研究状态时，至少检查 `Daily/YYYY-MM-DD.md`，
- 只有顶层项目状态真正变化时才更新 `00-Hub.md`，
- 只要项目状态变化就更新 `.codex/project-memory/<project_id>.md`，
- `Knowledge/`、`Experiments/`、`Results/`、`Writing/` 仍保持 agent-first，而不是每轮自动重写。

## 可选的 Obsidian CLI 安装

官方 Obsidian CLI 是内置在较新的桌面版安装器里的。要使用 `obsidian ...` 命令：

1. 使用支持 CLI 注册的 Obsidian Desktop 版本。
2. 在 Obsidian Desktop 中打开 `Settings -> General -> Advanced`。
3. 打开 **Command line interface**。
4. 在 macOS 上确保 `/Applications/Obsidian.app/Contents/MacOS` 已加入 `PATH`（例如写入 `~/.zprofile`）。
5. 重启终端后验证：

```bash
obsidian help
obsidian search query="diffusion" limit=5
```

如果提示 `Command line interface is not enabled`，通常说明 shell 路径已经配置好，但 Obsidian 应用内的开关还没打开。

## 生命周期操作

### Detach
- 停止自动同步
- 保留 vault 中的内容
- 保留项目 memory 文件

### Archive（默认）
- 将项目移动到 `Archive/`
- 禁止继续同步
- 保留项目 memory，后续可重新启用

### Purge
- 永久删除绑定、项目 memory、以及 vault 中对应项目目录
- 只有用户明确要求永久删除时才使用

## 可选 CLI / URI

Claude Scholar 可选利用官方 Obsidian CLI 与 URI：

- CLI 文档：<https://help.obsidian.md/cli>
- URI 文档：<https://help.obsidian.md/uri>

示例：

```bash
obsidian help
obsidian search query="diffusion" limit=10
obsidian daily:append content="- [ ] Follow up on experiment"
```

```text
obsidian://open?vault=My%20Vault&file=Research%2Fproject-slug%2F00-Hub
obsidian://search?vault=My%20Vault&query=%23experiment
```

## 常见问题

| 问题 | 解决方案 |
|------|----------|
| Bootstrap 提示缺少 vault path | 设置 `OBSIDIAN_VAULT_PATH`，或在 bootstrap 时显式传入 |
| 项目反复被重新导入 | 检查 `.codex/project-memory/registry.yaml` 是否存在且 repo_root 是否正确 |
| 还看到 `Views/`、`Concepts/`、`Datasets/` 被写成默认结构 | 这通常来自旧文档或旧项目生成版本；当前默认工作流使用的是上面的精简结构，默认图谱只保留 `Maps/literature.canvas` |
| CLI 命令不可用 | 先检查 `Settings -> General -> Advanced -> Command line interface` 是否已开启；否则继续使用 filesystem-only 同步即可 |
| “移除项目知识”太激进 | 优先使用 archive 或 detach；purge 仅用于永久删除 |

## Windows 使用方案

如果你在 WSL 里运行 Claude Scholar，但想用 **Windows 原生 Obsidian** 获得更稳定的窗口行为，推荐使用下面的双份方案：

- `WSL vault` 作为 **source of truth**：`<repo-root>/obsidian-vault`
- `Windows 本地目录` 作为镜像副本：例如 `<wsl-mounted-windows-vault-path>`
- Windows Obsidian 只打开 **Windows 本地镜像目录**

同步脚本：

```bash
bash scripts/sync_obsidian_to_windows.sh \
  --windows-path <wsl-mounted-windows-vault-path>
```

首次建议先预览：

```bash
bash scripts/sync_obsidian_to_windows.sh \
  --windows-path <wsl-mounted-windows-vault-path> \
  --dry-run
```

说明：

- 默认会把 WSL vault 同步到 Windows 镜像，并删除镜像里已经不存在于源目录的文件。
- 如果你不想自动删除镜像中的多余文件，可以追加 `--no-delete`。
- 这个方案的核心是：**我继续在 WSL 内维护 vault，你在 Windows 上稳定打开镜像副本。**
