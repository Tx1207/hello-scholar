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

> 面向学术研究和软件开发的 semi-automated research assistant（Codex CLI 版），覆盖构思、文献综述、实验、分析、报告、写作与发表。

> **注意**: 这是 Claude Scholar 的 **Codex CLI 版本**。Claude Code CLI 版本请查看 [`main` 分支](https://github.com/Galaxy-Dawn/claude-scholar/tree/main)。OpenCode 版本请查看 [`opencode` 分支](https://github.com/Galaxy-Dawn/claude-scholar/tree/opencode)。

## 最新动态

- **2026-03-18**: **实验结果报告、写作记忆与工作流整理** — Codex 版已把实验后工作明确拆成两层：`results-analysis` 负责严格统计、真实科研图、`analysis-report.md` / `stats-appendix.md` / `figure-catalog.md`，`results-report` 负责面向决策的实验总结报告与 Obsidian 写回；同时移除了冗余的 `data-analyst` 入口，把 Codex 版默认路径收敛为自然语言触发的一键分析 + 成稿流程；还为 `paper-miner` 引入了全局 writing memory，并让 `ml-paper-writing` 与 `review-response` 统一读取这份共享记忆；此外同步更新了以人类决策为中心的 README 叙事与项目 logo。
- **2026-03-17**: **Obsidian 项目知识库** — Codex 版已迁入 filesystem-first Obsidian 工作流，支持项目导入、repo 绑定自动同步、`Papers / Knowledge / Experiments / Results / Results/Reports / Writing` 路由，以及默认 `Maps/literature.canvas`，且 Obsidian 侧不依赖 MCP。
- **2026-02-26**: **Zotero MCP Web/写操作工作流** — 支持远程访问、通过 DOI/arXiv ID/URL 导入论文、集合管理、条目更新和安全删除；详见 `MCP_SETUP.md`。
- **2026-02-25**: **Codex CLI 迁移** — 从 OpenCode 迁移到 Codex CLI：TOML 配置、独立 agent 目录、commands 合并进 skills、hooks 改为 AGENTS.md 指令 + sandbox，并提供支持增量合并的 `setup.sh`。
- **2026-02-23**: 新增 `setup.sh` 安装脚本 — 面向已有 `~/.codex` 的带备份增量更新与配置保留。

<details>
<summary>查看历史更新日志</summary>

- **2026-02-22**: 新增 Zotero MCP 服务器 — 开箱即用支持文献管理
- **2026-02-21**: OpenCode 迁移 — hooks→plugins (TypeScript)、agents→opencode.jsonc、CLAUDE.md→AGENTS.md
- **2026-02-15**: Zotero MCP 集成 — 在 Claude Code 分支新增 `/zotero-review` 和 `/zotero-notes` 命令
- **2026-02-11**: 大版本更新，新增 10 个 skills、7 个 agents、8 个研究工作流命令；涉及 89 个文件
- **2026-01-25**: 项目正式开源，v1.0.0 发布

</details>

## 为什么使用 Claude Scholar

Claude Scholar **不是**一个试图替代研究者的端到端全自动科研系统。

它的核心非常简单：

> **人的决策始终在中心，助手负责加速围绕它的结构化流程。**

也就是说，Codex 版重点帮助你处理研究中那些重、重复、又对结构敏感的部分——文献组织、笔记沉淀、实验分析、结果报告和写作支持——但关键判断仍然由人来做：

- 哪个问题值得做，
- 哪些论文真的重要，
- 哪些假设值得检验，
- 哪些结果足够有说服力，
- 以及什么该写、该投、该继续、该放弃。

换句话说，Claude Scholar 是一个**半自动研究助手**，而不是“全自动科学家”。

## 核心工作流

- **Ideation**: turn a vague topic into concrete questions, research gaps, and an initial plan.
- **Literature**: search, import, organize, and read papers through Zotero collections.
- **Paper notes**: convert papers into structured reading notes and reusable claims.
- **Knowledge base**: route durable knowledge into Obsidian across `Papers / Knowledge / Experiments / Results / Results/Reports / Writing`.
- **Experiments**: track hypotheses, experiment lines, run history, findings, and next actions.
- **Analysis**: generate strict statistics, real scientific figures, and analysis artifacts with `results-analysis`.
- **Reporting**: produce a complete post-experiment report with `results-report`, then write it back into Obsidian.
- **Writing and publication**: carry stable findings into literature reviews, papers, rebuttals, slides, posters, and promotion.

## 快速导航

| 部分 | 作用 |
|---|---|
| [为什么使用 Claude Scholar](#为什么使用-claude-scholar) | 快速理解项目的人类决策导向定位。 |
| [核心工作流](#核心工作流) | 查看从研究构思到发表的主链路。 |
| [快速开始](#快速开始) | 安全地安装到现有 `~/.codex` 环境。 |
| [集成能力](#集成能力) | 了解 Zotero 和 Obsidian 如何接入 Codex 工作流。 |
| [主要工作流](#主要工作流) | 浏览核心研究与开发工作流。 |
| [支撑工作流](#支撑工作流) | 查看强化主链路的后台能力。 |
| [文档](#文档) | 跳转到安装、MCP、Obsidian 与 AGENTS 说明。 |
| [引用](#引用) | 在论文、报告或项目文档中引用 Claude Scholar。 |

## 集成能力

### Zotero

适合这些场景：
- 通过 DOI / arXiv / URL 导入论文
- 按 collection 批量阅读论文
- 通过 Zotero MCP 读取 full text
- 生成详细 paper notes 与 literature synthesis

详见 [MCP_SETUP.zh-CN.md](./MCP_SETUP.zh-CN.md)。

### Obsidian

适合这些场景：
- 维护 filesystem-first 项目知识库
- 管理 `Papers/`
- 管理 `Knowledge/`
- 管理 `Experiments/`
- 管理 `Results/`
- 管理 `Results/Reports/`
- 管理 `Writing/` 与 `Daily/`

详见 [OBSIDIAN_SETUP.zh-CN.md](./OBSIDIAN_SETUP.zh-CN.md)。

## 主要工作流

完整学术研究生命周期 —— 从研究构思到发表的 7 个阶段。

#### 1. 研究构思（Zotero 集成）

**工具**: `research-ideation` skill + `literature-reviewer` agent + Zotero MCP

**流程**:
- **5W1H 头脑风暴**: What, Why, Who, When, Where, How → 结构化思维框架
- **文献搜索与导入**: WebSearch 搜索论文 → 提取 DOI → 通过 `add_items_by_doi` 自动导入 Zotero
- **PDF 与全文分析**: `find_and_attach_pdfs` 批量附加 PDF → `get_item_fulltext` 读取全文深度分析
- **Gap 分析**: 5 种类型（文献、方法论、应用、跨学科、时间）→ 识别 2-3 个研究机会
- **研究问题**: SMART 原则 → 制定具体、可衡量的问题

**触发**: "开始研究"、"review 这个 Zotero collection"、"生成阅读笔记"

#### 2. ML 项目开发

**工具**: `architecture-design` skill + `code-reviewer` agent + `git-workflow` skill

**流程**:
- **结构**: Factory & Registry 模式 → 配置驱动模型（仅 `cfg` 参数）
- **代码风格**: 200-400 行文件 → 类型提示 → `@dataclass(frozen=True)` → 最多 3 层嵌套
- **调试** (`bug-detective`): Python/Bash/JS 错误模式匹配 → 堆栈跟踪分析
- **Git**: Conventional Commits → 分支策略（master/develop/feature）→ `--no-ff` 合并

**触发**: "创建计划"、"提交代码"、"审查代码"、"运行 TDD"

#### 3. 实验分析

**工具**: `results-analysis` skill + `results-report` skill

**流程**:
- **Strict analysis bundle**：生成 `analysis-report.md`、`stats-appendix.md`、`figure-catalog.md` 与真实科研图
- **统计验证**：报告 descriptive statistics、置信区间、effect size 与合理的 significance tests
- **图表解释**：每张主图都要说明用途、caption 要点与 interpretation checklist
- **实验总结报告**：再交给 `results-report` 生成完整复盘，明确结论、限制与下一步

**触发**: "分析这个目录下的结果并整理最终报告"、"给这个实验写结果报告"

#### 4. 论文写作

**工具**: `ml-paper-writing` skill + `paper-miner` agent + `latex-conference-template-organizer` skill

**流程**:
- **模板准备**：整理会议模板，清理成可写作结构
- **引文验证**：以程序化 citation workflow 为主，避免幻觉引用
- **全局写作记忆**：`paper-miner` 把可复用的写作模式、结构信号与 venue phrasing 写入 `~/.codex/skills/ml-paper-writing/references/knowledge/` 下的一份 canonical memory
- **系统写作**：基于 repo、结果和写作记忆开展分节写作与修改

**会议**: NeurIPS, ICML, ICLR, ACL, AAAI, COLM, Nature, Science, Cell, PNAS

**触发**: "起草论文"、"从这篇论文里挖掘写作模式"

#### 5. 论文自审

**工具**: `paper-self-review` skill — 6 项质量检查清单

#### 6. 投稿与 Rebuttal

**工具**: `review-response` skill + `rebuttal-writer` agent

**触发**: "写 rebuttal"

#### 7. 录用后处理

**工具**: `post-acceptance` skill

**触发**: "准备演讲"、"设计海报"、"推广论文"

**覆盖范围**: 90% 的学术研究生命周期（从想法到发表）

## 支撑工作流

#### Obsidian 项目知识库

Codex 版现在也带上了主分支的 filesystem-first Obsidian 项目知识库工作流：

- `obsidian-project-memory` 负责 repo 绑定后的 project memory 与 canonical note 路由
- `obsidian-project-bootstrap` 负责识别/导入科研仓库
- `obsidian-research-log` 与 `obsidian-experiment-log` 负责 daily、plan、experiment、result 的落地
- `obsidian-literature-workflow` 与 `zotero-obsidian-bridge` 负责 paper notes 与 `Maps/literature.canvas`
- Obsidian 侧不需要 MCP，也不需要 API key

详见 [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md)。

#### 工作流自动化

在 Codex 版本中，自动化工作流通过以下方式实现：

- **AGENTS.md 指令**: 会话启动协议、技能评估指导和安全规则嵌入 `AGENTS.md` — Codex 自动读取
- **Sandbox 模式**: `sandbox_mode = "workspace-write"` 提供文件写入限制和网络隔离，替代 hook 安全守卫
- **session-wrap-up** (skill): 会话结束时手动触发，生成工作日志和清理提醒 — 替代自动会话摘要 hook

#### 知识提取工作流

- **paper-miner** (agent): 分析研究论文 → 把可复用的写作模式、短语和 venue 信号写入一份全局 writing memory
- **kaggle-miner** (agent): 研究 Kaggle 获胜方案 → 提取技术分析、代码模板

#### 技能进化系统

```
skill-development → skill-quality-reviewer → skill-improver
```

## 功能亮点

### 技能（55 个）

**研究工作流：**
- `research-ideation` - 研究构思启动：5W1H、文献综述、Gap 分析
- `results-analysis` - 严格实验分析：严谨统计、真实科研图和分析产物
- `results-report` - 面向决策的实验后完整总结报告
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

**Obsidian 知识库：**
- `obsidian-project-memory` - 已绑定科研仓库的默认项目知识库总控
- `obsidian-project-bootstrap` - 将科研仓库 bootstrap / 导入到 Obsidian vault
- `obsidian-research-log` - 维护 daily、plan、hub 和稳定进展沉淀
- `obsidian-experiment-log` - 维护实验、消融和稳定结果总结
- `obsidian-project-lifecycle` - detach / archive / purge 与 note lifecycle 操作
- `obsidian-literature-workflow` - 规范化 paper note 并连接项目上下文
- `zotero-obsidian-bridge` - 将 Zotero collection / full text 写成 durable Obsidian paper notes
- `obsidian-markdown` / `obsidian-cli` / `obsidian-bases` / `json-canvas` / `defuddle` - vendored 官方辅助能力

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

Codex CLI 没有斜杠命令。Codex 版主要依靠 skills、agents 与自然语言触发：

| 这样说... | 会调用 |
|-----------|--------|
| "提交代码" | `git-commit` |
| "推送到 GitHub" | `git-push` |
| "审查代码" | `code-review-excellence` |
| "开始研究" | `research-ideation` + `literature-reviewer` |
| "分析 results/run_a 里的实验结果" | `results-analysis` |
| "给这个实验写结果报告" | `results-report` |
| "从这篇论文里挖掘写作模式" | `paper-miner` |
| "写 rebuttal" | `review-response` + `rebuttal-writer` |
| "总结会话" | `session-wrap-up` |

### 代理（15 个专业）

每个代理在 `~/.codex/agents/<name>/` 下有独立目录，包含 `config.toml` 和 `AGENTS.md`（系统提示词）。代理在主 `config.toml` 中注册，可自动或按需调用。

**研究代理：**
- **literature-reviewer** - 文献搜索、分类和趋势分析
- **literature-reviewer-obsidian** - 从 Obsidian 项目 paper notes 生成项目联动的文献综合
- **research-knowledge-curator-obsidian** - 在正常科研对话中维护绑定的 Obsidian 项目知识库
- **rebuttal-writer** - 系统化 rebuttal 写作
- **paper-miner** - 把可复用写作知识沉淀到一份全局 canonical writing memory

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
├── agents/                      # 15 个专业代理
│   ├── code-reviewer/
│   │   ├── config.toml          # 代理专属设置
│   │   └── AGENTS.md            # 代理系统提示词
│   ├── architect/
│   ├── literature-reviewer/
│   └── ... (11 more agents)
│
├── skills/                      # 55 个技能
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

交互式安装器，支持带备份的增量更新 —— 检测已有 `~/.codex` 配置并进行非破坏性合并：

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

脚本会：
- 保留你现有的 provider/model 选择，除非你明确要求重配
- 保留已有 API keys、auth 文件、权限配置和无关字段
- 将 Scholar 管理的部分（features、agents、MCP、skills 路径）增量合并到现有配置，而不是整体覆盖
- 将 skills、agents、scripts、utils 刷新到 `~/.codex/`，并为被覆盖的受管文件创建备份

**包含**：所有 55 个技能、15 个代理、Zotero MCP 配置、Obsidian 知识库 skills 和 AGENTS.md。

#### 选项 2：手动安装

按需复制：

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar

mkdir -p ~/.codex/skills ~/.codex/agents
cp /tmp/claude-scholar/config.toml ~/.codex/
cp -r /tmp/claude-scholar/skills/ml-paper-writing ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/research-ideation ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/git-workflow ~/.codex/skills/
cp -r /tmp/claude-scholar/agents/code-reviewer ~/.codex/agents/

rm -rf /tmp/claude-scholar
```

**注意**：需要手动编辑 `~/.codex/config.toml` 设置模型、提供商，并注册复制的 agents/skills。`AGENTS.md` 应保留在你实际运行 Codex 的仓库根目录。

### 系统要求

- [Codex CLI](https://github.com/openai/codex)（`npm i -g @openai/codex`）
- Git
- uv、Python（用于 Python 开发和 MCP 服务器安装）
- （可选）[Zotero](https://www.zotero.org/) + [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp)（用于文献管理）

### MCP 服务器配置

如需使用 Zotero 集成的研究工作流，请安装 MCP 服务器：

```bash
# 安装 Zotero MCP 服务器
uv tool install --reinstall git+https://github.com/Galaxy-Dawn/zotero-mcp.git
```

如需使用 Web API / 写操作，请打开 [Zotero 设置 -> Security -> Applications](https://www.zotero.org/settings/security#applications)，创建 private key，并将页面显示的数字 `User ID` 作为个人库的 `ZOTERO_LIBRARY_ID`。然后在 `config.toml` 中配置：

```toml
[mcp_servers.zotero]
command = "zotero-mcp"
args = ["serve"]
enabled = true

[mcp_servers.zotero.env]
ZOTERO_API_KEY = "your-api-key"
ZOTERO_LIBRARY_ID = "your-user-id"
ZOTERO_LIBRARY_TYPE = "user"
UNPAYWALL_EMAIL = "your-email@example.com"
UNSAFE_OPERATIONS = "all"
```

详细配置说明（所有平台、可用工具、故障排除），请参阅 [MCP_SETUP.md](MCP_SETUP.md)。

### 首次运行

安装后，运行 `codex` 启动。Codex CLI 会：

1. 读取 `AGENTS.md` 获取项目上下文和工作流指令
2. 扫描 `~/.codex/skills/` 中的可用技能（通过自然语言触发）
3. 使用 `config.toml` 中注册的代理处理专业任务
4. 通过 `sandbox_mode = "workspace-write"` 确保文件安全

## Obsidian 知识库

Codex 分支现在也携带了和主分支一致方向的 filesystem-first Obsidian 项目知识库能力，只是入口改成适合 Codex 的自然语言工作流：

- 不需要 Obsidian MCP，也不需要 API key
- 通过研究仓库内的 `.codex/project-memory/registry.yaml` 进行 repo 绑定 project memory
- 默认 vault 结构为 `Knowledge / Papers / Experiments / Results / Results/Reports / Writing / Daily / Archive`
- 官方 `obsidian` CLI 只作为可选导航辅助
- 默认文献图谱产物为 `Maps/literature.canvas`

详见 [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md)。

## 与 OpenCode 版本的主要区别

| 方面 | OpenCode (`opencode` 分支) | Codex CLI (`codex` 分支) |
|------|--------------------------|---------------------------|
| 配置文件 | `opencode.jsonc`（JSON） | `config.toml`（TOML） |
| 钩子/插件 | TypeScript 插件 (`plugins/*.ts`) | 无 — 由 AGENTS.md 指令 + sandbox 替代 |
| 代理 | JSON 配置在 `opencode.jsonc` | 独立目录 (`agents/<name>/config.toml + AGENTS.md`) |
| 命令 | 文件式 `.md`（50+） | 合并入 skills（自然语言触发） |
| 技能 | 32 个 | 55 个 |
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

## 文档

- [INSTALL-CODEX.md](./INSTALL-CODEX.md) — Codex CLI 安装与更新指南
- [MCP_SETUP.zh-CN.md](./MCP_SETUP.zh-CN.md) — Zotero MCP 配置与排错
- [OBSIDIAN_SETUP.zh-CN.md](./OBSIDIAN_SETUP.zh-CN.md) — filesystem-first Obsidian 知识库工作流
- [AGENTS.md](./AGENTS.md) — Codex 项目规则、工作流指导与代理编排默认值

## 贡献

欢迎贡献，尤其是：
- 研究工作流设计，
- Codex 兼容的 skill / agent 改进，
- Zotero / Obsidian 工作流质量提升，
- 文档修正与可复现性增强。

如果你想修改 installer 行为、Zotero 工作流或 Obsidian 路由，建议在提案里明确：
- 目标用户工作流，
- 向后兼容考虑，
- 以及它在 Codex 版中应如何工作。

## 引用

如果 Claude Scholar 对你的工作有帮助，可以按下面方式引用：

```bibtex
@misc{zhang2026claudescholar,
  author       = {Gaorui Zhang},
  title        = {Claude Scholar: Semi-automated research assistant for academic research and software development},
  year         = {2026},
  howpublished = {GitHub repository},
  url          = {https://github.com/Galaxy-Dawn/claude-scholar}
}
```

## 许可证

MIT 许可证

## 致谢

基于 [Codex CLI](https://github.com/openai/codex) 构建，并结合开源研究工具链与社区实践持续扩展。

### 参考资料

- **[everything-claude-code](https://github.com/anthropics/everything-claude-code)** - Claude Code CLI 的综合资源
- **[AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs)** - 研究导向的技能和配置

---

**面向学术研究和软件开发的半自动研究助手。**

仓库：[https://github.com/Galaxy-Dawn/claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)
