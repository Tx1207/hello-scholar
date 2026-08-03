# Project Rules

- Read `README.md`, `docs/refactor-history.md`, `data/flags.json`, and all callers before making compatibility claims.
- Run `python3 -B -m unittest discover -s tests` before judging the current model.
- Treat only documented imports and persisted data as public contracts; do not infer one from a class name alone.
- Direction reviews are read-only and must stop before implementation planning.
