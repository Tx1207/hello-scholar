---
schema: 1
kind: tasks
spec: SPEC-021
spec_revision: 2
plan_revision: 1
revision: 1
approval: approved
approved_revision: 1
status: in-progress
created: 2026-07-31
updated: 2026-07-31
---

# 查询规范化 Tasks

- [ ] T001: Case-fold normalized queries
  - Spec Coverage: AC-1, AC-3
  - Depends On: None
  - Parallel: No
  - Files: `src/search_normalization.py`, `tests/test_search_normalization.py`
  - Work: 在 NFKC 后执行 case-fold，保留空白折叠和错误行为。
  - Validation: `python3 -m unittest discover -s tests` 退出 0。
  - Completion: 大小写输入归一且既有测试全绿。

- [ ] T002: Normalize typographic dashes
  - Spec Coverage: AC-2, AC-3
  - Depends On: T001
  - Parallel: No
  - Files: `src/search_normalization.py`, `tests/test_dash_normalization.py`
  - Work: 覆盖 em dash 和 en dash，并映射为 ASCII `-`。
  - Validation: `python3 -m unittest discover -s tests` 退出 0。
  - Completion: 新测试与完整测试全绿，处理保持幂等。
