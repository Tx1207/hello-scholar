---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-30
---
# Current Architecture

`src/ranking.py` owns relevance scoring. Intent-aware score weights are governed by `SPEC-001`; post-ranking source diversity is governed independently by `SPEC-004`.
