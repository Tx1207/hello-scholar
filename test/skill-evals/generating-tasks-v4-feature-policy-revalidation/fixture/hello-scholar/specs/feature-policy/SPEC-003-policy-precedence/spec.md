---
schema: 1
kind: spec
id: SPEC-003
title: Feature policy precedence and deny rules
topic: feature-policy
type: capability
status: accepted
revision: 2
summary: Evaluate explicit deny tenant allow and global default in one deterministic order
created: 2026-06-18
updated: 2026-07-28
supersedes: []
superseded_by: null
---
# Feature Policy Precedence And Deny Rules

## Problem

Tenant overrides can enable a feature that an emergency global deny must block.

## Goals

Add explicit deny rules and deterministic evaluation evidence without changing the public boolean API.

## Non-goals

Persistent policy storage and remote configuration are excluded.

## Target Design

Evaluation order is explicit deny, tenant allow/deny, then global default.

## Acceptance Criteria

- AC-1: An explicit deny returns `False` even when tenant and global rules allow the feature.
- AC-2: Without explicit deny, a tenant rule overrides the global default.
- AC-3: Without tenant or deny rules, evaluation returns the global default.
- AC-4: Existing `evaluate(feature, tenant)` callers and boolean return values remain compatible.

## Verification

Focused unit tests cover every precedence branch and the full suite protects compatibility.

## Migration And Cleanup

Existing dictionaries load with an empty explicit-deny set. Remove the temporary compatibility constructor only after all callers use the new policy object.

## Rollback

Revert the policy object and constructor call sites together; no stored data requires rollback.

## Revision History

- Revision 1: tenant override and global default.
- Revision 2: accepted explicit-deny precedence and compatibility migration.
