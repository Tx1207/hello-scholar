---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-31
---
# Current Architecture

`src/access-policy.js` owns authorization decisions. `clients/http-handler.js` is the production HTTP adapter, while `config/policies.json` represents the persisted tenant-policy shape loaded by the service. Policy decisions are synchronous after the caller resolves one tenant policy.
