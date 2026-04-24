# 用法

使用与当前模式匹配的 helper path：
- `standby`: `python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`
- `global`: `python3 "$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`

## 退出码

### `preflight`
- `0` -> 允许
- `3` -> 先向用户确认
- `2` -> 默认阻止

## 推荐模式

### 危险 git 操作前

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" preflight "git reset --hard HEAD~1"
```

### 大范围文档或 skill 编辑后

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" post-edit --cwd "$PWD"
```

### research repo 会话开始时

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-start --cwd "$PWD"
```

### 会话结束前

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-end --cwd "$PWD"
```

## JSON 模式

如果需要 machine-readable 输出：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-start --cwd "$PWD" --json
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" preflight --json "git push --force origin main"
```
