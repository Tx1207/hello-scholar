---
schema: 1
kind: spec
id: SPEC-002
title: Retrieval result ranking
topic: search-ranking
type: capability
status: accepted
revision: 2
summary: Rank candidate documents returned by text retrieval
created: 2026-05-15
updated: 2026-07-02
supersedes: []
superseded_by: null
---
# Retrieval Result Ranking

## Problem

Text retrieval returns more candidates than a caller needs.

## Goal

Order candidate documents by relevance score.

## Boundary

This Spec does not own lookup request shapes, batch limits, partial failures, or endpoint rollout.

## Acceptance Criteria

Ranking is deterministic and does not change document payloads.

## Revision History

- Revision 1: lexical ranking.
- Revision 2: stable tie ordering.
