---
name: obsidian-synthesis-map
description: 当需要在项目知识库内部生成更高层次的综合型笔记时使用该 skill，例如 literature reviews、comparison matrices、project summaries 或其他跨笔记总结。
---

# Obsidian Synthesis Map

这是一个 **legacy compatibility helper**。

虽然名字里有 map，但当前默认工作流聚焦的是 **synthesis notes**，而不是 Bases 或 Canvas artifacts。

## 默认输出

- `Writing/` 中的 synthesis notes
- 与 `Knowledge/`、`Papers/`、`Experiments/` 和 `Results/` 关联的项目摘要
- 有助于写作、规划或结果解释的 comparison notes

## 指南

- 使用 `obsidian-project-memory` 作为主要工作流权威。
- 使用 `$obsidian-markdown` 保证笔记质量。
- 通过 wikilinks 将 synthesis notes 锚定到真实 papers、experiments、results 和 project questions。
- 每种用途优先维护一份 durable synthesis note，而不是多个相互重叠的 summary。
- 如果用户明确要求 `.base` 或 `.canvas` artifacts，把它们视为可选附加产物，而不是默认输出。

## 默认立场

默认**不要**生成：
- `Views/*.base`
- `Maps/*.canvas`

除非用户明确要求这些 artifacts。
