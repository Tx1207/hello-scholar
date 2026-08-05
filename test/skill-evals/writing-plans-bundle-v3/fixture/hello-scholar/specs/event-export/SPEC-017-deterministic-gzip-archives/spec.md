---
schema: 1
kind: spec
id: SPEC-017
title: Deterministic gzip event archives
topic: event-export
type: capability
status: accepted
revision: 3
summary: Replace plaintext JSONL writes with deterministic gzip archives while preserving the public export contract and legacy reads
created: 2026-05-12
updated: 2026-07-28
supersedes: []
superseded_by: null
---
# Deterministic Gzip Event Archives

## Problem

Plaintext JSONL archives consume unnecessary storage, while ad hoc gzip settings produce different bytes for the same events and complicate replay verification.

## Goals

- Make new archives deterministic gzip files.
- Preserve the public `export_events(events, destination) -> ExportResult` contract and event schema.
- Read both legacy `.jsonl` and current `.jsonl.gz` archives during one compatibility release.

## Non-goals

Object storage, encryption, schema evolution, parallel compression, and changing the replay job interface are excluded.

## Current State

`src/exporter.py` writes one canonical JSON object per line through `_write_plaintext`. `src/archive_reader.py` accepts only UTF-8 plaintext. `clients/replay_job.py` calls the two public functions without inspecting encoding internals.

## Accepted Design

Add `src/gzip_archive.py` as the only gzip encoding/decoding owner. New writes use gzip level 6, `mtime=0`, UTF-8, sorted JSON keys, compact separators, and one trailing newline. `export_events` keeps its signature and `ExportResult` shape, but requires a `.jsonl.gz` destination. `read_events` selects the decoder only from `.jsonl` or `.jsonl.gz`; malformed gzip and unsupported suffixes raise `ExportFormatError`.

During one compatibility release, the reader accepts both suffixes and the writer emits only gzip. Existing archive fixtures migrate to `.jsonl.gz`, while one immutable legacy fixture remains as the regression proof. Once caller search and the full compatibility matrix are green, delete `_write_plaintext`; do not retain a writer flag or two formal writer paths.

## Public Interface

- `export_events(events, destination) -> ExportResult` keeps its name, arguments, return type, `path`, `event_count`, and `byte_count` fields.
- `read_events(path) -> list[dict]` keeps its name and return shape.
- `ExportFormatError` is the stable error for malformed gzip and unsupported archive suffixes.

## File Boundary

- Add `src/gzip_archive.py` and `tests/test_gzip_archive.py`.
- Modify `src/exporter.py`, `src/archive_reader.py`, `tests/test_exporter.py`, `tests/test_archive_reader.py`, and archive fixtures.
- Migrate replay fixtures to `.jsonl.gz` but preserve one legacy `.jsonl` fixture.
- Delete `_write_plaintext` after the removal gate.
- Must not modify `src/event_schema.py`, `clients/replay_job.py`, public result fields, package dependencies, or Architecture in this implementation unit.

## Acceptance Criteria

- AC-1: Identical canonical events produce byte-identical gzip archives across repeated runs, including a zero gzip timestamp.
- AC-2: The public exporter signature and all `ExportResult` fields remain compatible, and new writes use only `.jsonl.gz`.
- AC-3: The reader returns identical events from the preserved legacy fixture and its migrated gzip equivalent.
- AC-4: Malformed gzip and unsupported suffixes raise `ExportFormatError` without a partial successful result.
- AC-5: `_write_plaintext`, a writer mode flag, and all non-regression plaintext writer fixtures are absent after the caller and test gates pass.
- AC-6: The full unit suite and replay-client contract tests pass without a new dependency.

## Test And Experiment Strategy

Use deterministic unit tests for byte identity, headers, round trips, legacy reads, errors, public compatibility, and cleanup. No formal experiment or performance benchmark is required.

## Migration And Cleanup

Land the codec and dual-format reader first, switch the existing writer, migrate fixtures, run the reader/writer compatibility matrix and `clients/` caller search, then delete the old writer. The compatibility reader remains for one release; the plaintext writer does not.

## Rollback

Revert codec, writer, reader, tests, and migrated fixtures together. Restoring the previous plaintext writer requires restoring the old fixture set in the same rollback; no persisted archive is deleted by this change.

## Revision History

- Revision 1: Proposed gzip output.
- Revision 2: Fixed the public result and reader compatibility contracts.
- Revision 3: Accepted deterministic encoding settings, exact migration gate, cleanup, error behavior, and rollback boundary.
