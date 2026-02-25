---
name: git-push
description: Commits and pushes changes to GitHub remote repository using Conventional Commits format.
tags: [Git, GitHub, Push, Development, Workflow]
---

# Git Push

Commit uncommitted changes and push to remote GitHub repository. Handles the complete flow: stage, commit, and push.

## Instructions

1. **Check Git Status**
   - Run `git status`
   - Show all uncommitted changes

2. **Analyze Changes**
   - Review changed files
   - Determine commit type (feat/fix/docs/refactor/test/chore)
   - Determine scope (affected module/component)

3. **Create Commit Message**
   Follow Conventional Commits format:
   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation update
   - `refactor`: Code refactoring
   - `perf`: Performance optimization
   - `test`: Test related
   - `chore`: Other changes

4. **Stage and Commit**
   - Run `git add` for affected files
   - Create commit with formatted message
   - Include `Co-Authored-By: Claude <noreply@anthropic.com>` in footer

5. **Push to Remote**
   - Run `git push`
   - If rejected, pull with rebase first:
     ```bash
     git pull --rebase origin $(git branch --show-current)
     git push
     ```

6. **Verify Success**
   - Show commit SHA
   - Show remote branch status

## Options

- `--amend` - Amend last commit instead of creating new one
- `--no-verify` - Skip pre-commit hooks
- Custom commit message can be provided directly in `<type>(<scope>): <message>` format

## Integration

This skill uses the same Conventional Commits format as git-commit but focuses on the complete flow: stage, commit, and push.
