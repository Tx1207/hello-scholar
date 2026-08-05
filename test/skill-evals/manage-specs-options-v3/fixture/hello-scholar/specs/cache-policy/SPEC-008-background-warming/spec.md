---
schema: 1
kind: spec
id: SPEC-008
title: Background cache warming
topic: cache-policy
type: capability
status: accepted
revision: 1
summary: Prefetch configured hot keys without blocking requests
created: 2026-07-12
updated: 2026-07-12
supersedes: []
superseded_by: null
---
# Background Cache Warming

## Problem

Cold service instances produce avoidable misses.

## Goal

Prefetch configured keys after startup.

## Boundary

Warming calls the cache public API and does not own admission or eviction selection.

## Acceptance Criteria

Requests remain available while configured keys warm asynchronously.

## Revision History

- Revision 1: accepted warming flow.
