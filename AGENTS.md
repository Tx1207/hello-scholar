# hello-scholar 配置

## 项目概述

**hello-scholar** - 面向学术研究和软件开发的 semi-automated research assistant（Codex CLI 版）

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
- **关注点**: 学术写作质量、逻辑连贯性、自然表达、代码简洁、模型高效

### 技术栈偏好

**Python 生态**:
- **包管理**: `uv` - 现代化 Python 包管理器 or `conda`
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

### 项目资产目录约定
- `.hello-scholar/` 只用于 `standby` 运行时安装目录，不承载项目记录资产
- `hello-scholar/` 用于项目级资产，至少可包含：
  - `hello-scholar/changes/`
  - `hello-scholar/state/`
  - `hello-scholar/plans/`
  - `hello-scholar/evidence/`
  - `hello-scholar/research/`
- 项目产生的长期记录优先写入 `hello-scholar/`，避免混入运行时目录

### ROUTE / TIER 执行路由

每次实质性请求先做两步判断，再决定调用哪些 skills：

1. **TIER**
   - `T0`: 探索、澄清、收集上下文
   - `T1`: 规划、方案设计、任务拆解
   - `T2`: 实现、编辑、构建
   - `T3`: 验证、交付、收尾
2. **ROUTE**
   - `~idea`: 只探索，不产生副作用
   - `~plan`: 生成方案包、任务拆解、风险清单
   - `~build`: 实施变更
   - `~verify`: 跑验证、整理证据、检查交付门槛
   - `~prd`: 面向文档/交付物收束
   - `~auto`: 无法稳定归类时的保守默认

执行原则：

- 先判断 `TIER` 和 `ROUTE`，再决定 skill 组合
- `~idea` 默认零副作用，不写项目文件、不改代码
- 从 `~plan` 进入 `~build` 前，要明确任务范围与涉及文件
- 从 `~build` 进入 `~verify` 前，要先记录已做出的真实修改

---

## 核心工作流

### 研究生命周期（7 阶段）

```
构思 → ML开发 → 实验分析 → 论文写作 → 自审 → 投稿/Rebuttal → 录用后处理
```

| 阶段 | 核心工具 | 自然语言入口示例 |
|------|---------|------------------|
| 1. 研究构思 | `research-ideation` skill + `literature-reviewer` agent | “start research on ...”, “review this Zotero collection” |
| 2. ML 项目开发 | `architecture-design` skill + `code-reviewer` agent | “create a plan”, “review my code”, “run TDD” |
| 3. 实验分析 | `results-analysis` skill + `results-report` skill | “analyze results in ...”, “write a results report for this experiment” |
| 4. 论文写作 | `ml-paper-writing` skill + `paper-miner` agent | “draft the paper”, “mine writing patterns from this paper” |
| 5. 论文自审 | `paper-self-review` skill | “self-review this draft” |
| 6. 投稿与 Rebuttal | `review-response` skill + `rebuttal-writer` agent | “write rebuttal for these reviews” |
| 7. 录用后处理 | `post-acceptance` skill | “prepare slides”, “design poster”, “promote this paper” |

### 支撑工作流

- **Zotero 集成**: 通过 Zotero MCP 服务器实现论文自动导入、集合管理、全文阅读和准确引用导出
- **知识提取**: `paper-miner` 将论文中的可复用写作模式沉淀到一份全局 canonical writing memory；`kaggle-miner` 持续从竞赛方案中提取工程知识
- **Obsidian 知识库**: 已内置 filesystem-first 项目知识库工作流；当仓库已绑定 project memory 时，应默认把 Obsidian 视为该科研项目的 durable knowledge sink
- **技能进化**: `skill-development` → `skill-quality-reviewer` → `skill-improver` 三步改进循环

### Obsidian 项目知识库规则

- 若当前仓库包含 `hello-scholar/project-memory/registry.yaml`，默认启用 `obsidian-project-memory`，把 Obsidian 作为该项目的默认知识库。
- 若仓库尚未绑定但明显像科研项目，则默认启用 `obsidian-project-bootstrap`。
- 对于实质性的科研回合，至少维护当天 `Daily/` 与 repo-local project memory；只有项目顶层状态变化时才更新 `00-Hub.md`。
- Obsidian 工作流不依赖 MCP，也不要求额外 API key。

### 项目级变更追踪协议

对“会影响项目内容、代码、实验、文档或配置”的请求，默认启用项目级变更追踪。

记录目标：

- 记录用户提出的修改
- 记录 AI 实际完成的修改
- 记录验证结果与下一步
- 让记录以人类可读的 Markdown 为主，同时保留机器可解析的 frontmatter

默认目录：

- `hello-scholar/changes/INDEX.md`
- `hello-scholar/changes/*.md`
- `hello-scholar/state/STATE.md`
- `hello-scholar/plans/<plan-id>/`
- `hello-scholar/evidence/<target-id>/`

默认调用时机：

1. 用户提出实质性修改请求后：
   - 运行 `track-intent`
2. 进入规划阶段并需要持久方案时：
   - 创建 `hello-scholar/plans/<plan-id>/`
   - 写入 `requirements.md / plan.md / tasks.md / contract.json`
2. 发生真实编辑并形成可描述变更后：
   - 运行 `track-change`
3. 跑验证并形成证据时：
   - 写入 `hello-scholar/evidence/<target-id>/`
   - 用 delivery gate 检查是否满足交付条件
3. 阶段结束或任务关闭时：
   - 运行 `track-closeout`

新建 / 追加判断原则：

- 主目标不变、涉及文件高度重合、用户在继续补充时，优先追加到当前 change file
- 主目标切换、涉及文件明显变化、用户明确说“新任务 / 另一个问题”时，创建新的 change file
- 当前 change 已 `done / closed` 时，不再继续追加

记录格式要求：

- 每个变更主题一个 `*.md`
- 必须包含 `User Requests`
- 必须包含 `Actual Changes`
- 需要时补 `Verification`、`Result`、`Next Step`
- `STATE.md` 只维护当前活跃主题摘要，不替代明细记录

---

## 技能目录（55 skills）

### 研究与分析 (5)
- **research-ideation**: 研究构思启动
- **results-analysis**: 严格实验分析
- **results-report**: 实验后完整总结报告
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
- **command-development / plugin-structure**: 命令开发
- **agent-identifier**: Agent 开发配置
- **hook-development**: Hook 开发
- **mcp-integration**: MCP 服务器集成

### 工具与实用 (5)
- **planning-with-files**: Markdown 规划
- **uv-package-manager**: uv 包管理器
- **webapp-testing**: Web 应用测试
- **kaggle-learner**: Kaggle 竞赛学习
- **codex-hook-emulation**: 用 AGENTS + helper script 近似 Claude Code hooks

### Obsidian 知识库 (12)
- **obsidian-project-memory**: 默认项目知识库总控
- **obsidian-project-bootstrap**: 新项目/旧项目导入
- **obsidian-research-log**: daily、plan、hub 与稳定进展路由
- **obsidian-experiment-log**: 实验与结果日志
- **obsidian-project-lifecycle**: detach / archive / purge / note lifecycle
- **obsidian-literature-workflow**: paper notes 与文献综合工作流
- **zotero-obsidian-bridge**: Zotero -> Obsidian durable paper notes
- **obsidian-link-graph**: legacy link repair helper
- **obsidian-synthesis-map**: legacy synthesis helper
- **obsidian-markdown**: vendored 官方 Obsidian Markdown skill
- **obsidian-cli**: vendored 官方 Obsidian CLI skill
- **obsidian-bases / json-canvas / defuddle**: vendored 官方可选辅助

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

For hook emulation, use the helper path that matches the current mode:
- `standby`: `python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`
- `global`: `python3 "$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`

When starting a new session, ALWAYS:
1. Run the current-mode hook helper with `session-start --cwd "$PWD"` when available
2. Check git status and display current branch + uncommitted changes
3. List available skills relevant to the current project context
4. Show recent TODOs if any exist
5. Display a brief summary of the project state

---

## Codex Hook Emulation Protocol

Because Codex does not expose native Claude Code hooks, emulate the highest-value hook behavior through `codex-hook-emulation` plus AGENTS discipline:

1. **SessionStart surrogate**
   - Use the current-mode hook helper with `session-start --cwd "$PWD"` at the first substantive repo turn.
2. **Intent tracking surrogate**
   - For substantial project changes, run:
     - `track-intent --cwd "$PWD" --request "<user request>"`
   - Add `--title`, `--route`, `--tier`, and `--file` when those facts are already clear.
2. **PreToolUse surrogate**
   - Before dangerous or irreversible operations, run:
     - current-mode hook helper + `preflight "<command>"`
   - Interpret exit codes:
     - `0` allow
     - `3` confirm with user first
     - `2` block by default
3. **PostToolUse surrogate**
   - After meaningful edits, run:
     - current-mode hook helper + `post-edit --cwd "$PWD"`
   - Then, for substantial project changes, run:
     - `track-change --cwd "$PWD" --summary "<actual change summary>"`
   - Use the output to decide verification and minimum Obsidian write-back.
4. **Stop / SessionEnd surrogate**
   - Before closeout, for substantial tracked work, run:
     - `track-closeout --cwd "$PWD" --status done`
   - Before closeout, run:
     - current-mode hook helper + `session-end --cwd "$PWD"`
   - Then apply `session-wrap-up`.

---

## Skill Evaluation Protocol

Before responding to ANY user message, evaluate all available skills and invoke the most relevant one. This is mandatory, not optional.

If you think there is even a 1% chance a skill might apply, you MUST check it. Do not rationalize skipping skill evaluation with thoughts like "this is just a simple question" or "I can handle this without a skill."

---

## Session Wrap-Up Protocol

When the user says "wrap up", "总结", "session end", or similar:
1. Run the current-mode hook helper with `session-end --cwd "$PWD"` when available
2. Generate a work log summarizing what was accomplished
3. Check if AGENTS.md needs updates based on changes made
4. Remind about any temporary files that should be cleaned up
5. Show git status for uncommitted changes

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
- Prefer the current-mode hook helper with `preflight "<command>"` before high-risk shell actions
