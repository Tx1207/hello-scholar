---
schema: 1
kind: spec
id: SPEC-420
title: Eval Score Normalization
topic: agent-evaluation
type: capability
status: accepted
revision: 2
summary: Normalize observed dimensions before applying stable configured weights.
created: 2026-07-15
updated: 2026-07-30
supersedes: []
superseded_by: null
---

# Eval Score Normalization

## Contract

Normalize raw scores into `[0, 1]`, reject invalid maxima, require every weighted dimension, and preserve stable configured weights.

## Revision History

- Revision 1 introduced bounded normalization.
- Revision 2 requires a clear error for a missing weighted dimension.
