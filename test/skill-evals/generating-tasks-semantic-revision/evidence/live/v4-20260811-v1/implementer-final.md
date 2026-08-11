✅ 【hello-scholar】- 完成 - generating-tasks

已修订并验证：

- 更新 `/tmp/hello-scholar-eval-generating-tasks-semantic-revision-live-v1-20260811a/hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md`
  - 绑定 `spec_revision: 3`、`plan_revision: 2`
  - `revision` 从 1 增至 2
  - 重置为 `approval: pending-review`、`approved_revision: null`、`status: pending`
  - 保留已完成的 `T001`、checkbox 和证据原文
  - 删除废弃的未完成 `T002`
  - 保留 `T003` 身份与非指定字段，仅更新依赖、Validation
  - 新增 `T004` 审计回调集成任务
  - 修复 DAG：`T001 → T003 → T004`
- 通过绝对 CLI 生成并更新两个 Index：
  - `hello-scholar/specs/INDEX.md`
  - `hello-scholar/specs/feature-policy/INDEX.md`
- 上游 Spec、Plan、Architecture、源码和测试未修改。
- 验证通过：
  - `hello-scholar docs sync`
  - `hello-scholar docs check`：0 errors
  - Python 全量测试：2 tests，`OK`
  - `git diff --check`
  - 未产生 `__pycache__` 或 `.pyc` runtime artifacts
- 未开始实施，当前 Tasks 等待审核。
