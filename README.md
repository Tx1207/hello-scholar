# hello-scholar

`hello-scholar` is a Codex-oriented CLI runtime for selectively installing research, writing, development, Obsidian, and meta-builder workflows.

## Requirements

- Node.js 18+
- npm
- Codex CLI available on your machine if you want to install into Codex

## Install

If `hello-scholar` has already been published to npm:

```bash
npm install -g hello-scholar
```

If you are installing from this repository source:

```bash
npm install
npm run build:catalog
npm install -g .
```

After a global install, the `hello-scholar` command is available directly in your terminal:

```bash
hello-scholar help
```

Important note:

- `npm install` inside the repo only installs dependencies for local development.
- To run `hello-scholar` directly from any terminal, use `npm install -g hello-scholar` or `npm install -g .`.

## Quick Start

List available workflow bundles:

```bash
hello-scholar list bundles
```

Install the selected modules into the current project in `standby` mode:

```bash
hello-scholar install codex --standby
```

Install the selected modules into your Codex global environment:

```bash
hello-scholar install codex --global
```

Check runtime state:

```bash
hello-scholar status
hello-scholar doctor
```

Clean up an installation:

```bash
hello-scholar cleanup codex --standby
hello-scholar cleanup codex --global
```

## How It Works

- `base` modules are shared foundations installed by default unless `--no-base` is used.
- `bundles` are opt-in workflow groups such as `research-core`, `writing-core`, `dev-core`, `obsidian-core`, and `meta-builder`.
- `standby` mode writes the active runtime into the current project's `.hello-scholar/`.
- `global` mode installs `hello-scholar` as a local Codex plugin chain under your home directory.

## Runtime Layout

Project mode:

- `.hello-scholar/modules.json`
- `.hello-scholar/install-state.json`
- `.hello-scholar/skills/`
- `.hello-scholar/agents/`
- `.hello-scholar/scripts/`
- `.hello-scholar/templates/`
- `.hello-scholar/project-storage.json` (optional repo-shared storage config)

Project artifacts should default to the visible `hello-scholar/` tree, for example:

- `hello-scholar/changes/`
- `hello-scholar/state/`
- `hello-scholar/plans/`
- `hello-scholar/evidence/`
- `hello-scholar/research/`

Global mode:

- `~/.codex/.hello-scholar/`
- `~/plugins/hello-scholar/`
- `~/.codex/plugins/cache/local-plugins/hello-scholar/local/`
- `~/.codex/AGENTS.md`
- `~/.codex/config.toml`

## Common Commands

```bash
hello-scholar list bundles
hello-scholar list skills
hello-scholar list agents

hello-scholar install codex --standby
hello-scholar install codex --global

hello-scholar status
hello-scholar doctor
hello-scholar cleanup codex
```

## Development

```bash
npm test
```

Tests cover catalog resolution, selection persistence, standby install/cleanup, and global plugin installation flow.
