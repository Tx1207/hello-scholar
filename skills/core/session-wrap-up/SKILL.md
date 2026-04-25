---
name: session-wrap-up
description: 生成 session work log，检查是否需要更新 AGENTS.md，并清理临时文件。用于替代 session-summary 和 stop-summary hooks。
tags: [Workflow, Session, Productivity]
---

# Session Wrap-Up

生成完整的 session summary，并执行收尾清理任务。

## 何时使用

在以下场景触发该 skill：
- 用户说 “wrap up”、“总结”、“session end” 或类似表达
- 在结束一次工作 session 之前
- 在多个 major tasks 之间切换时

## 操作说明

如果当前仓库中可用，先运行：

```bash
python3 ".hello-scholar/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-end --cwd "$PWD"
```

如果当前模式是 `global`，则将 helper path 替换为：

```bash
python3 "$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/codex-hook-emulation/scripts/codex_hook_emulation.py" session-end --cwd "$PWD"
```

把该输出当作 Codex 对 `SessionEnd` / `Stop` hook 的确定性替代，再撰写最终的人类可读总结。

Only present a final complete, waiting, or blocked status at the actual end of the turn. Progress updates and intermediate summaries must not be phrased as final completion. When the project provides structured turn-state helpers, write machine-readable status before the final closeout and include reason category plus reason for waiting or blocked states.

### 1. 生成 Work Log

总结本次 session：

```text
📋 本次操作回顾
1. [List main operations performed]
2. [List files modified/created]

📊 当前状态
• Git: [branch, uncommitted changes count]
• Tests: [pass/fail status if applicable]
• Build: [status if applicable]

💡 下一步建议
1. [Actionable next steps]
```

### 2. 检查 AGENTS.md 更新

扫描是否存在需要更新 AGENTS.md 的变化：
- 新增或修改的 skills
- 新增的 agents 配置
- 配置层变化

如果需要更新，提出具体修改建议。

### 3. 清理临时文件

检查哪些临时文件应被清理：
- `/temp/` 目录内容
- `/plan/` 目录中的已完成计划
- 孤立测试文件
- 调试 / 日志文件

报告发现，并在删除前征求确认。

### 4. 检查 Git 状态

展示：
- 当前分支
- 未提交变更
- 未 push 的 commits
- stash 条目

## 输出格式

始终使用以上结构化格式。保持总结简洁，但信息完整。
