# Codex Scholar 配置

## 项目概述

**Codex Scholar** - 面向学术研究和软件开发的个人 Codex CLI 配置系统

**配置路径**:
- 主配置：`~/.codex/config.toml`
- Agent 配置：`~/.codex/agents/<name>/`
- Skills 目录：项目根目录 `skills/`
- 本文件：项目根目录 `AGENTS.md`（Codex 自动读取）

**Mission**: 覆盖完整的学术研究生命周期（从构思到发表）和软件开发工作流，同时提供插件开发和项目管理能力。

---

## 用户背景

### 学术背景
- **学历**: 计算机科学 PhD
- **投稿目标**:
  - 顶会：NeurIPS, ICML, ICLR, KDD, ACL, AAAI
  - 高影响期刊：Nature, Science, Cell, PNAS
- **关注点**: 学术写作质量、逻辑连贯性、自然表达

### 技术栈偏好

**Python 生态**:
- **包管理**: `uv` - 现代化 Python 包管理器
- **配置管理**: Hydra + OmegaConf（配置组合、覆盖、类型安全）
- **模型训练**: Transformers Trainer

**Git 规范**:
- **提交规范**: Conventional Commits (feat, fix, docs, style, refactor, perf, test, chore)
- **分支策略**: master/develop/feature/bugfix/hotfix/release
- **合并策略**: 功能分支用 rebase 同步，用 merge --no-ff 合并

---

## 全局配置

### 语言设置
- 用中文进行回答
- 专业术语保持英文（如 NeurIPS, RLHF, TDD, Git）
- 不翻译特定名词或名称

### 工作目录规范
- 计划文档：`/plan` 文件夹
- 临时文件：`/temp` 文件夹
- 文件夹不存在时自动创建

### 任务执行原则
- 复杂任务先交流意见，再拆解实施
- 实施后进行示例测试
- 做好备份，不影响现有功能
- 完成后及时删除临时文件

### 工作风格
- **任务管理**: 复杂任务先规划再执行，优先使用已有 skills
- **沟通方式**: 不确定时主动询问，重要操作前先确认
- **代码风格**: Python 遵循 PEP 8，注释使用英文，命名使用英文

---

## 核心工作流

### 研究生命周期（7 阶段）

```
构思 → ML开发 → 实验分析 → 论文写作 → 自审 → 投稿/Rebuttal → 录用后处理
```

| 阶段 | 核心工具 | 命令 |
|------|---------|------|
| 1. 研究构思 | `research-ideation` skill + `literature-reviewer` agent | `/research-init`, `/zotero-review`, `/zotero-notes` |
| 2. ML 项目开发 | `architecture-design` skill + `code-reviewer` agent | `/plan`, `/commit`, `/tdd` |
| 3. 实验分析 | `results-analysis` skill + `data-analyst` agent | `/analyze-results` |
| 4. 论文写作 | `ml-paper-writing` skill + `paper-miner` agent | - |
| 5. 论文自审 | `paper-self-review` skill | - |
| 6. 投稿与 Rebuttal | `review-response` skill + `rebuttal-writer` agent | `/rebuttal` |
| 7. 录用后处理 | `post-acceptance` skill | `/presentation`, `/poster`, `/promote` |

### 支撑工作流

- **Zotero 集成**: 通过 Zotero MCP 服务器实现论文自动导入、集合管理、全文阅读和准确引用导出
- **知识提取**: `paper-miner` 和 `kaggle-miner` agent 持续从论文和竞赛中提取知识
- **技能进化**: `skill-development` → `skill-quality-reviewer` → `skill-improver` 三步改进循环

---

## 技能目录（32 skills）

### 研究与分析 (4)
- **research-ideation**: 研究构思启动
- **results-analysis**: 实验结果分析
- **citation-verification**: 引文验证
- **daily-paper-generator**: 每日论文生成器

### 论文写作与发表 (7)
- **ml-paper-writing**: ML/AI 论文写作辅助（NeurIPS, ICML, ICLR, Nature 等）
- **writing-anti-ai**: 去除 AI 写作痕迹
- **paper-self-review**: 论文自审
- **review-response**: 系统化 rebuttal 写作
- **post-acceptance**: 录用后处理
- **doc-coauthoring**: 文档协作工作流
- **latex-conference-template-organizer**: LaTeX 会议模板整理

### 开发工作流 (6)
- **daily-coding**: 日常编码检查清单
- **git-workflow**: Git 工作流规范
- **code-review-excellence**: 代码审查最佳实践
- **bug-detective**: 调试和错误排查
- **architecture-design**: ML 项目代码框架和设计模式
- **verification-loop**: 验证循环和测试

### 插件开发 (8)
- **skill-development / skill-improver / skill-quality-reviewer**: Skill 开发三件套
- **command-development / command-name**: 命令开发
- **agent-identifier**: Agent 开发配置
- **hook-development**: Hook 开发
- **mcp-integration**: MCP 服务器集成

### 工具与实用 (4)
- **planning-with-files**: Markdown 规划
- **uv-package-manager**: uv 包管理器
- **webapp-testing**: Web 应用测试
- **kaggle-learner**: Kaggle 竞赛学习

### 网页设计 (3)
- **frontend-design**: 前端界面设计
- **ui-ux-pro-max**: UI/UX 设计智能
- **web-design-reviewer**: 网站设计视觉检查

---

## 命名规范

### Skill 命名
- 格式：kebab-case（小写+连字符）
- 形式：优先使用 gerund form（动词+ing）
- 示例：`scientific-writing`, `git-workflow`, `bug-detective`

### Tags 命名
- 格式：Title Case，缩写全大写（TDD, RLHF, NeurIPS）

### 描述规范
- 人称：第三人称
- 内容：包含用途和使用场景

---

## 任务完成总结

每次任务完成时，主动提供简要总结：

```
📋 本次操作回顾
1. [主要操作]
2. [修改的文件]

📊 当前状态
• [Git/文件系统/运行状态]

💡 下一步建议
1. [针对性建议]
```

---

## Code Standards (from coding-style rule)

### Small File Principle
- Keep each file within 200-400 lines, split when exceeding 400
- Files exceeding 800 lines are prohibited

### Immutability First
- Use `@dataclass(frozen=True)` for configuration
- Avoid mutating input parameters

### Type Hints
- All functions must have type hints
- Use types from the `typing` module

### Import Order
1. Standard library
2. Third-party libraries
3. Local modules

### Naming Conventions
- Classes: PascalCase
- Functions/variables: snake_case
- Constants: UPPER_SNAKE_CASE
- Private: underscore prefix

### ML Project Patterns
- Factory & Registry pattern for all modules
- Config-driven models (`__init__` only accepts `cfg`)
- Auto-import pattern for module discovery

### Prohibited Patterns
- Nesting deeper than 4 levels
- Mutable default arguments
- Global variables (use config)
- Bare `except:`
- Hardcoded hyperparameters
- `print()` debug statements (use logger)
- Unused imports

---

## Agent Orchestration (from agents rule)

### Automatic Agent Invocation
1. Code just written/modified → **code-reviewer**
2. Build failure → **build-error-resolver**
3. Complex feature request → **dev-planner** then **architect**
4. Bug report → **bug-analyzer**
5. New feature with tests → **tdd-guide**

### Parallel Task Execution
ALWAYS use parallel execution for independent operations.

### Multi-Perspective Analysis
For complex problems, use split-role sub-agents:
- Factual reviewer, Senior engineer, Security expert, Consistency reviewer

---

## Security Rules (from security rule)

### Secrets Management
- API keys, tokens, passwords must NEVER appear in committed files
- Use environment variables or `.env` files (gitignored)
- `settings.json` is excluded from Git

### Sensitive Files (NEVER commit)
`settings.json`, `.env`, `*.pem`, `*.key`, `credentials.json`, `*_secret*`, `*_token*`, `*.sqlite`, `*.db`

### Prohibited in Source Code
- Hardcoded passwords or API keys
- Hardcoded IP addresses or internal URLs
- Disabled SSL verification without justification
- `eval()` or `exec()` with user input
- SQL string concatenation

---

## Experiment Reproducibility (from experiment-reproducibility rule)

### Random Seed Management
- Always set seeds: `random`, `numpy`, `torch`, `torch.cuda`, `PYTHONHASHSEED`
- Use `torch.backends.cudnn.deterministic = True`

### Configuration Recording
- Hydra auto-saves configs to `outputs/` directory
- Log experiment configuration at start

### Environment Recording
- Record Python version, torch version, CUDA version, GPU model
- Save `pip freeze` alongside experiment results

### Checkpoint Management
- Save best model (by validation metric) + last N checkpoints
- Include optimizer and scheduler state for resumption
- Naming: `best_model.pt`, `checkpoint_epoch_N.pt`, `checkpoint_latest.pt`

### Dataset Version Tracking
- Record dataset hash or version tag in experiment logs
- Document preprocessing steps

---

## Codex CLI 特有配置

### Sandbox 模式
- 当前配置：`sandbox_mode = "workspace-write"`
- 限制文件写入范围至工作区目录
- 提供网络隔离保护

### 配置文件路径
- 主配置：`~/.codex/config.toml`
- Agent 配置：`~/.codex/agents/<name>/config.toml`
- Skills：项目 `skills/` 目录，在 config.toml 中注册

---

## Session Start Protocol

When starting a new session, ALWAYS:
1. Check git status and display current branch + uncommitted changes
2. List available skills relevant to the current project context
3. Show recent TODOs if any exist
4. Display a brief summary of the project state

---

## Skill Evaluation Protocol

Before responding to ANY user message, evaluate all available skills and invoke the most relevant one. This is mandatory, not optional.

If you think there is even a 1% chance a skill might apply, you MUST check it. Do not rationalize skipping skill evaluation with thoughts like "this is just a simple question" or "I can handle this without a skill."

---

## Session Wrap-Up Protocol

When the user says "wrap up", "总结", "session end", or similar:
1. Generate a work log summarizing what was accomplished
2. Check if AGENTS.md needs updates based on changes made
3. Remind about any temporary files that should be cleaned up
4. Show git status for uncommitted changes

---

## Security Rules (Sandbox-Enforced)

Two layers of protection:

### Layer 1: Codex Sandbox
- `sandbox_mode = "workspace-write"` restricts file writes to workspace
- Network isolation prevents unauthorized external access

### Layer 2: Instruction-Based Rules
- NEVER hardcode API keys, tokens, or passwords in source code
- NEVER execute: `rm -rf /`, `dd if=/dev/zero`, `mkfs.*`
- WARN before: `git push --force`, `git reset --hard`, `chmod 777`, `DROP DATABASE/TABLE`
- NEVER write to system paths: `/etc/`, `/usr/bin/`, `/sbin/`, `/System/`
- NEVER commit sensitive files: `.env`, `*.pem`, `*.key`, `credentials.json`, `settings.json`
