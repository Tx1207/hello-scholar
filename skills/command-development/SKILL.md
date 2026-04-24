---
name: command-development
description: 当用户要求“create a slash command”、“add a command”、“write a custom command”、“define command arguments”、“use command frontmatter”、“organize commands”、“create command with file references”、“interactive command”、“use AskUserQuestion in command”，或需要了解 slash command 结构、YAML frontmatter、动态参数、bash 执行、用户交互模式以及 Claude Code command 开发最佳实践时使用。
version: 0.2.0
---

# Command Development for Claude Code

## 概览

Slash command 是以 Markdown 文件定义、在交互 session 中执行的高频 prompt。理解 command 的结构、frontmatter 和动态能力后，才能构建可复用工作流。

**关键概念：**
- command 本质是 Markdown 文件
- YAML frontmatter 负责配置
- 支持动态参数和文件引用
- 可内联执行 bash 收集上下文
- 支持目录组织与 namespacing

## Command Basics

### What is a Slash Command?

slash command 是用户调用后，由 Claude 执行的一段 Markdown 指令。它带来：
- **Reusability**
- **Consistency**
- **Sharing**
- **Efficiency**

### Critical: Commands are Instructions FOR Claude

**command 是写给 Claude 的，不是写给用户看的。**

✅ 正确：
```markdown
Review this code for security vulnerabilities including:
- SQL injection
- XSS attacks
- Authentication issues
```

❌ 错误：
```markdown
This command will review your code for security issues.
You'll receive a report with vulnerability details.
```

## Command Locations

**Project commands**
- 位置：`.codex/commands/`
- 范围：当前项目

**Personal commands**
- 位置：`~/.codex/commands/`
- 范围：所有项目

**Plugin commands**
- 位置：`plugin-name/commands/`
- 范围：安装 plugin 后可用

## File Format

### Basic Structure

```text
.codex/commands/
├── review.md
├── test.md
└── deploy.md
```

简单 command 可以没有 frontmatter。

### With YAML Frontmatter

```markdown
---
description: Review code for security issues
allowed-tools: Read, Grep, Bash(git:*)
model: sonnet
---

Review this code for security vulnerabilities...
```

## YAML Frontmatter Fields

### description

- 用途：`/help` 中显示的描述
- 类型：String
- 默认：取 prompt 第一行

### allowed-tools

- 用途：限制 command 可调用的 tool
- 类型：String 或 Array
- 例子：`Read, Write, Edit, Bash(git:*)`

### model

- 用途：指定执行 model
- 选项：`haiku`、`sonnet`、`opus`

### argument-hint

- 用途：提示参数格式，便于自动补全

### disable-model-invocation

- 用途：阻止被 SlashCommand tool 以编程方式调用

## Dynamic Arguments

### Using $ARGUMENTS

把全部参数作为一个字符串接收：

```markdown
Fix issue #$ARGUMENTS following our coding standards.
```

### Using Positional Arguments

分别接收 `$1`、`$2`、`$3`：

```markdown
Review pull request #$1 with priority $2.
After review, assign to $3.
```

### Combining Arguments

```markdown
Deploy $1 to $2 environment with options: $3
```

## File References

### Using @ Syntax

```markdown
Review @$1 for:
- Code quality
- Best practices
- Potential bugs
```

### Multiple File References

```markdown
Compare @src/old-version.js with @src/new-version.js
```

### Static File References

```markdown
Review @package.json and @tsconfig.json for consistency
```

## Bash Execution in Commands

command 可以内联 bash，在 Claude 处理前动态收集上下文，例如 git 状态、环境信息、项目配置等。

完整语法和示例见 `references/plugin-features-reference.md`。

## Command Organization

### Flat Structure

适合 5-15 个 command 的小集合。

### Namespaced Structure

适合 15+ 个 command，通过子目录做逻辑分组。

## 最佳实践

### Command Design

1. 单一职责
2. 描述清楚
3. 显式声明依赖
4. 参数格式要写明
5. 命名统一，建议 `verb-noun`

### Argument Handling

1. 对参数做校验
2. 缺参时给默认建议
3. 说明参数格式
4. 考虑错误输入

### File References

1. 路径明确
2. 缺文件时优雅处理
3. 优先项目相对路径
4. 必要时配合 Glob

### Bash Commands

1. 控制权限范围
2. 避免破坏性命令
3. 考虑失败情况
4. 保持快速

### Documentation

复杂 command 可在注释中补 usage、example 和 dependency。

## Common Patterns

### Review Pattern

```markdown
---
description: Review code changes
allowed-tools: Read, Bash(git:*)
---

Files changed: !`git diff --name-only`

Review each file for:
1. Code quality and style
2. Potential bugs or issues
3. Test coverage
4. Documentation needs
```

### Testing Pattern

```markdown
Run tests: !`npm test $1`
Analyze results and suggest fixes for failures.
```

### Documentation Pattern

```markdown
Generate comprehensive documentation for @$1 including:
- Function/class descriptions
- Parameter documentation
- Usage examples
```

### Workflow Pattern

```markdown
PR #$1 Workflow:
1. Fetch PR: !`gh pr view $1`
2. Review changes
3. Run checks
4. Approve or request changes
```

## Troubleshooting

**Command 不出现：**
- 检查目录是否正确
- 检查是否为 `.md`
- 检查 Markdown 格式
- 重启 Claude Code

**参数不生效：**
- 检查 `$1`、`$2` 语法
- 检查 `argument-hint`

**Bash 执行失败：**
- 检查 `allowed-tools`
- 先在终端里手测命令

**文件引用失败：**
- 检查 `@` 语法
- 检查文件路径
- 检查 Read tool 权限

## Plugin-Specific Features

### CLAUDE_PLUGIN_ROOT Variable

plugin command 可使用 `${CLAUDE_PLUGIN_ROOT}` 指向 plugin 的绝对路径。

常见用法：
- 执行 plugin script
- 读取 plugin config
- 加载 plugin template
- 访问 plugin 内文档资源

```markdown
!`node ${CLAUDE_PLUGIN_ROOT}/scripts/analyze.js $1`
@${CLAUDE_PLUGIN_ROOT}/templates/report.md
```

## Plugin Command Organization

```text
plugin-name/
├── commands/
│   ├── foo.md
│   ├── bar.md
│   └── utils/
│       └── helper.md
└── plugin.json
```

命名建议：
- 用明确动作名
- 避免过泛名字
- 多词用连字符

## Integration with Plugin Components

### Agent Integration

command 可以发起 agent 执行复杂任务。

### Skill Integration

command 可以显式提到 skill 名，以触发专门知识。

### Hook Coordination

command 可以与 hook 配合，比如准备上下文、解释 hook 输出。

### Multi-Component Workflows

可以把脚本、agent、skill、template 组合成多阶段工作流。

## Validation Patterns

### Argument Validation

在 command 早期就检查参数是否合法。

### File Existence Checks

先确认文件存在，再继续处理。

### Plugin Resource Validation

先检查 `${CLAUDE_PLUGIN_ROOT}` 下脚本和配置是否存在。

### Error Handling

对 build / deploy / script 失败给出可执行诊断，而不是只报错。

---

更细的 frontmatter 规范见 `references/frontmatter-reference.md`。  
plugin 专属能力见 `references/plugin-features-reference.md`。  
更多模式示例见 `examples/` 目录。
