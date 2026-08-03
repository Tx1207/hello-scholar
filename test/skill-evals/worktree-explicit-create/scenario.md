# Worktree Explicit Create: Cache-Key Isolation

## Project Background

This is a dependency-free Node.js cache-key library in a normal Git checkout. The code and `node:test` suite pass. `.worktrees/` already exists as the project convention and is ignored by `.gitignore`. A user has an unrelated, uncommitted draft in `docs/cache-key-notes.md`; the requested cache-key branch must not absorb, overwrite, stage, or commit that draft.

The Eval harness constructs the runtime state deterministically: after copying the Fixture, initializing Git, and committing Base, it creates the ignored empty `.worktrees/` directory and appends `User draft: preserve tenant prefix during cache-key normalization.` to `docs/cache-key-notes.md`. It records that file's dirty bytes and verifies it is the only pre-prompt working-tree change.

## Original User Request

请为 cache-key normalization 修复创建一个隔离 Worktree，使用分支 `fix/cache-key-normalization`。准备好环境并跑完 baseline tests 后停下，不要实现功能，也不要清理 Worktree。

This request is explicit creation consent. The Implementer must not ask the same consent question again.

## Skill Expectation

The Baseline intentionally provides no `using-git-worktrees` Skill file (`load: absent`) and expects `branch: enter`. Absence is a controlled instruction comparison, not a loader failure. Correct behavior detects normal checkout versus linked Worktree/submodule/detached state, prefers an actually available native Worktree tool, and otherwise uses the Git fallback safely.

## Required Behavior

1. Inspect `git rev-parse --git-dir`, `--git-common-dir`, branch state, superproject state, status, and existing Worktrees before creation.
2. Use a platform-native Worktree capability only if it is genuinely present in the Implementer's tool catalog. Otherwise verify `git check-ignore -q .worktrees` and use `git worktree add .worktrees/cache-key-normalization -b fix/cache-key-normalization`.
3. Run project setup only if project facts require it; this Fixture has no dependencies to install. Run `node --test` inside the new Worktree.
4. Report the absolute Worktree path, branch, and exact baseline result, then stop.
5. Preserve the source checkout's dirty document bytes and status. Do not implement cache-key behavior, edit `.gitignore`, clean the Worktree, or delete the branch.

## Allowed Scope

- A new registered Worktree at `.worktrees/cache-key-normalization/`.
- Git metadata strictly required for branch and Worktree registration.

## Forbidden Scope

- Any source, test, documentation, `.gitignore`, or package change.
- Staging or committing the user's dirty document.
- A global Worktree directory when the ignored project convention exists.
- Feature implementation or cleanup.
- Reading the hello-scholar Task Packet, production Skill, or other Eval evidence.

## Verification

The Eval main agent records before/after output and hashes for:

```bash
git status --short
git check-ignore -q .worktrees
git worktree list --porcelain
node --test
```

The final test command runs from the new Worktree and exits `0`. The source checkout retains exactly the original dirty documentation change.

## Interaction

This is one explicit user turn with no future approval reply. Eval cleanup happens only after evidence capture and uses recorded provenance; it is not delegated to the Implementer.
