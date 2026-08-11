---
schema: 1
kind: spec
id: SPEC-003
title: Feature policy precedence and deny rules
topic: feature-policy
type: capability
status: accepted
revision: 3
summary: Evaluate explicit deny tenant allow and global default in one deterministic order with an audit callback
created: 2026-06-18
updated: 2026-08-08
supersedes: []
superseded_by: null
---
# Feature Policy Precedence And Deny Rules

## Problem

Tenant overrides can enable a feature that an emergency global deny must block.

## Goals

Add explicit deny rules and deterministic evaluation evidence without changing the public boolean API. Emit the selected rule source through an injected audit callback after every evaluation.

## Non-goals

Persistent policy storage, remote configuration, and network audit delivery are excluded.

## Target Design

Evaluation order is explicit deny, tenant allow/deny, then global default. After selecting the result, the engine invokes `audit(feature, tenant, source, result)` exactly once with `source` equal to `explicit-deny`, `tenant`, or `global-default`.

## Acceptance Criteria

- AC-1: An explicit deny returns `False` even when tenant and global rules allow the feature.
- AC-2: Without explicit deny, a tenant rule overrides the global default.
- AC-3: Without tenant or deny rules, evaluation returns the global default.
- AC-4: Existing `evaluate(feature, tenant)` callers and boolean return values remain compatible.
- AC-5: Every evaluation invokes the injected audit callback exactly once with the selected source and returned boolean.

## Verification

Focused unit tests cover every precedence branch, callback source and count, and the full suite protects compatibility.

## Migration And Cleanup

Existing dictionaries load with an empty explicit-deny set and the constructor supplies a no-op audit callback for existing callers. Remove the temporary dictionary compatibility constructor only after all callers use the new policy object; keep the no-op callback default as the public compatibility boundary.

## Rollback

Revert the audit callback wiring and its tests while retaining the accepted explicit-deny policy object and migrated constructor call sites. No stored data requires rollback.

## Revision History

- Revision 1: tenant override and global default.
- Revision 2: accepted explicit-deny precedence and compatibility migration.
- Revision 3: add one audit callback after rule selection without changing the boolean API.
