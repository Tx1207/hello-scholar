# 示例：基于文件的规划如何运作

## 示例 1：研究任务

**用户请求：** “Research the benefits of morning exercise and write a summary”

### Loop 1：创建计划
```bash
Write task_plan.md
```

```markdown
# Task Plan: Morning Exercise Benefits Research

## Goal
Create a research summary on the benefits of morning exercise.

## Phases
- [ ] Phase 1: Create this plan
- [ ] Phase 2: Search and gather sources
- [ ] Phase 3: Synthesize findings
- [ ] Phase 4: Deliver summary

## Key Questions
1. What are the physical health benefits?
2. What are the mental health benefits?
3. What scientific studies support this?

## Status
**Currently in Phase 1** - Creating plan
```

### Loop 2：研究
```bash
Read task_plan.md           # Refresh goals
WebSearch "morning exercise benefits"
Write notes.md              # Store findings
Edit task_plan.md           # Mark Phase 2 complete
```

### Loop 3：综合
```bash
Read task_plan.md           # Refresh goals
Read notes.md               # Get findings
Write morning_exercise_summary.md
Edit task_plan.md           # Mark Phase 3 complete
```

### Loop 4：交付
```bash
Read task_plan.md           # Verify complete
Deliver morning_exercise_summary.md
```

---

## 示例 2：Bug 修复任务

**用户请求：** “Fix the login bug in the authentication module”

### task_plan.md
```markdown
# Task Plan: Fix Login Bug

## Goal
Identify and fix the bug preventing successful login.

## Phases
- [x] Phase 1: Understand the bug report
- [x] Phase 2: Locate relevant code
- [ ] Phase 3: Identify root cause (CURRENT)
- [ ] Phase 4: Implement fix
- [ ] Phase 5: Test and verify

## Key Questions
1. What error message appears?
2. Which file handles authentication?
3. What changed recently?

## Decisions Made
- Auth handler is in src/auth/login.ts
- Error occurs in validateToken() function

## Errors Encountered
- [Initial] TypeError: Cannot read property 'token' of undefined
  -> Root cause: user object not awaited properly

## Status
**Currently in Phase 3** - Found root cause, preparing fix
```

---

## 示例 3：功能开发

**用户请求：** “Add a dark mode toggle to the settings page”

### 3 文件模式示例

**task_plan.md：**
```markdown
# Task Plan: Dark Mode Toggle

## Goal
Add functional dark mode toggle to settings.

## Phases
- [x] Phase 1: Research existing theme system
- [x] Phase 2: Design implementation approach
- [ ] Phase 3: Implement toggle component (CURRENT)
- [ ] Phase 4: Add theme switching logic
- [ ] Phase 5: Test and polish

## Decisions Made
- Using CSS custom properties for theme
- Storing preference in localStorage
- Toggle component in SettingsPage.tsx

## Status
**Currently in Phase 3** - Building toggle component
```

**notes.md：**
```markdown
# Notes: Dark Mode Implementation

## Existing Theme System
- Located in: src/styles/theme.ts
- Uses: CSS custom properties
- Current themes: light only

## Files to Modify
1. src/styles/theme.ts - Add dark theme colors
2. src/components/SettingsPage.tsx - Add toggle
3. src/hooks/useTheme.ts - Create new hook
4. src/App.tsx - Wrap with ThemeProvider

## Color Decisions
- Dark background: #1a1a2e
- Dark surface: #16213e
- Dark text: #eaeaea
```

**dark_mode_implementation.md：**（deliverable）
```markdown
# Dark Mode Implementation

## Changes Made

### 1. Added dark theme colors
File: src/styles/theme.ts
...

### 2. Created useTheme hook
File: src/hooks/useTheme.ts
...
```

---

## 示例 4：错误恢复模式

当出现失败时，**不要**隐藏它：

### Before（错误示范）
```text
Action: Read config.json
Error: File not found
Action: Read config.json  # Silent retry
Action: Read config.json  # Another retry
```

### After（正确示范）
```text
Action: Read config.json
Error: File not found

# Update task_plan.md:
## Errors Encountered
- config.json not found -> Will create default config

Action: Write config.json (default config)
Action: Read config.json
Success!
```

---

## 决策前先读计划模式

**每次重大决策前都先读计划：**

```text
[Many tool calls have happened...]
[Context is getting long...]
[Original goal might be forgotten...]

-> Read task_plan.md          # This brings goals back into attention!
-> Now make the decision      # Goals are fresh in context
```

这也是 Manus 为什么能在大约 50 次 tool calls 之后仍然不丢目标。计划文件相当于一个“目标刷新”机制。
