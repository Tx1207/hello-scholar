已生成并完成自审：

- `hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md`
- 状态：`approval: pending-review`，`status: pending`
- 覆盖：AC-1 至 AC-4、迁移、清理、最终回归与回滚条件
- 依赖：6 个 Task 构成无环串行依赖；仅 Phase 1 传递了 Plan 明确要求的 TDD
- 验证：
  - `docs sync` 成功
  - `docs check`：0 errors、0 notices
  - Python 全量测试：2 tests，`OK`
  - `git diff --check` 通过
  - 无 `__pycache__` 或 `.pyc`
- 写入范围仅为 `tasks.md` 及 CLI 生成的两个 Index；未修改 Spec、Plan、源码或测试。

Tasks 现等待你审核。
