# Claude Scholar (OpenCode Edition)

<div align="center">
  <img src="LOGO.jpeg" alt="Claude Scholar Logo" width="100%"/>

  <p>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/stargazers"><img src="https://img.shields.io/github/stars/Galaxy-Dawn/claude-scholar?style=flat-square&color=yellow" alt="Stars"/></a>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/network/members"><img src="https://img.shields.io/github/forks/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Forks"/></a>
    <img src="https://img.shields.io/github/last-commit/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Last Commit"/>
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/OpenCode-Compatible-blueviolet?style=flat-square" alt="OpenCode"/>
  </p>

  <strong>Language</strong>: <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a>
</div>

> Personal OpenCode configuration for academic research and software development — covering the full research lifecycle from ideation to publication.

> **Note**: This is the **OpenCode edition** of Claude Scholar. For other versions:
> - Claude Code CLI: [`main` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/main)
> - Codex CLI (OpenAI): [`codex` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/codex) — see [INSTALL-CODEX.md](INSTALL-CODEX.md)

## News

- **2026-02-23**: Added `setup.sh` installer — safe merge into existing `~/.opencode`, auto-backup `opencode.jsonc`
- **2026-02-22**: Added Zotero MCP server to `opencode.jsonc` — enables literature management commands (`/zotero-review`, `/zotero-notes`) out of the box
- **2026-02-21**: OpenCode migration — ported entire configuration to OpenCode format: hooks→plugins (TypeScript), agents→opencode.jsonc, CLAUDE.md→AGENTS.md, added permission rules, file-based commands preserved

<details>
<summary>View older changelog</summary>

- **2026-02-20**: Bilingual config — translated `CLAUDE.md` to English for international readability
- **2026-02-15**: Zotero MCP integration — added `/zotero-review` and `/zotero-notes` commands, updated `research-ideation` skill with Zotero integration guide
- **2026-02-14**: Hooks optimization — restructured `security-guard` to two-tier system (Block + Confirm), `skill-forced-eval` now groups skills into 6 categories with silent scan mode
- **2026-02-11**: Major update — added 10 new skills, 7 new agents, 8 research workflow commands, 2 new rules; 89 files changed
- **2026-01-25**: Project open-sourced, v1.0.0 released

</details>

## Introduction

Claude Scholar (OpenCode Edition) is a configuration system for [OpenCode](https://github.com/sst/opencode) CLI, providing rich skills, commands, agents, and plugins optimized for:
- **Academic Research** - Complete research lifecycle: idea generation → experimentation → results analysis → paper writing → review response → conference preparation
- **Software Development** - Git workflows, code review, test-driven development, ML project architecture
- **Plugin Development** - Skill, Command, Agent, Plugin development guides with quality assessment
- **Project Management** - Planning documents, code standards, automated workflows with cross-platform plugins

## Quick Navigation

| Topic | Description |
|-------|-------------|
| [Quick Start](#quick-start) | Get up and running in minutes |
| [Core Workflows](#core-workflows) | Paper writing, code organization, skill evolution |
| [What's Included](#whats-included) | Skills, commands, agents overview |
| [Installation Guide](#installation-options) | Full, minimal, or selective setup |
| [MCP Setup](#mcp-server-setup-optional) | Zotero MCP for research workflows |
| [Project Rules](#project-rules) | Coding style and agent orchestration |

## Core Workflows

### Primary Workflows

Complete academic research lifecycle - 7 stages from idea to publication.

#### 1. Research Ideation (Zotero-Integrated)

End-to-end research startup from idea generation to literature management:

**Tools**: `research-ideation` skill + `literature-reviewer` agent + Zotero MCP

**Process**:
- **5W1H Brainstorming**: What, Why, Who, When, Where, How → structured thinking framework
- **Literature Search & Import**: WebSearch finds papers → extract DOIs → auto-import to Zotero via `add_items_by_doi` → classify into themed sub-collections
- **PDF & Full-Text**: `find_and_attach_pdfs` batch-attaches open-access PDFs → `get_item_fulltext` reads full paper content for deep analysis
- **Gap Analysis**: 5 types (Literature, Methodological, Application, Interdisciplinary, Temporal) → identify 2-3 concrete research opportunities
- **Research Question**: SMART principles → formulate specific, measurable questions
- **Method Selection & Planning**: Evaluate method applicability → timeline, milestones, risk assessment

**Commands**: `/research-init`, `/zotero-review`, `/zotero-notes`

#### 2. ML Project Development

**Tools**: `architecture-design` skill + `code-reviewer` agent + `git-workflow` skill

**Process**:
- **Structure**: Factory & Registry patterns → config-driven models (only `cfg` parameter) → enforced by `rules/coding-style.md`
- **Code Style**: 200-400 line files → type hints required → `@dataclass(frozen=True)` for configs → max 3-level nesting
- **Debug** (`bug-detective`): Error pattern matching for Python/Bash/JS → stack trace analysis
- **Git**: Conventional Commits (`feat/scope: message`) → branch strategy (master/develop/feature) → merge with `--no-ff`

**Commands**: `/plan`, `/commit`, `/code-review`, `/tdd`

#### 3. Experiment Analysis

**Tools**: `results-analysis` skill + `data-analyst` agent

**Process**:
- **Statistical Testing**: t-test, ANOVA, Wilcoxon signed-rank → validate significance
- **Visualization**: matplotlib/seaborn integration → publication-ready figures
- **Ablation Studies**: Systematic component analysis

**Command**: `/analyze-results <experiment_dir>`

#### 4. Paper Writing

**Tools**: `ml-paper-writing` skill + `paper-miner` agent + `latex-conference-template-organizer` skill

**Process**:
- **Template Preparation**: Download conference .zip → extract main files → clean Overleaf-ready structure
- **Citation Verification** (`citation-verification`): Multi-layer validation (Format → API → Information → Content)
- **Systematic Writing**: Narrative framing → 5-sentence abstract formula → section-by-section drafting
- **Anti-AI Processing** (`writing-anti-ai`): Remove inflated symbolism, promotional language → add human voice

**Venues**: NeurIPS, ICML, ICLR, ACL, AAAI, COLM, Nature, Science, Cell, PNAS

#### 5. Paper Self-Review

**Tools**: `paper-self-review` skill — 6-item quality checklist (structure, logic, citations, figures, writing, compliance)

#### 6. Submission & Rebuttal

**Tools**: `review-response` skill + `rebuttal-writer` agent

**Command**: `/rebuttal <review_file>`

#### 7. Post-Acceptance Processing

**Tools**: `post-acceptance` skill

**Commands**: `/presentation`, `/poster`, `/promote`

**Coverage**: 90% of academic research lifecycle (from idea to publication)

### Supporting Workflows

#### Automated Plugin Workflow

Cross-platform TypeScript plugins automate workflow enforcement:

- **skill-eval** (`skill-eval.ts`): Before EVERY command → scans available skills → matches relevant skills to user input → ensures no relevant skill is missed
- **session-start** (`session-start.ts`): Session begins → displays Git status, pending todos → shows project context at a glance
- **session-summary** (`session-summary.ts`): Session ends → generates comprehensive work log → summarizes all changes → provides smart recommendations
- **stop-summary** (`stop-summary.ts`): Session updates → lightweight status check
- **security-guard** (`security-guard.ts`): Before tool execution → **Block tier**: rejects catastrophic commands (rm -rf /, dd, mkfs); **Warn tier**: flags dangerous-but-legitimate operations (git push --force, git reset --hard, chmod 777)

**Cross-platform**: All plugins use TypeScript, ensuring Windows/macOS/Linux compatibility.

#### Knowledge Extraction Workflow

- **paper-miner** (agent): Analyze research papers → extract writing patterns, structure insights, venue requirements
- **kaggle-miner** (agent): Study winning Kaggle solutions → extract technical analysis, code templates, best practices

#### Skill Evolution System

```
skill-development → skill-quality-reviewer → skill-improver
```

## What's Included

### Skills (32 total)

**Research Workflow:**
- `research-ideation` - Research startup: 5W1H brainstorming, literature review, gap analysis
- `results-analysis` - Experiment analysis: statistical testing, visualization, ablation studies
- `citation-verification` - Multi-layer citation validation
- `daily-paper-generator` - Automated daily paper generation for research tracking

**Writing & Academic:**
- `ml-paper-writing` - Full paper writing guidance for top conferences/journals
- `writing-anti-ai` - Remove AI writing patterns (bilingual support)
- `paper-self-review` - 6-item quality checklist
- `review-response` - Systematic rebuttal writing
- `post-acceptance` - Conference preparation: presentations, posters, promotion
- `doc-coauthoring` - Structured document collaboration workflow
- `latex-conference-template-organizer` - LaTeX template management

**Development:**
- `daily-coding` - Daily coding checklist (minimal, auto-triggered)
- `git-workflow` - Git best practices (Conventional Commits, branching)
- `code-review-excellence` - Code review guidelines
- `bug-detective` - Debugging for Python, Bash, JS/TS
- `architecture-design` - ML project design patterns
- `verification-loop` - Testing and validation

**Web Design:**
- `frontend-design` - Create distinctive, production-grade frontend interfaces
- `ui-ux-pro-max` - UI/UX design intelligence (50+ styles, 97 palettes, 9 stacks)
- `web-design-reviewer` - Visual inspection and design issue fixing

**Plugin Development:**
- `skill-development` / `skill-improver` / `skill-quality-reviewer` - Skill lifecycle
- `command-development` / `command-name` - Command creation
- `agent-identifier` - Agent configuration
- `hook-development` - Plugin development guide
- `mcp-integration` - MCP server integration

**Utilities:**
- `uv-package-manager` - Modern Python package management
- `planning-with-files` - Markdown-based planning
- `webapp-testing` - Local web application testing
- `kaggle-learner` - Learn from Kaggle solutions

### Commands (50+)

**Research Commands:**

| Command | Purpose |
|---------|---------|
| `/research-init` | Launch research startup workflow (5W1H, literature review, gap analysis) |
| `/zotero-review` | Read papers from Zotero collection, generate structured literature review |
| `/zotero-notes` | Batch read Zotero papers, generate structured reading notes |
| `/analyze-results` | Analyze experiment results (statistics, visualization, ablation) |
| `/rebuttal` | Generate systematic rebuttal document from review comments |
| `/presentation` | Create conference presentation outline |
| `/poster` | Generate academic poster design plan |
| `/promote` | Generate promotion content (Twitter, LinkedIn, blog) |

**Development Commands:**

| Command | Purpose |
|---------|---------|
| `/plan` | Create implementation plans |
| `/commit` | Commit with Conventional Commits |
| `/update-github` | Commit and push to GitHub |
| `/update-readme` | Update README documentation |
| `/update-memory` | Check and update AGENTS.md memory |
| `/code-review` | Perform code review |
| `/tdd` | Test-driven development workflow |
| `/build-fix` | Fix build errors |
| `/verify` | Verify changes |
| `/checkpoint` | Create checkpoints |
| `/refactor-clean` | Refactor and cleanup |
| `/learn` | Extract reusable patterns |
| `/create_project` | Create new project from template |
| `/setup-pm` | Configure package manager (uv/pnpm) |
| `/sc` | SuperClaude command suite (30 commands) |

### Agents (14 specialized)

Agents are defined in `opencode.jsonc` and invoked automatically or on demand.

**Research Agents:**
- **literature-reviewer** - Literature search, classification, and trend analysis
- **data-analyst** - Automated data analysis and visualization
- **rebuttal-writer** - Systematic rebuttal writing with tone optimization
- **paper-miner** - Extract paper writing knowledge from successful publications

**Development Agents:**
- **architect** - System architecture design
- **build-error-resolver** - Fix build errors
- **code-reviewer** - Review code quality
- **refactor-cleaner** - Remove dead code
- **tdd-guide** - Guide TDD workflow
- **kaggle-miner** - Extract Kaggle engineering practices
- **bug-analyzer** - Deep code execution flow analysis and root cause investigation
- **dev-planner** - Implementation planning and task breakdown

**Design & Content Agents:**
- **ui-sketcher** - UI blueprint design and interaction specs
- **story-generator** - User story and requirement generation

## File Structure

<details>
<summary>View file structure</summary>

```
claude-scholar/                  # OpenCode edition
├── opencode.jsonc               # Core config: agents, MCP, permissions
├── AGENTS.md                    # Project context (replaces CLAUDE.md)
├── package.json                 # Plugin dependencies (@opencode-ai/plugin)
│
├── plugins/                     # TypeScript plugins (replaces hooks/)
│   ├── lib/
│   │   └── common.ts                   # Shared utilities (git info, todo info)
│   ├── session-start.ts                # Session begin - Git status, todos
│   ├── skill-eval.ts                   # Skill matching on command execute
│   ├── session-summary.ts              # Session end - work log generation
│   ├── stop-summary.ts                 # Session update - status check
│   └── security-guard.ts              # Tool execution guard (block + warn)
│
├── skills/                      # 32 specialized skills (same as Claude Code version)
│   ├── ml-paper-writing/
│   ├── research-ideation/
│   ├── results-analysis/
│   ├── review-response/
│   ├── writing-anti-ai/
│   ├── architecture-design/
│   ├── git-workflow/
│   ├── bug-detective/
│   └── ... (24 more skills)
│
├── commands/                    # 50+ slash commands (file-based, one .md per command)
│   ├── research-init.md
│   ├── zotero-review.md
│   ├── commit.md
│   ├── plan.md
│   └── sc/                      # SuperClaude command suite (30 commands)
│
├── rules/                       # Global guidelines (merged into AGENTS.md)
│   ├── coding-style.md
│   ├── agents.md
│   ├── security.md
│   └── experiment-reproducibility.md
│
├── scripts/                     # Utility scripts
│   ├── setup-package-manager.js
│   └── lib/
│
├── utils/                       # Python utilities
│   └── platform_utils.py
│
├── LOGO.jpeg
├── README.md                    # This file
└── README.zh-CN.md              # Chinese version
```

</details>

## Quick Start

### Installation Options

#### Option 1: Full Installation (Recommended)

Safe merge into existing `~/.opencode` directory — won't overwrite personal data:

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

The script copies skills/commands/plugins/scripts/utils into `~/.opencode` and installs `opencode.jsonc` (auto-backup to `opencode.jsonc.bak`).

**Includes**: All 32 skills, 50+ commands, 14 agents, 5 plugins, and project rules.

#### Option 2: Minimal Installation

Core plugins and essential skills only:

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar

mkdir -p ~/.opencode/plugins/lib ~/.opencode/skills
cp /tmp/claude-scholar/plugins/*.ts ~/.opencode/plugins/
cp /tmp/claude-scholar/plugins/lib/common.ts ~/.opencode/plugins/lib/
cp /tmp/claude-scholar/opencode.jsonc ~/.opencode/
cp /tmp/claude-scholar/package.json ~/.opencode/
cp -r /tmp/claude-scholar/skills/ml-paper-writing ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/research-ideation ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/results-analysis ~/.opencode/skills/
cp -r /tmp/claude-scholar/skills/git-workflow ~/.opencode/skills/

rm -rf /tmp/claude-scholar
```

**Post-install**: If you already had `opencode.jsonc`, back it up first — this overwrites it with the full agent/mcp/permission config.

#### Option 3: Selective Installation

```bash
git clone -b opencode https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar

# Copy what you need:
cp /tmp/claude-scholar/opencode.jsonc ~/.opencode/
cp /tmp/claude-scholar/plugins/*.ts ~/.opencode/plugins/
cp -r /tmp/claude-scholar/skills/architecture-design ~/.opencode/skills/
cp -r /tmp/claude-scholar/commands/commit.md ~/.opencode/commands/
```

**Post-install**: Back up your existing `opencode.jsonc` before copying.

### Requirements

- [OpenCode](https://github.com/sst/opencode) CLI
- Git
- (Optional) uv, Python (for Python development)
- (Optional) [Zotero](https://www.zotero.org/) + [zotero-mcp-server](https://pypi.org/project/zotero-mcp-server/) (for literature management)

### MCP Server Setup (Optional)

For Zotero-integrated research workflows, install the MCP server:

```bash
# Install Zotero MCP server
uv tool install zotero-mcp-server

# Enable Local API in Zotero desktop app:
# Edit → Settings → Advanced → Check "Allow other applications on this computer to communicate with Zotero"
```

The Zotero MCP server is already configured in `opencode.jsonc`. If you installed via Option 1 (Full Installation), it works out of the box.

For selective installations, ensure your `opencode.jsonc` includes:

```jsonc
"mcp": {
  "zotero": {
    "type": "local",
    "command": ["zotero-mcp", "serve"],
    "enabled": true
  }
}
```

### First Run

After installation, the plugins provide automated workflow assistance:

1. **Every command** triggers `skill-eval` → ensures applicable skills are considered
2. **Session starts** with `session-start` → displays project context
3. **Sessions end** with `session-summary` → generates work log with recommendations
4. **Tool execution** guarded by `security-guard` → blocks dangerous commands

## Key Differences from Claude Code Version

| Aspect | Claude Code (`main` branch) | OpenCode (`opencode` branch) |
|--------|---------------------------|------------------------------|
| Config file | `CLAUDE.md` | `AGENTS.md` + `opencode.jsonc` |
| Hooks | JavaScript (`hooks/*.js`) | TypeScript plugins (`plugins/*.ts`) |
| Agents | Markdown files (`agents/*.md`) | JSON config in `opencode.jsonc` |
| Permissions | Hook-based (`security-guard.js`) | `opencode.jsonc` permission rules + plugin |
| MCP | `settings.json` | `opencode.jsonc` mcp section |
| Skills | Same format | Same format (compatible) |
| Commands | Same format | Same format (file-based `.md`) |

## Project Rules

### Coding Style

Enforced by `rules/coding-style.md`:
- **File Size**: 200-400 lines maximum
- **Immutability**: Use `@dataclass(frozen=True)` for configs
- **Type Hints**: Required for all functions
- **Patterns**: Factory & Registry for all modules
- **Config-Driven**: Models accept only `cfg` parameter

### Agent Orchestration

Defined in `rules/agents.md`:
- Available agent types and purposes
- Parallel task execution
- Multi-perspective analysis

### Security

Defined in `rules/security.md` + `opencode.jsonc` permission rules:
- Secrets management (environment variables, `.env` files)
- Sensitive file protection (never commit tokens, keys, credentials)
- Tool execution guard via `security-guard.ts` plugin

### Experiment Reproducibility

Defined in `rules/experiment-reproducibility.md`:
- Random seed management for reproducibility
- Configuration recording (Hydra auto-save)
- Environment recording and checkpoint management

## Contributing

This is a personal configuration, but you're welcome to:
- Fork and adapt for your own research
- Submit issues for bugs
- Suggest improvements via issues

## License

MIT License

## Acknowledgments

Built with [OpenCode](https://github.com/sst/opencode) CLI and enhanced by the open-source community.

### References

- **[everything-claude-code](https://github.com/anthropics/everything-claude-code)** - Comprehensive resource for Claude Code CLI
- **[AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs)** - Research-focused skills and configurations

---

**For data science, AI research, and academic writing.**

Repository: [https://github.com/Galaxy-Dawn/claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)
