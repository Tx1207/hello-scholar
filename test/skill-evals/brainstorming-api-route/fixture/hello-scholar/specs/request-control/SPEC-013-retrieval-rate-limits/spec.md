---
schema: 1
kind: spec
id: SPEC-013
title: Retrieval request rate limits
topic: request-control
type: capability
status: accepted
revision: 1
summary: Enforce tenant request budgets before retrieval work begins
created: 2026-07-25
updated: 2026-07-25
supersedes: []
superseded_by: null
---
# Retrieval Request Rate Limits

## Goal

Reject tenant traffic that exceeds its configured request budget.

## Boundary

Rate enforcement consumes request cost but does not define single versus batch API response contracts.

## Acceptance Criteria

Every accepted request consumes a deterministic budget unit and rejected requests perform no storage read.

## Revision History

- Revision 1: accepted tenant request budget.
