---
schema: 1
kind: plan
spec: SPEC-028
spec_revision: 3
revision: 2
status: approved
title: Deterministic access policy implementation plan
summary: Migrate persisted policies and converge decision validation precedence audit and cleanup in one bounded release
created: 2026-07-29
updated: 2026-07-30
---
# Deterministic Access Policy Implementation Plan

## Source Of Truth

Implement `SPEC-028` revision 3 without changing the accepted result keys or introducing a second public authorization path.

## Technical Approach

Parse and validate the version 2 policy shape at the service boundary. Validate all request fields before matching. Partition matching rules by effect so a deny cannot depend on input order, derive one accepted reason code, and emit denial audit through the required sink before returning.

## Module And File Boundary

- `src/access-policy.js`: version 2 policy validation, request validation, precedence, reason codes, and audit call.
- `clients/http-handler.js`: load the version 2 policy and pass the production audit sink without a shadow option.
- `config/policies.json`: migrated persisted fixture.
- `test/access-policy.test.js` and caller tests: complete AC matrix.
- Delete `src/legacy-policy.js`; no new runtime module or public entry point is selected.

## Stages

1. Add invalid-field, deny-order, reason, and audit-cardinality coverage.
2. Migrate the checked-in persisted policy and the production caller together.
3. Delete the legacy bridge and its test after a complete caller and fixture search.
4. Remove the shadow header and reject any preview or alternate authorization surface.
5. Run the full suite, forbidden-symbol search, docs check, and final Bundle comparison.

## Test Strategy

Use table-driven `node:test` cases for all missing fields, both deny/allow orders, four reason codes, audit cardinality, old-schema rejection, and HTTP behavior. The full test command and empty cleanup search are both required.

## Migration And Cleanup

The configuration migration and compatibility deletion form one release transaction. Do not retain an adapter, feature flag, old test, or unused candidate implementation after all callers read schema version 2.

## Rollback

Revert source, caller, persisted fixture, and tests together. A mixed persisted/runtime schema is not a valid rollback.

## Tasks Generation Rules

Keep changes sharing `src/access-policy.js` serial. Separate the persisted migration, legacy deletion, shadow/preview cleanup, and final convergence check when their evidence differs. Every Task must cite the AC and an observable completion condition.
