---
name: obsidian-cli
description: 使用 Obsidian CLI 与 Obsidian vault 交互，以读取、创建、搜索和管理 notes、tasks、properties 等。也支持 plugin 和 theme 开发，可重新加载 plugins、执行 JavaScript、抓取 errors、截图以及检查 DOM。当用户希望操作 Obsidian vault、管理 notes、搜索 vault 内容、从命令行执行 vault 操作，或开发调试 Obsidian plugins 和 themes 时使用。
---

# Obsidian CLI

使用 `obsidian` CLI 与正在运行的 Obsidian 实例交互。要求 Obsidian 已经打开。

## 命令参考

运行 `obsidian help` 查看所有可用命令。它始终是最新的。完整文档： https://help.obsidian.md/cli

## 语法

**Parameters** 通过 `=` 传值。包含空格的值需要加引号：

```bash
obsidian create name="My Note" content="Hello world"
```

**Flags** 是无值的布尔开关：

```bash
obsidian create name="My Note" silent overwrite
```

多行内容使用 `\n` 表示换行，`\t` 表示制表符。

## 文件定位

很多命令支持 `file` 或 `path` 指向目标文件。两者都不提供时，默认使用当前活动文件。

- `file=<name>` - 按 wikilink 方式解析（只需名称，无需路径和扩展名）
- `path=<path>` - 从 vault root 开始的精确路径，例如 `folder/note.md`

## Vault 定位

命令默认作用于最近一次获得焦点的 vault。使用 `vault=<name>` 作为第一个参数，可指定特定 vault：

```bash
obsidian vault="My Vault" search query="test"
```

## 常见模式

```bash
obsidian read file="My Note"
obsidian create name="New Note" content="# Hello" template="Template" silent
obsidian append file="My Note" content="New line"
obsidian search query="search term" limit=10
obsidian daily:read
obsidian daily:append content="- [ ] New task"
obsidian property:set name="status" value="done" file="My Note"
obsidian tasks daily todo
obsidian tags sort=count counts
obsidian backlinks file="My Note"
```

在任意命令上使用 `--copy` 可把输出复制到剪贴板。使用 `silent` 可阻止文件被打开。对 list commands 使用 `total` 可获得总数。

## Plugin 开发

### 开发 / 测试循环

在修改 plugin 或 theme 代码之后，遵循以下工作流：

1. **Reload** plugin，使其加载最新改动：
   ```bash
   obsidian plugin:reload id=my-plugin
   ```
2. **检查 errors** - 如果有错误，修复后回到第 1 步：
   ```bash
   obsidian dev:errors
   ```
3. **进行可视验证**，例如截图或 DOM 检查：
   ```bash
   obsidian dev:screenshot path=screenshot.png
   obsidian dev:dom selector=".workspace-leaf" text
   ```
4. **检查 console 输出**，查看 warnings 或意外日志：
   ```bash
   obsidian dev:console level=error
   ```

### 其他开发者命令

在应用上下文中运行 JavaScript：

```bash
obsidian eval code="app.vault.getFiles().length"
```

检查 CSS 值：

```bash
obsidian dev:css selector=".workspace-leaf" prop=background-color
```

切换移动端模拟：

```bash
obsidian dev:mobile on
```

运行 `obsidian help` 查看更多开发者命令，包括 CDP 和 debugger controls。
