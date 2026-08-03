---
schema: 1
kind: tasks
spec: SPEC-028
spec_revision: 3
plan_revision: 2
revision: 4
approval: approved
approved_revision: 4
status: completed
created: 2026-07-30
updated: 2026-07-31
---
# Deterministic Access Policy Tasks

- [x] T001: Complete request validation and deterministic decision codes
  - Spec Coverage: AC-2, AC-3
  - Depends On: None
  - Parallel: No
  - Files: `src/access-policy.js`, `test/access-policy.test.js`
  - Work: Reject each missing required request field with `PolicyInputError`, then cover and emit only the four accepted decision reason codes while retaining the public result keys.
  - Validation: Run `node --test test/access-policy.test.js`; every invalid-field and reason-code case passes.
  - Completion: All required fields fail before matching or audit, and every successful result uses an accepted reason.

- [x] T002: Enforce deny precedence and denial audit cardinality
  - Spec Coverage: AC-1, AC-4
  - Depends On: T001
  - Parallel: No
  - Files: `src/access-policy.js`, `test/access-policy.test.js`
  - Work: Make matching deny independent of rule order and call the supplied audit sink exactly once for each false decision, with no event for allowed decisions.
  - Validation: Run focused tests with allow-before-deny and deny-before-allow policies plus audit event assertions; all exit 0.
  - Completion: Both rule orders deny and the observed audit event count and fields match the Spec.

- [x] T003: Migrate persisted policy and remove the legacy runtime bridge
  - Spec Coverage: AC-5, AC-6
  - Depends On: T002
  - Parallel: No
  - Files: `config/policies.json`, `clients/http-handler.js`, `src/legacy-policy.js`, `test/access-policy.test.js`
  - Work: Move the fixture and caller to schema version 2, reject `defaultAllow`, delete `normalizeLegacyPolicy`, delete `src/legacy-policy.js`, and remove its compatibility test after the caller search is empty.
  - Validation: Run `npm test`; then search `src`, `clients`, `config`, and `test` for `defaultAllow|normalizeLegacyPolicy|authorizeLegacy`, expecting exit 1 and no matches.
  - Completion: Only schema version 2 reaches authorization and no legacy file, import, test, or persisted field remains.

- [x] T004: Remove unselected shadow and preview surfaces
  - Spec Coverage: AC-6
  - Depends On: T003
  - Parallel: No
  - Files: `src/policy-preview.js`, `clients/http-handler.js`, `test/`
  - Work: Delete the preview module, remove the shadow option and HTTP header, and confirm the accepted authorization entry point is the only runtime decision path.
  - Validation: Search the complete tree for `previewPolicy|shadowMode|x-policy-shadow`, expecting no source or test matches; run `npm test` with exit 0.
  - Completion: No preview, shadow behavior, header, alternate entry point, or associated test remains.

- [x] T005: Verify the complete Bundle against the final tree
  - Spec Coverage: AC-1 through AC-7
  - Depends On: T004
  - Parallel: No
  - Files: `hello-scholar/specs/access-policy/SPEC-028-deterministic-access-decisions/tasks.md`
  - Work: Compare every AC, Plan stage, Task Completion statement, cleanup search, caller, persisted fixture, and final source tree before marking the Bundle complete.
  - Validation: Run `npm test`, the forbidden-symbol search, `node <hello-scholar-repo>/bin/hello-scholar.js docs check`, and `git diff --check`; record current exit codes and outputs.
  - Completion: Every Spec obligation and cleanup gate has current, direct evidence and no Missing, Partial, Contradictory, Unrequested, or cleanup deviation remains.
