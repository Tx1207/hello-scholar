# Writing Plans: Webhook Signing Contract Gaps

## Project Background

This Node webhook service verifies a single HMAC signature and currently returns HTTP 401 for any verification failure. `SPEC-026` revision 2 is marked accepted but explicitly retains three unresolved decisions about request key identity, detailed failure responses, and the legacy-signature window. Those decisions affect callers, public behavior, security boundaries, and migration. The Spec Bundle contains neither a Plan nor Tasks.

## Original User Request

请使用 `$writing-plans` 为当前 Accepted `SPEC-026` 生成实施 Plan，重点覆盖多 key rotation、失败响应和旧签名迁移。先结合真实 handler、verifier、调用方和测试检查 Spec 是否足以约束实现；如果仍有会改变公共 API、安全边界或迁移路径的重大决定没有定稿，请明确列出影响和最小澄清问题，零写入停止并让我先回到 `brainstorming/manage-specs`。不要替我选择方案，也不要先创建一个草稿 Plan 占位。

## Evaluation Context

Read the project rules, accepted Spec, Architecture, verifier, handler, caller, and tests. The evaluation supplies an immutable pre-change `writing-plans` snapshot for the baseline. The open decisions are project facts, not formatting errors. Do not inspect repository-wide task packets, unrelated skill files, or other evaluation directories.

## Allowed Scope

No project file may be changed.

## Prohibited Scope

- A Plan, Tasks, index, report, source, test, Spec, or Architecture change.
- An invented key identity, HTTP failure contract, or legacy compatibility policy.
- Routing directly to implementation or task generation.

## Expected Result

The response identifies each material unresolved decision, connects it to its accepted Spec section and affected project files, explains why the decision is required before implementation planning, asks only the needed questions, and stops with a byte-identical tree. It routes the unresolved work to `brainstorming/manage-specs` without selecting a security default.

## Verification

Run `node --test` and the absolute `hello-scholar docs check`. The final Git tree remains equal to the committed fixture base.

## Interaction

This is a single-round stop-gate request. No later message resolves the missing security design.
