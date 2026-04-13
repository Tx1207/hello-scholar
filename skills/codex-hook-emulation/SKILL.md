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
- `Intent tracking` -> project-level change record creation / continuation
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
- `standby`: `python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`
- `global`: `python3 "$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`

### 1. Session start surrogate

At the start of a substantive repo session, run:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-start --cwd "$PWD"
```

Use this as the Codex substitute for `SessionStart`.

### 2. Preflight guard for risky actions

Before destructive or irreversible operations, run:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" preflight "git push --force origin main"
```

Interpret the result like this:
- exit `0` -> allow
- exit `3` -> ask / confirm first
- exit `2` -> block unless the user explicitly overrides with clear intent

### 2.5 Project change tracking surrogate

For substantial project work, record the user request before editing:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" track-intent --cwd "$PWD" --title "Fix training config" --request "修复训练配置加载问题" --route ~build --tier T2 --file src/train.py
```

After real edits, record what actually changed:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" track-change --cwd "$PWD" --summary "Adjusted config load order" --file src/config/loaders.py --verification "pytest tests/test_config_loader.py"
```

At phase closeout or task completion:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" track-closeout --cwd "$PWD" --status done --result "Validated the fix manually"
```

These commands maintain:

- `hello-scholar/changes/*.md`
- `hello-scholar/changes/INDEX.md`
- `hello-scholar/state/STATE.md`

### 3. Post-edit verification surrogate

After meaningful file edits, run:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" post-edit --cwd "$PWD"
```

Or pass touched files explicitly:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" post-edit --cwd "$PWD" README.md scripts/setup.sh
```

Use this as the Codex substitute for `PostToolUse`.

### 4. Session-end surrogate

Before closeout or when the user says `wrap up`, run:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-end --cwd "$PWD"
```

If the current mode is `global`, replace the helper path in the examples above with:

```bash
$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py
```

Then apply `session-wrap-up` for the final human-readable summary.

## Behavioral rules

- Prefer this skill in Codex whenever you would normally rely on Claude Code hooks for workflow discipline.
- For substantial project work, use `track-intent` before editing and `track-change` after editing.
- Use `preflight` before `git push --force`, `git reset --hard`, dangerous deletes, risky chmods, or sensitive config writes.
- Use `post-edit` after code, skill, config, or Obsidian workflow changes.
- Use `track-closeout` when a tracked change reaches `done` or `closed`.
- In bound research repos, treat the post-edit result as a reminder to consider minimum Obsidian write-back.

## Resources

- `references/HOOK-MAPPING.md` - mapping from Claude hook events to Codex substitutes
- `references/USAGE.md` - recommended invocation patterns and return codes
- `examples/example-session-start.txt` - example output shape
- `scripts/codex_hook_emulation.py` - deterministic helper script
