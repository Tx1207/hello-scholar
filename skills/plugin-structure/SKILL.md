---
name: plugin-structure
description: 当用户要求“create a plugin”、“scaffold a plugin”、“understand plugin structure”、“organize plugin components”、“set up plugin.json”、“use ${CLAUDE_PLUGIN_ROOT}”、“add commands/agents/skills/hooks”、“configure auto-discovery”，或需要了解 plugin 目录布局、manifest 配置、组件组织、文件命名规范以及 Claude Code plugin architecture 最佳实践时使用。
version: 0.1.0
---

# Plugin Structure for Claude Code

> **范围说明**：本 skill 是 **Claude Code plugin 参考文档**，不是 Codex 原生工作流。Codex CLI 本身并不使用原生 `.claude-plugin` plugin system。

## 概览

Claude Code plugin 遵循标准化目录结构，并支持组件自动发现。理解这一结构后，才能构建出组织清晰、可维护、能与 Claude Code 顺畅集成的 plugin。

**关键概念：**
- 采用约定式目录布局实现自动发现
- 用 `.claude-plugin/plugin.json` 中的 manifest 驱动配置
- 组件化组织：commands、agents、skills、hooks
- 使用 `${CLAUDE_PLUGIN_ROOT}` 做可移植路径引用
- 支持显式路径配置与默认 auto-discovery 并存

## Directory Structure

每个 Claude Code plugin 都遵循如下组织方式：

```text
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # 必需：plugin manifest
├── commands/               # Slash command（.md 文件）
├── agents/                 # Subagent 定义（.md 文件）
├── skills/                 # Agent skill（每个 skill 一个子目录）
│   └── skill-name/
│       └── SKILL.md        # 每个 skill 必需
├── hooks/
│   └── hooks.json          # 事件处理配置
├── .mcp.json               # MCP server 定义
└── scripts/                # 辅助脚本和工具
```

**关键规则：**

1. **Manifest 位置**：`plugin.json` 必须放在 `.claude-plugin/` 下
2. **组件位置**：`commands`、`agents`、`skills`、`hooks` 等组件目录必须位于 plugin 根目录，**不能**嵌套到 `.claude-plugin/` 里面
3. **按需创建**：只创建 plugin 实际会用到的组件目录
4. **命名规范**：所有目录和文件都使用 kebab-case

## Plugin Manifest (plugin.json)

manifest 定义 plugin 元数据和配置，位于 `.claude-plugin/plugin.json`。

### Required Fields

```json
{
  "name": "plugin-name"
}
```

**Name 要求：**
- 使用 kebab-case（小写 + 连字符）
- 在已安装 plugin 中必须唯一
- 不允许空格或特殊字符
- 例如：`code-review-assistant`、`test-runner`、`api-docs`

### 推荐元数据

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Brief explanation of plugin purpose",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://example.com"
  },
  "homepage": "https://docs.example.com",
  "repository": "https://github.com/user/plugin-name",
  "license": "MIT",
  "keywords": ["testing", "automation", "ci-cd"]
}
```

**版本格式：** 遵循 semantic versioning（MAJOR.MINOR.PATCH）  
**Keywords：** 用于 plugin 发现和分类

### Component Path Configuration

可以为组件指定自定义路径（这是对默认目录的补充）：

```json
{
  "name": "plugin-name",
  "commands": "./custom-commands",
  "agents": ["./agents", "./specialized-agents"],
  "hooks": "./config/hooks.json",
  "mcpServers": "./.mcp.json"
}
```

**重要：** 自定义路径只是补充，不会替换默认目录。默认目录和自定义路径中的组件都会被加载。

**路径规则：**
- 必须相对 plugin root
- 必须以 `./` 开头
- 不允许绝对路径
- 支持数组形式配置多个位置

## Component Organization

### Commands

**位置：** `commands/`  
**格式：** 带 YAML frontmatter 的 Markdown  
**自动发现：** `commands/` 下所有 `.md` 文件都会自动加载

**示例结构：**
```text
commands/
├── review.md
├── test.md
└── deploy.md
```

**文件格式：**
```markdown
---
name: command-name
description: Command description
---

Command implementation instructions...
```

**用途：** 会作为 Claude Code 的原生 slash command 接入

### Agents

**位置：** `agents/`  
**格式：** 带 YAML frontmatter 的 Markdown  
**自动发现：** `agents/` 下所有 `.md` 文件都会自动加载

**示例结构：**
```text
agents/
├── code-reviewer.md
├── test-generator.md
└── refactorer.md
```

**文件格式：**
```markdown
---
description: Agent role and expertise
capabilities:
  - Specific task 1
  - Specific task 2
---

Detailed agent instructions and knowledge...
```

**用途：** 用户可以手动调用，也可以由 Claude Code 根据上下文自动选择

### Skills

**位置：** `skills/`，每个 skill 独占一个子目录  
**格式：** 子目录中必须包含 `SKILL.md`  
**自动发现：** `skills/` 下所有包含 `SKILL.md` 的子目录都会自动加载

**示例结构：**
```text
skills/
├── api-testing/
│   ├── SKILL.md
│   ├── scripts/
│   │   └── test-runner.py
│   └── references/
│       └── api-spec.md
└── database-migrations/
    ├── SKILL.md
    └── examples/
        └── migration-template.sql
```

**`SKILL.md` 格式：**
```markdown
---
name: Skill Name
description: When to use this skill
version: 1.0.0
---

Skill instructions and guidance...
```

**支持文件：** skill 子目录中可以放 `scripts`、`references`、`examples`、`assets`

**用途：** Claude Code 会根据任务上下文自动激活 skill

### Hooks

**位置：** `hooks/hooks.json` 或直接写在 `plugin.json` 中  
**格式：** 定义事件处理器的 JSON 配置  
**注册方式：** plugin 启用时自动注册

**示例结构：**
```text
hooks/
├── hooks.json
└── scripts/
    ├── validate.sh
    └── check-style.sh
```

**配置格式：**
```json
{
  "PreToolUse": [{
    "matcher": "Write|Edit",
    "hooks": [{
      "type": "command",
      "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/validate.sh",
      "timeout": 30
    }]
  }]
}
```

**可用事件：** `PreToolUse`、`PostToolUse`、`Stop`、`SubagentStop`、`SessionStart`、`SessionEnd`、`UserPromptSubmit`、`PreCompact`、`Notification`

**用途：** 在 Claude Code 事件发生时自动执行

### MCP Servers

**位置：** plugin 根目录的 `.mcp.json`，或直接写在 `plugin.json` 中  
**格式：** MCP server 定义的 JSON 配置  
**启动方式：** plugin 启用时自动启动

**示例：**
```json
{
  "mcpServers": {
    "server-name": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/server.js"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

**用途：** 与 Claude Code 的 tool system 无缝集成

## Portable Path References

### ${CLAUDE_PLUGIN_ROOT}

plugin 内部路径引用统一使用 `${CLAUDE_PLUGIN_ROOT}`：

```json
{
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/run.sh"
}
```

**为什么重要：**
plugin 的安装位置会因以下因素不同而变化：
- 用户安装方式（marketplace、local、npm）
- 操作系统约定
- 用户个人偏好

**适用场景：**
- hook command 路径
- MCP server 启动参数
- script 执行路径
- 资源文件路径

**不要使用：**
- 硬编码绝对路径（如 `/Users/name/plugins/...`）
- 相对当前工作目录的路径（如 `./scripts/...`）
- 家目录简写（如 `~/plugins/...`）

### Path Resolution Rules

**在 manifest JSON 字段中：**
```json
"command": "${CLAUDE_PLUGIN_ROOT}/scripts/tool.sh"
```

**在组件文件中：**
```markdown
Reference scripts at: ${CLAUDE_PLUGIN_ROOT}/scripts/helper.py
```

**在被执行的脚本中：**
```bash
#!/bin/bash
source "${CLAUDE_PLUGIN_ROOT}/lib/common.sh"
```

## File Naming Conventions

### Component Files

**Commands**：使用 kebab-case 的 `.md`
- `code-review.md` → `/code-review`
- `run-tests.md` → `/run-tests`
- `api-docs.md` → `/api-docs`

**Agents**：使用能描述角色的 kebab-case `.md`
- `test-generator.md`
- `code-reviewer.md`
- `performance-analyzer.md`

**Skills**：目录名使用 kebab-case
- `api-testing/`
- `database-migrations/`
- `error-handling/`

### Supporting Files

**Scripts**：使用语义明确的 kebab-case 文件名，并带正确扩展名
- `validate-input.sh`
- `generate-report.py`
- `process-data.js`

**Documentation**：使用 kebab-case Markdown 文件
- `api-reference.md`
- `migration-guide.md`
- `best-practices.md`

**Configuration**：使用标准文件名
- `hooks.json`
- `.mcp.json`
- `plugin.json`

## Auto-Discovery Mechanism

Claude Code 会自动发现并加载以下组件：

1. **Plugin manifest**：启用 plugin 时读取 `.claude-plugin/plugin.json`
2. **Commands**：扫描 `commands/` 中的 `.md`
3. **Agents**：扫描 `agents/` 中的 `.md`
4. **Skills**：扫描 `skills/` 中包含 `SKILL.md` 的子目录
5. **Hooks**：读取 `hooks/hooks.json` 或 manifest 中的配置
6. **MCP servers**：读取 `.mcp.json` 或 manifest 中的配置

**发现时机：**
- Plugin 安装时：组件注册到 Claude Code
- Plugin 启用时：组件变为可用
- 无需重启：通常在下一次 Claude Code session 生效

**覆盖行为：** `plugin.json` 中的自定义路径只会补充，不会替换默认目录

## 最佳实践

### Organization

1. **按逻辑分组**
   - 把测试相关 command、agent、skill 组织在一起
   - `scripts/` 内也可按用途再细分子目录

2. **Manifest 保持精简**
   - 非必要不要写自定义路径
   - 标准布局尽量依赖 auto-discovery
   - 只有简单场景才用 inline 配置

3. **补充 README**
   - plugin 根目录：说明整体目的和用法
   - 组件目录：写目录级指导
   - script 目录：写依赖与使用方式

### Naming

1. **一致性**
   - 如果 command 叫 `test-runner`，相关 agent 最好叫 `test-runner-agent`
   - skill 目录名要与职责匹配

2. **清晰性**
   - 名称要直接表达用途
   - 好例子：`api-integration-testing/`、`code-quality-checker.md`
   - 避免：`utils/`、`misc.md`、`temp.sh`

3. **长度适中**
   - Commands：2-3 个词，如 `review-pr`、`run-ci`
   - Agents：能清楚表达角色，如 `code-reviewer`
   - Skills：聚焦主题，如 `error-handling`

### Portability

1. **始终使用 `${CLAUDE_PLUGIN_ROOT}`**
2. **跨系统测试**：至少在 macOS、Linux、Windows 上验证
3. **明确写出依赖**：列出所需工具和版本
4. **避免系统专属特性**：尽量使用可移植的 bash / Python 写法

### Maintenance

1. **版本一致更新**：release 时同步更新 `plugin.json` 中的版本
2. **平滑弃用**：删除旧组件前先明确标记 deprecated
3. **记录 breaking changes**
4. **充分测试**：每次变更后都验证所有组件可用

## Common Patterns

### Minimal Plugin

只有一个 command 的最小 plugin：

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── commands/
    └── hello.md
```

### Full-Featured Plugin

包含全部组件类型的完整 plugin：

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
├── agents/
├── skills/
├── hooks/
│   ├── hooks.json
│   └── scripts/
├── .mcp.json
└── scripts/
```

### Skill-Focused Plugin

仅提供 skill 的 plugin：

```text
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    ├── skill-one/
    │   └── SKILL.md
    └── skill-two/
        └── SKILL.md
```

## Troubleshooting

**组件未加载：**
- 确认文件在正确目录、扩展名正确
- 检查 YAML frontmatter 语法（commands / agents / skills）
- 确认 skill 使用的是 `SKILL.md`，不是 `README.md`
- 确认 plugin 已在 Claude Code 设置中启用

**路径解析错误：**
- 把所有硬编码路径替换成 `${CLAUDE_PLUGIN_ROOT}`
- 检查 manifest 中路径是否为相对路径且以 `./` 开头
- 检查引用文件是否真的存在
- 在 hook script 中用 `echo $CLAUDE_PLUGIN_ROOT` 做验证

**自动发现不工作：**
- 确认目录位于 plugin 根目录，而不是 `.claude-plugin/` 内部
- 检查文件命名是否符合规范（kebab-case、正确扩展名）
- 检查 manifest 中的自定义路径是否正确
- 必要时重启 Claude Code 重新加载配置

**插件间冲突：**
- 使用唯一且语义明确的组件名
- 必要时给 command 加 plugin 前缀
- 在 plugin README 中记录潜在冲突
- 对相关功能考虑统一前缀

---

更详细的示例和高级模式见 `references/` 与 `examples/` 目录。
