---
name: agent-identifier
description: 在创建或配置 Claude Code agent 及其 frontmatter 时使用。
version: 0.1.0
---

# Agent Development for Claude Code Plugins

## 概览

Agent 是能够独立处理复杂多步骤任务的自治子进程。理解 agent 的结构、触发条件和 system prompt 设计后，才能创建真正有用的自治能力。

**关键概念：**
- Agent 用于 autonomous work，command 用于用户主动触发的动作
- 文件格式是带 YAML frontmatter 的 Markdown
- 通过 `description` 字段及其示例决定触发
- `system prompt` 定义 agent 行为
- 支持 `model` 与 `color` 自定义

## When to Use

当用户要求以下事项时使用本 skill：
- 创建 agent
- 添加 agent
- 编写 subagent
- 定义 agent frontmatter
- 判断 description 示例该怎么写
- 配置 agent 的 tool、color 或 model 行为
- 设计 autonomous agent 的结构、触发条件或 system prompt

## When Not to Use

以下情况不要使用本 skill：
- Slash command 设计
- Hook 配置
- MCP server 配置
- 属于 `plugin-structure` 范畴的通用 plugin 布局问题

## Agent File Structure

### Complete Format

```markdown
---
name: agent-identifier
description: Use this agent when [triggering conditions]. Examples:

<example>
Context: [Situation description]
user: "[User request]"
assistant: "[How assistant should respond and use this agent]"
<commentary>
[Why this agent should be triggered]
</commentary>
</example>

<example>
[Additional example...]
</example>

model: inherit
color: blue
tools: ["Read", "Write", "Grep"]
---

You are [agent role description]...

**Your Core Responsibilities:**
1. [Responsibility 1]
2. [Responsibility 2]

**Analysis Process:**
[Step-by-step workflow]

**Output Format:**
[What to return]
```

## Frontmatter Fields

### name (required)

这是用于命名空间和调用的 agent 标识符。

**格式：** 仅允许小写字母、数字、连字符  
**长度：** 3-50 个字符  
**规则：** 必须以字母或数字开头并结尾

**好例子：**
- `code-reviewer`
- `test-generator`
- `api-docs-writer`
- `security-analyzer`

**坏例子：**
- `helper`（过于泛）
- `-agent-`（开头和结尾是连字符）
- `my_agent`（不允许下划线）
- `ag`（过短，小于 3 个字符）

### description (required)

定义 Claude 应该在什么情况下触发这个 agent。**这是最关键的字段。**

**必须包含：**
1. 触发条件（如 “Use this agent when...”）
2. 多个 `<example>` 示例块
3. 每个示例都包含 Context、user request 和 assistant response
4. 用 `<commentary>` 解释为什么会触发

**格式：**
```text
Use this agent when [conditions]. Examples:

<example>
Context: [Scenario description]
user: "[What user says]"
assistant: "[How Claude should respond]"
<commentary>
[Why this agent is appropriate]
</commentary>
</example>

[More examples...]
```

**最佳实践：**
- 放入 2-4 个具体示例
- 同时展示主动触发和被动触发
- 覆盖同一意图的不同说法
- 在 commentary 中写清触发理由
- 明确说明什么情况下**不该**使用该 agent

### model (required)

定义 agent 使用哪个 model。

**可选值：**
- `inherit` - 继承父级 model（推荐）
- `sonnet` - Claude Sonnet（平衡）
- `opus` - Claude Opus（能力最强，成本最高）
- `haiku` - Claude Haiku（最快、最便宜）

**建议：** 除非 agent 明确需要特定 model 能力，否则优先使用 `inherit`。

### color (required)

UI 中用于区分 agent 的视觉颜色。

**可选值：** `blue`、`cyan`、`green`、`yellow`、`magenta`、`red`

**建议：**
- 同一 plugin 内不同 agent 尽量使用不同颜色
- 相似类型 agent 尽量保持颜色语义一致
- Blue / cyan：analysis、review
- Green：成功导向任务
- Yellow：caution、validation
- Red：critical、security
- Magenta：creative、generation

### tools (optional)

限制 agent 可使用的 tool。

**格式：** tool 名称数组

```yaml
tools: ["Read", "Write", "Grep", "Bash"]
```

**默认行为：** 如果省略，则 agent 可访问全部 tool

**最佳实践：** 只授予最少所需权限（least privilege）

**常见 tool 组合：**
- 只读分析：`["Read", "Grep", "Glob"]`
- 代码生成：`["Read", "Write", "Grep"]`
- 测试执行：`["Read", "Bash", "Grep"]`
- 全权限：省略字段或使用 `["*"]`

## System Prompt Design

Markdown 正文会直接成为 agent 的 system prompt。正文应以第二人称写法直接面向 agent。

### Structure

**标准模板：**
```markdown
You are [role] specializing in [domain].

**Your Core Responsibilities:**
1. [Primary responsibility]
2. [Secondary responsibility]
3. [Additional responsibilities...]

**Analysis Process:**
1. [Step one]
2. [Step two]
3. [Step three]
[...]

**Quality Standards:**
- [Standard 1]
- [Standard 2]

**Output Format:**
Provide results in this format:
- [What to include]
- [How to structure]

**Edge Cases:**
Handle these situations:
- [Edge case 1]: [How to handle]
- [Edge case 2]: [How to handle]
```

### 最佳实践

✅ **建议：**
- 用第二人称写法（`You are...`, `You will...`）
- 明确责任边界
- 给出清晰的分步流程
- 定义输出格式
- 补充质量标准
- 处理 edge case
- 控制在 10,000 字符以内

❌ **不要：**
- 用第一人称（`I am...`, `I will...`）
- 写得含糊泛泛
- 省略流程步骤
- 不定义输出格式
- 跳过质量指导
- 忽略错误场景

## Creating Agents

### Method 1: AI-Assisted Generation

可以使用如下 prompt 模式（摘自 Claude Code）：

```text
Create an agent configuration based on this request: "[YOUR DESCRIPTION]"

Requirements:
1. Extract core intent and responsibilities
2. Design expert persona for the domain
3. Create comprehensive system prompt with:
   - Clear behavioral boundaries
   - Specific methodologies
   - Edge case handling
   - Output format
4. Create identifier (lowercase, hyphens, 3-50 chars)
5. Write description with triggering conditions
6. Include 2-3 <example> blocks showing when to use

Return JSON with:
{
  "identifier": "agent-name",
  "whenToUse": "Use this agent when... Examples: <example>...</example>",
  "systemPrompt": "You are..."
}
```

然后把结果转换成 agent 文件格式，并补全 frontmatter。

完整模板见 `examples/agent-creation-prompt.md`。

### Method 2: Manual Creation

1. 选择 agent identifier（3-50 字符，小写，使用连字符）
2. 编写带示例的 description
3. 选择 model（通常为 `inherit`）
4. 选择用于识别的 color
5. 定义 tools（如需限制）
6. 按上面的结构写 system prompt
7. 保存为 `agents/agent-name.md`

## Validation Rules

### Identifier Validation

```text
✅ Valid: code-reviewer, test-gen, api-analyzer-v2
❌ Invalid: ag (too short), -start (starts with hyphen), my_agent (underscore)
```

**规则：**
- 3-50 个字符
- 只允许小写字母、数字和连字符
- 必须以字母或数字开头与结尾
- 不允许下划线、空格和特殊字符

### Description Validation

**长度：** 10-5,000 个字符  
**必须包含：** 触发条件和示例  
**最佳范围：** 200-1,000 个字符，并包含 2-4 个示例

### System Prompt Validation

**长度：** 20-10,000 个字符  
**最佳范围：** 500-3,000 个字符  
**结构要求：** 责任清晰、流程完整、输出格式明确

## Agent Organization

### Plugin Agents Directory

```text
plugin-name/
└── agents/
    ├── analyzer.md
    ├── reviewer.md
    └── generator.md
```

`agents/` 目录下的所有 `.md` 文件都会被自动发现。

### Namespacing

Agent 会自动带命名空间：
- 单个 plugin：`agent-name`
- 带子目录时：`plugin:subdir:agent-name`

## Testing Agents

### Test Triggering

需要设计测试场景来确认 agent 会在正确时机触发：

1. 编写包含明确触发示例的 agent
2. 用接近示例的话术来测试
3. 检查 Claude 是否加载该 agent
4. 验证 agent 是否提供了预期功能

### Test System Prompt

确认 system prompt 足够完整：

1. 给 agent 一个典型任务
2. 检查它是否遵循流程步骤
3. 验证输出格式是否正确
4. 测试 prompt 中提到的 edge case
5. 确认达到质量标准

## Quick Reference

### Minimal Agent

```markdown
---
name: simple-agent
description: Use this agent when... Examples: <example>...</example>
model: inherit
color: blue
---

You are an agent that [does X].

Process:
1. [Step 1]
2. [Step 2]

Output: [What to provide]
```

### Frontmatter Fields Summary

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| name | Yes | lowercase-hyphens | code-reviewer |
| description | Yes | 文本 + 示例 | Use when... <example>... |
| model | Yes | inherit / sonnet / opus / haiku | inherit |
| color | Yes | 颜色名 | blue |
| tools | No | tool 名数组 | ["Read", "Grep"] |

### 最佳实践

**DO：**
- ✅ 在 description 中放 2-4 个具体示例
- ✅ 触发条件写具体
- ✅ 无特殊需求时优先用 `inherit`
- ✅ 给出恰当的最小 tool 集
- ✅ system prompt 写得清楚有结构
- ✅ 认真测试触发行为

**DON'T：**
- ❌ description 没示例、过于泛化
- ❌ 不写触发条件
- ❌ 所有 agent 都用同一种颜色
- ❌ 赋予不必要的 tool 权限
- ❌ system prompt 含糊不清
- ❌ 跳过测试

## Additional Resources

### Reference Files

需要更详细指导时，查看：

- **`references/system-prompt-design.md`** - 完整 system prompt 设计模式
- **`references/triggering-examples.md`** - 触发示例格式与最佳实践
- **`references/agent-creation-system-prompt.md`** - Claude Code 中使用的原始创建 prompt

### Example Files

`examples/` 中的可用示例：

- **`agent-creation-prompt.md`** - AI assisted agent 生成模板
- **`complete-agent-examples.md`** - 不同 use case 的完整 agent 示例

### Utility Scripts

`scripts/` 中的辅助工具：

- **`validate-agent.sh`** - 验证 agent 文件结构
- **`test-agent-trigger.sh`** - 测试 agent 是否正确触发

## Implementation Workflow

为 plugin 创建 agent 时，按以下顺序执行：

1. 定义 agent 的职责和触发条件
2. 选择创建方式（AI assisted 或 manual）
3. 创建 `agents/agent-name.md`
4. 在 frontmatter 中填写所有必需字段
5. 按最佳实践编写 system prompt
6. 在 description 中加入 2-4 个触发示例
7. 用 `scripts/validate-agent.sh` 做验证
8. 用真实场景测试触发行为
9. 在 plugin README 中记录该 agent

重点放在清晰的触发条件和完整的 system prompt 上，确保 agent 真正能独立运行。
