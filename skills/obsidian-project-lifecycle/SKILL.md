---
name: obsidian-project-lifecycle
description: Use this skill when the user wants to detach, archive, purge, or otherwise change the lifecycle state of an Obsidian project knowledge base.
---

# Obsidian Project Lifecycle

Use the shared helper script for deterministic lifecycle operations.

## Role in the workflow

This is a **supporting skill** under `obsidian-project-memory`.

Use it for project-level state changes and, when needed, note-level removal or rename flows.

## Project-level commands

```bash
python3 ".scholaragents/skills/obsidian-project-memory/scripts/project_kb.py" lifecycle --cwd "$PWD" --mode detach
python3 ".scholaragents/skills/obsidian-project-memory/scripts/project_kb.py" lifecycle --cwd "$PWD" --mode archive
python3 ".scholaragents/skills/obsidian-project-memory/scripts/project_kb.py" lifecycle --cwd "$PWD" --mode purge
```

## Note-level command

```bash
python3 ".scholaragents/skills/obsidian-project-memory/scripts/project_kb.py" note-lifecycle --cwd "$PWD" --mode archive --note "Results/Old-Result.md"
python3 ".scholaragents/skills/obsidian-project-memory/scripts/project_kb.py" note-lifecycle --cwd "$PWD" --mode purge --note "Results/Old-Result.md"
python3 ".scholaragents/skills/obsidian-project-memory/scripts/project_kb.py" note-lifecycle --cwd "$PWD" --mode rename --note "Experiments/Old-Name.md" --dest "Experiments/New-Name.md"
```

If the current mode is `global`, replace the helper path in the examples above with:

```bash
$HOME/.codex/plugins/cache/local-plugins/scholaragents/local/skills/obsidian-project-memory/scripts/project_kb.py
```

## Policy

- **Detach**: stop syncing, keep vault content.
- **Archive**: default for “remove this project's knowledge”; move the project to `Archive/` and disable syncing.
- **Purge**: only when the user explicitly requests permanent deletion.
- **Rename / move**: treat as update plus link repair, not delete plus create.

Always summarize what was removed, what was preserved, and whether auto-sync remains enabled.
