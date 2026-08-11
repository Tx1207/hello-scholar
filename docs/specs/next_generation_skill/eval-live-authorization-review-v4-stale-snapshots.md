# Stale Skill Snapshot Haiku v4 Live Authorization 审核

- Status: `completed-pending-user-review`
- Batch ID: `haiku-v4-stale-snapshot-live-authorization-v1`
- Batch SHA-256: `sha256:34c1b95309d29c413b593b97cf4a8d9df73608dc0513d32eb42933e049712684`
- Manifest: [`eval-live-authorization-batch-v4-stale-snapshots.json`](./eval-live-authorization-batch-v4-stale-snapshots.json)
- Scope: `2` 个已有有效 Red Baseline 的 Live revalidation，绑定当前 `brainstorming`、`manage-specs` 与 `writing-plans` Skill snapshots。
- Run state at review creation: 未启动任何本 Batch 的 Haiku Live Implementer 或 Reviewer，也未生成新的 Scorecard 或运行证据。
- Execution result: 两项 Live Eval 已严格串行完成，均由 fresh Haiku Implementer/Reviewer 执行并形成 `pass` Scorecard；`userDecision` 均保持 `pending`，等待用户统一审核。

批准顶部 Batch ID 和 Batch SHA-256，仅授权严格串行执行这两个绑定当前 Skill snapshot 的 Live Eval。它不接受输出，不修改历史 Baseline，也不授权两个 `generating-tasks` successor 的 Baseline 或 Live 阶段。

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 2 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `manage-specs-successor-v3` - `manage-specs`

- Live approval ID: [`live-manage-specs-successor-v3-current-snapshot-v1`](../../../test/skill-evals/manage-specs-successor-v3/live-approval.json)
- Project / case: `node-session-token-service` / `manage-specs-successor-v3`
- Proposal ID: `proposal-manage-specs-successor-v3-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/manage-specs-successor-v3/baseline.json`](../../../test/skill-evals/manage-specs-successor-v3/baseline.json) = `7c547ee19d21f182d291808b00ce756adebe0fc593bd9a76a0ba8ebff5ea4550` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-successor-v3/scenario.md`](../../../test/skill-evals/manage-specs-successor-v3/scenario.md) = `60174a93e1a97990eb978618cb954d201adc1e8495ab169e140d804316b113f0`
- Protocol: [`test/skill-evals/manage-specs-successor-v3/protocol.json`](../../../test/skill-evals/manage-specs-successor-v3/protocol.json) = `82de007040e561ce2313d1bf673c112d9fb766908b09193024b9bb6c868036d1`
- Fixture: [`test/skill-evals/manage-specs-successor-v3/fixture`](../../../test/skill-evals/manage-specs-successor-v3/fixture) = `202a6aeba2f752411ea59e1e6ed0f715015f5d686757d39b420ed26d92a9ddfe`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `4fd6d260c35c8ccb5f19b05cb25df452946137cc18a13571527baee007b75f53`

**Critical path**: Read authentication and audit ownership evidence, present the successor classification, and stop before creating reciprocal supersession links until approval.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。

### 02. `brainstorming-api-route-v3` - `brainstorming`

- Live approval ID: [`live-brainstorming-api-route-v3-current-snapshot-v1`](../../../test/skill-evals/brainstorming-api-route-v3/live-approval.json)
- Project / case: `node-retrieval-api` / `brainstorming-api-route-v3`
- Proposal ID: `proposal-brainstorming-api-route-v3-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/brainstorming-api-route-v3/baseline.json`](../../../test/skill-evals/brainstorming-api-route-v3/baseline.json) = `4303d4d12e9272d448423afb23876ec78f6ed663b0f4d2011e1305ee6f157bea` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-api-route-v3/scenario.md`](../../../test/skill-evals/brainstorming-api-route-v3/scenario.md) = `ec3e98b060831934be5c6117fc9001efa36c984b9f607b40ef2d83a8123e9f6a`
- Protocol: [`test/skill-evals/brainstorming-api-route-v3/protocol.json`](../../../test/skill-evals/brainstorming-api-route-v3/protocol.json) = `e5315f1d94ed43ec69071e81ec6c9035f803bafeba6c897418d6f890f61650cd`
- Fixture: [`test/skill-evals/brainstorming-api-route-v3/fixture`](../../../test/skill-evals/brainstorming-api-route-v3/fixture) = `3c99678936692158ab5a69adfccbdd170e6f11f8e25cbcd4eabd1806779fb457`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `brainstorming` / `current-explicit-file` = `c4094a8328a5d597a5bd0c634c05cf3dd6e15f2ac6f1e114019108acb611f46e`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `4fd6d260c35c8ccb5f19b05cb25df452946137cc18a13571527baee007b75f53`
- Current Skill snapshot: `writing-plans` / `current-explicit-file` = `030228fe933008abe406dbf14124f8bd5b9761a75f3ef8917b381f3117f30bab`

**Critical path**: Read the API callers and current contracts, ask the first material question, and deliver the first evidence-backed design comparison before any document write.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
