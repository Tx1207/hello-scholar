# Retrieval API Rules

- Inspect public routes, tests, and current Specs before assigning a new capability to a document identity.
- New public endpoints require an independently reviewable acceptance, rollout, and rollback boundary.
- Do not write a new Spec until the user approves the proposed identity classification.
- A creation decision leaves the new Spec in `draft`; acceptance is a later decision.
- Generated Indexes come only from the absolute hello-scholar CLI. Run all Python tests after docs work.
