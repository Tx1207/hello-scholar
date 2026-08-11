已完成 `SPEC-052` 的 T004，已在指定隔离目录停止，未开始 T005–T007，也未修改 `tasks.md`。

变更文件：
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/src/batch_processor.py`
  - 增加 50 项上限；超过 50 项时在处理前抛出 `ValueError`。
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/tests/test_batch_processor.py`
  - 增加恰好 50 项接受及 51 项拒绝的边界测试。
- `/tmp/hello-scholar-eval-router-execution-mirror-v4-live-r7ab93p1/evidence/T004-validation.txt`
  - 记录 T004 的 Validation/Completion PASS 证据。

验证结果：
- T004 focused tests：2 tests passed。
- 完整 unittest suite：5 tests passed。
- `scripts/check_execution_state.py`：`execution-state-ready: T001-T004 evidenced; T005-T007 pending; tasks unchanged`。

未提交 git commit。
