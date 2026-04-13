---
name: checkpoint-manager
description: Creates, verifies, and lists workflow checkpoints for tracking development progress via git snapshots.
tags: [Git, Workflow, Checkpoint, Development]
---

# Checkpoint Manager

Create, verify, and list workflow checkpoints to track development progress.

## Operations

### Create Checkpoint

When creating a checkpoint:

1. Run a quick verification to ensure current state is clean
2. Create a git stash or commit with checkpoint name
3. Log checkpoint to `hello-scholar/checkpoints.log`:
   ```bash
   mkdir -p hello-scholar
   echo "$(date +%Y-%m-%d-%H:%M) | $CHECKPOINT_NAME | $(git rev-parse --short HEAD)" >> hello-scholar/checkpoints.log
   ```
4. Report checkpoint created

### Verify Checkpoint

When verifying against a checkpoint:

1. Read checkpoint from log
2. Compare current state to checkpoint:
   - Files added since checkpoint
   - Files modified since checkpoint
   - Test pass rate now vs then
   - Coverage now vs then
3. Report:
   ```
   CHECKPOINT COMPARISON: $NAME
   ============================
   Files changed: X
   Tests: +Y passed / -Z failed
   Coverage: +X% / -Y%
   Build: [PASS/FAIL]
   ```

### List Checkpoints

Show all checkpoints with:
- Name
- Timestamp
- Git SHA
- Status (current, behind, ahead)

## Typical Workflow

```
[Start] --> create "feature-start"
   |
[Implement] --> create "core-done"
   |
[Test] --> verify "core-done"
   |
[Refactor] --> create "refactor-done"
   |
[PR] --> verify "feature-start"
```

## Options

- `create <name>` - Create named checkpoint
- `verify <name>` - Verify against named checkpoint
- `list` - Show all checkpoints
- `clear` - Remove old checkpoints (keeps last 5)
