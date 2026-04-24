---
name: memory-updater
description: 检查并更新 hello-scholar 全局 memory 文件，使其与 skills、commands、agents 和 hooks 的变化保持同步。
tags: [Memory, Configuration, Sync, Workflow]
---

# Memory Updater

检查并更新 hello-scholar 的全局 memory 文件，确保其内容与 skills、commands、agents 和 hooks 的源码保持同步。

## 概览

canonical global memory 文件是：
- `~/.hello-scholar/AGENTS-memory.md`

它可以总结：
- skill catalog 结构
- command 列表
- agent 配置
- hook 定义
- 值得在跨项目场景中保留的全局约定

这个文件属于全局知识，必须放在 uninstall-managed plugin/runtime 目录之外。

## 检测逻辑

1. **扫描源码文件修改时间**
   - `~/plugins/hello-scholar/skills/**/SKILL.md`
   - `~/plugins/hello-scholar/agents/**/AGENTS.md`
   - `~/plugins/hello-scholar/commands/**/*.md`
   - `~/plugins/hello-scholar/hooks/**/*.{js,json}`
   - 若当前在源码仓库中工作，则回退到 `./skills/`、`./agents/`、`./commands/`、`./hooks/`

2. **与 `~/.hello-scholar/AGENTS-memory.md` 对比**
   - 只要任一源文件更新更晚，就需要同步
   - 通过 `~/.hello-scholar/.last-memory-sync` 跟踪上次同步时间

3. **生成报告**
   - 列出所有变更过的源文件
   - 展示哪些 memory sections 需要更新

## 更新流程

### 1. 扫描阶段
```text
Scanning Skills: X items
Scanning Commands: Y items
Scanning Agents: Z items
Scanning Hooks: W items
```

### 2. 对比阶段
```text
Sections needing update:
- [ ] Skill catalog
- [ ] Command list
- [ ] Agent config
- [ ] Hook definitions
```

### 3. 确认更新
询问用户是否继续：
- `yes` - 执行更新
- `no` - 取消
- `diff` - 展示详细差异

### 4. 执行更新
- 保留用户手工编辑的内容
- 仅更新明确标注为生成内容的 sections
- 更新 `~/.hello-scholar/.last-memory-sync`

## 选项

- 默认：检查并提示是否更新
- `--check`：仅检查，不更新
- `--force`：不经确认强制更新
- `--diff`：展示差异对比

## 集成

- 在 session wrap-up 中集成检查提醒
- 当 skill / agent catalog 发生变化时，与 post-edit verification 配合使用
- 建议在一次维护会话结束时定期运行
