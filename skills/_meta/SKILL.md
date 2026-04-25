---
name: hello-scholar-meta
description: hello-scholar 内部命令与 canonical skill 规范
policy:
  allow_implicit_invocation: false
---

## Skill 系统
Skills 是带 YAML frontmatter 的 Markdown 文件。
- canonical skills: 按 domain 组织的长期技能，例如 `skills/core/*`、`skills/development/*`、`skills/writing/*`、`skills/post-acceptance/*`
- commands/*: 用户通过 `~command` 调用的命令壳

Skills 按需加载，不预加载。

## Frontmatter 字段
- name: 技能名称（必填）
- description: 技能描述，用于元数据层判断是否相关（必填）
- policy.allow_implicit_invocation: 是否允许隐式激活（false = 仅显式调用）。缺省时默认 true。commands/* 必须显式设为 false（仅通过 `~command` 调用）
