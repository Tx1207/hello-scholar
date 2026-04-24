---
name: ~init
description: 初始化 hello-scholar 资产与项目工作流；若用户显式要求从零建仓，再接入 project-creator。
policy:
  allow_implicit_invocation: false
---
Trigger: ~init

`~init` 是 hello-scholar 的项目初始化命令。

## 主调度

- 现有仓库工作流初始化：创建并整理 `hello-scholar/` 资产根
- 从零建仓或模板建仓：附加 `project-creator`
- 科研仓库且需要 durable truth 时：附加 `research-store.mjs init-project`

## 初始化目标

- 确保 `hello-scholar/state/`、`plans/`、`changes/`、`evidence/`、`research/` 可用
- 确保 `STATE.md`、变更索引和研究摘要处于可继续维护状态
- 不再把 `.helloagents/` 作为主资产目录
