---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-31
---
# Current Architecture

`src/retrieval-service.js` serves one document lookup. `clients/export-client.js` loops over that public method and owns per-ID retry today. `SPEC-007` owns replica-read consistency; `SPEC-013` owns request-rate enforcement. No batch contract exists.
