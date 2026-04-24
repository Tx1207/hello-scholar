---
name: codex-hook-emulation
description: 当用户希望 Codex CLI 近似 Claude Code hook 行为、模拟 SessionStart 或 SessionEnd 检查、在危险操作前增加 preflight 守卫、自动触发 post-edit 验证，或在 Codex 中尽可能遵循类似 Claude Code hook 的安全工作流时使用该 skill。
---

# Codex Hook Emulation

通过以下手段，在 Codex 内部模拟 **Claude Code hooks 中最有价值的部分**：
- `AGENTS.md` 协议规则
- 一个确定性的 helper script
- 以及在 session 边界和高风险操作前后的显式 agent 行为

## 这个 skill 会做什么

该 skill 将 Claude Code hook 的意图映射为 Codex 原生替代方案：
- `SessionStart` -> 确定性的 session-start 摘要
- `Intent tracking` -> 项目级 change record 的创建 / 延续
- `PreToolUse` -> 危险操作 preflight 守卫
- `PostToolUse` -> post-edit 验证建议
- `Stop` / `SessionEnd` -> 确定性的 closeout 摘要 + `session-wrap-up`

当当前仓库已绑定 Obsidian project memory 时，helper 还应输出与主分支 hooks 类似的 **Obsidian-aware 提醒**，例如：
- 绑定状态
- project id / vault root / auto-sync
- 最小化 post-turn 维护提醒
- 针对尚未绑定但明显是 research repo 的 bootstrap 提示

## 这个 skill 不会做什么

- 它**不会**创建真正原生的 Codex hooks。
- 它**不会**在运行时自动拦截每一次工具调用。
- 它**不会**替代 sandbox 或针对破坏性操作的显式用户确认。

## 默认工作流

使用与当前模式匹配的 helper 路径：
- `standby`: `python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`
- `global`: `python3 "$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" ...`

### 1. Session start surrogate

在一次实质性仓库会话开始时，运行：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-start --cwd "$PWD"
```

将其视为 Codex 中对 `SessionStart` 的替代。

### 2. 风险操作的 Preflight 守卫

在破坏性或不可逆操作前，运行：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" preflight "git push --force origin main"
```

当当前 route 是 `~idea` 时，显式传入它，这样 helper 就能阻止副作用：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" preflight --route ~idea "git commit -m test"
```

按以下规则解释返回结果：
- exit `0` -> 允许
- exit `3` -> 先询问 / 确认
- exit `2` -> 默认阻止，除非用户以清晰意图显式覆盖

### 2.5 项目级变更追踪替代流程

对于实质性项目工作，在编辑前先记录用户请求：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" track-intent --cwd "$PWD" --title "Fix training config" --request "修复训练配置加载问题" --route ~build --tier T2 --file src/train.py
```

完成真实编辑后，记录实际发生了什么：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" track-change --cwd "$PWD" --summary "Adjusted config load order" --file src/config/loaders.py --verification "pytest tests/test_config_loader.py"
```

在阶段收尾或任务完成时：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" track-closeout --cwd "$PWD" --status done --result "Validated the fix manually"
```

这些命令会维护：

- `hello-scholar/changes/*.md`
- `hello-scholar/changes/INDEX.md`
- `hello-scholar/state/STATE.md`

### 3. Post-edit 验证替代流程

完成有意义的文件编辑后，运行：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" post-edit --cwd "$PWD"
```

或者显式传入受影响文件：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" post-edit --cwd "$PWD" README.md scripts/setup.sh
```

将其视为 Codex 中对 `PostToolUse` 的替代。

### 4. Session-end surrogate

在 closeout 前，或者当用户说 `wrap up` 时，运行：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-end --cwd "$PWD"
```

如果当前模式是 `global`，则把以上示例中的 helper 路径替换为：

```bash
$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py
```

然后应用 `session-wrap-up`，生成最终的人类可读摘要。

## 行为规则

- 在 Codex 中，只要你原本会依赖 Claude Code hooks 来维持流程纪律，就优先使用这个 skill。
- 对于实质性项目工作，编辑前使用 `track-intent`，编辑后使用 `track-change`。
- 在 `git push --force`、`git reset --hard`、危险删除、高风险 chmod 或敏感配置写入前，使用 `preflight`。
- 在代码、skill、配置或 Obsidian 工作流发生改动后，使用 `post-edit`。
- 当一个已追踪变更进入 `done` 或 `closed` 时，使用 `track-closeout`。
- 在已绑定的 research repo 中，把 `post-edit` 的结果视为提醒：需要考虑最小 Obsidian 写回。

## 资源

- `references/HOOK-MAPPING.md`：Claude hook 事件到 Codex 替代流程的映射
- `references/USAGE.md`：推荐调用模式和返回码说明
- `examples/example-session-start.txt`：示例输出形态
- `scripts/codex_hook_emulation.py`：确定性的 helper script
