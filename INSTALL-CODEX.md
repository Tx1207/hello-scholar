# Codex CLI Installation Guide

Claude Scholar Codex CLI 版安装指南（已覆盖 results-report、global writing memory、Obsidian knowledge base，以及安全增量更新安装器）。

## Prerequisites

- [Codex CLI](https://github.com/openai/codex) (OpenAI 官方 CLI)
- Git
- (Optional) Python + [uv](https://docs.astral.sh/uv/) for Python development
- (Optional) [Zotero](https://www.zotero.org/) + [Galaxy-Dawn/zotero-mcp](https://github.com/Galaxy-Dawn/zotero-mcp) for literature management

## Quick Start

### 1. Clone Repository

```bash
git clone -b codex https://github.com/Galaxy-Dawn/claude-scholar.git /tmp/claude-scholar
```

### 2. Copy Skills

```bash
# Create skills directory (if not exists)
mkdir -p /tmp/claude-scholar/skills

# Skills are already in the repository
# The config.toml references them via absolute paths
```

### 3. Install Config

```bash
# Backup existing config
[ -f ~/.codex/config.toml ] && cp ~/.codex/config.toml ~/.codex/config.toml.bak

# Create codex config directory
mkdir -p ~/.codex

# Copy main config
# Prefer the interactive installer for safe incremental merge
cp /tmp/claude-scholar/config.toml ~/.codex/config.toml
```

### 4. Install Agents

```bash
# Copy agent directories
cp -r /tmp/claude-scholar/agents ~/.codex/
```

### 5. Use Repo-local AGENTS.md

The `AGENTS.md` file should stay in the project root where you actually run Codex. Codex reads it automatically from the current workspace.

```bash
# AGENTS.md is already in the repository root
ls /tmp/claude-scholar/AGENTS.md
```

## MCP Server Setup

### Zotero MCP (Literature Management)

For the Obsidian knowledge-base side, no MCP is required; see `OBSIDIAN_SETUP.md`.

```bash
# Install Zotero MCP server
uv tool install --reinstall git+https://github.com/Galaxy-Dawn/zotero-mcp.git
```

Template block already present in `config.toml` (enable it only after replacing with your own values):

```toml
[mcp_servers.zotero]
command = "zotero-mcp"
args = ["serve"]
enabled = true
[mcp_servers.zotero.env]
ZOTERO_API_KEY = "your-api-key"
ZOTERO_LIBRARY_ID = "your-user-id"
ZOTERO_LIBRARY_TYPE = "user"
```

## Directory Structure

```
~/.codex/
├── config.toml              # Main config (model, sandbox, skills, agents, MCP)
└── agents/                  # 15 agent directories
    ├── architect/
    │   ├── config.toml      # Agent-specific settings
    │   └── AGENTS.md        # Agent system prompt
    ├── code-reviewer/
    ├── bug-analyzer/
    ├── build-error-resolver/
    ├── dev-planner/
    ├── kaggle-miner/
    ├── literature-reviewer/
    ├── paper-miner/
    ├── literature-reviewer-obsidian/
    ├── research-knowledge-curator-obsidian/
    ├── rebuttal-writer/
    ├── refactor-cleaner/
    ├── tdd-guide/
    ├── ui-sketcher/
    └── story-generator/

/tmp/claude-scholar/         # Project root (codex branch)
├── AGENTS.md                # Project instructions (auto-read by Codex)
├── skills/                  # 55 skills (SKILL.md format)
│   ├── ml-paper-writing/
│   ├── research-ideation/
│   ├── git-commit/          # New (from command)
│   ├── git-push/            # New (from command)
│   └── ... (37 more)
└── rules/                   # Reference rules (merged into AGENTS.md)
```

## Key Differences from Claude Code

| Aspect | Claude Code (`main`) | Codex CLI (`codex`) |
|--------|---------------------|---------------------|
| Config | `settings.json` (legacy JSON config) | `~/.codex/config.toml` |
| Project file | `CLAUDE.md` | `AGENTS.md` |
| Hooks | JS hooks (5 event hooks) | AGENTS.md instructions + manual skills |
| Agents | Markdown files | TOML config + AGENTS.md per agent |
| Skills | Same SKILL.md format | Same SKILL.md format |
| Commands | Slash commands (`/commit`) | Natural language triggers |
| MCP | JSON in settings.json | TOML in config.toml |
| Sandbox | N/A | Built-in `workspace-write` mode |

## Troubleshooting

### Skills not loading

Verify paths in `~/.codex/config.toml` point to actual SKILL.md files:

```bash
grep "path = " ~/.codex/config.toml | while read -r line; do
  path=$(echo "$line" | sed 's/.*"\(.*\)"/\1/')
  [ ! -f "$path" ] && echo "MISSING: $path"
done
```

### MCP connection issues

```bash
# Reinstall the latest zotero-mcp version
uv tool install --reinstall git+https://github.com/Galaxy-Dawn/zotero-mcp.git

# Test Zotero MCP manually
zotero-mcp serve
```

### Agent not found

Ensure agent directories exist under `~/.codex/agents/` and each contains both `config.toml` and `AGENTS.md`.
