# 基础 Command 示例

以下示例都按“写给 Claude 的指令”来写，而不是写给用户的说明。

## Example 1: Code Review Command

**File:** `.codex/commands/review.md`

```markdown
---
description: Review code for quality and issues
allowed-tools: Read, Bash(git:*)
---

Review the code in this repository for:
- code quality
- potential issues
- best practices

Provide specific feedback with file and line references.
```

## Example 2: Security Review Command

```markdown
---
description: Review code for security vulnerabilities
allowed-tools: Read, Grep
model: sonnet
---

Perform security review checking for:
- SQL injection
- XSS
- authentication / authorization issues
- hardcoded secrets
```

## Example 3: Test Command with File Argument

```markdown
---
description: Run tests for specific file
argument-hint: [test-file]
allowed-tools: Bash(npm:*), Bash(jest:*)
---

Run tests for $1:
!`npm test $1`

Analyze failures and suggest fixes.
```

## Example 4: Documentation Generator

```markdown
---
description: Generate documentation for file
argument-hint: [source-file]
---

Generate documentation for @$1 including:
- purpose
- API documentation
- usage examples
- edge cases
```

## Example 5: Git Status Summary

```markdown
---
description: Summarize Git repository status
allowed-tools: Bash(git:*)
---

Current Branch: !`git branch --show-current`
Status: !`git status --short`
Recent Commits: !`git log --oneline -5`
```

## Common Patterns

### Read-Only Analysis

```markdown
---
allowed-tools: Read, Grep
---

Analyze but don't modify...
```

### Single Argument

```markdown
---
argument-hint: [target]
---

Process $1...
```

### Multiple Arguments

```markdown
---
argument-hint: [source] [target] [options]
---

Process $1 to $2 with $3...
```

### Context Gathering

```markdown
---
allowed-tools: Bash(git:*), Read
---

Context: !`git status`
Files: @file1 @file2
Analyze...
```

## Tips

1. 先写最简单版本。
2. frontmatter 只在需要时增加。
3. 每加一个能力就测试一次。
4. 命名要直接表达用途。
5. 参数一定要写 `argument-hint`。
