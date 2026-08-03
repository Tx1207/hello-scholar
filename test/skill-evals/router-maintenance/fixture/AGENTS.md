# Research Document Index Rules

- Core documents and code are current facts; generated Index files are derived navigation only.
- Rebuild generated Index files with the repository-provided hello-scholar CLI, never by hand.
- An Index-only request may change only generated `INDEX.md` files and must be idempotent on a second sync.
- Do not create a Spec, Run, Architecture proposal, or recovery report for Index maintenance.
- Run Python tests from the project root and report exact command status.
