# hello-scholar

`hello-scholar` is a Codex-oriented CLI runtime for ML experiment development, research records, profile-based skill activation, and skill/preference evolution.

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

List lifecycle profiles:

```bash
hello-scholar profile list
```

Use the default `ml-development` profile or switch profile:

```bash
hello-scholar profile use ml-development
```

Install the current profile selection into the current project in `standby` mode:

```bash
hello-scholar install codex --standby
```

Install the current profile selection into your Codex global environment:

```bash
hello-scholar install codex --global
```

Check runtime state:

```bash
hello-scholar status
hello-scholar preferences show
```

Clean up an installation:

```bash
hello-scholar cleanup codex --standby
hello-scholar cleanup codex --global
```

## How It Works

- `ml-development` is the default/base profile for research code development and experiment analysis.
- lifecycle profiles are `research-ideation`, `ml-development`, `paper-writing`, `paper-self-review`, `submission-rebuttal`, and `post-acceptance`.
- `bundles` remain an internal compatibility layer behind profiles.
- `standby` mode writes the active runtime into the current project's `.hello-scholar/`.
- `global` mode installs `hello-scholar` as a local Codex plugin chain under your home directory.

## Runtime Layout

Repository skills are organized by canonical capability domain. Profiles are manifests and do not duplicate skill folders:

- `skills/core/`
- `skills/research/`
- `skills/development/`
- `skills/writing/`
- `skills/review/`
- `skills/submission/`
- `skills/post-acceptance/`
- `skills/memory/`
- `skills/meta/`
- `skills/profiles/`
- `skills/commands/`

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
- `hello-scholar/experiments/`
- `hello-scholar/state/`
- `hello-scholar/plans/`
- `hello-scholar/preferences/`

Experiment artifacts are centralized under `hello-scholar/experiments/EXP-*/`. Top-level evidence is retained only for non-experiment plan/delivery compatibility.

Global mode:

- `~/plugins/hello-scholar/.hello-scholar/`
- `~/plugins/hello-scholar/`
- `~/.codex/plugins/cache/local-plugins/hello-scholar/local/`
- `~/.codex/AGENTS.md`
- `~/.codex/config.toml`

## Common Commands

```bash
hello-scholar install codex --standby
hello-scholar install codex --global
hello-scholar cleanup codex --standby
hello-scholar cleanup codex --global
hello-scholar profile list
hello-scholar profile use ml-development
hello-scholar preferences show
hello-scholar status
```

## Development

```bash
npm test
```

Tests cover catalog resolution, selection persistence, standby install/cleanup, and global plugin installation flow.
