---
name: ~clean
description: 清理 hello-scholar 的临时状态与可归档方案包，不删除长期知识与研究资产。
policy:
  allow_implicit_invocation: false
---
Trigger: ~clean

`~clean` 用于整理运行时残留，而不是删除项目事实。

## 清理范围

- 可归档的 `hello-scholar/plans/<plan-id>/`
- 已过期的临时状态文件
- 不再需要的中间验证残留

## 不清理

- `hello-scholar/research/`
- 有效的 evidence bundle
- 活跃 change record
- 当前仍在使用的 state 文件
