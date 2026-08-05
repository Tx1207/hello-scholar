---
schema: 1
kind: plan
spec: SPEC-007
spec_revision: 1
revision: 1
status: approved
title: Exact V1 Key Validation
summary: Add focused exact-key validation without changing valid CLI output.
created: 2026-08-01
updated: 2026-08-01
---

# Exact V1 Key Validation

## 1. Implementation Goal

Reject unknown version-1 keys before output and preserve all valid behavior.

## 2. Scope

### Included

One validation branch and focused unit coverage.

### Excluded

Nested schemas, warnings, and compatibility modes.

## 3. Technical Approach

Compare input keys with one constant allowed set before current field validation and projection.

## 4. Affected Modules

`src/config_upgrader.py` and `tests/test_config_upgrader.py`.

## 5. File Change Scope

### Add

No files.

### Modify

The upgrader and its tests.

### Move or Migrate

None.

### Delete

None.

### Must Not Touch

Spec, valid sample, and CLI output shape.

## 6. Interface Changes

Invalid unknown-key inputs now raise `ValueError`; valid output is unchanged.

## 7. Implementation Stages

Prove the missing behavior, add minimal validation, and verify all behavior.

## 8. Test Strategy

Use a focused unit test and full suite under explicit TDD.

## 9. Migration Order

No data migration.

## 10. Cleanup

No compatibility path is introduced.

## 11. Rollback

Revert test and implementation together.

## 12. Tasks Generation Rules

Keep exact-key validation as one serial TDD Task.
