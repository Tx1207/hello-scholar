---
schema: 1
kind: spec
id: SPEC-014
title: Ranking feature snapshot freshness
topic: relevance-ranking
type: capability
status: accepted
revision: 1
summary: Reject feature snapshots older than the configured publication window
created: 2026-07-22
updated: 2026-07-22
supersedes: []
superseded_by: null
---
# Ranking Feature Snapshot Freshness

## Goal

Publish and validate feature snapshot age independently of score blending.

## Boundary

This Spec does not own query confidence, scoring weights, or fallback selection.

## Acceptance Criteria

Expired snapshots are rejected before the ranking request uses them.

## Revision History

- Revision 1: accepted freshness window.
