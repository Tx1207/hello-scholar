# MCP Server 类型详解

这是一份 Claude Code 插件支持的 MCP server 类型完整参考。

## stdio（Standard Input/Output）

### 概览

stdio 会把本地 MCP server 作为子进程启动，并通过 stdin/stdout 通信。它最适合本地工具、自定义 servers 和 NPM packages。

### 配置

基础配置：

```json
{
  "my-server": {
    "command": "npx",
    "args": ["-y", "my-mcp-server"]
  }
}
```

带环境变量的配置：

```json
{
  "my-server": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/custom-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "API_KEY": "${MY_API_KEY}",
      "LOG_LEVEL": "debug",
      "DATABASE_URL": "${DB_URL}"
    }
  }
}
```

### 进程生命周期

1. **Startup**：Claude Code 用 `command` 和 `args` 启动进程
2. **Communication**：通过 stdin/stdout 传输 JSON-RPC 消息
3. **Lifecycle**：进程通常贯穿整个 Claude Code session
4. **Shutdown**：Claude Code 退出时终止进程

### 使用场景

- NPM packages
- 自定义脚本
- Python servers
- 本地文件系统或本地数据库工具

### 最佳实践

1. 使用绝对路径或 `${CLAUDE_PLUGIN_ROOT}`
2. Python servers 设置 `PYTHONUNBUFFERED`
3. 通过 args 或 env 传配置，不要从 stdin 读普通配置
4. 优雅处理 server crash
5. 日志写 stderr，不要写 stdout（stdout 要留给 MCP protocol）

### 排错

**Server 无法启动：**
- 检查 command 是否存在且可执行
- 验证路径是否正确
- 检查权限
- 查看 `claude --debug` 日志

**通信失败：**
- 确认 server 正确使用 stdin/stdout
- 检查是否有多余 `print` / `console.log`
- 验证 JSON-RPC 格式

## SSE（Server-Sent Events）

### 概览

SSE 通过 HTTP 连接 hosted MCP servers，并用 server-sent events 做流式通信。它最适合云服务和 OAuth 认证。

### 配置

```json
{
  "hosted-service": {
    "type": "sse",
    "url": "https://mcp.example.com/sse"
  }
}
```

带 headers：

```json
{
  "service": {
    "type": "sse",
    "url": "https://mcp.example.com/sse",
    "headers": {
      "X-API-Version": "v1",
      "X-Client-ID": "${CLIENT_ID}"
    }
  }
}
```

### 连接生命周期

1. **Initialization**：建立到 URL 的 HTTP 连接
2. **Handshake**：协商 MCP protocol
3. **Streaming**：server 通过 SSE 发送事件
4. **Requests**：client 通过 HTTP POST 发送 tool calls
5. **Reconnection**：断开后自动重连

### 认证

OAuth 可由 Claude Code 自动处理：

```json
{
  "asana": {
    "type": "sse",
    "url": "https://mcp.asana.com/sse"
  }
}
```

也可以使用自定义 headers：

```json
{
  "service": {
    "type": "sse",
    "url": "https://mcp.example.com/sse",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    }
  }
}
```

### 最佳实践

1. 永远使用 HTTPS，不要使用 HTTP
2. 可用时让 OAuth 处理认证
3. token 放在环境变量
4. 优雅处理连接失败
5. 在文档中说明所需 OAuth scopes

## HTTP（REST API）

### 概览

HTTP 类型用于连接 RESTful MCP servers。它适合 token-based auth 和 stateless 交互。

### 配置

```json
{
  "api": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}",
      "Content-Type": "application/json"
    }
  }
}
```

### 请求流程

1. **Tool Discovery**：GET 发现可用 tools
2. **Tool Invocation**：POST 发送 tool name 和 parameters
3. **Response**：返回 JSON 结果或错误
4. **Stateless**：每次请求相互独立

### 使用场景

- REST API backends
- 内部服务
- Microservices
- Serverless functions

### 最佳实践

1. 所有连接都使用 HTTPS
2. token 存在环境变量
3. 对临时失败实现 retry
4. 处理 rate limiting
5. 设置合适 timeout

## WebSocket（Real-time）

### 概览

WebSocket 用于与 MCP servers 建立实时双向通信。适合 streaming、低延迟和实时应用。

### 配置

```json
{
  "realtime": {
    "type": "ws",
    "url": "wss://mcp.example.com/ws",
    "headers": {
      "Authorization": "Bearer ${TOKEN}"
    }
  }
}
```

### 连接生命周期

1. **Handshake**：WebSocket upgrade request
2. **Connection**：持久双向通道
3. **Messages**：通过 WebSocket 传 JSON-RPC
4. **Heartbeat**：keep-alive 消息
5. **Reconnection**：断开后自动重连

### 使用场景

- 实时数据流
- live updates 和 notifications
- 协作编辑
- 低延迟 tool calls
- server push notifications

### 最佳实践

1. 使用 WSS，不要使用 WS
2. 实现 heartbeat / ping-pong
3. 处理重连逻辑
4. 断线期间 buffer messages
5. 设置 connection timeouts

## 对比矩阵

| Feature | stdio | SSE | HTTP | WebSocket |
|---------|-------|-----|------|-----------|
| **Transport** | Process | HTTP/SSE | HTTP | WebSocket |
| **Direction** | Bidirectional | Server->Client | Request/Response | Bidirectional |
| **State** | Stateful | Stateful | Stateless | Stateful |
| **Auth** | Env vars | OAuth/Headers | Headers | Headers |
| **Use Case** | Local tools | Cloud services | REST APIs | Real-time |
| **Latency** | Lowest | Medium | Medium | Low |
| **Setup** | Easy | Medium | Easy | Medium |
| **Reconnect** | Process respawn | Automatic | N/A | Automatic |

## 如何选择类型

**使用 stdio：**
- 运行本地工具或自定义 servers
- 需要最低延迟
- 访问文件系统或本地数据库
- server 随插件一起分发

**使用 SSE：**
- 连接 hosted services
- 需要 OAuth
- 使用官方 MCP servers（如 Asana、GitHub）
- 希望自动重连

**使用 HTTP：**
- 集成 REST APIs
- 需要 stateless 交互
- 使用 token-based auth
- 简单 request/response 模式

**使用 WebSocket：**
- 需要实时更新
- 构建协作功能
- 对低延迟很敏感
- 需要双向 streaming

## 类型迁移

### 从 stdio 迁移到 SSE

**Before（stdio）：**

```json
{
  "local-server": {
    "command": "node",
    "args": ["server.js"]
  }
}
```

**After（SSE）：**

```json
{
  "hosted-server": {
    "type": "sse",
    "url": "https://mcp.example.com/sse"
  }
}
```

### 从 HTTP 迁移到 WebSocket

WebSocket 的收益是实时更新、更低延迟和双向通信。

## 高级配置

### 多个 Servers

可以组合不同类型：

```json
{
  "local-db": {
    "command": "npx",
    "args": ["-y", "mcp-server-sqlite", "./data.db"]
  },
  "cloud-api": {
    "type": "sse",
    "url": "https://mcp.example.com/sse"
  },
  "internal-service": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    }
  }
}
```

### 条件配置

可用环境变量在 dev/prod 间切换：

```json
{
  "api": {
    "type": "http",
    "url": "${API_URL}",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    }
  }
}
```

## 安全注意事项

### Stdio 安全

- 校验 command paths
- 不执行用户提供的命令
- 限制环境变量访问
- 限制文件系统访问

### 网络安全

- 始终使用 HTTPS/WSS
- 校验 SSL certificates
- 不要跳过证书校验
- 使用安全 token 存储

### Token 管理

- 不要硬编码 tokens
- 使用环境变量
- 定期轮换 token
- 实现 token refresh
- 记录所需 scopes

## 结论

根据使用场景选择 MCP server 类型：
- **stdio**：本地、自定义或 NPM-packaged servers
- **SSE**：带 OAuth 的 hosted services
- **HTTP**：使用 token auth 的 REST APIs
- **WebSocket**：实时双向通信

为了稳定的 MCP 集成，需要充分测试并优雅处理错误。
