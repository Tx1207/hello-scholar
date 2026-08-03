---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-08-01
---

# Current Architecture

## 1. System Goal

Extract placeholder names from localization strings for build-time validation.

## 2. Project Structure

Production code is under `src/localization_parser/`; deterministic tests are under `tests/`.

## 3. Current Modules

`localization_parser.parser` owns one regular expression and `extract_placeholders`.

## 4. Current Technical Choices

The implementation uses Python's standard `re` module and has no third-party dependency.

## 5. Current Runtime Flow

The parser finds names, removes duplicates through insertion order, and returns a tuple.

## 6. File And Runtime Artifact Locations

Code and tests remain in their existing directories; this library creates no runtime artifact.

## 7. Current Constraints

The public tuple return type and first-seen ordering are stable.

## 8. Technical Debt

Double-brace escaping is documented but not yet implemented.

## 9. Design Sources

The current implementation predates `SPEC-003`; that Accepted Spec is a target, not current architecture.
