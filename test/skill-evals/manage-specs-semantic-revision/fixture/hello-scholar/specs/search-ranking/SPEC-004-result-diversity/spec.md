---
schema: 1
kind: spec
id: SPEC-004
title: Search result source diversity
topic: search-ranking
type: capability
status: accepted
revision: 1
summary: Limit repeated sources after relevance ranking
created: 2026-07-01
updated: 2026-07-01
supersedes: []
superseded_by: null
---
# Search Result Source Diversity

## Problem

Highly relevant results can all come from one source.

## Goal

Apply a post-ranking per-source cap without changing relevance scores.

## Boundary

This Spec does not own lexical, phrase, semantic, or freshness weights.

## Acceptance Criteria

The top page respects the source cap while preserving relative score order where possible.

## Revision History

- Revision 1: accepted source-cap design.
