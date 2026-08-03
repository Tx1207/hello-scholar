# Access Policy Service Rules

- `SPEC-028` revision 3, its Current Approved Plan, and approved Current Tasks are the contract. Passing tests and checked boxes do not override those documents.
- A convergence audit reads the complete Bundle, runtime source, tests, callers, and persisted configuration, then distinguishes Missing, Partial, Contradictory, Unrequested, and cleanup debt with concrete evidence.
- Convergence is read-only unless the user separately asks to amend Tasks. Do not create an audit report or silently fix implementation.
- If the user later asks to add convergence work, append independently readable Tasks to the existing Bundle, move that semantic revision back to `pending-review`, and stop for review.
- Generate Indexes only with the absolute hello-scholar CLI. Run `npm test` and `docs check` from the project root.
