# Usage

Use the helper path that matches the current mode:
- `standby`: `python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`
- `global`: `python3 "$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`

## Exit codes

### `preflight`
- `0` -> allow
- `3` -> confirm with user first
- `2` -> block by default

## Recommended patterns

### Before dangerous git operations

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" preflight "git reset --hard HEAD~1"
```

### After broad documentation or skill edits

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" post-edit --cwd "$PWD"
```

### At the start of a research repo session

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-start --cwd "$PWD"
```

### Before ending a session

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-end --cwd "$PWD"
```

## JSON mode

For machine-readable output:

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-start --cwd "$PWD" --json
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" preflight --json "git push --force origin main"
```
