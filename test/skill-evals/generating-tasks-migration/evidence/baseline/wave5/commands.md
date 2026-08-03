# Final Protocol Commands

The commands below were rerun against the final temporary tree and preserve the Protocol order.

## 1. `npm test`

- Executed command: `npm test`
- Exit code: `0`

```text
tests 5
pass 5
fail 0
```

## 2. `node <hello-scholar-repo>/bin/hello-scholar.js docs check`

- Executed command: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs check`
- Exit code: `1`

```text
docs check: specs 1, records 0, indexes 0, errors 5, notices 0
error invalid-enum hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md: status has unsupported value proposed
error missing-field hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md: tasks requires field approval
error missing-field hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md: tasks requires field approved_revision
error missing-field hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md: tasks requires field revision
error missing-field hello-scholar/specs/config-format/SPEC-014-json-config-migration/tasks.md: tasks requires field updated
docs check failed with 5 errors
```
