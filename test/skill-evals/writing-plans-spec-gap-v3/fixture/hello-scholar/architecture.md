---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-27
---
# Current Architecture

`src/verify-signature.js` verifies one HMAC-SHA256 signature with one process secret. `server/webhook-handler.js` maps every verification failure to HTTP 401. `clients/webhook-client.js` sends `X-Webhook-Signature` and has no key identity concept.
