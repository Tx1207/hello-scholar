---
schema: 1
kind: spec
id: SPEC-014
title: Complete the JSON v2 profile migration
topic: config-format
type: capability
status: accepted
revision: 3
summary: Migrate active profiles to JSON v2 then remove legacy write and read paths behind evidence gates
created: 2026-06-24
updated: 2026-07-30
supersedes: []
superseded_by: null
---
# Complete The JSON V2 Profile Migration

## Problem

The CLI writes JSON v2 by default, but one active profile remains in the legacy properties format. Compatibility reading, `--legacy-output`, `writeLegacyConfig`, and the vendored legacy codec keep the old persistence contract alive indefinitely.

## Goals

Finish the migration without losing a profile, prove canonical equivalence before cutover, and remove every legacy write and read path only after reversible evidence exists.

## Non-goals

Changing profile fields, adding remote storage, changing endpoint semantics, and supporting a third configuration format are excluded.

## Target Design

The only final persisted profile shape is UTF-8 JSON with exactly `version: 2`, a non-empty string `endpoint`, and a non-negative integer `retries`. During the migration window, the existing reader continues to normalize `.properties` and `.json` into that canonical object. Migration creates a byte-for-byte backup of each legacy source, writes and re-reads a temporary JSON target, compares the canonical objects, atomically renames the target, and records source path, target path, and SHA-256 values in `config/migration-manifest.json` before removing the active legacy source.

Cutover is allowed only when a recursive active-profile scan finds zero `.properties` files, every manifest target exists, and re-reading every target matches its recorded canonical values. After that gate, `config/migration-state.json` changes from `phase: dual-read` with `allowLegacyRead: true` to `phase: json-only` with `allowLegacyRead: false`. The compatibility reader then rejects `.properties`; the legacy writer, CLI flag, and local codec dependency are removed in the same cleanup release.

## Acceptance Criteria

- AC-1: New and migrated active profiles use only the exact JSON v2 shape and normal JSON writes remain readable by the public CLI.
- AC-2: Before cutover, both existing formats produce the same canonical object and malformed legacy input aborts without changing active profiles or backups.
- AC-3: A dry run reports planned source, target, and backup paths without writes; an applied migration backs up, validates, atomically installs, manifests, and only then removes each active legacy source. Re-running after success makes no changes.
- AC-4: The cutover gate fails if any active legacy file remains, any manifest target is missing, or canonical validation differs; the state changes to JSON-only only after all checks pass.
- AC-5: After cutover, `writeLegacyConfig`, `--legacy-output`, the properties branch in `readConfig`, `@fixture/legacy-properties-codec`, and its vendored files are absent, while unsupported legacy input fails with a clear error.
- AC-6: The final regression matrix covers JSON read/write, mixed-format compatibility before cutover, dry-run, successful and idempotent migration, corrupt-input preservation, each cutover failure, cleanup, and a rollback drill from backup.

## Migration And Cleanup

The checked-in `config/profiles/east.properties` is the required real migration input and `west.json` is the already-current control. Cleanup must not start on partial migration evidence. Package manifest, lockfile, source imports, CLI help, and tests must agree after dependency removal.

## Rollback

Before cleanup, leave the state in `dual-read`, retain the active legacy source, and remove only an uninstalled temporary target when validation fails. After cleanup, rollback first reverts the cleanup and cutover release so the legacy reader and codec exist again, then restores backed-up `.properties` files, changes the state back to `dual-read`, and runs the mixed-format suite. Backups and the migration manifest are retained until the rollback drill passes.

## Verification

Deterministic Node tests and CLI checks must exercise every acceptance criterion without network access.

## Revision History

- Revision 1: introduce JSON v2 writes.
- Revision 2: retain a compatibility reader during data conversion.
- Revision 3: accept the gated cutover, full legacy cleanup, regression, and rollback contract.
