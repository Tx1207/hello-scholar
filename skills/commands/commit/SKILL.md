---
name: ~commit
description: 提交命令，优先复用 git-commit，并在提交前对齐 hello-scholar 的验证与状态资产。
policy:
  allow_implicit_invocation: false
---
Trigger: ~commit [message]

`~commit` 负责规范化本地提交。

## 主调度

- 主 skill：`git-commit`
- 若当前变更尚未验证完成，先回到 `~verify`

## 提交前约束

- 至少确认当前 change record、plan package 和验证状态是一致的
- 如需结构化 closeout，先写 `closeout-state.json`
- 提交后更新 change tracker 的 closeout 状态
