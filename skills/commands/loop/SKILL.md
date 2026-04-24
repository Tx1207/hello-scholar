---
name: ~loop
description: 迭代修复与验证命令，围绕 verification-loop 进行多轮改进，直到满足交付条件。
policy:
  allow_implicit_invocation: false
---
Trigger: ~loop [description]

`~loop` 用于“改一轮 -> 验一轮 -> 再修”的迭代场景。

## 主调度

- 主 skill：`verification-loop`
- 失败反思或卡住时附加 `bug-detective`
- 代码审查补充时附加 `code-review-excellence`

## 执行约束

- 每轮都要记录本轮修改与验证证据
- 只有当验证通过、契约满足时，才允许退出循环
- 若连续失败，升级到更明确的 root-cause 分析，不机械重试
