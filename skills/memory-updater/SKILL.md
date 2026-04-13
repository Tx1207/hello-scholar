---
name: memory-updater
description: Checks and updates the hello-scholar global memory file to stay in sync with changes to skills, commands, agents, and hooks.
tags: [Memory, Configuration, Sync, Workflow]
---

# Memory Updater

Check and update the hello-scholar global memory file, ensuring its content stays synchronized with source files for skills, commands, agents, and hooks.

## Overview

The canonical global memory file is:
- `~/.hello-scholar/AGENTS-memory.md`

It can summarize:
- skill catalog structure,
- command list,
- agent configuration,
- hook definitions,
- global conventions worth preserving across projects.

This file is global knowledge. It must live outside uninstall-managed plugin/runtime directories.

## Detection Logic

1. **Scan source file modification times**
   - `~/plugins/hello-scholar/skills/**/SKILL.md`
   - `~/plugins/hello-scholar/agents/**/AGENTS.md`
   - `~/plugins/hello-scholar/commands/**/*.md`
   - `~/plugins/hello-scholar/hooks/**/*.{js,json}`
   - fallback to the currently checked-out repo `./skills/`, `./agents/`, `./commands/`, `./hooks/` when working from source

2. **Compare against `~/.hello-scholar/AGENTS-memory.md`**
   - If any source file is newer, an update is needed
   - Track last sync timestamp via `~/.hello-scholar/.last-memory-sync`

3. **Generate report**
   - List all changed source files
   - Show which memory sections need updating

## Update Flow

### 1. Scan Phase
```
Scanning Skills: X items
Scanning Commands: Y items
Scanning Agents: Z items
Scanning Hooks: W items
```

### 2. Compare Phase
```
Sections needing update:
- [ ] Skill catalog
- [ ] Command list
- [ ] Agent config
- [ ] Hook definitions
```

### 3. Confirm Update
Ask the user whether to proceed:
- `yes` - Execute update
- `no` - Cancel
- `diff` - Show detailed differences

### 4. Execute Update
- Preserve user-edited content
- Only update clearly marked generated sections
- Update `~/.hello-scholar/.last-memory-sync`

## Options

- Default - Check and prompt for update
- `--check` - Check only, do not update
- `--force` - Force update without confirmation
- `--diff` - Show difference comparison

## Integration

- Integrate check reminders in session wrap-up
- Pair with post-edit verification when the skill/agent catalog changes
- Recommended to run periodically at the end of a maintenance session
