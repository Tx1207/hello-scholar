已根据当前 Accepted Spec 和 Approved Plan 修订：

- Tasks：`/tmp/hello-scholar-eval-generating-tasks-semantic-revision-baseline/hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md`
  - 保留已完成且有效的 `T001`、checkbox 与原始 Evidence。
  - 删除已废弃且未完成的 `T002`。
  - 保留 `T003`，仅更新 `Work`、`Validation`、`Completion`，并改为依赖 `T001`。
  - 新增未复用的 `T004` audit integration，依赖 `T003`。
  - 修复依赖图：`T001 → T003 → T004`。
  - 重置为 `revision: 2`、`approval: pending-review`、`approved_revision: null`、`status: pending`。
- CLI 已刷新索引：
  - `/tmp/hello-scholar-eval-generating-tasks-semantic-revision-baseline/hello-scholar/specs/INDEX.md`
  - `/tmp/hello-scholar-eval-generating-tasks-semantic-revision-baseline/hello-scholar/specs/feature-policy/INDEX.md`
- 验证通过：
  - `docs check`：0 errors，0 notices。
  - 完整 Python 测试：2 tests，`OK`。
  - `git diff --check`：通过。
  - 最终写集仅包含 `tasks.md` 与两个生成索引，未产生 `__pycache__` 或 `.pyc`。
  - 未修改 Spec、Plan、Architecture、源码、测试或执行证据。

result: Tasks revision 2 已完成并处于 pending-review，等待用户审核，未开始实施。
