# Final Protocol Commands

The commands below were rerun against the final temporary tree and preserve the Protocol order.

## 1. `python3 -B -m unittest discover -s tests`

- Executed command: `python3 -B -m unittest discover -s tests`
- Exit code: `0`

```text
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK
```

## 2. `node <hello-scholar-repo>/bin/hello-scholar.js docs check`

- Executed command: `node /xsb/hello-scholar/.worktrees/next-generation-skill/bin/hello-scholar.js docs check`
- Exit code: `1`

```text
docs check: specs 1, records 0, indexes 0, errors 1, notices 0
error invalid-enum hello-scholar/specs/feature-policy/SPEC-003-policy-precedence/tasks.md: approval has unsupported value pending-approval
docs check failed with 1 error
```
