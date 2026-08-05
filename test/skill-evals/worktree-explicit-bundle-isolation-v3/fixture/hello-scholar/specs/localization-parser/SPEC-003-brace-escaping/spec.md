---
schema: 1
kind: spec
id: SPEC-003
title: Ignore Escaped Localization Braces
topic: localization-parser
type: engineering
status: accepted
revision: 1
summary: Treat double braces as literals while preserving ordered placeholder extraction.
created: 2026-08-01
updated: 2026-08-01
supersedes: []
superseded_by: null
---

# Ignore Escaped Localization Braces

## 1. Problem

The current regex extracts the inner name from `{{name}}`, although double braces represent literal text.

## 2. Goal

Ignore escaped double-brace names and preserve ordinary ordered, unique extraction.

## 3. Non-Goals

Nested template syntax, formatting, and rendering are excluded.

## 4. Current State

One regex matches every single brace pair, including pairs nested inside double braces.

## 5. Target Design

A placeholder opening brace must not be preceded by `{`, and its closing brace must not be followed by `}`.

## 6. Implementation Boundary

### Allowed

The parser regex and focused tests.

### Forbidden

A new parser framework, dependency, or return type.

## 7. Interface And Data

`extract_placeholders(message: str) -> tuple[str, ...]` remains stable.

## 8. Invariants And Constraints

Names remain first-seen ordered and de-duplicated.

## 9. Options And Decision

Use regex lookarounds rather than introduce a tokenizer.

## 10. Acceptance Criteria

- AC-1: Double-brace names are ignored.
- AC-2: Ordinary names remain ordered and unique.

## 11. Verification

Focused regression and full `unittest` suite.

## 12. Migration And Cleanup

No migration or compatibility path is needed.

## 13. Rollback

Revert parser and test changes together.

## 14. Evidence

Implementation evidence is pending.

## 15. Revision History

- Revision 1: Accepted double-brace behavior.
