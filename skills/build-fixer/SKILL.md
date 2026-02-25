---
name: build-fixer
description: Incrementally fixes Python type and lint errors using mypy, ruff, and pytest with a safe one-at-a-time approach.
tags: [Python, Linting, Type Checking, Testing, Development]
---

# Build Fixer

Incrementally fix Python type and lint errors, one at a time for safety.

## Instructions

1. **Run Checks**
   - `mypy src/` (type checking)
   - `ruff check .` (linting)
   - `pytest` (tests)

2. **Parse Error Output**
   - Group errors by file
   - Sort by severity (errors first, then warnings)

3. **For Each Error**
   - Show error context (5 lines before and after)
   - Explain the issue clearly
   - Propose a fix
   - Apply the fix
   - Re-run the relevant check
   - Verify the error is resolved

4. **Stop Conditions**
   - Fix introduces new errors
   - Same error persists after 3 attempts
   - User requests pause

5. **Show Summary**
   ```
   Build Fix Summary
   =================
   Errors fixed: X
   Errors remaining: Y
   New errors introduced: Z
   ```

## Safety Rules

- Fix one error at a time to minimize risk
- Always re-run checks after each fix
- Roll back if a fix introduces new errors
- Never apply bulk fixes without verification
