---
schema: 1
kind: spec
id: SPEC-101
title: Policy Rule Ownership
topic: bundle-validation
type: capability
status: accepted
revision: 2
summary: Require every policy rule to use its normalized owner namespace.
created: 2026-07-20
updated: 2026-07-31
supersedes: []
superseded_by: null
---

# Policy Rule Ownership

## Problem

Mixed-case owner labels can produce policy rules that appear to belong to a different namespace.

## Target

Normalize owner labels before checking the `<owner>:<rule>` prefix. Revision 2 also requires blank owners to fail before any prefix comparison.

## Acceptance Criteria

- Owner labels are trimmed and lowercased.
- Blank owners raise `ValueError`.
- A rule belongs to an owner only when its normalized namespace prefix matches.

## Evidence

`src/bundle_rules.py` and `tests/test_bundle_rules.py`.

## Revision History

- Revision 1 normalized owner labels before prefix comparison.
- Revision 2 made blank-owner rejection part of the accepted contract.
