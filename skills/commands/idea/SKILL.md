---
name: ~idea
description: 轻量探索与方向比较，优先复用 research-ideation，不写项目资产也不进入实现。
policy:
  allow_implicit_invocation: false
---
Trigger: ~idea [description]

`~idea` 是 hello-scholar 的零副作用探索命令。

## 主调度

- 主 skill：`research-ideation`
- 需要代码事实时，只读取少量相关文件辅助判断
- 不创建 plan package，不改代码，不创建 `hello-scholar/` 下的新记录

## 输出要求

- 提供 2-4 个可行方向
- 明确推荐一个方向，并说明理由
- 若用户要继续推进：
  - 结构化方案 → `~plan`
  - 直接落地实现 → `~build`
  - 交付前检查 → `~verify`
  - 复盘沉淀 → `~evolve`
