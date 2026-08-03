---
schema: 1
kind: plan
spec: SPEC-310
spec_revision: 2
revision: 1
status: completed
title: Hybrid Retrieval Implementation
summary: Add vector evidence and internal publication filtering without changing the public call shape.
created: 2026-07-20
updated: 2026-07-29
---

# Hybrid Retrieval Implementation

Keep the in-process module boundary, move publication filtering into the retriever, combine lexical and vector evidence with fixed accepted weights, and verify recall through one formal Eval.
