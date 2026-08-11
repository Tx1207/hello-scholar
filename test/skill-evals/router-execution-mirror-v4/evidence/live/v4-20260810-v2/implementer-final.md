已完成 T004，严格停在 T005 前，未修改 `tasks.md`，未执行后续 Task，未 commit。

- 在 `src/batch_processor.py` 增加 50 项上限检查；超过 50 项时在处理前抛出 `ValueError`。
- 在 `tests/test_batch_processor.py` 增加 50/51 项边界测试。
- 新增 `evidence/T004-validation.txt`。
- 检查结果：
  - T004 聚焦测试：2 tests passed
  - 完整 unittest：5 tests passed
  - 执行状态校验：`execution-state-ready: T001-T004 evidenced; T005-T007 pending; tasks unchanged`
- 当前仅有上述两个源/测试文件修改和 T004 证据文件新增。

result: T004 已完成并验证通过，T005–T007 保持 pending。
