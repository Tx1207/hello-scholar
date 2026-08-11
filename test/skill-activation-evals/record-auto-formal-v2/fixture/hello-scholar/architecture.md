---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-28
---
# Current Architecture

`src/cache_model.py` owns an in-memory LRU admission model. Formal acceptance uses the committed request trace and configuration through `scripts/benchmark_cache.py`; benchmark evidence is not part of runtime behavior.
