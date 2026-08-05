---
schema: 1
kind: tasks
spec: SPEC-000
spec_revision: 1
plan_revision: 1
revision: 1
approval: pending-review
approved_revision: null
status: pending
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Spec title> Tasks

## Phase 1: <independently verifiable outcome>

- [ ] T001: <plain-language goal>
  - Spec Coverage: <exact AC IDs or Spec sections>
  - Depends On: None
  - Parallel: No
  - Files:
    - `<exact/path/to/create-or-change>`
  - Work:
    1. <2–5 minute action naming the exact symbol, interface, or file region and concrete edit>
    2. <next 2–5 minute action needed for this independently verifiable outcome>
  - Validation:
    - Run `<exact command>`; expect `<observable passing signal>`.
  - Completion:
    - <observable behavior or repository state that proves the Task is complete>
    - <preserved invariant, absence check, or recovery condition required by the Plan>
