# Project Rules

- This repository validates policy bundles used by internal release tooling.
- Read `hello-scholar/` facts before describing a document problem.
- A request to check is read-only: never run `docs sync`, repair Front Matter, or update Revision bindings without a separate explicit request.
- Generated `INDEX.md` files are CLI-owned and must never be hand-edited.
- Run `python3 -m unittest discover -s tests` for runtime verification.
- Use `python3 scripts/verify_check_contract.py <hello-scholar-repo>` to verify the intentionally broken documentation state without changing it.
