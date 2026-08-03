---
schema: 1
kind: plan
spec: SPEC-003
spec_revision: 1
revision: 1
status: approved
title: Brace Escape Parser Correction
summary: Add narrow lookarounds and regression coverage without changing the public API.
created: 2026-08-01
updated: 2026-08-01
---

# Brace Escape Parser Correction

## 1. Implementation Goal

Make escaped braces literal and retain current extraction behavior.

## 2. Scope

### Included

One regex correction and focused tests.

### Excluded

Tokenizer design and renderer changes.

## 3. Technical Approach

Add opening and closing negative brace lookarounds to the existing pattern.

## 4. Affected Modules

The parser and its test file only.

## 5. File Change Scope

### Add

No files.

### Modify

`src/localization_parser/parser.py` and `tests/test_parser.py`.

### Move or Migrate

None.

### Delete

None.

### Must Not Touch

Public type, dependency set, Spec, and Architecture.

## 6. Interface Changes

No public signature change.

## 7. Implementation Stages

Correct the pattern, add regression coverage, and run the suite.

## 8. Test Strategy

Cover mixed escaped and ordinary placeholders plus existing order/de-duplication.

## 9. Migration Order

No migration.

## 10. Cleanup

No old path or compatibility branch is introduced.

## 11. Rollback

Revert parser and tests together.

## 12. Tasks Generation Rules

Use one serial local Task; Worktree isolation is not required.
