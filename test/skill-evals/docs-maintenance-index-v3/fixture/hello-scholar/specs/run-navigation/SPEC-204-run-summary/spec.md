---
schema: 1
kind: spec
id: SPEC-204
title: Deterministic Run Summary Navigation
topic: run-navigation
type: capability
status: accepted
revision: 1
summary: Render newest-first immutable Run summaries for dashboard navigation.
created: 2026-07-22
updated: 2026-07-31
supersedes: []
superseded_by: null
---

# Deterministic Run Summary Navigation

## Contract

Run summaries are ordered newest-first, use Run ID as a stable tie break, and never mutate caller input.

## Evidence

`src/run-summary.js` and `test/run-summary.test.js`.
