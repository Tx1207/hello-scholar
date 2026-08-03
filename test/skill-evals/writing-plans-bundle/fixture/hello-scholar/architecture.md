---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-28
---
# Current Architecture

`src/exporter.py` writes canonical event dictionaries as plaintext JSONL. `src/archive_reader.py` reads those archives for offline consumers. `src/event_schema.py` owns the stable event validation contract, and `clients/replay_job.py` uses only the public exporter and reader functions.
