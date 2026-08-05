# Project Rules

- `SPEC-017` revision 3 is the accepted contract for the archive change.
- Preserve the public `export_events` result fields and the public reader interface.
- `src/event_schema.py`, `clients/replay_job.py`, package dependencies, and `hello-scholar/architecture.md` are outside the implementation boundary defined by the Spec.
- Run Python verification without writing bytecode into the project tree.
