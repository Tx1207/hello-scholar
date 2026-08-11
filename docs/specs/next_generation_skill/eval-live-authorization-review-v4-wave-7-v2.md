# Execution Mirror Haiku v4 Live authorization v2

- Status: `historical-stale-after-skill-repair`
- Batch ID: `haiku-v4-wave-7-execution-mirror-live-authorization-v2`
- Batch SHA-256: `sha256:ba59d1f8078c2f2f6f19f2008ed0eb10e19b7571381db1506c190253d301a01a`
- Manifest: [`eval-live-authorization-batch-v4-wave-7-v2.json`](./eval-live-authorization-batch-v4-wave-7-v2.json)
- Scope: validate the simplified `using-helloscholar` Task Continuation execution mirror against the genuine Red Baseline where T004 succeeded but no task/todo tracker was created or synchronized.
- Authorization basis: Scenario, Protocol, Fixture, shared rubric, and Red Baseline remain unchanged; the current Skill snapshot is newly bound and requires explicit user approval before Live execution.

This authorization permits only one fresh isolated Live Implementer/Reviewer flow. It does not accept Skill output or authorize unrelated changes. The resulting Scorecard starts with `userDecision: pending`.

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 1 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `router-execution-mirror-v4` - `using-helloscholar`

- Live approval ID: [`live-router-execution-mirror-v4-haiku-v4-v2`](../../../test/skill-evals/router-execution-mirror-v4/live-approval.json)
- Project / case: `py-batch-processor` / `router-execution-mirror-v4`
- Proposal ID: `proposal-router-execution-mirror-v4-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/router-execution-mirror-v4/baseline.json`](../../../test/skill-evals/router-execution-mirror-v4/baseline.json) = `a1f903d72626722292f17ec68580094c5e999960f0f40648a4f094a372b4e480` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/router-execution-mirror-v4/scenario.md`](../../../test/skill-evals/router-execution-mirror-v4/scenario.md) = `b40180c68051ac5f69bb5f6ac5064c5d82fe3ea66265aeaeafa7ad92a77e02e2`
- Protocol: [`test/skill-evals/router-execution-mirror-v4/protocol.json`](../../../test/skill-evals/router-execution-mirror-v4/protocol.json) = `cb5c1cb1d3a2d49931864440ed992b0c718fbce504425727385596b8cce71eee`
- Fixture: [`test/skill-evals/router-execution-mirror-v4/fixture`](../../../test/skill-evals/router-execution-mirror-v4/fixture) = `2b06e75e2fa7aa2940a259d97ce3e468b15d1252dbe9f031504fc3a6e7d31589`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `using-helloscholar` / `current-explicit-file` = `3c31607e0e8d327e3df64de9805acea2217821240f7ec147ec9095a37c9bdb47`

**Critical path**: Verify SPEC-052 and its evidence, create the complete T001-T007 tracker before beginning T004, then synchronize T004 completion after fresh validation without touching later Tasks or tasks.md.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
