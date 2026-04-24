---
name: mcp-integration
description: 当用户要求“add MCP server”、“integrate MCP”、“configure MCP in plugin”、“use .mcp.json”、“set up Model Context Protocol”、“connect external service”，提到 “${CLAUDE_PLUGIN_ROOT} with MCP”，或讨论 SSE、stdio、HTTP、WebSocket 等 MCP server 类型时使用。该 skill 提供把 Model Context Protocol server 集成到 Claude Code plugin 中的完整指导。
version: 0.1.0
---

# MCP Integration for Claude Code Plugins

> **范围说明**：本 skill 主要记录 **Claude Code plugin 的 MCP 集成**，不是 Codex 原生 plugin 机制。在 Codex CLI 中，MCP 通常通过 `~/.codex/config.toml` 里的 `[mcp_servers]` 配置。

## 概览

Model Context Protocol（MCP）让 Claude Code plugin 能以结构化 tool 的形式接入外部服务和 API。使用 MCP，可以把外部服务能力暴露为 Claude Code 内部工具。

**关键能力：**
- 连接外部服务（数据库、API、文件系统）
- 一个服务暴露 10+ 个相关 tool
- 处理 OAuth 和复杂认证流程
- 随 plugin 一起打包 MCP server，实现自动安装与启用

## MCP Server Configuration Methods

Plugin 可以通过两种方式打包 MCP server：

### Method 1: Dedicated .mcp.json (Recommended)

在 plugin 根目录创建 `.mcp.json`：

```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

**优点：**
- 职责分离更清晰
- 更易维护
- 更适合多个 server

### Method 2: Inline in plugin.json

直接在 `plugin.json` 中写 `mcpServers`：

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

**优点：**
- 只有一个配置文件
- 适合简单的单 server plugin

## MCP Server Types

### stdio (Local Process)

把本地 MCP server 作为子进程执行，适合本地工具和自定义 server。

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
    "env": {
      "LOG_LEVEL": "debug"
    }
  }
}
```

**适用场景：**
- 文件系统访问
- 本地数据库连接
- 自定义 MCP server
- 通过 npm 分发的 MCP server

### SSE (Server-Sent Events)

连接托管型 MCP server，通常带 OAuth，适合云服务。

```json
{
  "asana": {
    "type": "sse",
    "url": "https://mcp.asana.com/sse"
  }
}
```

### HTTP (REST API)

连接基于 REST 的 MCP server，常用于 token 认证。

```json
{
  "api-service": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    }
  }
}
```

### WebSocket (Real-time)

连接 WebSocket MCP server，用于实时双向通信。

```json
{
  "realtime-service": {
    "type": "ws",
    "url": "wss://mcp.example.com/ws",
    "headers": {
      "Authorization": "Bearer ${TOKEN}"
    }
  }
}
```

## Environment Variable Expansion

所有 MCP 配置都支持环境变量替换：

**`${CLAUDE_PLUGIN_ROOT}`**：plugin 根目录，路径引用必须优先使用它。

**用户环境变量**：来自用户 shell。

**最佳实践：** 在 plugin README 中明确列出所有必需环境变量。

## MCP Tool Naming

MCP server 暴露出来的 tool 会自动带前缀：

**格式：** `mcp__plugin_<plugin-name>_<server-name>__<tool-name>`

**示例：**
- Plugin：`asana`
- Server：`asana`
- Tool：`create_task`
- 完整名：`mcp__plugin_asana_asana__asana_create_task`

### Using MCP Tools in Commands

可以在 command frontmatter 中预先放行特定 MCP tool：

```markdown
---
allowed-tools: [
  "mcp__plugin_asana_asana__asana_create_task",
  "mcp__plugin_asana_asana__asana_search_tasks"
]
---
```

**不建议滥用 wildcard**，安全上优先精确列出所需 tool。

## Lifecycle Management

**自动启动：**
- plugin 启用时，MCP server 会启动或建立连接
- 第一次调用 tool 前完成可用性准备
- 修改配置后通常需要重启 / 重新加载

生命周期大致为：
1. plugin 加载
2. 解析 MCP 配置
3. 启动 stdio 进程，或建立 SSE / HTTP / WS 连接
4. 自动发现并注册 tool
5. 通过 `mcp__plugin_...__...` 名称提供给 Claude Code

可以用 `/mcp` 查看所有 server，包括 plugin 自带的 server。

## Authentication Patterns

### OAuth

SSE / HTTP 场景下，OAuth 通常由 Claude Code 自动处理，首次使用时引导用户在浏览器中认证。

### Token-Based

适合在 `headers` 中通过环境变量传 token。

### Environment Variables (stdio)

把数据库 URL、API key 等配置通过 `env` 注入给本地 server。

## Integration Patterns

### Pattern 1: Simple Tool Wrapper

command 先收集用户输入，再调用 MCP tool。

### Pattern 2: Autonomous Agent

agent 在多步流程中自主调用 MCP tool，比如先查询数据，再分析并生成报告。

### Pattern 3: Multi-Server Plugin

一个 plugin 同时集成多个服务，例如 GitHub + Jira。

## 安全最佳实践

### Use HTTPS/WSS

始终优先使用安全连接：

```json
✅ "url": "https://mcp.example.com/sse"
❌ "url": "http://mcp.example.com/sse"
```

### Token Management

**DO：**
- ✅ token 通过环境变量传入
- ✅ 在 README 中记录所需环境变量
- ✅ 能用 OAuth 就优先交给 OAuth

**DON'T：**
- ❌ 在配置里硬编码 token
- ❌ 把 token 提交到 git
- ❌ 在文档中泄露凭据

### Permission Scoping

command 中预放行的 MCP tool 应尽量最小化，不要用大范围 wildcard。

## Error Handling

### Connection Failures

- command 中提供合理 fallback
- 明确告知用户连接失败
- 检查 server URL 与配置

### Tool Call Errors

- 调用前先校验输入
- 返回清晰错误信息
- 关注 rate limit 和 quota

### Configuration Errors

- 开发阶段就测试 server 连通性
- 检查 JSON 语法
- 检查必需环境变量是否存在

## Performance Considerations

### Lazy Loading

MCP server 往往按需连接，不一定在启动时全部建立连接；首次 tool 调用时才真正激活。

### Batching

能合并请求时尽量合并，避免大量逐条查询。

## Testing MCP Integration

### Local Testing

1. 在 `.mcp.json` 中配置 server
2. 本地安装 plugin
3. 用 `/mcp` 确认 server 已出现
4. 在 command 中测试 tool 调用
5. 用 `claude --debug` 查看连接日志

### Validation Checklist

- [ ] MCP 配置是合法 JSON
- [ ] Server URL 正确且可访问
- [ ] 必需环境变量已记录
- [ ] `/mcp` 输出中能看到 tool
- [ ] 认证正常（OAuth 或 token）
- [ ] 从 command 中调用成功
- [ ] 错误场景处理正常

## Debugging

### Enable Debug Logging

```bash
claude --debug
```

重点观察：
- MCP server 连接尝试
- tool 发现日志
- 认证流程
- tool call error

### 常见问题

**Server 连接不上：**
- 检查 URL
- 如果是 stdio，检查 server 是否能本地启动
- 检查网络可达性
- 复核认证配置

**Tool 不可用：**
- 检查 server 是否成功连接
- 检查 tool 名称是否完全匹配
- 用 `/mcp` 查看实际可用 tool
- 改完配置后重启 Claude Code

**认证失败：**
- 清空缓存 token
- 重新认证
- 检查 scope 和权限
- 检查环境变量

## Quick Reference

### MCP Server Types

| Type | Transport | Best For | Auth |
|------|-----------|----------|------|
| stdio | Process | 本地工具、自定义 server | Env vars |
| SSE | HTTP | 托管服务、云 API | OAuth |
| HTTP | REST | API backend、token auth | Tokens |
| ws | WebSocket | 实时、流式通信 | Tokens |

### Configuration Checklist

- [ ] server type 已指定（stdio / SSE / HTTP / ws）
- [ ] 类型所需字段完整（`command` 或 `url`）
- [ ] 认证已配置
- [ ] 环境变量已记录
- [ ] 使用 HTTPS / WSS
- [ ] 路径统一使用 `${CLAUDE_PLUGIN_ROOT}`

### 最佳实践

**DO：**
- ✅ 路径统一使用 `${CLAUDE_PLUGIN_ROOT}`
- ✅ 记录所有必需环境变量
- ✅ 使用 HTTPS / WSS
- ✅ command 中只预放行必要 MCP tool
- ✅ 发布前先做本地验证
- ✅ 平稳处理连接与 tool error

**DON'T：**
- ❌ 硬编码绝对路径
- ❌ 提交凭据到 git
- ❌ 用 HTTP 替代 HTTPS
- ❌ 用 wildcard 预放行所有工具
- ❌ 跳过错误处理
- ❌ 忘记写 setup 文档

## Additional Resources

### Reference Files

- **`references/server-types.md`** - 各类 server 的深入说明
- **`references/authentication.md`** - 认证模式与 OAuth
- **`references/tool-usage.md`** - 在 command 和 agent 中使用 MCP tool

### Example Configurations

- **`examples/stdio-server.json`** - 本地 stdio MCP server
- **`examples/sse-server.json`** - 带 OAuth 的托管 SSE server
- **`examples/http-server.json`** - 基于 token 的 REST API 配置

### External Resources

- **Official MCP Docs**: https://modelcontextprotocol.io/
- **Claude Code MCP Docs**: https://docs.claude.com/en/docs/claude-code/mcp
- **MCP SDK**: @modelcontextprotocol/sdk

## Implementation Workflow

为 plugin 增加 MCP integration 时：

1. 先选 MCP server 类型（stdio、SSE、HTTP、ws）
2. 在 plugin 根目录创建 `.mcp.json`
3. 所有文件路径都使用 `${CLAUDE_PLUGIN_ROOT}`
4. 在 README 中记录所需环境变量
5. 用 `/mcp` 本地验证
6. 在相关 command 中预放行对应 MCP tool
7. 配置认证（OAuth 或 token）
8. 测试异常场景（连接失败、认证失败）
9. 在 plugin README 中补充集成说明

对自定义 / 本地服务优先考虑 stdio，对带 OAuth 的托管服务优先考虑 SSE。
