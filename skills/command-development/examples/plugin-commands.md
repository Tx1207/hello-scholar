# Plugin Command 示例

这些示例展示面向 Claude Code plugin 的 command 模式，重点是 `${CLAUDE_PLUGIN_ROOT}`、plugin 资源、agent / skill / hook 协作。

## 1. Simple Plugin Command

```markdown
---
description: Analyze code quality using plugin tools
argument-hint: [file-path]
allowed-tools: Bash(node:*), Read
---

Analyze @$1 using plugin's quality checker:
!`node ${CLAUDE_PLUGIN_ROOT}/scripts/quality-check.js $1`
```

## 2. Template-Based Generation

```markdown
---
description: Generate API documentation from template
argument-hint: [api-file]
---

Template: @${CLAUDE_PLUGIN_ROOT}/templates/api-documentation.md
API source: @$1
Generate final docs following the template.
```

## 3. Multi-Script Workflow

```markdown
---
description: Execute release workflow
argument-hint: [version]
allowed-tools: Bash(*), Read
---

!`bash ${CLAUDE_PLUGIN_ROOT}/scripts/pre-release-check.sh $1`
!`bash ${CLAUDE_PLUGIN_ROOT}/scripts/build-release.sh $1`
!`bash ${CLAUDE_PLUGIN_ROOT}/scripts/run-tests.sh`
```

## 4. Agent Integration

```markdown
---
description: Deep code review using plugin agent
argument-hint: [file-or-directory]
---

Initiate review of @$1 using the code-reviewer agent.
```

## 5. Skill Integration

```markdown
---
description: Document API following plugin standards
argument-hint: [api-file]
---

API source: @$1
Use the api-documentation-standards skill to ensure consistency.
```

## Common Plugin Patterns

### Plugin Script Execution

```markdown
!`node ${CLAUDE_PLUGIN_ROOT}/scripts/script-name.js $1`
```

### Plugin Configuration Loading

```markdown
@${CLAUDE_PLUGIN_ROOT}/config/config-name.json
```

### Plugin Template Usage

```markdown
@${CLAUDE_PLUGIN_ROOT}/templates/template-name.md
```

### Resource Validation

```markdown
!`test -f ${CLAUDE_PLUGIN_ROOT}/path/file && echo "YES" || echo "NO"`
```

## Common Mistakes to Avoid

1. 不要用相对路径替代 `${CLAUDE_PLUGIN_ROOT}`。
2. 不要忘记在 frontmatter 中允许所需工具。
3. 不要跳过参数校验。
4. 不要硬编码用户机器上的 plugin 绝对路径。
