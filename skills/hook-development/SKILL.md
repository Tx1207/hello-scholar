---
name: hook-development
description: 当用户要求“create a hook”、“add a PreToolUse/PostToolUse/Stop hook”、“validate tool use”、“implement prompt-based hooks”、“use ${CLAUDE_PLUGIN_ROOT}”、“set up event-driven automation”、“block dangerous commands”，或提到 PreToolUse、PostToolUse、Stop、SubagentStop、SessionStart、SessionEnd、UserPromptSubmit、PreCompact、Notification 等 hook event 时使用。该 skill 提供 Claude Code plugin hook 的完整开发指南，重点覆盖 prompt-based hooks API。
version: 0.1.0
---

# Hook Development for Claude Code Plugins

> **范围说明**：本 skill 是 **Claude Code hook 参考文档**，不是 Codex 原生能力。Codex CLI 不暴露 Claude Code 的 hook system。

## 概览

Hook 是对 Claude Code event 做出响应的自动化脚本。它可用于校验操作、执行策略、补充上下文，以及把外部工具整合进开发流程。

**关键能力：**
- 在 tool 执行前校验（`PreToolUse`）
- 在 tool 执行后响应结果（`PostToolUse`）
- 在停止前检查完成度（`Stop`、`SubagentStop`）
- 在 `SessionStart` 加载项目上下文
- 在整个开发生命周期中自动化流程

## Hook Types

### Prompt-Based Hooks (Recommended)

使用 LLM 推理做上下文感知判断：

```json
{
  "type": "prompt",
  "prompt": "Evaluate if this tool use is appropriate: $TOOL_INPUT",
  "timeout": 30
}
```

**适用事件：** `Stop`、`SubagentStop`、`UserPromptSubmit`、`PreToolUse`

**优点：**
- 上下文敏感
- 逻辑灵活
- 处理 edge case 更自然
- 易维护

### Command Hooks

执行 bash 命令做确定性检查：

```json
{
  "type": "command",
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh",
  "timeout": 60
}
```

适合：
- 快速、确定性的校验
- 文件系统操作
- 外部工具集成
- 对性能要求高的检查

## Hook Configuration Formats

### Plugin hooks.json Format

plugin 的 `hooks/hooks.json` 使用 wrapper 格式：

```json
{
  "description": "Brief explanation of hooks (optional)",
  "hooks": {
    "PreToolUse": [...],
    "Stop": [...],
    "SessionStart": [...]
  }
}
```

### Settings Format (Direct)

用户设置中的 `.claude/settings.json` 使用直接格式：

```json
{
  "PreToolUse": [...],
  "Stop": [...],
  "SessionStart": [...]
}
```

## Hook Events

### PreToolUse

在 tool 执行前运行，可用于 approve / deny / modify。

### PostToolUse

在 tool 完成后运行，可用于反馈、日志、补充上下文。

### Stop

主 agent 准备结束时执行，用于检查任务是否真的完成。

### SubagentStop

subagent 结束时执行，作用类似 `Stop`。

### UserPromptSubmit

用户提交 prompt 时执行，可用于前置校验、补充 context 或阻断提示。

### SessionStart

session 开始时执行，可用于加载环境、上下文、持久化环境变量。

### SessionEnd

session 结束时执行，可用于清理和落日志。

### PreCompact / Notification

分别用于 compact 前保留关键信息，以及响应通知事件。

## Hook Output Format

标准输出示例：

```json
{
  "continue": true,
  "suppressOutput": false,
  "systemMessage": "Message for Claude"
}
```

**Exit code：**
- `0`：成功
- `2`：阻断性错误
- 其他：非阻断错误

## Hook Input Format

所有 hook 都通过 stdin 接收 JSON，通常包含：
- `session_id`
- `transcript_path`
- `cwd`
- `permission_mode`
- `hook_event_name`

不同事件还会附带：
- `tool_name`、`tool_input`、`tool_result`
- `user_prompt`
- `reason`

## Environment Variables

常见环境变量：
- `$CLAUDE_PROJECT_DIR`
- `$CLAUDE_PLUGIN_ROOT`
- `$CLAUDE_ENV_FILE`（仅 SessionStart）
- `$CLAUDE_CODE_REMOTE`

**始终优先使用 `${CLAUDE_PLUGIN_ROOT}` 做可移植路径引用。**

## Plugin Hook Configuration

plugin 中通常在 `hooks/hooks.json` 定义各事件 hook。plugin hook 会与用户 hook 合并，并并行运行。

## Matchers

### Tool Name Matching

```json
"matcher": "Write"
"matcher": "Read|Write|Edit"
"matcher": "*"
"matcher": "mcp__.*__delete.*"
```

matcher 大小写敏感。

## 安全最佳实践

### Input Validation

command hook 中必须校验输入，不要信任外部数据。

### Path Safety

要检查：
- path traversal
- `.env` 等敏感文件
- 非法 tool name

### Quote All Variables

bash 变量一律加引号。

### Set Appropriate Timeouts

hook 必须设置合理超时，避免拖慢交互。

## Performance Considerations

### Parallel Execution

所有匹配到的 hook 会**并行执行**。

设计含义：
- hook 看不到彼此输出
- 执行顺序不稳定
- 必须按“彼此独立”来设计

### Optimization

1. 简单确定性检查用 command hook
2. 复杂推理用 prompt hook
3. 热路径减少 I/O
4. 必要时缓存结果

## Temporarily Active Hooks

可通过 flag file 或配置开关，让 hook 仅在特定条件下生效。

适用场景：
- 临时严格校验
- 调试专用 hook
- 项目特定行为
- feature flag

## Hook Lifecycle and Limitations

### Hooks Load at Session Start

**重要：** hook 在 Claude Code session 启动时加载，修改配置后必须重启 Claude Code 才会生效。

不能热更新：
- 改 `hooks.json`
- 新增 hook script
- 修改 command / prompt

### Hook Validation at Startup

启动时会校验：
- JSON 是否合法
- script 是否存在
- 调试模式下会报告语法问题

可用 `/hooks` 查看当前 session 已加载的 hook。

## Debugging Hooks

### Enable Debug Mode

```bash
claude --debug
```

关注：
- hook 注册与执行日志
- 输入 / 输出 JSON
- timing

### Test Hook Scripts

可以直接把 JSON pipe 给 hook script 测试。

### Validate JSON Output

可用 `jq` 检查 hook 输出是否是合法 JSON。

## Quick Reference

### Hook Events Summary

| Event | When | Use For |
|-------|------|---------|
| PreToolUse | 工具执行前 | 校验、改写 |
| PostToolUse | 工具执行后 | 反馈、日志 |
| UserPromptSubmit | 用户提交 prompt 时 | context、校验 |
| Stop | 主 agent 结束前 | 完成度检查 |
| SubagentStop | subagent 结束前 | 子任务校验 |
| SessionStart | session 开始 | 加载上下文 |
| SessionEnd | session 结束 | 清理、日志 |
| PreCompact | compact 前 | 保留关键上下文 |
| Notification | 发送通知时 | 响应或记录 |

### 最佳实践

**DO：**
- ✅ 复杂逻辑优先用 prompt-based hook
- ✅ 路径统一用 `${CLAUDE_PLUGIN_ROOT}`
- ✅ 校验所有输入
- ✅ bash 变量全部加引号
- ✅ 设置合理 timeout
- ✅ 输出结构化 JSON
- ✅ 充分测试

**DON'T：**
- ❌ 硬编码路径
- ❌ 不校验用户输入
- ❌ 写长时间运行 hook
- ❌ 依赖 hook 执行顺序
- ❌ 不可预测地修改全局状态
- ❌ 记录敏感信息

## Additional Resources

- **`references/patterns.md`** - 常见 hook 模式
- **`references/migration.md`** - 从基础 hook 迁移到高级 hook
- **`references/advanced.md`** - 高级场景与技巧
- **`examples/validate-write.sh`** - 文件写入校验示例
- **`examples/validate-bash.sh`** - Bash 校验示例
- **`examples/load-context.sh`** - SessionStart 上下文加载示例
- **`scripts/validate-hook-schema.sh`** - 校验 `hooks.json`
- **`scripts/test-hook.sh`** - 测试 hook
- **`scripts/hook-linter.sh`** - 检查常见问题

## Implementation Workflow

为 plugin 实现 hook 时：

1. 先确定要监听的事件
2. 决定使用 prompt-based 还是 command hook
3. 在 `hooks/hooks.json` 中写配置
4. 若使用 command hook，则创建 script
5. 路径统一使用 `${CLAUDE_PLUGIN_ROOT}`
6. 用校验脚本检查配置
7. 部署前先做本地测试
8. 在 Claude Code 中用 `claude --debug` 验证
9. 在 plugin README 中记录 hook 行为

大多数场景优先使用 prompt-based hook；只有在需要高性能或确定性检查时再使用 command hook。
