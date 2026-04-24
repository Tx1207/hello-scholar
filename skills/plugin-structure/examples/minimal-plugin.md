# 最简插件示例

一个只有单个 command 的基础插件。

## 目录结构

```
hello-world/
├── .claude-plugin/
│   └── plugin.json
└── commands/
    └── hello.md
```

## 文件内容

### .claude-plugin/plugin.json

```json
{
  "name": "hello-world"
}
```

### commands/hello.md

```markdown
---
name: hello
description: 输出一条友好的问候消息
---

# Hello Command

向用户输出一条友好的问候。

## Implementation

向用户输出下面这段消息：

> Hello! This is a simple command from the hello-world plugin.
>
> Use this as a starting point for building more complex plugins.

在问候中带上当前时间戳，用来说明这个 command 已成功执行。
```

## 使用方式

安装插件后：

```
$ claude
> /hello
Hello! This is a simple command from the hello-world plugin.

Use this as a starting point for building more complex plugins.

Executed at: 2025-01-15 14:30:22 UTC
```

## 关键点

1. **最小 manifest**：只包含必须的 `name` 字段
2. **单个 command**：`commands/` 目录里只有一个 markdown 文件
3. **自动发现**：Claude Code 会自动找到这个 command
4. **无依赖**：不需要 scripts、hooks 或外部资源

## 什么时候适合这种模式

- 快速原型
- 单一用途的小工具
- 学习插件开发
- 团队内部只有一个明确功能点的工具

## 如何扩展这个插件

如果要继续加功能：

1. **增加 commands**：在 `commands/` 中继续创建更多 `.md` 文件
2. **增加 metadata**：在 `plugin.json` 中补充 version、description、author
3. **增加 agents**：创建 `agents/` 目录并加入 agent 定义
4. **增加 hooks**：创建 `hooks/hooks.json` 处理事件
