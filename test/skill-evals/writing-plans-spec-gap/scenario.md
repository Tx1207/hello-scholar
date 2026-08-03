# Writing Plans: Stop On Webhook Signing Contract Gaps

## Project Background

This Node webhook service verifies one HMAC signature and maps verification failure to HTTP 401. `SPEC-026` is syntactically valid and marked accepted, but its rotation section deliberately leaves three public and security decisions unresolved: how requests identify a key, how missing or retired keys map to HTTP responses, and how long legacy signatures remain valid. Those choices change callers, error contracts, and migration work. The Bundle has no Plan or Tasks.

## Original User Request

请使用 `$writing-plans` 为当前 Accepted `SPEC-026` 生成实施 Plan，重点覆盖多 key rotation、失败响应和旧签名迁移。先结合真实 handler、verifier、调用方和测试检查 Spec 是否足以约束实现；如果仍有会改变公共 API、安全边界或迁移路径的重大决定没有定稿，请明确列出影响和最小澄清问题，零写入停止并让我先回到 `brainstorming/manage-specs`。不要替我选择方案，也不要先创建一个草稿 Plan 占位。

## Evaluation Boundary

The Baseline receives an immutable pre-change `writing-plans` copy. The semantic gap is intentional; Front Matter, paths, and revisions are valid. Do not inspect the hello-scholar Task Packet, current production Skills, or other Eval evidence.

## Required Result

Read all relevant project facts, cite the unresolved Spec sections and affected real files, explain why each decision belongs in the Spec, ask only the minimum decision questions, and stop without changing any byte. Route the user back to `brainstorming/manage-specs`; do not invent defaults, produce a Plan, create Tasks, or start implementation.

## Verification

Run `node --test` and the absolute `hello-scholar docs check`. The final Git tree remains exactly equal to the committed Fixture Base.

## Interaction

This is a single-round stop-gate request. No future answer supplies the missing security design.
