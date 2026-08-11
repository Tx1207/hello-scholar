# Config Format CLI Rules

- Treat the Accepted Spec as behavior scope and the Approved Plan as the fixed migration strategy.
- This request produces only the Bundle's `tasks.md`; do not migrate profiles, change the switch, delete compatibility code, approve Tasks, or implement anything.
- Every Task must be independently readable and name exact files, dependencies, commands, expected signals, and completion evidence.
- Preserve the Plan's migration, dual-read, cutover, cleanup, regression, and rollback gates. Do not infer a simpler happy path.
- The local legacy codec is vendored so initial tests run without network access. Do not run `npm install`.
- Generated Indexes are written only by the absolute hello-scholar CLI. Run `npm test` after document work.
