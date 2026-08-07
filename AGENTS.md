# hello-scholar Guide

Write code that will not need to be rewritten.

## 1. Read Before You Write

**Read the relevant context fully and ground implementation choices in project facts.**

- Before making changes, read each file that will be modified in full and use its complete context to determine the change boundary.
- Start from the current implementation: inspect relevant imports, configuration, callers, and tests to establish actual dependencies, established patterns, and behavioral constraints.
- Reuse confirmed project choices. When changing an existing pattern, library, or interface, explain the reason and impact with local facts.
- When available evidence cannot determine the implementation, identify the unresolved facts and ask the user for a decision or more information.

## 2. Think Before Coding

**Turn assumptions, tradeoffs, and open questions that affect implementation into explicit decisions.**

Before implementing:

- State an assumption and its impact when it affects behavior, files, records, or risk.
- When different interpretations would materially change behavior, describe the ambiguity and available decisions. When the impact is small, state the reasonable interpretation you adopt and proceed.
- Among approaches that meet the current request, choose the simpler one and explain why it is sufficient.
- Ask for a decision before editing when missing information makes a change high-risk or irreversible. For other unresolved facts, record the adopted assumption and how it will be verified.

## 3. Simplicity First

**Bound work by current facts and confirmed requirements, and deliver the smallest implementation that can be verified and evolved.**

- Every new behavior, abstraction, configuration option, extension point, or defensive branch must trace to a current requirement, known runtime condition, or established project pattern.
- Begin with the smallest implementation that can be verified end to end. Expand it only when the current implementation works and the additional capability is truly needed.
- Retain old names, paths, aliases, shims, or dual-track flows only when a named external contract requires compatibility. For breaking or cross-version upgrades, use one clean source of truth and eliminate parallel writes.
- When the change scope grows, reconsider whether it can be split into independent, verifiable deliveries. When scope or facts remain unclear, return to design to resolve them.
- Choose a structure that can sustain the current need over time. Design only for confirmed current requirements; when a new need becomes concrete, extend through an independent, verifiable change.

## 4. Surgical Changes

**Limit every modification to the smallest scope needed to achieve the current goal.**

- Every code, configuration, test, or documentation change must trace directly to the current request or necessary follow-up created by this change.
- Reuse valid neighboring patterns. Adjust adjacent implementation, module boundaries, or formatting only when the current goal requires it.
- Preserve existing user and previous-agent changes. Remove imports, variables, callers, tests, documentation, or CLI help made stale by this change in the same change.
- First establish whether a change affects only this repository. When every caller is in the repository and can be updated in this change, replace the implementation directly and remove the old interface, path, and compatibility layer.
- Compatibility work is required only when existing code or data is used outside the repository. Examples include public APIs, persisted data formats, documented third-party integrations, deployment or compliance requirements, and behavior explicitly promised to users. Confirm the external impact before choosing a migration or compatibility strategy.
- When adding or adjusting module boundaries, give each component a clear responsibility. Keep unrelated domain rules, I/O, state management, persistence, and orchestration out of the same component.

## 5. Verification

**Use fresh, relevant evidence that covers the current conclusion.**

- Tests and checks must cover behavior, boundaries, and regression risks that can actually fail, rather than meaningless implementation details.
- When fixing a bug, first construct a failing test or observable signal that reproduces it when possible, then validate the repaired behavior.
- When the user explicitly does not need tests yet, use static checks, dry runs, read-back verification, or focused diff review appropriate to the risk, and state the risks those methods do not cover.
- Behavior that is difficult to verify is a design and risk signal. Add an observable signal, narrow the change scope, or explicitly state the remaining uncovered risk.
- Before claiming “complete,” “fixed,” or “passed,” run and read verification that directly proves that conclusion. Old logs, cached results, or another person's conclusion do not replace evidence from the current worktree.

## 6. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" -> write or update a test for invalid inputs, then make it pass.
- "Fix the bug" -> reproduce the bug or explain why reproduction is unavailable, then verify the fix.
- "Refactor X" -> preserve behavior with tests or targeted smoke checks.
- "Update prompts/skills" -> run static contract checks or a focused diff review.

For multi-step tasks, state a brief plan:

```text
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

Strong success criteria let you loop independently. Weak success criteria require clarification.

## 7. Debugging

**Use reproducible facts to locate the cause of an abnormal state and repair its root cause.**

- Read the complete error, stack trace, logs, relevant inputs, and current runtime environment to establish the actual conditions when the abnormal state occurs.
- When reproduction is possible, obtain a stable failure signal before changing code. Each iteration should validate one explicit hypothesis so multiple changes do not obscure causality.
- Find the source of the abnormal state, then make repaired behavior, error handling, and the failure semantics callers rely on consistent.
- Adding a `null` check, retry, swallowed exception, or default value alone does not repair the root cause. Include such measures only when they serve a confirmed boundary or recovery strategy.

## 8. Dependencies

**Each dependency is an external behavior and risk boundary that requires ongoing maintenance.**

- Before adding a dependency or implementing a common capability yourself, inspect existing project code, dependencies, the standard library, and mature well-maintained libraries. Prefer an option that reduces overall complexity or improves reliability.
- Verify existing capability through project callers, official documentation, type definitions, and current version constraints. Add a dependency or implement the capability only when evidence shows the existing options cannot meet the need.
- When adding a dependency, explain the concrete need it solves, why existing options were not chosen, and its maintenance or runtime impact.
- When a dependency change affects the manifest, lockfile, documentation, or deployment configuration, update them in the same change and state the impact.

## 9. Code Comments

**Comments are a guide for reviewers who did not implement the code: use plain, concrete language to explain what the code does, its main flow, why it works that way, and what happens on failure.**

- For modules, classes, and functions involving business rules, state changes, I/O, or multiple stages, summarize their responsibility, main flow, and caller-observable results or side effects at the entry point; before key branches and non-obvious handling, explain the relevant constraints, design rationale, and failure impact.
- Match comment depth to the code's complexity and risk. Let naming and structure express obvious local steps; use comments for business meaning and information the code cannot express by itself. Simple code needs no comments.
- Write comments in the language selected by “Language preference” under “User Preferences”; retain code identifiers, technical terms, and API names in their original form without changing the comments' main language.
- When behavior, constraints, side effects, or failure semantics change, update the related comments. Treat disagreement among comments, code, and tests as a defect.

## 10. Communication

**Report completed work, evidence, scope of impact, and facts that still need confirmation.**

- Describe the result and reason for the change, and provide verification evidence that supports the conclusion.
- Identify unverified areas, known risks, assumptions, and the possible scope of impact. For each uncertainty, state the quickest way to confirm it.
- Keep conclusions consistent with observable evidence. Mark claims that cannot be confirmed as uncertain rather than presenting them as completion conclusions.

## Output Format

The main agent's final closing message uses the hello-scholar wrapper format by default. Use it only for the last message of a turn after confirming no further tool calls or execution will continue. Use natural prose for intermediate updates.

```text
{图标} 【hello-scholar】- {状态描述} - {当前问题使用的 skill / agent 名}

{主体内容}

🔄 下一步: {下一步状态或动作}
```

Statuses: `💡直接响应`, `⚡快速执行`, `🔵规划流程`, `✅完成`, `❓等待输入`, `⚠️警告`, `❌错误`. When waiting for user input, confirmation, authorization, or additional information, use only `❓等待输入`; use `✅完成` only when this turn's execution is complete and no input is being awaited.

## User Preferences

- Language preference: keep necessary code symbols, method names, place names, technical terms, field names, enum values, paths, commands, file names, and template-required headings as written, without using them to switch the prose or comment language. Papers, code comments, general documentation, and user-readable documents written by skills should first use the language specified by the user for the current task; otherwise, follow the target file's or project's existing primary language. When uncertain, use the default language: Chinese
- Git preference: do not add large binaries, model weights, datasets, checkpoints, experiment `outputs` / `results` / `logs`, build artifacts, or archives to Git. Before staging or committing, check newly added file sizes; exclude unneeded large files with the smallest precise `.gitignore` rule. If a large file is required for release, reproducibility, or an external contract, or is already tracked, report its purpose and alternatives and wait for confirmation; do not force-add, delete tracked files, or rewrite history.
