# 在 Commands 和 Agents 中使用 MCP Tools

> **范围说明**：下面的 tool prefix 和插件示例描述的是 Claude Code plugin 行为。Codex CLI 使用 repo/home 配置，而不是 plugin manifest。

这是一份在 Claude Code plugin commands 和 agents 中高效使用 MCP tools 的指南。

## 概览

MCP server 配置完成后，它提供的 tools 会以 `mcp__plugin_<plugin-name>_<server-name>__<tool-name>` 的前缀形式可用。可以像使用 Claude Code 内置 tools 一样在 commands 和 agents 中使用它们。

## Tool 命名约定

### 格式

```
mcp__plugin_<plugin-name>_<server-name>__<tool-name>
```

### 示例

Asana plugin + asana server：
- `mcp__plugin_asana_asana__asana_create_task`
- `mcp__plugin_asana_asana__asana_search_tasks`
- `mcp__plugin_asana_asana__asana_get_project`

Custom plugin + database server：
- `mcp__plugin_myplug_database__query`
- `mcp__plugin_myplug_database__execute`
- `mcp__plugin_myplug_database__list_tables`

### 发现 Tool 名称

使用 `/mcp`：

```bash
/mcp
```

它会展示：
- 所有可用 MCP servers
- 每个 server 提供的 tools
- tool schemas 和 descriptions
- 可用于配置的完整 tool names

## 在 Commands 中使用 Tools

### 预先允许 Tools

在 command frontmatter 中声明 MCP tools：

```markdown
---
description: Create a new Asana task
allowed-tools: [
  "mcp__plugin_asana_asana__asana_create_task"
]
---

# Create Task Command

创建 task：
1. 从用户收集 task 详情
2. 使用 mcp__plugin_asana_asana__asana_create_task 创建
3. 向用户确认创建结果
```

### 多个 Tools

```markdown
---
allowed-tools: [
  "mcp__plugin_asana_asana__asana_create_task",
  "mcp__plugin_asana_asana__asana_search_tasks",
  "mcp__plugin_asana_asana__asana_get_project"
]
---
```

### Wildcard（谨慎使用）

```markdown
---
allowed-tools: ["mcp__plugin_asana_asana__*"]
---
```

只有当 command 确实需要访问某个 server 的全部 tools 时才使用 wildcard。

## 在 Agents 中使用 Tools

Agents 可以自主使用 MCP tools，不需要像 commands 一样预先列 allowed-tools：

```markdown
---
name: asana-status-updater
description: 当用户要求 "update Asana status"、"generate project report" 或 "sync Asana tasks" 时使用
model: inherit
color: blue
---

## Role

用于生成 Asana project status reports 的 autonomous agent。

## Process

1. **Query tasks**：使用 mcp__plugin_asana_asana__asana_search_tasks 获取 tasks
2. **Analyze progress**：计算完成率并识别 blockers
3. **Generate report**：生成格式化 status update
4. **Update Asana**：使用 mcp__plugin_asana_asana__asana_create_comment 发布报告
```

## Tool Call 模式

### 模式 1：简单调用

```markdown
Steps:
1. 校验用户提供了必需字段
2. 用校验后的数据调用 mcp__plugin_api_server__create_item
3. 检查错误
4. 显示确认信息
```

### 模式 2：顺序调用

```markdown
Steps:
1. 搜索已有 items：mcp__plugin_api_server__search
2. 如果不存在，创建：mcp__plugin_api_server__create
3. 增加 metadata：mcp__plugin_api_server__update_metadata
4. 返回最终 item ID
```

### 模式 3：批量操作

```markdown
Steps:
1. 获取待处理 items
2. 对每个 item 调用 mcp__plugin_api_server__update_item
3. 记录 success/failure
4. 汇总报告结果
```

### 模式 4：错误处理

```markdown
Steps:
1. 尝试调用 mcp__plugin_api_server__get_data
2. 如果出错（rate limit、network 等），最多重试 3 次
3. 仍失败时告知用户，并建议检查配置
4. 成功时继续处理数据
```

## Tool 参数

### 理解 Tool Schema

每个 MCP tool 都有 schema 定义参数。可通过 `/mcp` 查看。

```json
{
  "name": "asana_create_task",
  "description": "Create a new Asana task",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Task title"
      },
      "notes": {
        "type": "string",
        "description": "Task description"
      }
    },
    "required": ["name", "workspace"]
  }
}
```

Claude 会基于 schema 自动组织 tool call。

### 参数校验

在 commands 中，调用前应先校验：

```markdown
Steps:
1. 检查必需参数：
   - Title 非空
   - Workspace ID 已提供
   - Due date 是有效格式（YYYY-MM-DD）
2. 校验失败时要求用户补充
3. 校验通过后调用 MCP tool
4. 优雅处理 tool errors
```

## 响应处理

### 成功响应

```markdown
Steps:
1. 调用 MCP tool
2. 成功后提取关键数据
3. 格式化展示给用户
4. 提供确认消息，并附相关 links 或 IDs
```

### 错误响应

```markdown
Steps:
1. 调用 MCP tool
2. 出错后识别错误类型（auth、rate limit、validation 等）
3. 给出有帮助的错误说明
4. 提供修复建议
5. 不向用户暴露内部错误细节
```

### 部分成功

```markdown
Steps:
1. 执行多个 MCP calls
2. 分别记录成功与失败
3. 输出 summary，例如 "Successfully processed 8 of 10 items"
4. 对失败项建议 retry 或人工处理
```

## 性能优化

### 批量请求

优先使用带 filters 的单次查询，而不是逐个 ID 查询。

### 缓存结果

昂贵 MCP operation 的结果应保存在变量中复用；只有数据变化时再重新获取。

### 并行调用

当多个 tools 互不依赖时，可以并行调用，再合并结果。

## 集成最佳实践

### 用户体验

给用户持续反馈：

```markdown
Steps:
1. 告知用户："Searching Asana tasks..."
2. 调用 mcp__plugin_asana_asana__asana_search_tasks
3. 展示进度："Found 15 tasks, analyzing..."
4. 呈现结果
```

长操作应提前说明耗时，并分阶段汇报进度。

### 错误消息

好的错误消息应告诉用户如何修复：

```
"Could not create task. Please check:
1. You're logged into Asana
2. You have access to workspace 'Engineering'
3. The project 'Q1 Goals' exists"
```

不要只输出：

```
"Error: MCP tool returned 403"
```

### 文档

在 command 中记录用到的 MCP tools：

```markdown
## MCP Tools Used

This command uses:
- **asana_search_tasks**: Search for tasks matching criteria
- **asana_create_task**: Create new task with details
- **asana_update_task**: Update existing task properties
```

## 测试 Tool 使用

### 本地测试

1. 在 `.mcp.json` 中配置 MCP server
2. 在 `.claude-plugin/` 中本地安装插件
3. 使用 `/mcp` 确认 tools 可用
4. 测试使用 tools 的 command
5. 查看 `claude --debug` 输出

### 测试场景

- 成功调用
- 缺少认证
- 参数无效
- 资源不存在
- 空结果
- 最大结果数
- 特殊字符
- 并发访问

## 常见模式

### CRUD Operations

```markdown
---
allowed-tools: [
  "mcp__plugin_api_server__create_item",
  "mcp__plugin_api_server__read_item",
  "mcp__plugin_api_server__update_item",
  "mcp__plugin_api_server__delete_item"
]
---

# Item Management

## Create
Use create_item with required fields...

## Read
Use read_item with item ID...

## Update
Use update_item with item ID and changes...

## Delete
Use delete_item with item ID (ask for confirmation first)...
```

### Search and Process

```markdown
Steps:
1. **Search**：使用 filters 调用 search
2. **Filter**：必要时做本地过滤
3. **Transform**：处理每个结果
4. **Present**：格式化展示给用户
```

### Multi-Step Workflow

```markdown
Steps:
1. **Setup**：收集全部必要信息
2. **Validate**：检查数据完整性
3. **Execute**：串联 MCP tool calls
4. **Verify**：确认所有步骤成功
5. **Report**：向用户汇总
```

## 排错

### Tools 不可用

检查：
- MCP server 配置是否正确
- server 是否已连接（查看 `/mcp`）
- tool names 是否完全匹配（大小写敏感）
- 配置变更后是否重启 Claude Code

### Tool 调用失败

检查：
- 认证是否有效
- 参数是否匹配 schema
- 必需参数是否已提供
- `claude --debug` 日志

### 性能问题

检查：
- 是否能用批量查询代替逐个查询
- 是否可缓存结果
- 是否有不必要 tool call
- 是否可以并行调用

## 结论

高质量 MCP tool 使用需要：
1. 通过 `/mcp` 理解 tool schemas
2. 在 commands 中合理预先允许 tools
3. 优雅处理错误
4. 用 batching 和 caching 优化性能
5. 用进度反馈和清晰错误提升 UX
6. 部署前充分测试

遵循这些模式，可以让 plugin commands 和 agents 更稳健地集成 MCP tools。
