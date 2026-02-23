# Claude Scholar (OpenCode 版)

<div align="center">
  <img src="LOGO.jpeg" alt="Claude Scholar Logo" width="100%"/>

  <p>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/stargazers"><img src="https://img.shields.io/github/stars/Galaxy-Dawn/claude-scholar?style=flat-square&color=yellow" alt="Stars"/></a>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/network/members"><img src="https://img.shields.io/github/forks/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Forks"/></a>
    <img src="https://img.shields.io/github/last-commit/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Last Commit"/>
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/OpenCode-Compatible-blueviolet?style=flat-square" alt="OpenCode"/>
  </p>

  <strong>语言</strong>: <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a>
</div>

> 面向学术研究和软件开发的个人 OpenCode 配置仓库 — 覆盖从构思到发表的完整研究生命周期。

> **注意**: 这是 Claude Scholar 的 **OpenCode 版本**。Claude Code CLI 版本请查看 [`main` 分支](https://github.com/Galaxy-Dawn/claude-scholar/tree/main)。

## News

- **2026-02-23**: 新增 `setup.sh` 安装脚本 — 安全合并到已有 `~/.opencode`，自动备份 `opencode.jsonc`
- **2026-02-22**: 在 `opencode.jsonc` 中添加 Zotero MCP 服务器 — 开箱即用支持文献管理命令（`/zotero-review`、`/zotero-notes`）
- **2026-02-21**: OpenCode 迁移 — 将整个配置迁移到 OpenCode 格式：hooks→plugins (TypeScript)、agents→opencode.jsonc、CLAUDE.md→AGENTS.md、新增 permission 规则、保留文件式命令

<details>
<summary>查看历史更新日志</summary>

- **2026-02-20**: 双语配置 — 将 `CLAUDE.md` 翻译为英文以便国际用户阅读
- **2026-02-15**: Zotero MCP 集成 — 新增 `/zotero-review` 和 `/zotero-notes` 命令
- **2026-02-14**: Hooks 优化 — `security-guard` 重构为两层系统（Block + Confirm）
- **2026-02-11**: 大版本更新，新增 10 个 skills、7 个 agents、8 个研究工作流命令；涉及 89 个文件
- **2026-01-25**: 项目正式开源，v1.0.0 发布

</details>

## 简介

Claude Scholar (OpenCode 版) 是一个面向 [OpenCode](https://github.com/sst/opencode) CLI 的配置系统，提供丰富的技能、命令、代理和插件，针对以下场景优化：
- **学术研究** - 完整的研究生命周期：想法生成 → 实验 → 结果分析 → 论文写作 → 审稿回复 → 会议准备
- **软件开发** - Git 工作流、代码审查、测试驱动开发、ML 项目架构
- **插件开发** - Skill、Command、Agent、Plugin 开发指南与质量评估
- **项目管理** - 规划文档、代码规范、跨平台插件驱动的自动化工作流

## 快速导航

| 主题 | 说明 |
|------|------|
| [快速开始](#快速开始) | 快速上手指南 |
| [核心工作流](#核心工作流) | 论文写作、代码组织、技能进化 |
| [功能亮点](#功能亮点) | 技能、命令、代理概览 |
| [安装指南](#安装选项) | 完整、最小化或选择性安装 |
| [MCP 配置](#mcp-服务器配置可选) | Zotero MCP 文献管理集成 |
| [项目规则](#项目规则) | 代码风格和代理编排 |

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

**命令**: `/research-init`, `/zotero-review`, `/zotero-notes`

#### 2. ML 项目开发

**工具**: `architecture-design` skill + `code-reviewer` agent + `git-workflow` skill

**流程**:
- **结构**: Factory & Registry 模式 → 配置驱动模型（仅 `cfg` 参数）
- **代码风格**: 200-400 行文件 → 类型提示 → `@dataclass(frozen=True)` → 最多 3 层嵌套
- **调试** (`bug-detective`): Python/Bash/JS 错误模式匹配 → 堆栈跟踪分析
- **Git**: Conventional Commits → 分支策略（master/develop/feature）→ `--no-ff` 合并

**命令**: `/plan`, `/commit`, `/code-review`, `/tdd`

#### 3. 实验分析

**工具**: `results-analysis` skill + `data-analyst` agent

**命令**: `/analyze-results <experiment_dir>`

#### 4. 论文写作

**工具**: `ml-paper-writing` skill + `paper-miner` agent + `latex-conference-template-organizer` skill

**会议**: NeurIPS, ICML, ICLR, ACL, AAAI, COLM, Nature, Science, Cell, PNAS

#### 5. 论文自审

**工具**: `paper-self-review` skill — 6 项质量检查清单

#### 6. 投稿与 Rebuttal

**工具**: `review-response` skill + `rebuttal-writer` agent

**命令**: `/rebuttal <review_file>`

#### 7. 录用后处理

**工具**: `post-acceptance` skill

**命令**: `/presentation`, `/poster`, `/promote`

**覆盖范围**: 90% 的学术研究生命周期（从想法到发表）

### 支撑工作流

#### 自动化插件工作流

跨平台 TypeScript 插件自动化工作流执行：

- **skill-eval** (`skill-eval.ts`): 每次命令执行前 → 扫描可用技能 → 匹配相关技能 → 确保不遗漏
- **session-start** (`session-start.ts`): 会话开始 → 显示 Git 状态、待办事项 → 项目上下文一目了然
- **session-summary** (`session-summary.ts`): 会话结束 → 生成工作日志 → 总结更改 → 智能建议
- **stop-summary** (`stop-summary.ts`): 会话更新 → 轻量状态检查
- **security-guard** (`security-guard.ts`): 工具执行前 → **Block 层**: 拒绝灾难性命令；**Warn 层**: 标记危险操作

#### 知识提取工作流

- **paper-miner** (agent): 分析研究论文 → 提取写作模式、结构见解、会议要求
- **kaggle-miner** (agent): 研究 Kaggle 获胜方案 → 提取技术分析、代码模板

#### 技能进化系统

```
skill-development → skill-quality-reviewer → skill-improver
```

## 功能亮点

### 技能（32 个）

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
- `hook-development` - 插件开发指南
- `mcp-integration` - MCP 服务器集成

**工具：**
- `uv-package-manager` - 现代 Python 包管理
- `planning-with-files` - Markdown 规划
- `webapp-testing` - Web 应用测试
- `kaggle-learner` - Kaggle 竞赛学习

### 命令（50+）

**研究命令：**

| 命令 | 用途 |
|------|------|
| `/research-init` | 启动研究工作流（5W1H、文献综述、Gap 分析） |
| `/zotero-review` | 从 Zotero 集合读取论文，生成文献综述 |
| `/zotero-notes` | 批量阅读 Zotero 论文，生成阅读笔记 |
| `/analyze-results` | 分析实验结果 |
| `/rebuttal` | 生成系统化 rebuttal 文档 |
| `/presentation` | 创建会议演讲大纲 |
| `/poster` | 生成学术海报设计方案 |
| `/promote` | 生成推广内容 |

**开发命令：**

| 命令 | 用途 |
|------|------|
| `/plan` | 创建实施计划 |
| `/commit` | 使用 Conventional Commits 提交 |
| `/update-github` | 提交并推送到 GitHub |
| `/update-readme` | 更新 README 文档 |
| `/update-memory` | 检查并更新 AGENTS.md 记忆 |
| `/code-review` | 代码审查 |
| `/tdd` | 测试驱动开发工作流 |
| `/build-fix` | 修复构建错误 |
| `/verify` | 验证更改 |
| `/checkpoint` | 创建检查点 |
| `/refactor-clean` | 重构和清理 |
| `/learn` | 提取可重用模式 |
| `/create_project` | 从模板创建新项目 |
| `/setup-pm` | 配置包管理器（uv/pnpm） |
| `/sc` | SuperClaude 命令套件（30 个命令） |

### 代理（14 个专业）

代理定义在 `opencode.jsonc` 中，可自动或按需调用。

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
claude-scholar/                  # OpenCode 版
├── opencode.jsonc               # 核心配置：agents、MCP、permissions
├── AGENTS.md                    # 项目上下文（替代 CLAUDE.md）
├── package.json                 # 插件依赖（@opencode-ai/plugin）
│
├── plugins/                     # TypeScript 插件（替代 hooks/）
│   ├── lib/
│   │   └── common.ts                   # 共享工具（git 信息、todo 信息）
│   ├── session-start.ts                # 会话开始 - Git 状态、待办事项
│   ├── skill-eval.ts                   # 命令执行时技能匹配
│   ├── session-summary.ts              # 会话结束 - 工作日志生成
│   ├── stop-summary.ts                 # 会话更新 - 状态检查
│   └── security-guard.ts              # 工具执行守卫（block + warn）
│
├── skills/                      # 32 个专业技能（与 Claude Code 版本相同）
├── commands/                    # 50+ 斜杠命令（文件式，每个命令一个 .md）
│   └── sc/                      # SuperClaude 命令套件
├── rules/                       # 全局指导原则（已合并到 AGENTS.md）
├── scripts/                     # 工具脚本
├── utils/                       # Python 工具
├── LOGO.jpeg
├── README.md
└── README.zh-CN.md
```

</details>

## 快速开始

### 安装选项

#### 选项 1：完整安装（推荐）

安全合并到已有的 `~/.opencode` 目录，不会覆盖个人数据：

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

脚本会将 skills/commands/plugins/scripts/utils 复制到 `~/.opencode`，并安装 `opencode.jsonc`（自动备份为 `opencode.jsonc.bak`）。

**包含**：所有 32 个技能、50+ 命令、14 个代理、5 个插件和项目规则。

#### 选项 2：最小化安装

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar

mkdir -p ~/.opencode/plugins/lib ~/.opencode/skills
cp /tmp/claude-scholar/plugins/*.ts ~/.opencode/plugins/
cp /tmp/claude-scholar/plugins/lib/common.ts ~/.opencode/plugins/lib/
cp /tmp/claude-scholar/opencode.jsonc ~/.opencode/
cp /tmp/claude-scholar/package.json ~/.opencode/
cp -r /tmp/claude-scholar/skills/ml-paper-writing ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/research-ideation ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/git-workflow ~/.opencode/skills/

rm -rf /tmp/claude-scholar
```

**安装后**：如果你已有 `opencode.jsonc`，请先备份 — 此操作会用完整的 agent/mcp/permission 配置覆盖它。

#### 选项 3：选择性安装

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar

# 按需复制：
cp /tmp/claude-scholar/opencode.jsonc ~/.opencode/
cp /tmp/claude-scholar/plugins/*.ts ~/.opencode/plugins/
cp -r /tmp/claude-scholar/skills/architecture-design ~/.opencode/skills/
```

**安装后**：复制前请先备份已有的 `opencode.jsonc`。

### 系统要求

- [OpenCode](https://github.com/sst/opencode) CLI
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

Zotero MCP 已在 `opencode.jsonc` 中预配置。如果使用选项 1（完整安装），开箱即用。

选择性安装时，确保 `opencode.jsonc` 包含：

```jsonc
"mcp": {
  "zotero": {
    "type": "local",
    "command": ["zotero-mcp", "serve"],
    "enabled": true
  }
}
```

### 首次运行

安装后，插件提供自动化工作流辅助：

1. **每次命令**触发 `skill-eval` → 确保考虑适用技能
2. **会话开始**时 `session-start` → 显示项目上下文
3. **会话结束**时 `session-summary` → 生成带建议的工作日志
4. **工具执行**由 `security-guard` 守卫 → 拦截危险命令

## 与 Claude Code 版本的主要区别

| 方面 | Claude Code (`main` 分支) | OpenCode (`opencode` 分支) |
|------|--------------------------|---------------------------|
| 配置文件 | `CLAUDE.md` | `AGENTS.md` + `opencode.jsonc` |
| 钩子 | JavaScript (`hooks/*.js`) | TypeScript 插件 (`plugins/*.ts`) |
| 代理 | Markdown 文件 (`agents/*.md`) | JSON 配置在 `opencode.jsonc` |
| 权限 | 基于钩子 (`security-guard.js`) | `opencode.jsonc` permission 规则 + 插件 |
| MCP | `settings.json` | `opencode.jsonc` mcp 部分 |
| 技能 | 相同格式 | 相同格式（兼容） |
| 命令 | 相同格式 | 相同格式（文件式 `.md`） |

## 项目规则

### 代码风格

由 `rules/coding-style.md` 强制执行：
- **文件大小**：最大 200-400 行
- **不可变性**：配置使用 `@dataclass(frozen=True)`
- **类型提示**：所有函数都需要
- **模式**：所有模块使用 Factory & Registry
- **配置驱动**：模型仅接受 `cfg` 参数

### 代理编排

在 `rules/agents.md` 中定义：
- 可用的代理类型和用途
- 并行任务执行
- 多视角分析

### 安全规则

在 `rules/security.md` + `opencode.jsonc` permission 规则中定义：
- 密钥管理（环境变量、`.env` 文件）
- 敏感文件保护（禁止提交 token、密钥、凭证）
- 通过 `security-guard.ts` 插件进行工具执行守卫

### 实验可复现性

在 `rules/experiment-reproducibility.md` 中定义：
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

使用 [OpenCode](https://github.com/sst/opencode) CLI 构建，并由开源社区增强。

### 参考资料

- **[everything-claude-code](https://github.com/anthropics/everything-claude-code)** - Claude Code CLI 的综合资源
- **[AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs)** - 研究导向的技能和配置

---

**面向数据科学、AI 研究和学术写作。**

仓库：[https://github.com/Galaxy-Dawn/claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)
