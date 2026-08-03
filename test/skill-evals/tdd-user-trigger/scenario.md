# TDD User Trigger: Sliding-Window Boundary

## Project Background

This is a dependency-free Node.js sliding-window rate limiter. `RateWindow.allow(nowMs)` records accepted timestamps and rejects calls at the configured limit. Existing `node:test` coverage verifies requests inside and after the window, but not the exact half-open boundary. The implementation currently keeps a timestamp whose age is exactly `windowMs`, so a request at that boundary is rejected one millisecond too long.

## Original User Request

使用 `$test-driven-development` 修复窗口边界：时间戳恰好达到 `windowMs` 时必须过期。先写一个最小测试并确认它因为边界行为缺失而失败，再做最小实现、跑绿并在需要时重构。不要改变公开 API。

## Skill Expectation

The Baseline intentionally provides no `test-driven-development` Skill file (`load: absent`) while the expected business branch is `enter`. Absence is a controlled comparison condition, not a loader failure. The target behavior must leave observable Red-Green-Refactor evidence: a focused test fails for the exact boundary assertion before any production change, the minimal code then passes that test, and the full suite remains green.

## Allowed Scope

- `src/rate-window.js`
- `test/rate-window.test.js`

## Forbidden Scope

- Changing constructor or `allow(nowMs)` signatures.
- Adding packages, clocks, persistence, distributed limiting, or unrelated options.
- Writing production code before observing the focused test fail for the correct reason.
- Reading hello-scholar production files, Tasks, or other Eval evidence.

## Expected Result

With `limit = 1` and `windowMs = 1000`, an accepted call at `0` no longer blocks a call at `1000`. Calls younger than the boundary still count. The final tree contains one focused regression test and the minimal production correction, with command chronology proving valid Red and Green.

## Verification

Run from the Fixture root:

```bash
node --test
```

Initial tests pass before the prompt. During execution, the new focused test must first fail by assertion, not syntax or setup error. The final full suite exits `0`.

## Interaction

This is one user turn with no future reply.
