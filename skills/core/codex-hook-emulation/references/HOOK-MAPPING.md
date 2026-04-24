# Hook 映射：Claude Code -> Codex

## 核心原则

Codex 没有原生 hook runtime，因此通过以下方式模拟 hooks：
1. 确定性的 helper scripts
2. AGENTS 层的强制协议
3. 由 skill 触发的执行约束

## 映射表

| Claude Code hook | Codex 替代方案 | 触发点 |
|---|---|---|
| `SessionStart` | `python3 "<current-mode-helper>" session-start` | 仓库中的第一个实质性回合 |
| `PreToolUse` | `python3 "<current-mode-helper>" preflight ...` | 破坏性或高风险操作前 |
| `PostToolUse` | `python3 "<current-mode-helper>" post-edit ...` | 有意义编辑后 |
| `Stop` | `python3 "<current-mode-helper>" session-end` | 任务或会话结束前 |
| `SessionEnd` | `session-end` + `session-wrap-up` | 显式 wrap-up 或 closeout |

## 推荐范围

聚焦高价值 hook 行为：
- 安全闸门
- session 上下文加载
- post-edit 验证
- closeout 纪律

不要尝试伪造完整运行时拦截。
