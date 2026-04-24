---
name: obsidian-project-lifecycle
description: 当用户希望 detach、archive、purge，或以其他方式改变一个 Obsidian 项目知识库的生命周期状态时使用该 skill。
---

# Obsidian Project Lifecycle

使用共享 helper script 执行确定性的 lifecycle 操作。

## 在工作流中的角色

这是 `obsidian-project-memory` 之下的一个 **supporting skill**。

它用于项目级状态变化，也可在需要时处理 note 级删除或重命名流程。

## 项目级命令

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" lifecycle --cwd "$PWD" --mode detach
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" lifecycle --cwd "$PWD" --mode archive
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" lifecycle --cwd "$PWD" --mode purge
```

## Note 级命令

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" note-lifecycle --cwd "$PWD" --mode archive --note "Results/Old-Result.md"
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" note-lifecycle --cwd "$PWD" --mode purge --note "Results/Old-Result.md"
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" note-lifecycle --cwd "$PWD" --mode rename --note "Experiments/Old-Name.md" --dest "Experiments/New-Name.md"
```

如果当前模式是 `global`，将以上示例中的 helper path 替换为：

```bash
$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/obsidian-project-memory/scripts/project_kb.py
```

## 策略

- **Detach**：停止同步，但保留 vault 内容。
- **Archive**：这是对“remove this project's knowledge”的默认解释；把项目移到 `Archive/` 并禁用同步。
- **Purge**：仅在用户明确要求永久删除时使用。
- **Rename / move**：应视为 update + link repair，而不是 delete + create。

始终总结：删除了什么、保留了什么，以及 auto-sync 是否仍启用。
