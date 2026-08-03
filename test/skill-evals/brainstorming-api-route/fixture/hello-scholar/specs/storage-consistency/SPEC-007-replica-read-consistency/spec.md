---
schema: 1
kind: spec
id: SPEC-007
title: Retrieval replica read consistency
topic: storage-consistency
type: system-design
status: accepted
revision: 1
summary: Route document reads to replicas with bounded staleness
created: 2026-06-11
updated: 2026-06-11
supersedes: []
superseded_by: null
---
# Retrieval Replica Read Consistency

## Goal

Bound replica staleness for individual document reads.

## Boundary

This Spec owns storage selection, not HTTP request cardinality, partial failures, or batch response shape.

## Acceptance Criteria

Reads exceeding the staleness bound retry against the primary.

## Revision History

- Revision 1: accepted bounded-staleness read path.
