已完成 SPEC-052 的 T004，未执行 T005–T007，也未修改 `tasks.md`，未提交。

- 修改 `src/batch_processor.py`：增加批次上限检查，超过 50 项立即抛出 `ValueError`。
- 修改 `tests/test_batch_processor.py`：新增 50 项成功、51 项拒绝且在处理前失败的边界测试。
- 新增 `evidence/T004-validation.txt`，记录 Validation/Completion PASS。

精确检查结果：

- 聚焦 T004 测试：2 tests passed
- 完整测试套件：5 tests passed
- 执行状态校验：`execution-state-ready: T001-T004 evidenced; T005-T007 pending; tasks unchanged`
- `git diff --check`：通过

当前状态已停在 T005 前。
