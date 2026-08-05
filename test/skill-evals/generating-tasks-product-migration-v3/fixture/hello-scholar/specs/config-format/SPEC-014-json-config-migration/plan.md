---
schema: 1
kind: plan
spec: SPEC-014
spec_revision: 3
revision: 2
status: approved
title: JSON v2 profile migration and legacy cleanup plan
summary: Prove dual-read equivalence migrate active data gate cutover remove legacy paths and drill rollback
created: 2026-07-30
updated: 2026-07-31
---
# JSON V2 Profile Migration And Legacy Cleanup Plan

## Source Of Truth

Implement `SPEC-014` revision 3. The final active persistence contract is JSON v2 only; the compatibility window and rollback evidence are temporary migration controls, not permanent APIs.

## Scope Boundary

### Add

- `src/migrate-config.js` with dry-run, apply, manifest, cutover verification, and restore operations.
- `test/migration.test.js` with isolated temporary profile directories and failure injection.
- `config/migration-manifest.json` as migration evidence after a successful applied conversion.
- `config/profiles/east.json` as the validated JSON v2 replacement for the active legacy profile.
- `.migration-backup/east.properties` as the retained byte-for-byte rollback input.

### Modify

- `src/config-store.js`: preserve dual reads through migration, then remove the properties branch after cutover.
- `src/cli.js`: expose `migrate`, `verify-cutover`, and `restore`; remove `--legacy-output` only at cleanup.
- `test/config-store.test.js` and `test/cli.test.js`: cover the compatibility window, final JSON-only behavior, and removed flag.
- `config/migration-state.json`: change to JSON-only only after cutover verification succeeds.
- `package.json` and `package-lock.json`: remove the local codec dependency only with cleanup.

### Delete

- `src/legacy-writer.js`, including exported symbol `writeLegacyConfig`.
- `vendor/legacy-properties-codec/package.json` and `vendor/legacy-properties-codec/index.js`.
- CLI option and help text for `--legacy-output`.
- `config/profiles/east.properties`, only after its backup, validated JSON target, and manifest entry are durable.

### Must Not Touch

- `hello-scholar/architecture.md`, this Spec, this Plan, endpoint values, profile field names, networking, or unrelated directories.

## Phases

1. **Migration preparation and compatibility proof:** Add isolated migration fixtures and `src/migrate-config.js`. Keep `allowLegacyRead: true`. Run `node --test test/config-store.test.js test/migration.test.js`; expect exit `0` with both legacy and JSON canonical-read cases passing. Run `node src/cli.js migrate config/profiles --dry-run --backup-dir .migration-backup`; expect `planned=1 current=1 errors=0` and an empty `git diff -- config .migration-backup`.
2. **Applied conversion while dual-read remains active:** Run the migration against `config/profiles`. For `east.properties`, parse the source, copy its original bytes to `.migration-backup/east.properties`, write `east.tmp.json`, re-read it through the JSON reader and compare the canonical object, rename it to `east.json`, append the manifest entry, and only then remove the active properties file. Expect `migrated=1 current=1 errors=0`. Re-run the same command; expect `migrated=0 current=2 errors=0` and no diff from the first successful result. If parsing, backup, write, comparison, rename, or manifest persistence fails, keep `migration-state.json` in `dual-read`, preserve or restore the active properties file, remove the temporary target, and stop before cutover.
3. **Cutover gate:** Run `node src/cli.js verify-cutover config/profiles --manifest config/migration-manifest.json`; expect `legacy=0 targets=1 mismatches=0 errors=0`. Tests must separately prove nonzero exit for one remaining `.properties` file, a missing target, and a canonical mismatch. Only the all-green command permits changing `config/migration-state.json` to `phase: json-only` and `allowLegacyRead: false`.
4. **Exact legacy cleanup:** With the successful migration output, cutover output, and rollback backup present, remove the properties branch and legacy codec import from `src/config-store.js`; remove `--legacy-output` parsing/help from `src/cli.js`; delete `src/legacy-writer.js`; remove `@fixture/legacy-properties-codec` from `package.json` and `package-lock.json`; delete both files under `vendor/legacy-properties-codec/`. Run `rg -n 'writeLegacyConfig|legacyCodec|legacyOutput|legacy-output|legacy-properties-codec' src/config-store.js src/cli.js package.json package-lock.json`; expect exit `1` with no old reader, writer, flag, import, or dependency matches. Run `test ! -e src/legacy-writer.js` and `test ! -e vendor/legacy-properties-codec`; expect exit `0` for both. Migration and rollback code may still name the legacy extension only to locate retained evidence; final tests may name the removed flag and extension only to assert their rejection. If any prerequisite evidence is absent or cleanup tests fail, restore these paths from the same change, leave the state at `dual-read`, and keep the active or backed-up legacy profile recoverable.
5. **Regression and rollback drill:** Preserve the phase 1 through phase 3 command outputs as the regression evidence for mixed-format reads, dry-run, applied and idempotent migration, corrupt-input preservation, and all three cutover failures. At the JSON-only result, run `npm test`; expect exit `0` for JSON read/write and CLI output, cutover state, unsupported legacy input, removed-flag rejection, and package cleanup. In a temporary Git worktree at the cleanup result, revert the cleanup/cutover change, run `node src/cli.js restore config/profiles --manifest config/migration-manifest.json --backup-dir .migration-backup`, expect `restored=1 errors=0`, verify `config/profiles/east.properties` canonical output, set state to `dual-read`, and run the saved mixed-format command from phase 1 with exit `0`. Do not mutate the primary worktree during this drill.

## Dependency And Parallel Rules

Preparation must complete before applied conversion; conversion must complete before cutover; cutover must complete before cleanup; cleanup must complete before final regression. Work that modifies `src/config-store.js`, `src/cli.js`, `config/migration-state.json`, active profiles, migration fixtures, `package.json`, or `package-lock.json` cannot run in parallel with another Task that writes the same file. Documentation is not an implementation workstream in this Plan.

## Rollback Gate

Do not delete `.migration-backup/east.properties` or `config/migration-manifest.json` in this Plan. A failed pre-cutover step returns to the original active properties file without changing state. A post-cleanup rollback first restores the cleanup/cutover code and dependency, then restores data and dual-read state, because JSON-only code cannot validate legacy bytes by itself.

## Tasks Generation Rules

Map every AC to at least one required Task. Keep migration preparation, compatibility evidence, applied conversion, cutover, exact cleanup, regression, and rollback independently reviewable where their prerequisites or failure recovery differ. Every deletion Task must name the exact symbol/path, prerequisite evidence, command and expected signal, and recovery action. Do not label Tasks parallel when they depend on one another or touch a shared reader, CLI, state, profile, package, lockfile, or test fixture. This Plan does not select TDD for any phase.
