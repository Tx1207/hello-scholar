---
schema: 1
kind: tasks
spec: SPEC-004
spec_revision: 1
plan_revision: 1
revision: 1
approval: approved
approved_revision: 1
status: in-progress
created: 2026-07-30
updated: 2026-07-30
---

# LRU Cache Tasks

## Phase 1: Recency Semantics

- [ ] T001: Refresh recency after successful reads
  - Spec Coverage: AC-1, AC-3
  - Depends On: None
  - Parallel: No
  - Files: `src/cache_allocator.py`, `tests/test_cache_allocator.py`
  - Work: Add a regression in which reading the oldest inserted key changes the next victim, then implement the smallest successful-read recency update. A missing-key lookup must keep raising `KeyError` without mutation.
  - Validation: Run `python3 -m unittest discover -s tests`; the new LRU-vs-FIFO case and all existing tests exit 0.
  - Completion: Read recency is observable through eviction and public signatures are unchanged.

- [ ] T002: Refresh recency for updates and close the regression matrix
  - Spec Coverage: AC-2, AC-3
  - Depends On: T001
  - Parallel: No
  - Files: `src/cache_allocator.py`, `tests/test_cache_allocator.py`
  - Work: Cover an existing-key update at full capacity, ensure no unrelated key is evicted, and make the updated key most recent. Do not add a FIFO/LRU mode.
  - Validation: Run `python3 -m unittest discover -s tests` and `python3 scripts/check_bundle_state.py`; both exit 0.
  - Completion: All acceptance criteria have focused coverage, the full suite is green, and Tasks status reflects only work actually completed.
