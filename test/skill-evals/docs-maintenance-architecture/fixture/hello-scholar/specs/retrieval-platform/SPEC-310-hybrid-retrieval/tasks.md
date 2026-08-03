---
schema: 1
kind: tasks
spec: SPEC-310
spec_revision: 2
plan_revision: 1
revision: 1
approval: approved
approved_revision: 1
status: completed
created: 2026-07-21
updated: 2026-07-29
---

# Hybrid Retrieval Tasks

- [x] T001: Implement hybrid scoring and publication filtering
  - Files: `src/retrieval.py`, `tests/test_retrieval.py`
  - Completion: Public input/output remains stable and focused tests cover filtering, weights, ties, and invalid limits.

- [x] T002: Run the formal Recall Eval and record the decision
  - Files: `runs/20260729-1500-hybrid-retrieval/record.md`, `results/recall-metrics.json`
  - Completion: Recall improves over the lexical baseline with zero publication-filter violations.

- [x] T003: Remove caller-owned publication filtering
  - Files: `src/retrieval.py`
  - Completion: The retriever is the single filtering owner and no compatibility branch remains.
