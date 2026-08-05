---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-29
---
# Current Architecture

`src/cache-policy.js` owns synchronous LRU admission and eviction. `SPEC-003` owns policy evolution; `SPEC-008` owns background warming and may consume the cache without selecting its eviction policy.
