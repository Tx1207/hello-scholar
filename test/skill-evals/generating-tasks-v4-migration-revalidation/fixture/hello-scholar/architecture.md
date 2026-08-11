---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-31
---
# Current Architecture

`src/config-store.js` owns profile serialization and compatibility reads. `src/cli.js` exposes profile inspection and writes. Active profiles live under `config/profiles/`, while `config/migration-state.json` records whether legacy reads remain enabled. The legacy properties codec is a local vendored package so this project and its tests do not require network access.
