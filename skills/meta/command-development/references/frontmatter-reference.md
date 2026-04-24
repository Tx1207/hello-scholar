# Command Frontmatter 参考

slash command 的 YAML frontmatter 是可选元数据。

```markdown
---
description: Brief description
allowed-tools: Read, Write
model: sonnet
argument-hint: [arg1] [arg2]
---
```

## 字段说明

### `description`

- 类型：String
- 必填：否
- 默认：command prompt 第一行
- 用途：显示在 `/help`

建议：
- 控制在 60 字符内
- 用动词开头
- 不要写废话

### `allowed-tools`

- 类型：String 或数组
- 默认：继承当前会话权限
- 用途：限制 command 可用工具

示例：

```yaml
allowed-tools: Read, Grep
allowed-tools: Bash(git:*)
allowed-tools:
  - Read
  - Bash(git:*)
```

### `model`

- 可选值：`haiku`、`sonnet`、`opus`
- 默认：继承当前会话

使用建议：
- `haiku`：简单快速任务
- `sonnet`：大多数标准任务
- `opus`：复杂分析

### `argument-hint`

- 用途：说明参数格式，便于用户理解和补全

```yaml
argument-hint: [environment] [version]
```

### `disable-model-invocation`

- 类型：Boolean
- 默认：`false`
- 用途：禁止被 SlashCommand tool 编程调用，只允许用户手动触发

适用场景：
- 高风险命令
- 需要人工判断的命令
- 强交互式工作流

## Validation Checklist

- [ ] YAML 合法
- [ ] `description` 清晰且不冗长
- [ ] `allowed-tools` 格式正确
- [ ] `model` 值合法
- [ ] `argument-hint` 与实际参数一致
- [ ] `disable-model-invocation` 只在必要时使用
