# Codex CLI Installation Guide

Claude Scholar 的 Codex CLI 版本安装指南。

## Prerequisites

- [Codex CLI](https://github.com/openai/codex) (OpenAI 官方 CLI)
- Git
- (Optional) Python + [uv](https://docs.astral.sh/uv/) for Python development
- (Optional) [Zotero](https://www.zotero.org/) + [zotero-mcp-server](https://pypi.org/project/zotero-mcp-server/) for literature management

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
cp /tmp/claude-scholar/codex/config.toml ~/.codex/config.toml
```

### 4. Install Agents

```bash
# Copy agent directories
cp -r /tmp/claude-scholar/codex/agents ~/.codex/
```

### 5. Setup AGENTS.md

The `AGENTS.md` file in the project root is automatically read by Codex CLI when you run it from that directory.

```bash
# AGENTS.md is already in the repository root
ls /tmp/claude-scholar/AGENTS.md
```

## MCP Server Setup

### Zotero MCP (Literature Management)

```bash
# Install Zotero MCP server
uv tool install zotero-mcp-server

# Enable Local API in Zotero desktop app:
# Edit → Settings → Advanced → Check "Allow other applications
# on this computer to communicate with Zotero"
```

Already configured in `config.toml`:

```toml
[mcp_servers.zotero]
command = "zotero-mcp"
args = ["serve"]
enabled = true
[mcp_servers.zotero.env]
ZOTERO_LOCAL = "true"
```

## Directory Structure

```
~/.codex/
├── config.toml              # Main config (model, sandbox, skills, agents, MCP)
└── agents/                  # 14 agent directories
    ├── architect/
    │   ├── config.toml      # Agent-specific settings
    │   └── AGENTS.md        # Agent system prompt
    ├── code-reviewer/
    ├── bug-analyzer/
    ├── build-error-resolver/
    ├── data-analyst/
    ├── dev-planner/
    ├── kaggle-miner/
    ├── literature-reviewer/
    ├── paper-miner/
    ├── rebuttal-writer/
    ├── refactor-cleaner/
    ├── tdd-guide/
    ├── ui-sketcher/
    └── story-generator/

/tmp/claude-scholar/         # Project root (codex branch)
├── AGENTS.md                # Project instructions (auto-read by Codex)
├── skills/                  # 40 skills (SKILL.md format)
│   ├── ml-paper-writing/
│   ├── research-ideation/
│   ├── git-commit/          # New (from command)
│   ├── git-push/            # New (from command)
│   └── ... (36 more)
└── rules/                   # Reference rules (merged into AGENTS.md)
```

## Key Differences from Claude Code

| Aspect | Claude Code (`main`) | Codex CLI (`codex`) |
|--------|---------------------|---------------------|
| Config | `~/.claude/settings.json` | `~/.codex/config.toml` |
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
# Test Zotero MCP manually
zotero-mcp serve

# Check Zotero Local API is enabled
curl http://localhost:23119/api
```

### Agent not found

Ensure agent directories exist under `~/.codex/agents/` and each contains both `config.toml` and `AGENTS.md`.
