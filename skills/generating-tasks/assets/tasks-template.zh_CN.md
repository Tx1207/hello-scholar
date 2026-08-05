---
schema: 1
kind: tasks
spec: SPEC-000
spec_revision: 1
plan_revision: 1
revision: 1
approval: pending-review
approved_revision: null
status: pending
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Spec 标题> Tasks

## Phase 1：<可独立验证的结果>

- [ ] T001: <清晰的自然语言目标>
  - Spec Coverage: <精确 AC ID 或 Spec 章节>
  - Depends On: None
  - Parallel: No
  - Files:
    - `<要创建或修改的精确路径>`
  - Work:
    1. <2–5 分钟动作，点名精确 symbol、interface 或文件区域以及具体编辑>
    2. <交付该可独立验证结果所需的下一个 2–5 分钟动作>
  - Validation:
    - 运行 `<精确命令>`；预期 `<可观察的通过信号>`。
  - Completion:
    - <证明该 Task 完成的可观察行为或仓库状态>
    - <Plan 要求保持的不变量、不存在性检查或恢复条件>
