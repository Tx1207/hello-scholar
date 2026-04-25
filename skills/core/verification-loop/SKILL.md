---
name: verification-loop
description: 当用户要求 “verify code”、“run verification”、“check quality”、“validate changes”，或在创建 PR 前做质量确认时使用该 skill。它提供包括 build、type check、lint、tests、security scan 和 diff review 在内的完整验证流程。
version: 1.0.0
---

# Verification Loop Skill

一个面向 Claude Code 会话的完整验证系统。

## 何时使用

在以下场景调用：
- 完成一个 feature 或一次重要代码变更之后
- 创建 PR 之前
- 需要确保质量闸门通过时
- 重构之后

## 验证阶段

根据当前项目自适应选择命令，而不是盲目运行所有示例。若仓库与默认示例不匹配，使用 `references/STACK-DETECTION.md` 中与当前 stack 对应的命令集合。

## Core Rules

No verification command means no claim of "done", "fixed", "passing", or "ready". Read the complete output and exit code before reporting a result.

Verification is a loop, not a one-shot gate:

1. Identify the commands that prove the current claim.
2. Run build, typecheck, lint, test, security, or targeted checks appropriate to the change.
3. Inspect the output and exit codes.
4. If anything fails, reason about the failure, fix it, and rerun the relevant checks.
5. Only report completion with concrete evidence.

Do not ask the user to skip required verification. If a command cannot run because of missing dependencies, environment limits, or an external service, report that as blocked or unverified with the exact reason.

## Scope And Goal Validation

Passing tests are proxy evidence, not the goal itself. Before closeout, verify the user-facing objective directly:

- State the real outcome the user asked for.
- Check that the implementation actually produces that outcome, not just that tests pass.
- Look for happy-path-only tests, over-mocked dependencies, dead code, or unconnected implementations.
- For each critical deliverable, confirm existence, real implementation, integration, and data flow.

If a plan package exists, cross-check `requirements.md`, `tasks.md`, and any `contract.json` before reporting completion. Confirm every requirement and task completion criterion is covered, non-goals were not implemented, and any required review, advisor, visual validation, or evidence gates have structured evidence.

## Checklist Gate

After verification commands pass, collect the delivery checklist from every active skill used for the task. Mark checklist items only in verification or acceptance records, attach evidence for passed items, explain not-applicable items, and fix any failed items before rerunning verification.

对于 hello-scholar 项目资产，优先采用 **evidence-driven loop**：

1. 创建带 `contract.json` 的 plan package
2. 将验证证据写入 `hello-scholar/evidence/<target-id>/`
3. 在 closeout 前运行 delivery gate

建议命令：

```bash
node .hello-scholar/scripts/plan-package.mjs create --cwd "$PWD" --title "Implement evidence loop" --verify-mode evidence-driven
node .hello-scholar/scripts/evidence-store.mjs record --cwd "$PWD" --target-id "<plan-id>" --kind test --status pass --summary "Ran targeted tests"
node .hello-scholar/scripts/delivery-gate.mjs check --cwd "$PWD" --target-id "<plan-id>" --plan-id "<plan-id>"
```

### Phase 1: Build 验证
```bash
# Python projects (uv)
uv build 2>&1 | tail -20
# OR
python -m build 2>&1 | tail -20

# Node.js projects
npm run build 2>&1 | tail -20
# OR
pnpm build 2>&1 | tail -20
```

如果 build 失败，**停止**，先修复再继续。

### Phase 2: 类型检查
```bash
# TypeScript projects
npx tsc --noEmit 2>&1 | head -30

# Python projects
pyright . 2>&1 | head -30
```

报告所有 type errors。关键错误需要先修掉再继续。

### Phase 3: Lint 检查
```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

### Phase 4: Test Suite
```bash
# Python projects
pytest --cov=src --cov-report=term-missing 2>&1 | tail -50

# Node.js projects
npm run test -- --coverage 2>&1 | tail -50
```

报告：
- Total tests: X
- Passed: X
- Failed: X
- Coverage: X%

### Phase 5: 安全扫描
```bash
# Python: Check for secrets
grep -rn "sk-" --include="*.py" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.py" . 2>/dev/null | head -10
pip-audit

# Node.js: Check for secrets
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# Check for debug statements
grep -rn "print(" --include="*.py" src/ 2>/dev/null | head -10
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

### Phase 6: Diff 审查
```bash
# Show what changed
git diff --stat
git diff HEAD~1 --name-only
```

审查每个改动文件，关注：
- 非预期修改
- 缺失错误处理
- 潜在边界情况

## 输出格式

跑完所有阶段后，输出一份 verification report：

```text
VERIFICATION REPORT
==================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY] for PR

Issues to Fix:
1. ...
2. ...
```

如果使用 evidence-driven loop，还要持久化：

- `hello-scholar/evidence/<target-id>/index.json`
- `hello-scholar/evidence/<target-id>/README.md`
- `hello-scholar/evidence/<target-id>/delivery-gate.json`
- `hello-scholar/evidence/<target-id>/closeout.md`

## 持续模式

对于长会话，每 15 分钟或每次 major changes 之后运行一次验证：

```markdown
Set a mental checkpoint:
- After completing each function
- After finishing a component
- Before moving to next task

Run: /verify
```

## 与 Hooks 的集成

该 skill 补充 PostToolUse hooks，但提供更深层验证。  
Hooks 负责即时发现问题，而该 skill 负责完整 review。

## 参考文件

按需加载：
- `references/STACK-DETECTION.md` - 如何为当前 repo 选择正确的验证命令集合
- `references/REPORT-TEMPLATE.md` - 最终验证输出的报告结构
- `examples/example-verification-report.md` - 最终报告示例
