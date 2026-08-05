# Session Token Service Rules

- Read token and audit Specs, runtime code, and tests before assigning design identity.
- A model that removes the current token-store lookup is a lifecycle decision, not a naming change.
- New or successor Spec creation requires a classification proposal and explicit user approval before writes.
- Creation approval leaves the new Spec `draft`; acceptance is separate.
- Supersession relations are reciprocal and acyclic. Generated Indexes are CLI-owned. Run `npm test` after docs work.
