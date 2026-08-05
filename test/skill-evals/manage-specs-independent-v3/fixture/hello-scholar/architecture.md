---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-27
---
# Current Architecture

`src/retrieval_api.py` exposes single-document lookup. Ranking is an internal result-order concern under `SPEC-002`; request tracing is an operational concern under `SPEC-009`. No batch route exists.
