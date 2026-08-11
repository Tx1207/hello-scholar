已生成：

`hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md`

检查结果：

- 仅新增 `tasks.md`，未修改 Spec、Plan、Architecture、配置、源码、测试或 package 文件。
- 覆盖兼容读取窗口、迁移准备、应用迁移、切换门、旧 writer/flag/reader/dependency 删除、回归矩阵和 rollback drill。
- 每项任务均包含独立背景、准确文件范围、前置依赖、命令、预期信号、完成证据和失败恢复动作。
- 明确串行依赖 `Task 1 → Task 2 → Task 3 → Task 4 → Task 5`，并列出共享文件导致的不可并行边界。
- 已运行 `npm test`：5 项通过，0 失败。
- `git diff --check` 通过；当前仅有新增的 `tasks.md` 未跟踪文件。

等待你审核。
