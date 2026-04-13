# Hook Mapping: Claude Code -> Codex

## Core principle

Codex has no native hook runtime, so emulate hooks through:
1. deterministic helper scripts,
2. AGENTS-level mandatory protocols,
3. skill-triggered enforcement.

## Mapping table

| Claude Code hook | Codex substitute | Trigger point |
|---|---|---|
| `SessionStart` | `python3 "<current-mode-helper>" session-start` | first substantive turn in a repo |
| `PreToolUse` | `python3 "<current-mode-helper>" preflight ...` | before destructive or high-risk operations |
| `PostToolUse` | `python3 "<current-mode-helper>" post-edit ...` | after meaningful edits |
| `Stop` | `python3 "<current-mode-helper>" session-end` | before ending a task or session |
| `SessionEnd` | `session-end` + `session-wrap-up` | explicit wrap-up or closeout |

## Recommended scope

Focus on the high-value hook behaviors:
- safety gating,
- session context loading,
- post-edit verification,
- closeout discipline.

Do not try to fake full runtime interception.
