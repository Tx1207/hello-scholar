# Claude Scholar (Codex CLI Edition)

<div align="center">
  <img src="LOGO.png" alt="Claude Scholar Logo" width="100%"/>

  <p>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/stargazers"><img src="https://img.shields.io/github/stars/Galaxy-Dawn/claude-scholar?style=flat-square&color=yellow" alt="Stars"/></a>
    <a href="https://github.com/Galaxy-Dawn/claude-scholar/network/members"><img src="https://img.shields.io/github/forks/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Forks"/></a>
    <img src="https://img.shields.io/github/last-commit/Galaxy-Dawn/claude-scholar?style=flat-square" alt="Last Commit"/>
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
    <img src="https://img.shields.io/badge/Codex_CLI-Compatible-blue?style=flat-square" alt="Codex CLI"/>
  </p>

  <strong>Language</strong>: <a href="README.md">English</a> | <a href="README.zh-CN.md">中文</a>
</div>

> Personal [Codex CLI](https://github.com/openai/codex) configuration for academic research and software development — covering the full research lifecycle from ideation to publication.

> **Note**: This is the **Codex CLI edition** of Claude Scholar. For the Claude Code CLI version, see the [`main` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/main). For the **OpenCode** version, see the [`opencode` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/opencode).

## News

- **2026-02-26**: Zotero MCP Web API mode — switched from local-only to Web API mode ([Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp)), supports remote access without Zotero desktop app; added `MCP_SETUP.md` setup guide
- **2026-02-25**: Codex CLI migration — ported from OpenCode to Codex CLI format: TOML config, independent agent directories, commands merged into skills (32→40), hooks replaced by AGENTS.md instructions + sandbox, interactive `setup.sh` with merge support
- **2026-02-23**: Added `setup.sh` installer — safe merge into existing config, auto-backup

<details>
<summary>View older changelog</summary>

- **2026-02-22**: Added Zotero MCP server — enables literature management out of the box
- **2026-02-21**: OpenCode migration — hooks→plugins (TypeScript), agents→opencode.jsonc, CLAUDE.md→AGENTS.md
- **2026-02-15**: Zotero MCP integration — added `/zotero-review` and `/zotero-notes` commands
- **2026-02-11**: Major update — added 10 new skills, 7 new agents, 8 research workflow commands; 89 files changed
- **2026-01-25**: Project open-sourced, v1.0.0 released

</details>

## Introduction

Claude Scholar (Codex Edition) is a configuration system for [Codex CLI](https://github.com/openai/codex), providing rich skills, agents, and MCP integrations optimized for:
- **Academic Research** - Complete research lifecycle: idea generation → experimentation → results analysis → paper writing → review response → conference preparation
- **Software Development** - Git workflows, code review, test-driven development, ML project architecture
- **Project Management** - Planning documents, code standards, automated workflows via AGENTS.md instructions

## Quick Navigation

| Topic | Description |
|-------|-------------|
| [Quick Start](#quick-start) | Get up and running with setup.sh |
| [Core Workflows](#core-workflows) | Paper writing, code organization, skill evolution |
| [What's Included](#whats-included) | Skills, agents overview |
| [Installation Guide](#installation-options) | Full install or manual setup |
| [MCP Setup](#mcp-server-setup) | Zotero MCP for research workflows |
| [Migration Notes](#key-differences-from-opencode-version) | What changed from OpenCode edition |

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

**Trigger**: "start research", "review literature", "generate reading notes"

#### 2. ML Project Development

**Tools**: `architecture-design` skill + `code-reviewer` agent + `git-workflow` skill

**Process**:
- **Structure**: Factory & Registry patterns → config-driven models (only `cfg` parameter) → enforced by AGENTS.md coding style rules
- **Code Style**: 200-400 line files → type hints required → `@dataclass(frozen=True)` for configs → max 3-level nesting
- **Debug** (`bug-detective`): Error pattern matching for Python/Bash/JS → stack trace analysis
- **Git**: Conventional Commits (`feat/scope: message`) → branch strategy (master/develop/feature) → merge with `--no-ff`

**Trigger**: "create a plan", "commit changes", "review my code", "run TDD"

#### 3. Experiment Analysis

**Tools**: `results-analysis` skill + `data-analyst` agent

**Process**:
- **Statistical Testing**: t-test, ANOVA, Wilcoxon signed-rank → validate significance
- **Visualization**: matplotlib/seaborn integration → publication-ready figures
- **Ablation Studies**: Systematic component analysis

**Trigger**: "analyze results in <experiment_dir>"

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

**Trigger**: "write rebuttal for <review_file>"

#### 7. Post-Acceptance Processing

**Tools**: `post-acceptance` skill

**Trigger**: "prepare presentation", "design poster", "promote paper"

**Coverage**: 90% of academic research lifecycle (from idea to publication)

### Supporting Workflows

#### Workflow Automation

In the Codex edition, automated workflows are handled through:

- **AGENTS.md instructions**: Session start protocol, skill evaluation guidance, and security rules are embedded as directives in `AGENTS.md` — Codex reads this file automatically
- **Sandbox mode**: `sandbox_mode = "workspace-write"` provides file write restrictions and network isolation, replacing the hook-based security guard
- **session-wrap-up** (skill): Manual trigger at session end to generate work logs and cleanup reminders — replaces the automatic session-summary hook

#### Knowledge Extraction Workflow

- **paper-miner** (agent): Analyze research papers → extract writing patterns, structure insights, venue requirements
- **kaggle-miner** (agent): Study winning Kaggle solutions → extract technical analysis, code templates, best practices

#### Skill Evolution System

```
skill-development → skill-quality-reviewer → skill-improver
```

## What's Included

### Skills (40 total)

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
- `mcp-integration` - MCP server integration

**Utilities:**
- `uv-package-manager` - Modern Python package management
- `planning-with-files` - Markdown-based planning
- `webapp-testing` - Local web application testing
- `kaggle-learner` - Learn from Kaggle solutions

**Migrated from Commands (8 new):**
- `git-commit` - Commit with Conventional Commits
- `git-push` - Commit and push to GitHub
- `readme-updater` - Update README documentation
- `build-fixer` - Fix build errors
- `checkpoint-manager` - Create checkpoints
- `memory-updater` - Check and update AGENTS.md memory
- `project-creator` - Create new project from template
- `session-wrap-up` - Generate work log and cleanup reminders

### Natural Language Triggers

Codex CLI does not have slash commands. Instead, all former commands have been merged into skills and are triggered via natural language. For example:

| Say this... | Triggers skill |
|-------------|---------------|
| "commit changes" | `git-commit` |
| "push to GitHub" | `git-push` |
| "review my code" | `code-review-excellence` |
| "start research" | `research-ideation` |
| "write rebuttal" | `review-response` |
| "analyze results" | `results-analysis` |
| "create a plan" | `planning-with-files` |
| "fix build errors" | `build-fixer` |
| "wrap up session" | `session-wrap-up` |

### Agents (14 specialized)

Each agent has its own directory under `~/.codex/agents/<name>/` with a `config.toml` and `AGENTS.md` (system prompt). Agents are registered in the main `config.toml` and invoked automatically or on demand.

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
claude-scholar/                  # Codex CLI edition
├── config.toml                  # Core config: model, agents, MCP, features
├── AGENTS.md                    # Project context + workflow instructions
│
├── agents/                      # 14 specialized agents
│   ├── code-reviewer/
│   │   ├── config.toml          # Agent-specific settings
│   │   └── AGENTS.md            # Agent system prompt
│   ├── architect/
│   ├── literature-reviewer/
│   └── ... (11 more agents)
│
├── skills/                      # 40 skills (32 original + 8 migrated)
│   ├── ml-paper-writing/
│   │   └── SKILL.md
│   ├── git-commit/              # New: migrated from /commit command
│   ├── session-wrap-up/         # New: replaces session hooks
│   └── ... (37 more skills)
│
├── scripts/                     # Installer and utilities
│   ├── setup.sh                 # Interactive installer (merge support)
│   ├── setup-package-manager.js
│   └── lib/
│
├── utils/                       # Python utilities
│   └── platform_utils.py
│
├── LOGO.png
├── README.md                    # This file
└── README.zh-CN.md              # Chinese version
```

</details>

## Quick Start

### Installation Options

#### Option 1: Full Installation (Recommended)

Interactive installer with merge support — detects existing `~/.codex` config and merges non-destructively:

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

The script will:
- Detect existing `config.toml` and `auth.json`, ask whether to keep or reconfigure
- Choose API provider (OpenAI or custom) and model
- Merge Scholar-specific sections (features, agents, MCP) into existing config
- Copy skills, agents, scripts, and utils to `~/.codex/`

**Includes**: All 40 skills, 14 agents, Zotero MCP config, and AGENTS.md.

#### Option 2: Manual Installation

Copy only what you need:

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

**Note**: You'll need to manually edit `~/.codex/config.toml` to set your model, provider, and register the agents/skills you copied.

### Requirements

- [Codex CLI](https://github.com/openai/codex) (`npm i -g @openai/codex`)
- Git
- uv, Python (for Python development and MCP server installation)
- (Optional) [Zotero](https://www.zotero.org/) + [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp) (for literature management)

### MCP Server Setup

For Zotero-integrated research workflows, install the MCP server:

```bash
# Install Zotero MCP server (Web API mode — no Zotero desktop app required)
uv tool install git+https://github.com/Galaxy-Dawn/zotero-mcp.git
```

Get your API key and library ID from [zotero.org/settings/keys](https://www.zotero.org/settings/keys), then configure in `config.toml`:

```toml
[mcp_servers.zotero]
command = "zotero-mcp"
args = ["serve"]
enabled = true

[mcp_servers.zotero.env]
ZOTERO_API_KEY = "your-api-key"
ZOTERO_LIBRARY_ID = "your-library-id"
ZOTERO_LIBRARY_TYPE = "user"
UNPAYWALL_EMAIL = "your-email@example.com"
UNSAFE_OPERATIONS = "all"
```

For detailed setup instructions (all platforms, available tools, troubleshooting), see [MCP_SETUP.md](MCP_SETUP.md).

### First Run

After installation, run `codex` to start. The Codex CLI will:

1. Read `AGENTS.md` for project context and workflow instructions
2. Scan `~/.codex/skills/` for available skills (triggered via natural language)
3. Use registered agents from `config.toml` for specialized tasks
4. Enforce `sandbox_mode = "workspace-write"` for file safety

## Key Differences from OpenCode Version

| Aspect | OpenCode (`opencode` branch) | Codex CLI (`codex` branch) |
|--------|------------------------------|---------------------------|
| Config file | `opencode.jsonc` (JSON) | `config.toml` (TOML) |
| Hooks/Plugins | TypeScript plugins (`plugins/*.ts`) | None — replaced by AGENTS.md instructions + sandbox |
| Agents | JSON config in `opencode.jsonc` | Individual directories (`agents/<name>/config.toml + AGENTS.md`) |
| Commands | File-based `.md` (50+) | Merged into skills (natural language triggers) |
| Skills | 32 skills | 40 skills (8 migrated from commands) |
| Security | `security-guard.ts` plugin | `sandbox_mode = "workspace-write"` + AGENTS.md rules |
| MCP | `opencode.jsonc` mcp section | `config.toml` `[mcp_servers]` section |
| Dependencies | `package.json` (npm) | None — no npm dependencies |

## Project Rules

All rules from the Claude Code version have been merged into `AGENTS.md` as inline directives.

### Coding Style

- **File Size**: 200-400 lines maximum
- **Immutability**: Use `@dataclass(frozen=True)` for configs
- **Type Hints**: Required for all functions
- **Patterns**: Factory & Registry for all modules
- **Config-Driven**: Models accept only `cfg` parameter

### Agent Orchestration

Defined in `AGENTS.md`:
- Available agent types and purposes
- Parallel task execution
- Multi-perspective analysis

### Security

Enforced by Codex sandbox + `AGENTS.md` rules:
- `sandbox_mode = "workspace-write"` restricts file writes and network access
- Secrets management (environment variables, `.env` files)
- Sensitive file protection (never commit tokens, keys, credentials)

### Experiment Reproducibility

Defined in `AGENTS.md`:
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

Built with [Codex CLI](https://github.com/openai/codex) and enhanced by the open-source community.

### References

- **[everything-claude-code](https://github.com/anthropics/everything-claude-code)** - Comprehensive resource for Claude Code CLI
- **[AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs)** - Research-focused skills and configurations

---

**For data science, AI research, and academic writing.**

Repository: [https://github.com/Galaxy-Dawn/claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)
