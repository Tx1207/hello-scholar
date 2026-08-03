---
schema: 1
kind: spec
id: SPEC-028
title: Deterministic access decisions and denial audit
topic: access-policy
type: capability
status: accepted
revision: 3
summary: Make deny precedence, input errors, persisted policy shape, and denial audit deterministic without shadow authorization paths
created: 2026-06-20
updated: 2026-07-29
supersedes: []
superseded_by: null
---
# Deterministic Access Decisions And Denial Audit

## Problem

Legacy boolean defaults and temporary shadow behavior make policy outcomes depend on caller options and rule order. Denied requests also lack a durable audit signal.

## Goals

- Produce one deterministic decision for every valid request.
- Reject structurally invalid requests through one stable error contract.
- Persist only the version 2 policy schema.
- Emit an audit event for every denied decision.

## Non-goals

Policy authoring UI, policy previews, alternate authorization endpoints, remote rule evaluation, and retaining a shadow mode are excluded.

## Accepted Design

`authorize(request, policy, auditSink) -> decision` remains the only public decision entry point. A request requires non-empty `actorId`, `actorRole`, and `resource`; any missing field raises `PolicyInputError` with code `invalid_request`. Matching deny rules take precedence over every matching allow regardless of stored order. If no rule matches, `defaultEffect` decides.

The result shape is `{ allowed, reason, matchedRuleId }`. `reason` is exactly one of `rule_allow`, `rule_deny`, `default_allow`, or `default_deny`. Every false decision calls `auditSink.record()` once with actor, resource, reason, and matched rule ID before returning. Allowed decisions do not emit denial events.

Persisted policies use only `{ schemaVersion: 2, defaultEffect: "allow" | "deny", rules: [...] }`. The runtime rejects the old `defaultAllow` boolean shape. There is no runtime conversion bridge after migration.

## File Boundary

- Modify `src/access-policy.js`, `clients/http-handler.js`, `config/policies.json`, and focused tests.
- Delete `src/legacy-policy.js`, its legacy test, and every caller import after the persisted migration is verified.
- Remove the temporary `shadowMode` behavior and its `x-policy-shadow` caller header.
- Do not add a preview API, alternate decision entry point, new configuration switch, or second policy normalizer.

## Acceptance Criteria

- AC-1: For the same actor and resource, any matching deny wins over all matching allows regardless of rule order.
- AC-2: Missing `actorId`, `actorRole`, or `resource` raises `PolicyInputError` with code `invalid_request`; no decision or audit event is produced.
- AC-3: Decisions use only the four accepted reason codes and preserve the `{ allowed, reason, matchedRuleId }` public result keys.
- AC-4: Each denied decision emits exactly one complete denial event, while allowed decisions emit none.
- AC-5: Runtime configuration and the checked-in persisted sample use schema version 2 and `defaultEffect`; `defaultAllow` and runtime legacy conversion are absent.
- AC-6: The legacy entry point, preview surface, shadow flag/header, and their tests are absent; the HTTP caller uses only the accepted entry point.
- AC-7: The focused and full Node test suites pass with tests covering invalid fields, deny precedence in both orders, reason codes, audit cardinality, persistence rejection, and cleanup.

## Verification

Run `npm test`; search the complete tree for `defaultAllow`, `normalizeLegacyPolicy`, `authorizeLegacy`, `previewPolicy`, `shadowMode`, and `x-policy-shadow`, expecting no runtime or test matches. Run the absolute `hello-scholar docs check` after Index synchronization.

## Migration And Cleanup

Rewrite every persisted policy to schema version 2 before removing the compatibility reader. Then delete the legacy module and test, remove shadow behavior from the HTTP caller, and confirm no unselected preview implementation remains.

## Rollback

Restore the previous runtime, persisted configuration, caller, and tests as one unit. Do not mix the schema version 2 fixture with the legacy runtime.

## Revision History

- Revision 1: Defined rule-based authorization.
- Revision 2: Selected deny precedence and a stable decision result.
- Revision 3: Accepted the version 2 persistence transaction, denial audit contract, and complete removal boundary.
