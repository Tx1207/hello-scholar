T004 已完成，已严格停在 T005 前。

- 实现：`src/batch_processor.py`
  - 50 项批次正常处理
  - 超过 50 项立即抛出 `ValueError`，不进入逐项处理
- 测试：`tests/test_batch_processor.py`
  - 新增 50 项接受测试
  - 新增 51 项拒绝测试
- 证据：`evidence/T004-validation.txt`
- 精确检查：
  - `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`：5 tests，全部通过
  - `PYTHONDONTWRITEBYTECODE=1 python3 -B scripts/check_execution_state.py`：`execution-state-ready`
- `tasks.md` 未修改
- Tracker：T001–T004 `completed`；T005–T007 `pending`
- 未 commit。
