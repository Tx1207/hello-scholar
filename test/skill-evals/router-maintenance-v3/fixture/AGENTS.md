# Research Document Index Rules

- Core documents and code are current facts; generated Index files are derived navigation only.
- Rebuild generated Index files with the repository-provided hello-scholar CLI, never by hand.
- A navigation-only update may change only generated `INDEX.md` files and must be idempotent on a second sync.
- Do not create a Spec, Run, Architecture proposal, or recovery report while restoring generated navigation.
- Run Python tests from the project root and report exact command status.
