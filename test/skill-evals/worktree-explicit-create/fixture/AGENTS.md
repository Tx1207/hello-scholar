# Cache Key Project Rules

- Preserve user-owned dirty files and report their status before any Git topology change.
- Use `.worktrees/` for explicitly requested project-local Worktrees; it is already ignored.
- Prefer a real platform-native Worktree tool when available, otherwise use Git after safety checks.
- Run `node --test` in a newly prepared workspace before feature work.
- Worktree cleanup and branch deletion require separate authorization and provenance.
