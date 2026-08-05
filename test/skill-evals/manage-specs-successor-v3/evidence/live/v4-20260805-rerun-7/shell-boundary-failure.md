# Invalid Evaluator Shell Boundary

This attempt is diagnostic only and is not a Formal Eval pass or fail.

The Implementer correctly read and wrote only the isolated Fixture through file tools. However, its later standalone Bash calls ran from the parent Claude Code worktree because shell invocations do not inherit a prior `cd`. The `docs sync` command therefore modified the parent `runs/INDEX.md`, and `npm test` did not execute as valid Fixture evidence.

No Reviewer was launched and no Scorecard was created. The replacement run requires every shell command to use explicit `env -C <fixture> ...` or an equivalent working-directory argument.
