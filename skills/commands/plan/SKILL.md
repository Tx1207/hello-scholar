---
name: ~plan
description: 结构化规划命令，优先复用 planning-with-files，并把方案包写入 hello-scholar/plans。
policy:
  allow_implicit_invocation: false
---
Trigger: ~plan [description]

`~plan` 是 hello-scholar 的主规划命令。

## 主调度

- 主 skill：`planning-with-files`
- 研究型问题可附加 `research-ideation`
- 文档型规划可附加 `doc-coauthoring`
- 涉及 UI 时再读取 `hello-ui`

## 落盘要求

- 方案包固定写入 `hello-scholar/plans/<plan-id>/`
- 使用 `scripts/plan-package.mjs create` 生成：
  - `requirements.md`
  - `plan.md`
  - `tasks.md`
  - `contract.json`
- 进入规划前，如任务会影响项目内容，先用 `scripts/change-tracker.mjs track-intent` 记录用户目标

## 执行边界

- 显式 `~plan` 默认停在“方案已形成”
- 只有用户明确要求继续实现时，才进入 `~build`
- 不把 `hello-*` 质量 skill 当成主规划 skill；它们只补质量约束
