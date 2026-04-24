---
name: obsidian-link-graph
description: 当用户希望修复或增强现有 canonical 项目笔记之间的 Obsidian wikilinks 时使用该 skill，特别适用于 papers、knowledge notes、experiments、results 和 writing 之间的链接关系。
---

# Obsidian Link Graph

这是一个 **legacy compatibility helper**。

尽管名字叫 link graph，但当前默认工作流并不是 graph-heavy。默认用它来修复现有 canonical notes 之间的导航，而不是自动生成 graph artifacts。

## 职责

- 强化 `00-Hub.md`、`01-Plan.md`、`Knowledge/`、`Papers/`、`Experiments/`、`Results/`、`Writing/` 和 `Daily/` 之间的 wikilinks
- 当 durable relationship 已经明确时，改善 backlinks
- 帮助把新引用路由到最佳 existing canonical note
- 在不引入 concepts / datasets 蔓延的前提下，减少 disconnected durable notes

## 链接启发式

- 每个 durable object 优先只有一个 canonical note。
- 通过稳定的项目对象建立链接，而不是临时短语。
- 不要把每一段都过度链接，只保留有意义的边。
- 优先修复现有链接，而不是新增辅助 notes。
- 如果最佳目标不明确，先缩小搜索范围；必要时使用 `obsidian-project-memory` 中的 `find-canonical-note`。

## 默认不要假设存在

- `Concepts/`
- `Datasets/`
- `Maps/`
- `Views/`
- `.canvas`
- `.base`

只有当用户明确要求时才创建这些内容。
