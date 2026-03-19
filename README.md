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

> Semi-automated research assistant for academic research and software development, adapted for [Codex CLI](https://github.com/openai/codex) across ideation, literature review, experiments, reporting, writing, and project knowledge management.
>
> **Branch note**: this is the **Codex CLI edition** of Claude Scholar. For the Claude Code version, see the [`main` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/main). For the OpenCode version, see the [`opencode` branch](https://github.com/Galaxy-Dawn/claude-scholar/tree/opencode).

## Recent News

- **2026-03-18**: **Results reporting, writing memory, and README alignment** — kept the `results-analysis` / `results-report` split for strict statistics plus decision-oriented post-experiment reporting, kept Obsidian write-back in the Codex workflow, removed the old `data-analyst` entrypoint from the product story, wired `paper-miner` output into a shared writing memory used by `ml-paper-writing` and `review-response`, and aligned the Codex README structure with the main branch while preserving Codex-specific usage.
- **2026-03-17**: **Obsidian project knowledge base** — ported the filesystem-first Obsidian workflow into the Codex edition with project import, repo-bound auto-sync, durable knowledge routed across `Papers / Knowledge / Experiments / Results / Writing`, with round-level experiment reports stored under `Results/Reports/`, and no MCP requirement on the Obsidian side.
- **2026-02-26**: **Zotero MCP Web API mode** — remote Zotero access, DOI/arXiv/URL import, collection management, item updates, and Codex-specific setup guidance in `config.toml`.

<details>
<summary>View older changelog</summary>

- **2026-02-25**: **Codex CLI migration** — ported the project into Codex CLI format with TOML config, agent directories, AGENTS-based instructions, and an incremental installer
- **2026-02-23**: Added `setup.sh` installer — backup-aware incremental updates for existing `~/.codex`, with config preservation and optional Zotero MCP enablement
- **2026-02-22**: Added Zotero MCP server template — out-of-the-box literature workflow support in Codex
- **2026-02-21**: OpenCode migration groundwork — clarified branch split between Claude Code, Codex, and OpenCode
- **2026-02-15**: Zotero MCP integration — brought `/zotero-review` and `/zotero-notes` style literature workflows into the broader Claude Scholar line
- **2026-02-11**: Major update — expanded research skills, agents, and workflow coverage across the academic lifecycle
- **2026-01-25**: Project open-sourced, v1.0.0 released

</details>

## Quick Navigation

| Section | What it helps with |
|---|---|
| [Why Claude Scholar](#why-claude-scholar) | Understand the project positioning and target use cases. |
| [Core Workflow](#core-workflow) | See the staged research pipeline from ideation to publication. |
| [Quick Start](#quick-start) | Install Claude Scholar safely into an existing `~/.codex` setup. |
| [Platform Scope](#platform-scope) | See what this branch covers and where the other editions live. |
| [Integrations](#integrations) | Learn how Zotero and Obsidian fit into the Codex workflow. |
| [Primary Workflows](#primary-workflows) | Browse the main research and development workflows. |
| [Supporting Workflows](#supporting-workflows) | See the background systems that strengthen the main workflow. |
| [Documentation](#documentation) | Jump to setup docs, configuration, and installation guides. |
| [Citation](#citation) | Cite Claude Scholar in papers, reports, or project docs. |

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
- **Knowledge base**: route durable knowledge into Obsidian across `Papers / Knowledge / Experiments / Results / Writing`, with round-level experiment reports stored under `Results/Reports/`.
- **Experiments**: track hypotheses, experiment lines, run history, findings, and next actions.
- **Analysis**: generate strict statistics, real scientific figures, and analysis artifacts with `results-analysis`.
- **Reporting**: produce a complete post-experiment report with `results-report`, then write it back into Obsidian.
- **Writing and publication**: carry stable findings into literature reviews, papers, rebuttals, slides, posters, and promotion.

## Quick Start

### Requirements

- [Codex CLI](https://github.com/openai/codex)
- Git
- (Optional) Python + [uv](https://docs.astral.sh/uv/) for Python development
- (Optional) [Zotero](https://www.zotero.org/) + [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp) for literature workflows

### Option 1: Full Installation (Recommended)

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
bash /tmp/claude-scholar/scripts/setup.sh
```

The installer is **backup-aware and incremental-update friendly**:
- syncs repo-managed `skills/`, `agents/`, `scripts/`, `utils/`, and `AGENTS.md`,
- merges Claude Scholar sections into an existing `~/.codex/config.toml` when you keep your current provider/model,
- backs up `config.toml` and `auth.json` before overwriting,
- preserves your existing provider/model/API key when you choose the incremental-update path,
- optionally enables the Zotero MCP block already present in the template config.

To update later:

```bash
cd /tmp/claude-scholar
git pull --ff-only
bash scripts/setup.sh
```

### Option 2: Minimal Installation

Install only a small research-focused subset:

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
mkdir -p ~/.codex/skills ~/.codex/agents
cp -r /tmp/claude-scholar/skills/research-ideation ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/results-analysis ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/results-report ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/ml-paper-writing ~/.codex/skills/
cp -r /tmp/claude-scholar/skills/review-response ~/.codex/skills/
cp -r /tmp/claude-scholar/agents/literature-reviewer ~/.codex/agents/
cp -r /tmp/claude-scholar/agents/paper-miner ~/.codex/agents/
cp /tmp/claude-scholar/AGENTS.md ~/.codex/AGENTS.md
```

**Post-install**: minimal/manual install does **not** auto-merge your `config.toml`; copy only the sections you need from the repository config and setup guides.

### Option 3: Selective Installation

Copy only the pieces you want:

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
cp -r /tmp/claude-scholar/skills/<skill-name> ~/.codex/skills/
cp -r /tmp/claude-scholar/agents/<agent-name> ~/.codex/agents/
cp /tmp/claude-scholar/AGENTS.md ~/.codex/AGENTS.md
```

**Important Codex note**:
- Codex does **not** show custom skills in `/...` menus.
- Use natural language prompts, or explicitly invoke a skill as `$skill-name` when needed.

## Platform Scope

This branch targets **Codex CLI**.

- **Codex CLI (`codex` branch)** — TOML config, AGENTS-based discipline, filesystem-first Obsidian workflow, and Codex-native installation docs
- **Claude Code (`main` branch)** — Claude Code setup, native hooks, and the main cross-platform documentation line
- **OpenCode (`opencode` branch)** — OpenCode-specific configuration and installation path

The research workflow is intentionally similar across branches, but the operational surface differs by platform.

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

Complete academic research lifecycle — 7 stages from idea to publication.

> **Codex entrypoint note**: this branch does not rely on repo slash commands. The normal entrypoint is natural language plus explicit skill invocation such as `$results-analysis` when needed.

### 1. Research Ideation (Zotero-Integrated)

Turn a vague topic into a structured research direction with literature support.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `research-ideation` | Turns a vague topic into structured questions, gap analysis, and an initial research plan. |
| Agent | `literature-reviewer` | Searches, classifies, and synthesizes papers into an actionable literature picture. |
| Skill | `zotero-obsidian-bridge` | Bridges Zotero collections into detailed paper notes and downstream Obsidian knowledge work. |

**How it works**
- **5W1H brainstorming**: turn vague interests into structured questions.
- **Literature search and import**: find papers, extract DOI/arXiv/URL, import them into Zotero, and organize them into themed collections.
- **PDF and full text**: attach PDFs when available and read full text when possible.
- **Gap analysis**: identify literature, methodological, application, interdisciplinary, and temporal gaps.
- **Research question and planning**: turn literature synthesis into concrete questions, first hypotheses, and next actions.

**Typical output**
- literature review notes
- structured Zotero collections
- research proposal or direction draft

### 2. ML Project Development

Maintainable ML project development for experiment code and repo hygiene.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `architecture-design` | Designs maintainable ML project structure when adding registrable components or new modules. |
| Skill | `git-workflow` | Enforces safer branching, commit discipline, and collaboration habits. |
| Skill | `bug-detective` | Systematically investigates stack traces, shell errors, and broken code paths. |
| Skill | `git-commit` | Creates Conventional Commit messages locally. |
| Skill | `git-push` | Stages, commits, and pushes using Conventional Commits. |
| Agent | `code-reviewer` | Reviews changed code for correctness, maintainability, and implementation quality. |
| Agent | `dev-planner` | Breaks complex engineering work into executable implementation steps. |

**How it works**
- **Structure**: use Factory / Registry patterns where they actually help.
- **Code quality**: keep files readable, typed, and config-driven.
- **Debugging**: treat shell failures, traces, and path issues systematically.
- **Git discipline**: keep a safer branch and commit workflow around fast iteration.

### 3. Experiment Analysis

Strict experiment analysis workflow: statistics, scientific figures, analysis artifacts, and post-experiment reporting.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `results-analysis` | Produces strict statistics, real scientific figures, and analysis appendices. |
| Skill | `results-report` | Converts analysis artifacts into a complete post-experiment report with conclusions, limitations, and next actions. |
| Agent | `research-knowledge-curator-obsidian` | Writes stable findings back into the Obsidian project knowledge base when the repo is bound. |

**How it works**
- **Data processing**: read experiment logs, metrics files, and result directories.
- **Statistical testing**: run strict tests under the right assumptions and report uncertainty clearly.
- **Visualization**: generate real scientific figures instead of vague plotting advice.
- **Ablation and comparison**: analyze component contribution, trade-offs, and stability.
- **Post-experiment reporting**: hand off to `results-report` for a complete retrospective tied to decisions.

**Typical output**
- `analysis-report.md`
- `stats-appendix.md`
- `figure-catalog.md`
- `figures/`
- an Obsidian write-back under `Results/Reports/`

### 4. Paper Writing

Systematic paper writing from template preparation to iterative drafting.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `ml-paper-writing` | Drafts submission-oriented ML/AI papers from repos, results, and literature context. |
| Skill | `citation-verification` | Checks references, metadata, and claim-citation alignment. |
| Skill | `writing-anti-ai` | Reduces formulaic phrasing and improves rhythm, clarity, and academic tone. |
| Skill | `latex-conference-template-organizer` | Cleans conference templates into Overleaf-ready writing structure. |
| Agent | `paper-miner` | Extracts reusable writing patterns, structure signals, and venue knowledge from strong papers. |

**How it works**
- **Template preparation**: clean messy conference templates into usable writing structure.
- **Citation verification**: check references, metadata, and claim support.
- **Systematic writing**: draft section-by-section from repo evidence and literature context.
- **Writing memory reuse**: mine and reuse durable writing patterns through `paper-miner` memory.

### 5. Paper Self-Review

Quality assurance before submission.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `paper-self-review` | Checks structure, logic, citations, figures, and compliance before submission. |

**How it works**
- **Structure check**: inspect logical flow, section balance, and narrative coherence.
- **Logic validation**: inspect claim-evidence alignment and assumption clarity.
- **Citation audit**: verify reference accuracy and completeness.
- **Figure quality**: inspect readability, captions, and accessibility.
- **Compliance**: inspect page limits, formatting, and disclosure requirements.

### 6. Submission and Rebuttal

Submission preparation and reviewer response workflow.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `review-response` | Organizes reviewer comments into an evidence-based rebuttal workflow. |
| Agent | `rebuttal-writer` | Drafts professional, respectful, and well-structured rebuttal text. |

**How it works**
- **Pre-submission checks**: verify venue formatting, anonymization, and required checklist items.
- **Review analysis**: classify reviewer comments into actionable issues.
- **Response strategy**: decide whether to accept, defend, clarify, or run new experiments.
- **Rebuttal writing**: produce structured, evidence-based responses with professional tone.

### 7. Post-Acceptance Processing

Conference preparation and research communication after acceptance.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `post-acceptance` | Supports slides, posters, and outward-facing communication after acceptance. |
| Agent | `ui-sketcher` | Helps structure visual materials such as slides, posters, and presentation flow when needed. |

**How it works**
- **Presentation**: prepare talk structure and slide guidance.
- **Poster**: structure poster content hierarchy and layout.
- **Promotion**: produce concise outward-facing summaries, threads, and post-acceptance materials.

## Supporting Workflows

These workflows run behind the primary workflows to strengthen the overall Codex experience.

### Obsidian Project Knowledge Base

Treat Obsidian as a durable research knowledge sink rather than a pile of disconnected notes.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `obsidian-project-memory` | Maintains the project-level Obsidian knowledge base and decides what stable knowledge should be written back. |
| Skill | `obsidian-project-bootstrap` | Initializes an Obsidian knowledge base for a new or existing research project. |
| Skill | `obsidian-research-log` | Writes daily research progress, plans, ideas, and TODOs into the knowledge base. |
| Skill | `obsidian-experiment-log` | Records experiment setup, run history, findings, and follow-up actions in Obsidian. |
| Skill | `obsidian-literature-workflow` | Handles filesystem-first paper-note normalization and literature synthesis inside Obsidian. |
| Skill | `zotero-obsidian-bridge` | Connects Zotero collections to canonical paper notes and literature maps in Obsidian. |

**How it works**
- bind an existing repo to an Obsidian vault,
- route stable knowledge into `Papers / Knowledge / Experiments / Results / Writing`, with round-level experiment reports stored under `Results/Reports/`,
- maintain `Daily/` and project memory conservatively,
- ingest new Markdown into the right canonical note,
- generate canvases or views only when the workflow actually calls for them.

### Codex Session Discipline and Hook Emulation

Codex does not expose native Claude Code hooks, so this branch emulates the highest-value behaviors through AGENTS discipline and local helper scripts.

| Type | Name | One-line explanation |
|---|---|---|
| File | `AGENTS.md` | Encodes session discipline, skill evaluation rules, safety rules, and Codex-specific workflow instructions. |
| Script | `scripts/codex_hook_emulation.py` | Emulates session-start, preflight, post-edit, and session-end behaviors inside repo workflows. |
| Skill | `session-wrap-up` | Produces work logs, cleanup reminders, and closeout summaries at the end of a session. |

**How it works**
- **Session start surrogate**: inspect repo state, skills, TODOs, and project context.
- **Preflight surrogate**: check dangerous or irreversible commands before execution.
- **Post-edit surrogate**: decide verification needs and minimum Obsidian write-back after meaningful edits.
- **Session end surrogate**: summarize work and remind follow-up maintenance actions.

### Knowledge Extraction Workflow

Specialized agents continuously mine reusable knowledge from papers and engineering solutions.

| Type | Name | One-line explanation |
|---|---|---|
| Agent | `paper-miner` | Extracts reusable writing patterns, structure signals, and response strategies from strong papers. |
| Agent | `kaggle-miner` | Extracts reusable engineering practices and solution patterns from strong Kaggle workflows. |

**How it works**
- mine writing patterns, venue expectations, and rebuttal strategies from papers,
- mine engineering patterns and solution structures from Kaggle workflows,
- feed that knowledge back into shared skills and references.

### Skill Evolution System

Claude Scholar also includes a self-improvement loop for its own skills.

| Type | Name | One-line explanation |
|---|---|---|
| Skill | `skill-development` | Creates new skills with clear triggers, structure, and progressive disclosure. |
| Skill | `skill-quality-reviewer` | Audits skills across content quality, organization, writing, and structural integrity. |
| Skill | `skill-improver` | Applies structured improvement plans to existing skills. |

**How it works**
- create new skills with clear trigger descriptions,
- review them across multiple quality dimensions,
- merge fixes and iterate over time.

## Documentation

- [MCP_SETUP.md](./MCP_SETUP.md) — Zotero MCP setup for Codex
- [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md) — Obsidian project knowledge base workflow
- [AGENTS.md](./AGENTS.md) — Codex session rules, safety discipline, and workflow instructions
- [config.toml](./config.toml) — template Codex configuration with skills, agents, and MCP blocks

## Project Rules

Claude Scholar for Codex includes rules around:
- coding style,
- agent orchestration,
- security constraints,
- experiment reproducibility,
- and Codex-specific session discipline.

These rules live primarily in `AGENTS.md` and the repo-managed skills.

## Contributing

Issues, pull requests, and workflow improvement suggestions are welcome.

If you want to modify the installer, Zotero workflow, Obsidian routing, or Codex session discipline, it helps to describe:
- the user scenario,
- the current limitation,
- the expected behavior,
- and the compatibility impact.

## Citation

If Claude Scholar helps your research or engineering workflow, please cite it as:

```bibtex
@misc{claude_scholar_2026,
  title        = {Claude Scholar: Semi-automated research assistant for academic research and software development},
  author       = {Gaorui Zhang},
  year         = {2026},
  howpublished = {\url{https://github.com/Galaxy-Dawn/claude-scholar}},
  note         = {GitHub repository}
}
```

## License

MIT License.

## Acknowledgments

Built with Codex CLI workflows and extended through open-source research tooling.

### References

This project was inspired by and built on excellent community work:

- **[everything-claude-code](https://github.com/anthropics/everything-claude-code)** - comprehensive Claude Code CLI resources
- **[AI-research-SKILLs](https://github.com/zechenzhangAGI/AI-research-SKILLs)** - research-oriented skills and configuration patterns
- **[codex](https://github.com/openai/codex)** - the Codex CLI foundation used by this branch

These projects helped shape the research and tooling direction of Claude Scholar.

---

**For academic research, software development, and durable project knowledge management.**

Repository: [https://github.com/Galaxy-Dawn/claude-scholar](https://github.com/Galaxy-Dawn/claude-scholar)
