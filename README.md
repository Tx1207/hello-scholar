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

> Semi-automated research assistant for academic research and software development, adapted for [Codex CLI](https://github.com/openai/codex) across ideation, literature review, experiments, reporting, writing, and publication.

> **Note**: This is the **Codex CLI edition** of Claude Scholar. For the Claude Code CLI version, see the [`main` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/main). For the **OpenCode** version, see the [`opencode` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/opencode).

## Recent News

- **2026-03-18**: **Results reporting, writing memory, and workflow cleanup** — split post-experiment work in the Codex edition into `results-analysis` for strict statistics, real scientific figures, `analysis-report.md` / `stats-appendix.md` / `figure-catalog.md`, and `results-report` for decision-oriented post-experiment reports with Obsidian write-back; removed the redundant `data-analyst` entrypoint, made the default Codex path a natural-language one-shot analysis + report workflow, introduced a global `paper-miner` writing memory, wired `ml-paper-writing` and `review-response` to read that shared memory, refreshed the README around human-centered semi-automation, and updated the project logo.
- **2026-03-17**: **Obsidian project knowledge base** — ported the filesystem-first Obsidian workflow into the Codex edition with project import, repo-bound auto-sync, `Papers / Knowledge / Experiments / Results / Results/Reports / Writing` routing, default `Maps/literature.canvas`, and no MCP requirement for the Obsidian side.
- **2026-02-26**: **Zotero MCP Web/write workflow** — supports remote access, paper import via DOI/arXiv ID/URL, collection management, item updates, and safe deletion; see `MCP_SETUP.md` for setup details.
- **2026-02-25**: **Codex CLI migration** — ported from OpenCode to Codex CLI format: TOML config, independent agent directories, commands merged into skills, hooks replaced by AGENTS.md instructions + sandbox, and an interactive `setup.sh` with merge support.
- **2026-02-23**: Added `setup.sh` installer — backup-aware incremental updates for existing `~/.codex` with config preservation.

<details>
<summary>View older changelog</summary>

- **2026-02-22**: Added Zotero MCP server — enables literature management out of the box
- **2026-02-21**: OpenCode migration — hooks→plugins (TypeScript), agents→opencode.jsonc, CLAUDE.md→AGENTS.md
- **2026-02-15**: Zotero MCP integration — added `/zotero-review` and `/zotero-notes` commands in the Claude Code branch
- **2026-02-11**: Major update — added 10 new skills, 7 new agents, 8 research workflow commands; 89 files changed
- **2026-01-25**: Project open-sourced, v1.0.0 released

</details>

## Why Claude Scholar

Claude Scholar is **not** an end-to-end autonomous research system that tries to replace the researcher.

Its core idea is simple:

> **human decision-making stays at the center; the assistant accelerates the workflow around it.**

That means the Codex edition is designed to help with the heavy, repetitive, and structure-sensitive parts of research — literature organization, note-taking, experiment analysis, reporting, and writing support — while still keeping the key judgments in human hands:

- which problem is worth pursuing,
- which papers actually matter,
- which hypotheses are worth testing,
- which results are convincing,
- and what should be written, submitted, or abandoned.

In other words, Claude Scholar is a **semi-automated research assistant**, not a fully automated scientist.

## Core Workflow

- **Ideation**: turn a vague topic into concrete questions, research gaps, and an initial plan.
- **Literature**: search, import, organize, and read papers through Zotero collections.
- **Paper notes**: convert papers into structured reading notes and reusable claims.
- **Knowledge base**: route durable knowledge into Obsidian across `Papers / Knowledge / Experiments / Results / Results/Reports / Writing`.
- **Experiments**: track hypotheses, experiment lines, run history, findings, and next actions.
- **Analysis**: generate strict statistics, real scientific figures, and analysis artifacts with `results-analysis`.
- **Reporting**: produce a complete post-experiment report with `results-report`, then write it back into Obsidian.
- **Writing and publication**: carry stable findings into literature reviews, papers, rebuttals, slides, posters, and promotion.

## Quick Navigation

| Section | What it helps with |
|---|---|
| [Why Claude Scholar](#why-claude-scholar) | Understand the human-centered positioning of the project. |
| [Core Workflow](#core-workflow) | See the end-to-end research pipeline from ideation to publication. |
| [Quick Start](#quick-start) | Install Claude Scholar safely into an existing `~/.codex` setup. |
| [Integrations](#integrations) | Learn how Zotero and Obsidian fit into the Codex workflow. |
| [Primary Workflows](#primary-workflows) | Browse the main research and development workflows. |
| [Supporting Workflows](#supporting-workflows) | See the background systems that strengthen the main workflow. |
| [Documentation](#documentation) | Jump to setup docs, configuration, and installation guides. |
| [Citation](#citation) | Cite Claude Scholar in papers, reports, or project docs. |

## Integrations

### Zotero

Use Zotero when you want Claude Scholar to help with:
- paper import via DOI / arXiv / URL,
- collection-based reading workflows,
- full-text access through Zotero MCP,
- detailed paper notes and literature synthesis.

See [MCP_SETUP.md](./MCP_SETUP.md).

### Obsidian

Use Obsidian when you want Claude Scholar to maintain a filesystem-first research knowledge base:
- `Papers/`
- `Knowledge/`
- `Experiments/`
- `Results/`
- `Results/Reports/`
- `Writing/`
- `Daily/`

See [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md).

## Primary Workflows

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

**Trigger**: "start research", "review this Zotero collection", "generate reading notes"

#### 2. ML Project Development

**Tools**: `architecture-design` skill + `code-reviewer` agent + `git-workflow` skill

**Process**:
- **Structure**: Factory & Registry patterns → config-driven models (only `cfg` parameter) → enforced by AGENTS.md coding style rules
- **Code Style**: 200-400 line files → type hints required → `@dataclass(frozen=True)` for configs → max 3-level nesting
- **Debug** (`bug-detective`): Error pattern matching for Python/Bash/JS → stack trace analysis
- **Git**: Conventional Commits (`feat/scope: message`) → branch strategy (master/develop/feature) → merge with `--no-ff`

**Trigger**: "create a plan", "commit changes", "review my code", "run TDD"

#### 3. Experiment Analysis

**Tools**: `results-analysis` skill + `results-report` skill

**Process**:
- **Strict Analysis Bundle**: produce `analysis-report.md`, `stats-appendix.md`, `figure-catalog.md`, and real scientific figures
- **Statistical Validation**: report descriptive statistics, confidence intervals, effect sizes, and justified significance tests
- **Figure Interpretation**: every main figure must include its purpose, caption requirements, and interpretation checklist
- **Post-Experiment Reporting**: hand off to `results-report` for a full retrospective with conclusions, limitations, and next actions

**Trigger**: "analyze results in <experiment_dir> and prepare the final report" or "write a results report for this experiment"

#### 4. Paper Writing

**Tools**: `ml-paper-writing` skill + `paper-miner` agent + `latex-conference-template-organizer` skill

**Process**:
- **Template Preparation**: Download conference .zip → extract main files → clean Overleaf-ready structure
- **Citation Verification** (`citation-verification`): Multi-layer validation (Format → API → Information → Content)
- **Global Writing Memory** (`paper-miner`): mine reusable writing patterns, structure signals, and venue-specific phrasing into one canonical memory under `~/.codex/skills/ml-paper-writing/references/knowledge/`
- **Systematic Writing**: Narrative framing → section-by-section drafting → revision with explicit citation authority
- **Anti-AI Processing** (`writing-anti-ai`): Remove inflated symbolism, promotional language → add human voice

**Venues**: NeurIPS, ICML, ICLR, ACL, AAAI, COLM, Nature, Science, Cell, PNAS

**Trigger**: "draft the paper", "mine writing patterns from this paper"

#### 5. Paper Self-Review

**Tools**: `paper-self-review` skill — 6-item quality checklist (structure, logic, citations, figures, writing, compliance)

#### 6. Submission & Rebuttal

**Tools**: `review-response` skill + `rebuttal-writer` agent

**Trigger**: "write rebuttal for <review_file>"

#### 7. Post-Acceptance Processing

**Tools**: `post-acceptance` skill

**Trigger**: "prepare presentation", "design poster", "promote paper"

**Coverage**: 90% of academic research lifecycle (from idea to publication)

## Supporting Workflows

#### Obsidian Project Knowledge Base

The Codex edition now includes the filesystem-first Obsidian workflow from the main branch:

- `obsidian-project-memory` for repo-bound project memory and canonical note routing
- `obsidian-project-bootstrap` for detecting or importing research repositories into a vault
- `obsidian-research-log` and `obsidian-experiment-log` for daily notes, plans, experiments, and results
- `obsidian-literature-workflow` and `zotero-obsidian-bridge` for moving paper notes into project knowledge and refreshing `Maps/literature.canvas`
- no MCP or API key required for the Obsidian side

See [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md).

#### Workflow Automation

In the Codex edition, automated workflows are handled through:

- **AGENTS.md instructions**: Session start protocol, skill evaluation guidance, and security rules are embedded as directives in `AGENTS.md` — Codex reads this file automatically
- **Sandbox mode**: `sandbox_mode = "workspace-write"` provides file write restrictions and network isolation, replacing the hook-based security guard
- **session-wrap-up** (skill): Manual trigger at session end to generate work logs and cleanup reminders — replaces the automatic session-summary hook

#### Knowledge Extraction Workflow

- **paper-miner** (agent): Analyze research papers → update one global writing memory with reusable patterns, phrasing, and venue-specific signals
- **kaggle-miner** (agent): Study winning Kaggle solutions → extract technical analysis, code templates, best practices

#### Skill Evolution System

```
skill-development → skill-quality-reviewer → skill-improver
```

## What's Included

### Skills (55 total)

**Research Workflow:**
- `research-ideation` - Research startup: 5W1H brainstorming, literature review, gap analysis
- `results-analysis` - Strict experiment analysis: rigorous statistics, scientific figures, and analysis artifacts
- `results-report` - Decision-oriented post-experiment summary reporting
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

**Obsidian Knowledge Base:**
- `obsidian-project-memory` - Default project-memory orchestrator for bound research repos
- `obsidian-project-bootstrap` - Bootstrap or import a research repository into an Obsidian vault
- `obsidian-research-log` - Route daily notes, plans, and durable progress updates
- `obsidian-experiment-log` - Log experiments, ablations, and stable result summaries
- `obsidian-project-lifecycle` - Detach, archive, purge, and note-level lifecycle operations
- `obsidian-literature-workflow` - Normalize paper notes and connect them to project context
- `zotero-obsidian-bridge` - Bridge Zotero collections/full text into durable Obsidian paper notes
- `obsidian-markdown` / `obsidian-cli` / `obsidian-bases` / `json-canvas` / `defuddle` - Vendored official helpers for markdown, CLI, optional bases/canvas, and clean web-to-markdown extraction

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

Codex CLI does not have slash commands. Instead, the Codex edition relies on skills, agents, and natural-language prompting. For example:

| Say this... | Uses |
|-------------|------|
| "commit changes" | `git-commit` |
| "push to GitHub" | `git-push` |
| "review my code" | `code-review-excellence` |
| "start research" | `research-ideation` + `literature-reviewer` |
| "analyze results in results/run_a" | `results-analysis` |
| "write a results report for this experiment" | `results-report` |
| "mine writing patterns from this paper" | `paper-miner` |
| "write rebuttal" | `review-response` + `rebuttal-writer` |
| "wrap up session" | `session-wrap-up` |

### Agents (15 specialized)

Each agent has its own directory under `~/.codex/agents/<name>/` with a `config.toml` and `AGENTS.md` (system prompt). Agents are registered in the main `config.toml` and invoked automatically or on demand.

**Research Agents:**
- **literature-reviewer** - Literature search, classification, and trend analysis
- **literature-reviewer-obsidian** - Read project paper notes from Obsidian and generate linked literature synthesis
- **research-knowledge-curator-obsidian** - Maintain the bound Obsidian project knowledge base during normal research turns
- **rebuttal-writer** - Systematic rebuttal writing with tone optimization
- **paper-miner** - Extract reusable writing knowledge into one canonical global writing memory

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
├── agents/                      # 15 specialized agents
│   ├── code-reviewer/
│   │   ├── config.toml          # Agent-specific settings
│   │   └── AGENTS.md            # Agent system prompt
│   ├── architect/
│   ├── literature-reviewer/
│   └── ... (11 more agents)
│
├── skills/                      # 55 skills
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

Interactive installer with merge support — detects existing `~/.codex` config and performs a backup-aware incremental update:

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

The script will:
- Preserve your existing provider/model choices unless you explicitly reconfigure them
- Preserve existing API keys, auth files, permissions, and unrelated config fields
- Merge Scholar-managed sections (features, agents, MCP, skills paths) into the existing config instead of overwriting the whole file
- Copy or refresh skills, agents, scripts, and utilities under `~/.codex/` with backups for overwritten managed files

**Includes**: All 55 skills, 15 agents, Zotero MCP config, Obsidian knowledge-base skills, and AGENTS.md.

#### Option 2: Manual Installation

Copy only what you need:

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

**Note**: You'll need to manually edit `~/.codex/config.toml` to set your model, provider, and register the agents/skills you copied. Keep `AGENTS.md` in the repo where you actually run Codex.

### Requirements

- [Codex CLI](https://github.com/openai/codex) (`npm i -g @openai/codex`)
- Git
- uv, Python (for Python development and MCP server installation)
- (Optional) [Zotero](https://www.zotero.org/) + [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp) (for literature management)

### MCP Server Setup

For Zotero-integrated research workflows, install the MCP server:

```bash
# Install Zotero MCP server
uv tool install --reinstall git+https://github.com/Galaxy-Dawn/zotero-mcp.git
```

For Web/write tools, open [Zotero Settings -> Security -> Applications](https://www.zotero.org/settings/security#applications), create a private key, and use the numeric `User ID` shown on that page as `ZOTERO_LIBRARY_ID` for a personal library. Then configure `config.toml`:

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

For detailed setup instructions (all platforms, available tools, troubleshooting), see [MCP_SETUP.md](MCP_SETUP.md).

### First Run

After installation, run `codex` to start. The Codex CLI will:

1. Read `AGENTS.md` for project context and workflow instructions
2. Scan `~/.codex/skills/` for available skills (triggered via natural language)
3. Use registered agents from `config.toml` for specialized tasks
4. Enforce `sandbox_mode = "workspace-write"` for file safety

## Obsidian Knowledge Base

The Codex branch now carries the same filesystem-first Obsidian project knowledge-base direction as the main branch, adapted to Codex conventions:

- no Obsidian MCP or API key requirement
- repo-bound project memory via `.codex/project-memory/registry.yaml` inside the research repo
- compact vault layout: `Knowledge / Papers / Experiments / Results / Results/Reports / Writing / Daily / Archive`
- optional official `obsidian` CLI support for navigation only
- default literature graph artifact: `Maps/literature.canvas`

See [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md).

## Key Differences from OpenCode Version

| Aspect | OpenCode (`opencode` branch) | Codex CLI (`codex` branch) |
|--------|------------------------------|---------------------------|
| Config file | `opencode.jsonc` (JSON) | `config.toml` (TOML) |
| Hooks/Plugins | TypeScript plugins (`plugins/*.ts`) | None — replaced by AGENTS.md instructions + sandbox |
| Agents | JSON config in `opencode.jsonc` | Individual directories (`agents/<name>/config.toml + AGENTS.md`) |
| Commands | File-based `.md` (50+) | Merged into skills (natural language triggers) |
| Skills | 32 skills | 55 skills |
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

## Documentation

- [INSTALL-CODEX.md](./INSTALL-CODEX.md) — Codex CLI installation and update guide
- [MCP_SETUP.md](./MCP_SETUP.md) — Zotero MCP setup and troubleshooting
- [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md) — filesystem-first Obsidian knowledge-base workflow
- [AGENTS.md](./AGENTS.md) — Codex project rules, workflow guidance, and orchestration defaults

## Contributing

Contributions are welcome, especially for:
- research workflow design,
- Codex-compatible skill and agent improvements,
- Zotero / Obsidian workflow quality,
- documentation fixes and reproducibility improvements.

If you propose changes to installer behavior, Zotero workflows, or Obsidian routing, please include:
- the target user workflow,
- backward-compatibility considerations,
- and how the change should behave in the Codex edition.

## Citation

If Claude Scholar helps your workflow, you can cite it as:

```bibtex
@misc{zhang2026claudescholar,
  author       = {Gaorui Zhang},
  title        = {Claude Scholar: Semi-automated research assistant for academic research and software development},
  year         = {2026},
  howpublished = {GitHub repository},
  url          = {https://github.com/Galaxy-Dawn/claude-scholar}
}
```

## License

MIT License

## Acknowledgments

Built with [Codex CLI](https://github.com/openai/codex) and extended through open-source research tooling and community practice.

### References

- **[everything-claude-code](https://github.com/anthropics/everything-claude-code)** - Comprehensive resource for Claude Code CLI
- **[AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs)** - Research-focused skills and configurations

---

**Semi-automated research assistant for academic research and software development.**

Repository: [https://github.com/Galaxy-Dawn/claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)
