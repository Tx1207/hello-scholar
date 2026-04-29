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

## 完整性要求

- `requirements.md` 必须记录用户问题、目标、成功标准、约束、非目标和需要确认的问题。
- `plan.md` 必须回答“接下来怎么做”，包含修改策略、受影响文件、逐项修改说明、行为变化、风险与缓解、验证计划和 Traceability。
- `tasks.md` 的每个任务必须包含涉及文件、具体改动、完成标准、验证方式、依赖/阻塞、对应计划项和对应 change 记录。
- 对高影响 prompt / workflow 修改，用户可见计划必须先说明修改范围、具体修改点、行为变化、风险边界和验证方式。
- 禁止只使用“优化、完善、增强、调整”等泛化动词作为计划项；必须补充具体对象、具体改动和可观察行为变化。

## 执行边界

- 显式 `~plan` 默认停在“方案已形成”
- 只有用户明确要求继续实现时，才进入 `~build`
- 不把 `hello-*` 质量 skill 当成主规划 skill；它们只补质量约束
