---
name: ~test
description: 测试子路径，优先走 verification-loop 的测试相关命令，不替代完整交付验证。
policy:
  allow_implicit_invocation: false
---
Trigger: ~test [scope]

`~test` 是偏测试的验证快捷入口。

## 主调度

- 主 skill：`verification-loop`
- 需要 review-first 时升级到 `~verify`

## 执行约束

- 优先运行与当前变更最相关的测试命令
- 记录测试证据到 `hello-scholar/evidence/<target-id>/`
- `~test` 只证明测试子路径，不自动等价于完整交付完成
