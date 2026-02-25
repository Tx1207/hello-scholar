# Claude Scholar (Codex CLI 版)

<div align="center">
  <img src="LOGO.png" alt="Claude Scholar Logo" width="100%"/>

  <p>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/stargazers"><img src="https://img.shields.io/github/stars/Galaxy-Dawn/claude-scholar?style=flat-square&color=yellow" alt="Stars"/></a>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/network/members"><img src="https://img.shields.io/github/forks/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Forks"/></a>
    <img src="https://img.shields.io/github/last-commit/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Last Commit"/>
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/Codex_CLI-Compatible-blue?style=flat-square" alt="Codex CLI"/>
  </p>

  <strong>语言</strong>: <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a>
</div>

> 面向学术研究和软件开发的个人 [Codex CLI](https://github.com/openai/codex) 配置仓库 — 覆盖从构思到发表的完整研究生命周期。

> **注意**: 这是 Claude Scholar 的 **Codex CLI 版本**。Claude Code CLI 版本请查看 [`main` 分支](https://github.com/Galaxy-Dawn/claude-scholar/tree/main)。OpenCode 版本请查看 [`opencode` 分支](https://github.com/Galaxy-Dawn/claude-scholar/tree/opencode)。

## News

- **2026-02-25**: Codex CLI 迁移 — 从 OpenCode 迁移到 Codex CLI 格式：TOML 配置、独立 agent 目录、commands 合并入 skills（32→40）、hooks 替换为 AGENTS.md 指令 + sandbox、交互式 `setup.sh` 支持增量合并
- **2026-02-23**: 新增 `setup.sh` 安装脚本 — 安全合并到已有配置，自动备份

<details>
<summary>查看历史更新日志</summary>

- **2026-02-22**: 新增 Zotero MCP 服务器 — 开箱即用支持文献管理
- **2026-02-21**: OpenCode 迁移 — hooks→plugins (TypeScript)、agents→opencode.jsonc、CLAUDE.md→AGENTS.md
- **2026-02-15**: Zotero MCP 集成 — 新增 `/zotero-review` 和 `/zotero-notes` 命令
- **2026-02-11**: 大版本更新，新增 10 个 skills、7 个 agents、8 个研究工作流命令；涉及 89 个文件
- **2026-01-25**: 项目正式开源，v1.0.0 发布

</details>

## 简介

Claude Scholar (Codex 版) 是一个面向 [Codex CLI](https://github.com/openai/codex) 的配置系统，提供丰富的技能、代理和 MCP 集成，针对以下场景优化：
- **学术研究** - 完整的研究生命周期：想法生成 → 实验 → 结果分析 → 论文写作 → 审稿回复 → 会议准备
- **软件开发** - Git 工作流、代码审查、测试驱动开发、ML 项目架构
- **项目管理** - 规划文档、代码规范、通过 AGENTS.md 指令驱动的自动化工作流

## 快速导航

| 主题 | 说明 |
|------|------|
| [快速开始](#快速开始) | 快速上手指南 |
| [核心工作流](#核心工作流) | 论文写作、代码组织、技能进化 |
| [功能亮点](#功能亮点) | 技能、代理概览 |
| [安装指南](#安装选项) | 完整安装或手动安装 |
| [MCP 配置](#mcp-服务器配置可选) | Zotero MCP 文献管理集成 |
| [迁移说明](#与-opencode-版本的主要区别) | 从 OpenCode 版本的变化 |

## 核心工作流

### 主要工作流

完整的学术研究生命周期 - 从想法到发表的 7 个阶段。

#### 1. 研究构思（Zotero 集成）

**工具**: `research-ideation` skill + `literature-reviewer` agent + Zotero MCP

**流程**:
- **5W1H 头脑风暴**: What, Why, Who, When, Where, How → 结构化思维框架
- **文献搜索与导入**: WebSearch 搜索论文 → 提取 DOI → 通过 `add_items_by_doi` 自动导入 Zotero
- **PDF 与全文分析**: `find_and_attach_pdfs` 批量附加 PDF → `get_item_fulltext` 读取全文深度分析
- **Gap 分析**: 5 种类型（文献、方法论、应用、跨学科、时间）→ 识别 2-3 个研究机会
- **研究问题**: SMART 原则 → 制定具体、可衡量的问题

**触发**: "开始研究"、"文献综述"、"生成阅读笔记"

#### 2. ML 项目开发

**工具**: `architecture-design` skill + `code-reviewer` agent + `git-workflow` skill

**流程**:
- **结构**: Factory & Registry 模式 → 配置驱动模型（仅 `cfg` 参数）
- **代码风格**: 200-400 行文件 → 类型提示 → `@dataclass(frozen=True)` → 最多 3 层嵌套
- **调试** (`bug-detective`): Python/Bash/JS 错误模式匹配 → 堆栈跟踪分析
- **Git**: Conventional Commits → 分支策略（master/develop/feature）→ `--no-ff` 合并

**触发**: "创建计划"、"提交代码"、"审查代码"、"运行 TDD"

#### 3. 实验分析

**工具**: `results-analysis` skill + `data-analyst` agent

**触发**: "分析实验结果"

#### 4. 论文写作

**工具**: `ml-paper-writing` skill + `paper-miner` agent + `latex-conference-template-organizer` skill

**会议**: NeurIPS, ICML, ICLR, ACL, AAAI, COLM, Nature, Science, Cell, PNAS

#### 5. 论文自审

**工具**: `paper-self-review` skill — 6 项质量检查清单

#### 6. 投稿与 Rebuttal

**工具**: `review-response` skill + `rebuttal-writer` agent

**触发**: "写 rebuttal"

#### 7. 录用后处理

**工具**: `post-acceptance` skill

**触发**: "准备演讲"、"设计海报"、"推广论文"

**覆盖范围**: 90% 的学术研究生命周期（从想法到发表）

### 支撑工作流

#### 工作流自动化

在 Codex 版本中，自动化工作流通过以下方式实现：

- **AGENTS.md 指令**: 会话启动协议、技能评估指导和安全规则嵌入 `AGENTS.md` — Codex 自动读取
- **Sandbox 模式**: `sandbox_mode = "workspace-write"` 提供文件写入限制和网络隔离，替代 hook 安全守卫
- **session-wrap-up** (skill): 会话结束时手动触发，生成工作日志和清理提醒 — 替代自动会话摘要 hook

#### 知识提取工作流

- **paper-miner** (agent): 分析研究论文 → 提取写作模式、结构见解、会议要求
- **kaggle-miner** (agent): 研究 Kaggle 获胜方案 → 提取技术分析、代码模板

#### 技能进化系统

```
skill-development → skill-quality-reviewer → skill-improver
```

## 功能亮点

### 技能（40 个）

**研究工作流：**
- `research-ideation` - 研究构思启动：5W1H、文献综述、Gap 分析
- `results-analysis` - 实验分析：统计检验、可视化、消融实验
- `citation-verification` - 多层引文验证
- `daily-paper-generator` - 每日论文生成器

**写作与学术：**
- `ml-paper-writing` - 顶级会议/期刊论文写作指导
- `writing-anti-ai` - 去除 AI 写作痕迹（双语支持）
- `paper-self-review` - 6 项质量检查清单
- `review-response` - 系统化 rebuttal 写作
- `post-acceptance` - 会议准备：演讲、海报、推广
- `doc-coauthoring` - 文档协作工作流
- `latex-conference-template-organizer` - LaTeX 模板管理

**开发：**
- `daily-coding` - 日常编码检查清单
- `git-workflow` - Git 最佳实践
- `code-review-excellence` - 代码审查指南
- `bug-detective` - Python、Bash、JS/TS 调试
- `architecture-design` - ML 项目设计模式
- `verification-loop` - 测试和验证

**网页设计：**
- `frontend-design` - 前端界面设计
- `ui-ux-pro-max` - UI/UX 设计智能
- `web-design-reviewer` - 网站设计视觉检查

**插件开发：**
- `skill-development` / `skill-improver` / `skill-quality-reviewer` - Skill 生命周期
- `command-development` / `command-name` - 命令创建
- `agent-identifier` - Agent 配置
- `mcp-integration` - MCP 服务器集成

**工具：**
- `uv-package-manager` - 现代 Python 包管理
- `planning-with-files` - Markdown 规划
- `webapp-testing` - Web 应用测试
- `kaggle-learner` - Kaggle 竞赛学习

**从命令迁移的新技能（8 个）：**
- `git-commit` - 使用 Conventional Commits 提交
- `git-push` - 提交并推送到 GitHub
- `readme-updater` - 更新 README 文档
- `build-fixer` - 修复构建错误
- `checkpoint-manager` - 创建检查点
- `memory-updater` - 检查并更新 AGENTS.md 记忆
- `project-creator` - 从模板创建新项目
- `session-wrap-up` - 生成工作日志和清理提醒

### 自然语言触发

Codex CLI 没有斜杠命令。所有原命令已合并入 skills，通过自然语言触发：

| 这样说... | 触发的技能 |
|-----------|-----------|
| "提交代码" | `git-commit` |
| "推送到 GitHub" | `git-push` |
| "审查代码" | `code-review-excellence` |
| "开始研究" | `research-ideation` |
| "写 rebuttal" | `review-response` |
| "分析结果" | `results-analysis` |
| "创建计划" | `planning-with-files` |
| "修复构建错误" | `build-fixer` |
| "总结会话" | `session-wrap-up` |

### 代理（14 个专业）

每个代理在 `~/.codex/agents/<name>/` 下有独立目录，包含 `config.toml` 和 `AGENTS.md`（系统提示词）。代理在主 `config.toml` 中注册，可自动或按需调用。

**研究代理：**
- **literature-reviewer** - 文献搜索、分类和趋势分析
- **data-analyst** - 自动化数据分析和可视化
- **rebuttal-writer** - 系统化 rebuttal 写作
- **paper-miner** - 从成功论文中提取写作知识

**开发代理：**
- **architect** - 系统架构设计
- **build-error-resolver** - 修复构建错误
- **code-reviewer** - 审查代码质量
- **refactor-cleaner** - 移除死代码
- **tdd-guide** - 指导 TDD 工作流
- **kaggle-miner** - 提取 Kaggle 工程实践
- **bug-analyzer** - 深度代码执行流分析和根因调查
- **dev-planner** - 实施规划和任务拆解

**设计与内容代理：**
- **ui-sketcher** - UI 蓝图设计和交互规范
- **story-generator** - 用户故事和需求生成

## 文件结构

<details>
<summary>查看文件结构</summary>

```
claude-scholar/                  # Codex CLI 版
├── config.toml                  # 核心配置：模型、代理、MCP、功能
├── AGENTS.md                    # 项目上下文 + 工作流指令
│
├── agents/                      # 14 个专业代理
│   ├── code-reviewer/
│   │   ├── config.toml          # 代理专属设置
│   │   └── AGENTS.md            # 代理系统提示词
│   ├── architect/
│   ├── literature-reviewer/
│   └── ... (11 more agents)
│
├── skills/                      # 40 个技能（32 原有 + 8 迁移）
│   ├── ml-paper-writing/
│   │   └── SKILL.md
│   ├── git-commit/              # 新增：从 /commit 命令迁移
│   ├── session-wrap-up/         # 新增：替代会话 hooks
│   └── ... (37 more skills)
│
├── scripts/                     # 安装器和工具
│   ├── setup.sh                 # 交互式安装器（支持增量合并）
│   ├── setup-package-manager.js
│   └── lib/
│
├── utils/                       # Python 工具
├── README.md
└── README.zh-CN.md
```

</details>

## 快速开始

### 安装选项

#### 选项 1：完整安装（推荐）

交互式安装器，支持增量合并 — 检测已有 `~/.codex` 配置并非破坏性合并：

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

脚本会：
- 检测已有的 `config.toml` 和 `auth.json`，询问是否保留或重新配置
- 选择 API 提供商（OpenAI 或自定义）和模型
- 将 Scholar 特有部分（features、agents、MCP）合并到已有配置
- 将 skills、agents、scripts、utils 复制到 `~/.codex/`

**包含**：所有 40 个技能、14 个代理、Zotero MCP 配置和 AGENTS.md。

#### 选项 2：手动安装

按需复制：

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar

mkdir -p ~/.codex/skills ~/.codex/agents
cp /tmp/claude-scholar/config.toml ~/.codex/
cp /tmp/claude-scholar/AGENTS.md ~/.codex/
cp -r /tmp/claude-scholar/skills/ml-paper-writing ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/research-ideation ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/git-workflow ~/.codex/skills/
cp -r /tmp/claude-scholar/agents/code-reviewer ~/.codex/agents/

rm -rf /tmp/claude-scholar
```

**注意**：需要手动编辑 `~/.codex/config.toml` 设置模型、提供商，并注册复制的 agents/skills。

### 系统要求

- [Codex CLI](https://github.com/openai/codex)（`npm i -g @openai/codex`）
- Git
- （可选）uv、Python（用于 Python 开发）
- （可选）[Zotero](https://www.zotero.org/) + [zotero-mcp-server](https://pypi.org/project/zotero-mcp-server/)（用于文献管理）

### MCP 服务器配置（可选）

如需使用 Zotero 集成的研究工作流，请安装 MCP 服务器：

```bash
# 安装 Zotero MCP 服务器
uv tool install zotero-mcp-server

# 在 Zotero 桌面应用中启用本地 API：
# 编辑 → 设置 → 高级 → 勾选"允许本计算机上的其他应用程序与 Zotero 通信"
```

Zotero MCP 已在 `config.toml` 中预配置。如果使用 `setup.sh`，安装时可选择启用，或之后手动设置 `enabled = true`：

```toml
[mcp_servers.zotero]
command = "zotero-mcp"
args = ["serve"]
enabled = true
[mcp_servers.zotero.env]
ZOTERO_LOCAL = "true"
```

### 首次运行

安装后，运行 `codex` 启动。Codex CLI 会：

1. 读取 `AGENTS.md` 获取项目上下文和工作流指令
2. 扫描 `~/.codex/skills/` 中的可用技能（通过自然语言触发）
3. 使用 `config.toml` 中注册的代理处理专业任务
4. 通过 `sandbox_mode = "workspace-write"` 确保文件安全

## 与 OpenCode 版本的主要区别

| 方面 | OpenCode (`opencode` 分支) | Codex CLI (`codex` 分支) |
|------|--------------------------|---------------------------|
| 配置文件 | `opencode.jsonc`（JSON） | `config.toml`（TOML） |
| 钩子/插件 | TypeScript 插件 (`plugins/*.ts`) | 无 — 由 AGENTS.md 指令 + sandbox 替代 |
| 代理 | JSON 配置在 `opencode.jsonc` | 独立目录 (`agents/<name>/config.toml + AGENTS.md`) |
| 命令 | 文件式 `.md`（50+） | 合并入 skills（自然语言触发） |
| 技能 | 32 个 | 40 个（8 个从命令迁移） |
| 安全 | `security-guard.ts` 插件 | `sandbox_mode = "workspace-write"` + AGENTS.md 规则 |
| MCP | `opencode.jsonc` mcp 部分 | `config.toml` `[mcp_servers]` 部分 |
| 依赖 | `package.json`（npm） | 无 — 无 npm 依赖 |

## 项目规则

### 代码风格

所有规则已合并入 `AGENTS.md` 作为内联指令。

- **文件大小**：最大 200-400 行
- **不可变性**：配置使用 `@dataclass(frozen=True)`
- **类型提示**：所有函数都需要
- **模式**：所有模块使用 Factory & Registry
- **配置驱动**：模型仅接受 `cfg` 参数

### 代理编排

在 `AGENTS.md` 中定义：
- 可用的代理类型和用途
- 并行任务执行
- 多视角分析

### 安全规则

由 Codex sandbox + `AGENTS.md` 规则强制执行：
- `sandbox_mode = "workspace-write"` 限制文件写入和网络访问
- 密钥管理（环境变量、`.env` 文件）
- 敏感文件保护（禁止提交 token、密钥、凭证）

### 实验可复现性

在 `AGENTS.md` 中定义：
- 随机种子管理
- 配置记录（Hydra 自动保存）
- 环境记录和检查点管理

## 贡献

这是个人配置，但欢迎您：
- Fork 并适应您自己的研究
- 通过 issue 提交错误
- 通过 issue 建议改进

## 许可证

MIT 许可证

## 致谢

使用 [Codex CLI](https://github.com/openai/codex) 构建，并由开源社区增强。

### 参考资料

- **[everything-claude-code](https://github.com/anthropics/everything-claude-code)** - Claude Code CLI 的综合资源
- **[AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs)** - 研究导向的技能和配置

---

**面向数据科学、AI 研究和学术写作。**

仓库：[https://github.com/Galaxy-Dawn/claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)
