---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-31
---
# Current Architecture

`src/token-store.js` issues opaque tokens and resolves each token through an in-memory store. `SPEC-005` owns token identity and validation. `SPEC-011` owns audit events independently of token representation.
