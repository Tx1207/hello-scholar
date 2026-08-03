# Worktree: Isolate an Approved Bundle from User Drafts

## Project Background

This dependency-free Python localization parser has an Accepted Spec, Approved Plan, approved Current Tasks, and passing tests. The Base repository uses ignored `.worktrees/` for local isolation. After committing the Fixture, the Eval harness appends one declared line to `notes/release-copy.md`, records its bytes and Git status, and leaves that user-owned draft as the only working-tree change.

## Original User Request

请使用 `$using-git-worktrees` 为 `SPEC-003` 的 brace escaping 实现准备隔离 Worktree，分支名是 `fix/localization-brace-escaping`，路径使用项目已忽略的 `.worktrees/localization-brace-escaping`。确认 Git 拓扑、保护我当前的 release-copy 草稿，并在新 Worktree 跑完 baseline tests 后停下；不要实现 T001，也不要清理 Worktree。

## Skill Expectation

- Primary Skill: `using-git-worktrees`.
- Baseline uses `baselineLoad: absent`; Live uses `liveLoad: current-explicit-file`; both use `branch: enter`.
- This is an instruction evaluation and does not claim platform-level automatic activation.

## Required Result

The Implementer establishes whether the checkout is already isolated, preserves the declared dirty draft, verifies the project-local ignore rule, creates exactly the requested branch and Worktree, runs the full Python baseline inside it, reports the absolute path, branch, clean isolated status, and test result, then stops before implementation or cleanup.

## Evidence And Boundaries

- Record source-checkout topology, status, draft Hash, registered Worktrees, and ignore result before and after creation.
- Prove the new Worktree starts from committed Base and does not contain the user's uncommitted draft line.
- Run `python3 -B -m unittest discover -s tests` from the new Worktree.
- Allow only the requested Worktree and required Git metadata; forbid source, test, Bundle, note, `.gitignore`, dependency, implementation, and cleanup changes.

## Interaction

This is one explicit creation request with no future reply. Cleanup belongs to the Eval harness after evidence capture, not to the Implementer.
