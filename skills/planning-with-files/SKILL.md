---
name: planning-with-files
description: Transforms workflow to use Manus-style persistent markdown files for planning, progress tracking, and knowledge storage. Use when starting complex tasks, multi-step projects, research tasks, or when the user mentions planning, organizing work, tracking progress, or wants structured output.
version: 0.1.0
---

# Planning with Files

Work like Manus: Use persistent markdown files as your "working memory on disk."

## Quick Start

Before ANY complex task:

1. **Create a persistent plan on disk**
2. **Define phases and affected files**
3. **Update after each phase** - mark [x] and change status
4. **Read before deciding** - refresh goals in attention window

## Preferred hello-scholar Pattern

For hello-scholar projects, prefer a **plan package** under `hello-scholar/plans/<plan-id>/`:

| File | Purpose | When to Update |
|------|---------|----------------|
| `requirements.md` | Record goals, constraints, and non-goals | At plan start |
| `plan.md` | Explain approach, phases, and risk | Before implementation |
| `tasks.md` | Track concrete tasks, files, done criteria, verification | During execution |
| `contract.json` | Optional machine-readable execution contract | When verification/review rules matter |

`tasks.md` should explicitly contain:

- `涉及文件`
- `完成标准`
- `验证方式`

## Fallback 3-File Pattern

For generic repositories that do not use hello-scholar project assets, the older THREE-file pattern is still acceptable:

| File | Purpose | When to Update |
|------|---------|----------------|
| `task_plan.md` | Track phases and progress | After each phase |
| `notes.md` | Store findings and research | During research |
| `[deliverable].md` | Final output | At completion |

## Core Workflow

```
Loop 1: Create plan package with requirements + plan
Loop 2: Research → save notes/findings → update tasks.md
Loop 3: Execute → update tasks.md + verification notes
Loop 4: Deliver final output and close the plan
```

### The Loop in Detail

**Before each major action:**
```bash
Read task_plan.md  # Refresh goals in attention window
```

**After each phase:**
```bash
Edit task_plan.md  # Mark [x], update status
```

**When storing information:**
```bash
Write notes.md     # Don't stuff context, store in file
```

## hello-scholar Plan Package Template

Recommended structure:

```text
hello-scholar/
└─ plans/
   └─ <plan-id>/
      ├─ requirements.md
      ├─ plan.md
      ├─ tasks.md
      └─ contract.json
```

### `requirements.md`

```markdown
# Requirements: [Brief Description]

## Goal
[One sentence describing the end state]

## Constraints
- [Constraint]

## Non-goals
- [Explicitly excluded work]
```

### `tasks.md`

```markdown
# Tasks: [Brief Description]

- [ ] Task 1
  涉及文件: [file list]
  完成标准: [definition of done]
  验证方式: [test / review / evidence]
```

## Fallback `task_plan.md` Template

Create this file FIRST for any complex task:

```markdown
# Task Plan: [Brief Description]

## Goal
[One sentence describing the end state]

## Phases
- [ ] Phase 1: Plan and setup
- [ ] Phase 2: Research/gather information
- [ ] Phase 3: Execute/build
- [ ] Phase 4: Review and deliver

## Key Questions
1. [Question to answer]
2. [Question to answer]

## Decisions Made
- [Decision]: [Rationale]

## Errors Encountered
- [Error]: [Resolution]

## Status
**Currently in Phase X** - [What I'm doing now]
```

## notes.md Template

For research and findings:

```markdown
# Notes: [Topic]

## Sources

### Source 1: [Name]
- URL: [link]
- Key points:
  - [Finding]
  - [Finding]

## Synthesized Findings

### [Category]
- [Finding]
- [Finding]
```

## Critical Rules

### 1. ALWAYS Create Plan First
Never start a complex task without a persistent plan file or plan package. This is non-negotiable.

### 2. Read Before Decide
Before any major decision, read the active plan file(s). This keeps goals in your attention window.

### 3. Update After Act
After completing any phase, immediately update the active plan file(s):
- Mark completed phases with [x]
- Update the Status section
- Log any errors encountered

### 4. Store, Don't Stuff
Large outputs go to files, not context. Keep only paths in working memory.

### 5. Log All Errors
Every error goes in the "Errors Encountered" section. This builds knowledge for future tasks.

## When to Use This Pattern

**Use a persistent plan package for:**
- Multi-step tasks (3+ steps)
- Research tasks
- Building/creating something
- Tasks spanning multiple tool calls
- Anything requiring organization

**Skip for:**
- Simple questions
- Single-file edits
- Quick lookups

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Use TodoWrite for persistence | Create a plan file or plan package |
| State goals once and forget | Re-read plan before each decision |
| Hide errors and retry | Log errors to plan file |
| Stuff everything in context | Store large content in files |
| Start executing immediately | Create plan file FIRST |

## Advanced Patterns

See [reference.md](reference.md) for:
- Attention manipulation techniques
- Error recovery patterns
- Context optimization from Manus

See [examples.md](examples.md) for:
- Real task examples
- Complex workflow patterns
