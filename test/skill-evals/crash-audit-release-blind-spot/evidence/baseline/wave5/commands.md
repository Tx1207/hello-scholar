# Final Protocol Commands

The commands below were rerun against the final temporary tree and preserve the Protocol order.

## 1. `node --test`

- Executed command: `node --test`
- Exit code: `0`

```text
pass 2
fail 0
```

## 2. `node src/cli.js fixtures/persisted-v1.json`

- Executed command: `node src/cli.js fixtures/persisted-v1.json`
- Exit code: `0`

```json
{"version":2,"endpoint":"https://research.internal.example","retries":4}
```

## 3. `git diff --exit-code`

- Executed command: `git diff --exit-code`
- Exit code: `0`
- Output: no working-tree diff.
