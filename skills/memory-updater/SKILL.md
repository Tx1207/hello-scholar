---
name: memory-updater
description: Checks and updates CLAUDE.md memory file to stay in sync with changes to skills, commands, agents, and hooks.
tags: [Memory, Configuration, Sync, Workflow]
---

# Memory Updater

Check and update the CLAUDE.md global memory file, ensuring its content stays synchronized with source files for skills, commands, agents, and hooks.

## Overview

CLAUDE.md is a summary memory file containing:
- Skill catalog structure (from `skills/`)
- Command list (from `commands/`)
- Agent configuration (from `agents/`)
- Hook definitions (from `hooks/`)

When these source files change, CLAUDE.md needs to be updated accordingly.

## Detection Logic

1. **Scan Source File Modification Times**
   - `~/.codex/skills/**/skill.md`
   - `~/.codex/commands/**/*.md`
   - `.scholaragents/agents/**/*.md`
   - `~/.codex/hooks/**/*.{js,json}`

2. **Compare Against CLAUDE.md Last Modified Time**
   - If any source file is newer than CLAUDE.md, an update is needed
   - Track last sync timestamp via `~/.codex/.last-memory-sync`

3. **Generate Report**
   - List all changed source files
   - Show which CLAUDE.md sections need updating

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
- [ ] Skill catalog (3 skills changed)
- [ ] Command list (1 command added)
- [ ] Agent config (no changes)
- [ ] Hook definitions (2 hooks modified)
```

### 3. Confirm Update
Ask the user whether to proceed:
- `yes` - Execute update
- `no` - Cancel
- `diff` - Show detailed differences

### 4. Execute Update
- Preserve user-edited content (e.g., "User Background", "Tech Stack Preferences")
- Only update AUTO-GENERATED marked sections
- Update sync timestamp

## Options

- Default - Check and prompt for update
- `--check` - Check only, do not update
- `--force` - Force update without confirmation
- `--diff` - Show difference comparison

## Integration

- Integrate check reminders in `session-summary.js`
- Real-time detection via PostToolUse hooks
- Recommended to run periodically (e.g., at end of each session)
