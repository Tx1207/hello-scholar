# Command 文档化模式

好的 command 应该是自解释、可维护、便于分发的。

## Self-Documenting Command Structure

```markdown
---
description: Clear, actionable description under 60 chars
argument-hint: [arg1] [arg2] [optional-arg]
allowed-tools: Read, Bash(git:*)
model: sonnet
---

<!--
COMMAND: command-name
VERSION: 1.0.0
AUTHOR: Team Name
LAST UPDATED: 2025-01-15
PURPOSE:
USAGE:
ARGUMENTS:
EXAMPLES:
REQUIREMENTS:
RELATED COMMANDS:
TROUBLESHOOTING:
CHANGELOG:
-->
```

## 建议写清的注释区块

- `PURPOSE`：这个 command 为什么存在
- `USAGE`：基本调用方式
- `ARGUMENTS`：参数说明、默认值、合法范围
- `EXAMPLES`：常见示例
- `REQUIREMENTS`：依赖、权限、环境要求
- `RELATED COMMANDS`：相关命令
- `TROUBLESHOOTING`：常见错误与修复
- `CHANGELOG`：版本变更

## Error Message Documentation

错误提示要包含：
- 出了什么错
- 为什么会发生
- 用户下一步该怎么改

## Maintenance Documentation

建议在注释里补：
- 版本号
- 更新时间
- 依赖
- 已知问题
- 未来改进项

## Documentation Checklist

- [ ] frontmatter 描述清楚
- [ ] 参数文档完整
- [ ] 有使用示例
- [ ] 有常见错误说明
- [ ] README 已同步
- [ ] 示例能实际运行
