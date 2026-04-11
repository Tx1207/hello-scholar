# ScholarAGENTS

ScholarAGENTS is the Codex-oriented runtime in this repository. During migration, repository content can remain under `claude-scholar`, but the outward-facing CLI, bootstrap, config, and docs use the `scholaragents` name.

## What It Ships

- `base` layer: default lower-layer skills shared by multiple workflows
- `bundle` layer: opt-in workflow groups so users do not install everything at once
- `standby` mode: stores selected modules under the current project's `.scholaragents/` and injects the managed ScholarAGENTS block into the current project's `AGENTS.md`
- `global` mode: installs ScholarAGENTS as a local Codex plugin chain and mirrors selected modules into the plugin cache
- project activation: `.scholaragents/modules.json`

## Runtime Carriers

- runtime prompt rendering now uses `AGENTS.md` in this repository as the source template
- the bundle-sensitive sections are rendered dynamically from `.scholaragents/modules.json` during install
- project-level module activation is driven by `.scholaragents/modules.json`
- base modules stay as shared infrastructure; bundle modules stay opt-in and do not duplicate base dependency hubs

## Base Modules

Default base install keeps the dependency hubs that multiple bundles rely on:

- `planning-with-files`
- `daily-coding`
- `bug-detective`
- `verification-loop`
- `git-workflow`
- `codex-hook-emulation`
- `session-wrap-up`

Bundle-specific skills such as `obsidian-project-memory`, `plugin-structure`, `skill-development`, and `skill-quality-reviewer` now live in their own bundles instead of base.

## Bundles

- `research-core`: ideation, experiment analysis, literature review
- `writing-core`: paper drafting, citation checks, rebuttal, post-acceptance
- `dev-core`: code review, architecture, build repair, git helpers
- `obsidian-core`: full Obsidian project memory and literature workflow, including `obsidian-project-memory`
- `meta-builder`: plugin/skill/command/agent authoring and maintenance, including `plugin-structure`, `skill-development`, and `skill-quality-reviewer`
- `ui-content`: UI generation, review, and browser testing

## Quick Start

```bash
npm install
node scripts/build-catalog.mjs
node cli.mjs list bundles
node cli.mjs install codex --standby
```

`list bundles|skills|agents` opens the interactive selector in a TTY terminal.

Install standby mode with the current saved selection:

```bash
node cli.mjs install codex --standby
```

Install global mode with the current saved selection:

```bash
node cli.mjs install codex --global
```

Inspect or clean the installation:

```bash
node cli.mjs status
node cli.mjs doctor
node cli.mjs cleanup codex
```

## Selection Model

- Base modules are included by default unless `--no-base` is passed.
- `--bundle` adds categorized workflow clusters.
- `--skills` and `--agents` add individual modules.
- Skill dependencies are expanded automatically.
- Base dependency hubs stay in `base`; bundles reference them through `dependsOnBase`.

## Global Mode Layout

`install codex --global` now creates the real Codex local-plugin chain:

- `~/plugins/scholaragents/`
- `~/.agents/plugins/marketplace.json`
- `~/.codex/plugins/cache/local-plugins/scholaragents/local/`
- `~/.codex/AGENTS.md` managed bootstrap block
- `~/.codex/config.toml` managed plugin and agent block

## Development

```bash
npm test
```

Tests cover catalog dependency resolution, standby install/activate/cleanup, and global plugin installation.
