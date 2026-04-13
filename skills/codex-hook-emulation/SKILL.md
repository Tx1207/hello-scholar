---
name: codex-hook-emulation
description: This skill should be used when the user wants Codex CLI to approximate Claude Code hook behavior, emulate SessionStart or SessionEnd checks, add preflight guards before dangerous actions, trigger post-edit verification automatically, or maximize Claude Code hook-like workflow safety in Codex.
---

# Codex Hook Emulation

Emulate the **highest-value parts of Claude Code hooks** inside Codex using:
- `AGENTS.md` protocol rules,
- a deterministic helper script,
- and explicit agent behavior at session boundaries and risky actions.

## What this skill does

This skill maps Claude Code hook intent onto Codex-native substitutes:
- `SessionStart` -> deterministic session-start summary
- `PreToolUse` -> dangerous-action preflight guard
- `PostToolUse` -> post-edit verification suggestions
- `Stop` / `SessionEnd` -> deterministic closeout summary + `session-wrap-up`

When the current repo is bound to Obsidian project memory, the helper should also surface the same kind of **Obsidian-aware reminders** that the main-branch hooks provide:
- binding status,
- project id / vault root / auto-sync,
- minimum post-turn maintenance reminders,
- bootstrap hints for research-repo candidates that are still unbound.

## What it does not do

- It does **not** create true native Codex hooks.
- It does **not** intercept every tool automatically at runtime.
- It does **not** replace sandboxing or explicit user confirmation for destructive actions.

## Default workflow

Use the helper path that matches the current mode:
- `standby`: `python3 ".scholaragents/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`
- `global`: `python3 "$HOME/.codex/plugins/cache/local-plugins/scholaragents/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`

### 1. Session start surrogate

At the start of a substantive repo session, run:

```bash
python3 ".scholaragents/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-start --cwd "$PWD"
```

Use this as the Codex substitute for `SessionStart`.

### 2. Preflight guard for risky actions

Before destructive or irreversible operations, run:

```bash
python3 ".scholaragents/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" preflight "git push --force origin main"
```

Interpret the result like this:
- exit `0` -> allow
- exit `3` -> ask / confirm first
- exit `2` -> block unless the user explicitly overrides with clear intent

### 3. Post-edit verification surrogate

After meaningful file edits, run:

```bash
python3 ".scholaragents/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" post-edit --cwd "$PWD"
```

Or pass touched files explicitly:

```bash
python3 ".scholaragents/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" post-edit --cwd "$PWD" README.md scripts/setup.sh
```

Use this as the Codex substitute for `PostToolUse`.

### 4. Session-end surrogate

Before closeout or when the user says `wrap up`, run:

```bash
python3 ".scholaragents/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-end --cwd "$PWD"
```

If the current mode is `global`, replace the helper path in the examples above with:

```bash
$HOME/.codex/plugins/cache/local-plugins/scholaragents/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py
```

Then apply `session-wrap-up` for the final human-readable summary.

## Behavioral rules

- Prefer this skill in Codex whenever you would normally rely on Claude Code hooks for workflow discipline.
- Use `preflight` before `git push --force`, `git reset --hard`, dangerous deletes, risky chmods, or sensitive config writes.
- Use `post-edit` after code, skill, config, or Obsidian workflow changes.
- In bound research repos, treat the post-edit result as a reminder to consider minimum Obsidian write-back.

## Resources

- `references/HOOK-MAPPING.md` - mapping from Claude hook events to Codex substitutes
- `references/USAGE.md` - recommended invocation patterns and return codes
- `examples/example-session-start.txt` - example output shape
- `scripts/codex_hook_emulation.py` - deterministic helper script
