---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-30
---
# Current Architecture

`src/pipeline.py` creates lexical candidates, estimates query confidence, applies a bounded feature reranker, and returns stable score order. `SPEC-006` owns confidence routing and blending. `SPEC-014` owns freshness of feature snapshots.
