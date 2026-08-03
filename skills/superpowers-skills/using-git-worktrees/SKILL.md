---
name: using-git-worktrees
description: Worktree isolation only when the user explicitly requests a Git worktree, an Approved Task explicitly requires a Worktree Process, or the user explicitly approves an Agent's concrete isolation-risk recommendation.
---

# Using Git Worktrees

## Entry Gate

Enter only with one of these explicit authorizations:

1. **Explicit user request:** The user clearly asks for a Git worktree or an isolated workspace.
2. **Approved Task requirement:** An Approved Task explicitly says to use a **Worktree Process**.
3. **Approved risk recommendation:** The Agent states a concrete isolation risk, such as changing a user-dirty checkout or a branch used by parallel work, and the user explicitly approves the recommendation.

An ordinary Plan, Task, Feature, or Validation label is not authorization. If none applies, return to the current Task flow without running Git commands from this skill. Do not ask about or create a worktree merely because the work is implementation-shaped.

For a concrete risk recommendation that has not yet been approved, state the specific risk and ask whether to prepare an isolated worktree. Wait for an explicit answer. Approval activates authorization 3; a refusal returns to the current Task flow without creation.

An explicit user request, an Approved Task requirement, and an approved risk recommendation already provide creation consent. Do not ask one of these paths for the same consent again.

When authorized, prepare an isolated Git workspace. **Core order:** Detect existing isolation first -> choose mechanism -> prepare -> verify.

## Scope and Exit

This skill ends when an isolated workspace is usable and its baseline status is known. It does not implement the feature, commit, merge, clean up, or remove a worktree.

After this skill exits, follow the current AGENTS and Task requirements for implementation and verification. No-worktree, declined isolation, or a blocked creation never waives required tests. Cleanup requires separate explicit authorization and real provenance for the workspace and branch.

## Step 0: Detect Existing Isolation

Run this step only after the Entry Gate authorizes isolation. Before creating anything, capture the repository topology and source-checkout state:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
SUPERPROJECT=$(git rev-parse --show-superproject-working-tree 2>/dev/null || true)
git status --short
git worktree list --porcelain
```

**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside a submodule. If `SUPERPROJECT` is non-empty, treat the current repository as a normal checkout; do not infer an existing linked worktree from that comparison alone.

- If `GIT_DIR != GIT_COMMON` and `SUPERPROJECT` is empty, the current directory is already a linked worktree. Report its absolute path and branch, or report detached HEAD as externally managed. Do not create a nested worktree; continue with Step 2.
- Otherwise, report that this is a normal checkout and continue with Step 1.

**Completion criterion:** Record the normal-checkout, linked-worktree, detached-HEAD, or submodule result; preserve the source checkout's status for comparison after creation.

## Step 1: Choose Mechanism

Skip this step when Step 0 found an existing linked worktree.

### 1a. Native Worktree Tool

Use a platform-native worktree tool first when one is actually available, such as `EnterWorktree`, `WorktreeCreate`, a `/worktree` command, or a supported worktree flag. The Entry Gate already supplies creation consent; do not ask the same question again.

Let the native tool own its managed path and branch setup. Do not use `git worktree add` beside an available native tool, because that creates state the harness cannot manage.

**Completion criterion:** Record the native tool's resulting absolute path and branch, then continue with Step 2.

### 1b. Git Worktree Fallback

Use this fallback only when no native worktree tool is available. Choose the directory in this order:

1. A directory explicitly required by the user, current Task, or project instructions.
2. Existing `.worktrees/` (preferred when both local directories exist).
3. Existing `worktrees/`.
4. Existing legacy global directory `~/.config/superpowers/worktrees/<project>/`.
5. Otherwise, `.worktrees/` at the project root.

For a project-local directory, verify the selected directory itself is ignored before creation:

```bash
git check-ignore -q "$LOCATION"
```

If that check fails, explain that adding the directory to `.gitignore` is an extra project change and wait for explicit authorization. Do not edit `.gitignore` or commit it automatically. After authorized editing, rerun the ignored check. A global directory does not need this repository check.

When the ignore gate passes, create and inspect the fallback worktree from the repository root:

```bash
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"
mkdir -p "$LOCATION"
git worktree add "$LOCATION/$BRANCH_NAME" -b "$BRANCH_NAME"
git worktree list --porcelain
git -C "$LOCATION/$BRANCH_NAME" rev-parse --show-toplevel
git -C "$LOCATION/$BRANCH_NAME" branch --show-current
```

If `git worktree add` is blocked by sandbox permissions or another error, report the exact block and do not claim isolation is ready. Return to the current Task flow and wait for direction before working in place.

**Completion criterion:** The selected mechanism reports an absolute isolated path and branch; for the fallback, `git worktree list --porcelain` and the new worktree's Git commands confirm the registered workspace.

## Step 2: Prepare the Isolated Workspace

Work only in the linked, native-created, or fallback-created workspace. Confirm its path and Git state, and compare the source checkout with the status captured in Step 0. Do not stage, overwrite, or commit source-checkout changes.

Auto-detect only setup required by project facts:

```bash
# Node.js
if [ -f package.json ]; then npm install; fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

If setup fails, report the command and result, then ask whether to investigate or continue. Do not represent a failed setup as ready.

**Completion criterion:** The isolated workspace path, branch state, source-checkout preservation, and every applicable setup result are known.

## Step 3: Verify the Baseline

Run the project's appropriate baseline command from the isolated workspace, for example:

```bash
npm test / cargo test / pytest / go test ./...
```

If baseline tests fail, stop, report the failing command and result, and ask whether to investigate or continue. Do not claim the workspace is ready. If no project baseline can be identified, report that status and ask before declaring completion.

**Completion criterion:** The baseline result is explicitly known. Declare the workspace ready only when the isolated path is usable and the baseline passes.

## Quick Reference

| Situation | Action |
|---|---|
| User explicitly requests isolation | Enter; do not repeat the consent question |
| Approved Task explicitly requires a Worktree Process | Enter; do not repeat the consent question |
| Concrete risk, not yet approved | State risk, ask, and wait without creating |
| Ordinary Plan, Task, Feature, or Validation | Stay in the current Task flow; run no Git commands from this skill |
| Already in linked worktree | Preserve it; skip creation |
| Detached HEAD in linked worktree | Report externally managed state; skip creation |
| In a submodule | Apply the submodule guard before classifying isolation |
| Native tool available | Use it before Git fallback |
| Project-local fallback | Verify the selected directory is ignored |
| Ignore check fails | Request separate authorization for the `.gitignore` change |
| Sandbox blocks creation | Report the block; do not claim ready |
| Baseline fails | Stop, report, and ask |

## Common Mistakes

### Treating task shape as consent

- **Problem:** Starting isolation because a Plan or feature looks like implementation work.
- **Fix:** Require one Entry Gate authorization; a concrete risk needs explicit approval.

### Fighting the harness

- **Problem:** Using `git worktree add` when a native worktree tool is available.
- **Fix:** Choose the native tool first and use the fallback only when it is unavailable.

### Nesting or misclassifying isolation

- **Problem:** Creating another worktree in a linked worktree or confusing a submodule for one.
- **Fix:** Run Step 0 first, including the superproject guard.

### Bypassing the ignore gate

- **Problem:** Creating a project-local worktree without proving its selected directory is ignored.
- **Fix:** Run `git check-ignore -q "$LOCATION"`; obtain separate authorization before any `.gitignore` edit.

### Hiding an unknown baseline

- **Problem:** Reporting ready after a setup, sandbox, or baseline failure.
- **Fix:** Report the observed command result and stop for direction.
