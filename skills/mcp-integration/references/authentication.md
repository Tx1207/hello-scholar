# MCP 认证模式

这是一份 Claude Code 插件中 MCP server 认证方式的完整指南。

## 概览

MCP servers 会根据 server 类型和服务要求支持不同认证方式。应选择最符合使用场景和安全要求的方法。

## OAuth（自动处理）

### 工作方式

Claude Code 会自动为 SSE 和 HTTP servers 处理完整 OAuth 2.0 流程：

1. 用户尝试使用 MCP tool
2. Claude Code 检测到需要认证
3. 打开浏览器请求 OAuth 授权
4. 用户在浏览器中授权
5. Claude Code 安全保存 tokens
6. 后续自动刷新 token

### 配置

```json
{
  "service": {
    "type": "sse",
    "url": "https://mcp.example.com/sse"
  }
}
```

不需要额外认证配置，Claude Code 会处理所有认证细节。

### 支持服务

常见启用 OAuth 的 MCP servers：
- Asana：`https://mcp.asana.com/sse`
- GitHub（可用时）
- Google services（可用时）
- 自定义 OAuth servers

### OAuth Scopes

OAuth scopes 由 MCP server 决定。用户会在授权流程中看到所需 scopes。

建议在 README 中记录所需权限：

```markdown
## Authentication

This plugin requires the following Asana permissions:
- Read tasks and projects
- Create and update tasks
- Access workspace data
```

### Token 存储

Tokens 由 Claude Code 安全保存：
- 插件无法直接访问
- 静态加密
- 自动刷新
- sign-out 时清理

### OAuth 排错

**重复认证循环：**
- 清理缓存 tokens（退出登录后重新登录）
- 检查 OAuth redirect URLs
- 确认 server OAuth 配置正确

**Scope 问题：**
- 新增 scopes 后，用户可能需要重新授权
- 查看 server 文档确认所需 scopes

**Token 过期：**
- Claude Code 会自动刷新
- 如果刷新失败，会提示重新认证

## Token-Based Authentication

### Bearer Tokens

HTTP 和 WebSocket servers 最常见的方式。

```json
{
  "api": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    }
  }
}
```

环境变量：

```bash
export API_TOKEN="your-secret-token-here"
```

### API Keys

API key 常放在自定义 header 中：

```json
{
  "api": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "X-API-Key": "${API_KEY}",
      "X-API-Secret": "${API_SECRET}"
    }
  }
}
```

### Custom Headers

部分服务会使用自定义认证 header：

```json
{
  "service": {
    "type": "sse",
    "url": "https://mcp.example.com/sse",
    "headers": {
      "X-Auth-Token": "${AUTH_TOKEN}",
      "X-User-ID": "${USER_ID}",
      "X-Tenant-ID": "${TENANT_ID}"
    }
  }
}
```

### 记录 Token 要求

README 中必须写清楚：

```markdown
## Setup

### Required Environment Variables

Set these environment variables before using the plugin:

\`\`\`bash
export API_TOKEN="your-token-here"
export API_SECRET="your-secret-here"
\`\`\`

### Obtaining Tokens

1. Visit https://api.example.com/tokens
2. Create a new API token
3. Copy the token and secret
4. Set environment variables as shown above
```

## Environment Variable Authentication（stdio）

### 把凭据传给 Server

stdio servers 通常通过环境变量传递凭据：

```json
{
  "database": {
    "command": "python",
    "args": ["-m", "mcp_server_db"],
    "env": {
      "DATABASE_URL": "${DATABASE_URL}",
      "DB_USER": "${DB_USER}",
      "DB_PASSWORD": "${DB_PASSWORD}"
    }
  }
}
```

用户在 shell 中设置：

```bash
export DATABASE_URL="postgresql://localhost/mydb"
export DB_USER="myuser"
export DB_PASSWORD="mypassword"
```

## Dynamic Headers

### Headers Helper Script

对于会变化或会过期的 token，可使用 helper script：

```json
{
  "api": {
    "type": "sse",
    "url": "https://api.example.com",
    "headersHelper": "${CLAUDE_PLUGIN_ROOT}/scripts/get-headers.sh"
  }
}
```

脚本示例：

```bash
#!/bin/bash
# Generate dynamic authentication headers

TOKEN=$(get-fresh-token-from-somewhere)

cat <<EOF
{
  "Authorization": "Bearer $TOKEN",
  "X-Timestamp": "$(date -Iseconds)"
}
EOF
```

适用场景：
- 短期 token 需要刷新
- HMAC 签名 token
- 基于时间的认证
- 动态 tenant/workspace 选择

## 安全最佳实践

### DO

✅ **使用环境变量：**

```json
{
  "headers": {
    "Authorization": "Bearer ${API_TOKEN}"
  }
}
```

✅ 在 README 中记录必要变量  
✅ 始终使用 HTTPS/WSS  
✅ 实现 token rotation  
✅ 安全保存 token（env vars，不写入文件）  
✅ 可用时优先让 OAuth 处理认证

### DON'T

❌ **不要硬编码 token：**

```json
{
  "headers": {
    "Authorization": "Bearer sk-abc123..."
  }
}
```

❌ 不要把 token 提交到 git  
❌ 不要在文档中共享真实 token  
❌ 不要用 HTTP 替代 HTTPS  
❌ 不要把 token 写进插件文件  
❌ 不要记录 token 或敏感 headers

## Multi-Tenancy 模式

### Workspace / Tenant 选择

通过环境变量：

```json
{
  "api": {
    "type": "http",
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}",
      "X-Workspace-ID": "${WORKSPACE_ID}"
    }
  }
}
```

通过 URL：

```json
{
  "api": {
    "type": "http",
    "url": "https://${TENANT_ID}.api.example.com/mcp"
  }
}
```

## 认证排错

### 常见问题

**401 Unauthorized：**
- 检查 token 是否已正确设置
- 检查 token 是否过期
- 检查 token 是否拥有所需权限
- 检查 header 格式是否正确

**403 Forbidden：**
- token 有效但权限不足
- 检查 scope / permissions
- 检查 workspace / tenant ID
- 可能需要 admin approval

**找不到 token：**

```bash
echo $API_TOKEN
export API_TOKEN="your-token"
```

**token 格式错误：**

```json
// Correct
"Authorization": "Bearer sk-abc123"

// Wrong
"Authorization": "sk-abc123"
```

### 调试认证

开启 debug mode：

```bash
claude --debug
```

关注：
- 认证 header 值（应已脱敏）
- OAuth flow 进度
- token refresh 尝试
- 认证错误

单独测试认证：

```bash
curl -H "Authorization: Bearer $API_TOKEN" \
     https://api.example.com/mcp/health
```

## 迁移模式

### 从硬编码迁移到环境变量

**Before：**

```json
{
  "headers": {
    "Authorization": "Bearer sk-hardcoded-token"
  }
}
```

**After：**

```json
{
  "headers": {
    "Authorization": "Bearer ${API_TOKEN}"
  }
}
```

迁移步骤：
1. 在插件 README 中加入环境变量说明
2. 把配置改成 `${VAR}`
3. 设置变量后测试
4. 删除硬编码值
5. 提交改动

### 从 Basic Auth 迁移到 OAuth

OAuth 的收益：
- 安全性更好
- 不需要自行管理凭据
- 自动刷新 token
- 支持 scoped permissions

## 高级认证

### Mutual TLS（mTLS）

部分企业服务需要 client certificate。MCP 配置本身不直接支持，可通过 stdio wrapper server 处理 mTLS：

```json
{
  "secure-api": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/mtls-wrapper",
    "args": ["--cert", "${CLIENT_CERT}", "--key", "${CLIENT_KEY}"],
    "env": {
      "API_URL": "https://secure.example.com"
    }
  }
}
```

### JWT Tokens

可用 headers helper 动态生成 JWT：

```json
{
  "headersHelper": "${CLAUDE_PLUGIN_ROOT}/scripts/generate-jwt.sh"
}
```

### HMAC Signatures

需要请求签名的 API 可由脚本动态生成 `X-Timestamp`、`X-Signature` 和 `X-API-Key`。

## 最佳实践总结

### 对插件开发者

1. 服务支持时优先使用 OAuth
2. 用环境变量存 token
3. 在 README 中记录所有必需变量
4. 提供带示例的 setup instructions
5. 永远不要提交 credentials
6. 只使用 HTTPS/WSS
7. 充分测试认证流程

### 对插件用户

1. 使用插件前设置环境变量
2. 保持 token 私密
3. 定期轮换 token
4. dev/prod 使用不同 token
5. 不要把 `.env` 提交到 git
6. 授权前检查 OAuth scopes

## 结论

按 MCP server 需求选择认证方式：
- **OAuth**：适合 cloud services，用户最省心
- **Bearer tokens**：适合 API services
- **Environment variables**：适合 stdio servers
- **Dynamic headers**：适合复杂认证流程

始终优先考虑安全，并为用户提供清晰的 setup 文档。
