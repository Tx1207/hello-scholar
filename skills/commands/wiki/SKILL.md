---
name: ~wiki
description: 初始化或刷新 hello-scholar 的项目知识与研究资产，不创建新的实现代码。
policy:
  allow_implicit_invocation: false
---
Trigger: ~wiki

`~wiki` 只处理知识与项目记忆，不直接进入实现。

## 主调度

- 研究项目：优先使用 `research-store.mjs` 维护 `hello-scholar/research/`
- Obsidian 工作流已绑定时：按需附加 `obsidian-project-memory` / `obsidian-project-bootstrap`
- 软件仓库的最小知识资产：保持 `hello-scholar/state/` 与 `changes/INDEX.md` 可读

## 边界

- 不创建 `.helloagents/`
- 不写项目级规则文件
- 不改业务代码
