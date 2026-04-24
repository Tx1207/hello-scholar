---
name: ~auto
description: 自动分流命令，根据当前任务复杂度在 ~idea/~plan/~build/~verify/~prd 之间选择主路径。
policy:
  allow_implicit_invocation: false
---
Trigger: ~auto [description]

`~auto` 负责自动选路，但不改变授权边界。

## 分流规则

- 探索/比较/脑暴 → `~idea`
- 多文件功能、新项目、结构化方案 → `~plan`
- 明确实现、小范围修复 → `~build`
- 已进入验证或显式要求审查/验真 → `~verify`
- 交付物以规格、提案、论文或文档为主 → `~prd`

## 执行原则

- 只在真实阻塞时停下
- 若已获得继续执行授权，分流后默认持续推进
- 分流结果必须与 `route/tier` 和当前资产状态一致
