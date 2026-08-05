---
schema: 1
kind: tasks
spec: SPEC-420
spec_revision: 1
plan_revision: 1
revision: 1
approval: approved
approved_revision: 1
status: in-progress
created: 2026-07-17
updated: 2026-07-25
---

# Eval Score Normalization Tasks

- [x] T001: Normalize and clamp observed scores
  - Files: `src/score.js`, `test/score.test.js`
  - Completion: Bounded cases pass without a dependency.

- [ ] T002: Require every weighted dimension
  - Files: `src/score.js`, `test/score.test.js`
  - Completion: Missing dimensions fail with a stable diagnostic.

These Tasks intentionally still bind accepted Spec Revision 1 and are Stale even though the runtime already exposes the Revision 2 behavior.
