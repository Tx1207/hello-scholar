# Command Development Skill

这份技能文档提供 Claude Code slash command 开发的完整说明，覆盖文件格式、frontmatter、动态参数、文件引用、bash 执行、plugin 特性和维护建议。

## 概览

本 skill 主要包含：
- slash command 文件结构
- YAML frontmatter 配置字段
- 动态参数（`$ARGUMENTS`、`$1`、`$2`）
- `@` 文件引用
- `!``...`` ` bash 执行
- command 组织与 namespacing
- plugin 专属能力（`${CLAUDE_PLUGIN_ROOT}`、agents、skills、hooks 集成）
- 输入校验和错误处理

## Skill Structure

### `SKILL.md`

核心文档，负责说明：
- command 基本概念与位置
- frontmatter 字段概览
- 参数、文件引用和 bash 执行
- 组织方式、常见模式、排障
- plugin 特性与验证模式

### References

- `frontmatter-reference.md`：frontmatter 字段细则
- `plugin-features-reference.md`：plugin 专属 command 能力
- `interactive-commands.md`：交互式 command
- `advanced-workflows.md`：多阶段 workflow
- `testing-strategies.md`：command 测试策略
- `documentation-patterns.md`：command 文档化模式
- `marketplace-considerations.md`：发布与分发注意事项

### Examples

- `simple-commands.md`：基础 command 示例
- `plugin-commands.md`：plugin command 示例

## When This Skill Triggers

以下场景应触发本 skill：
- 创建 slash command
- 添加自定义 command
- 定义参数和 frontmatter
- 使用文件引用或 bash 执行
- 组织 command 目录
- 设计 plugin command

## Progressive Disclosure

默认分层使用：
1. 先读 `SKILL.md`
2. 需要细节时再打开 `references/`
3. 需要范例时再看 `examples/`

## Command Basics Quick Reference

### File Format

```markdown
---
description: Brief description
argument-hint: [arg1] [arg2]
allowed-tools: Read, Bash(git:*)
---

Command prompt content with:
- Arguments: $1, $2, or $ARGUMENTS
- Files: @path/to/file
- Bash: !`command here`
```

### Locations

- **Project**：`.codex/commands/`
- **Personal**：`~/.codex/commands/`
- **Plugin**：`plugin-name/commands/`

### Key Features

- `$ARGUMENTS`：接收全部参数
- `$1`、`$2`：按位置接收参数
- `@path/to/file`：读取文件内容
- `!`command``：执行 bash 并嵌入输出

## Frontmatter Fields Quick Reference

| Field | Purpose | Example |
|-------|---------|---------|
| `description` | `/help` 中显示说明 | `"Review code for issues"` |
| `allowed-tools` | 限制工具权限 | `Read, Bash(git:*)` |
| `model` | 指定 model | `sonnet` |
| `argument-hint` | 说明参数格式 | `[pr-number] [priority]` |
| `disable-model-invocation` | 仅允许手动调用 | `true` |

## Development Workflow

1. 明确 command 的目的和范围
2. 创建 `.md` 文件
3. 补充必要 frontmatter
4. 测试参数、bash、文件引用是否生效
5. 继续精修 prompt、错误处理和示例

## 最佳实践总结

1. 单一职责
2. 描述清晰
3. 参数必须可发现
4. 工具权限尽量最小
5. 全量测试
6. 复杂逻辑加注释
7. 处理缺参、缺文件、执行失败等错误场景
