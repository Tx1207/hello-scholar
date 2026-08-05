# Spec Skills Haiku v4 Live authorization rerun 4

- Status: `completed-pending-user-review`
- Batch ID: `haiku-v4-spec-live-authorization-batch-v4`
- Batch SHA-256: `sha256:7b98814052572680aeaed1f5e1199e190d3862e34d9cca903566ca546465fedd`
- Manifest: [`eval-live-authorization-batch-v4-spec-v4.json`](./eval-live-authorization-batch-v4-spec-v4.json)
- Scope: revalidate the successor identity and brainstorming API workflow against the pruned, progressively disclosed `manage-specs` Skill after the genuine approach-versus-identity Live failure.
- Authorization basis: the user explicitly instructed Formal Eval to continue without pausing for incremental review and authorized up to three Haiku Eval Agents in parallel. This is blanket execution authorization applied to this subsequently hash-bound batch, not a claim that the user separately quoted this generated SHA-256.

This authorization allows only Live Implementer/Reviewer execution in fresh isolated Fixtures. It does not accept output or authorize unrelated changes. Any later Scorecard starts with `userDecision: pending`.

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 2 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `manage-specs-successor-v3` - `manage-specs`

- Live approval ID: [`live-manage-specs-successor-v3-haiku-v4-rerun-4`](../../../test/skill-evals/manage-specs-successor-v3/live-approval.json)
- Project / case: `node-session-token-service` / `manage-specs-successor-v3`
- Proposal ID: `proposal-manage-specs-successor-v3-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/manage-specs-successor-v3/baseline.json`](../../../test/skill-evals/manage-specs-successor-v3/baseline.json) = `7c547ee19d21f182d291808b00ce756adebe0fc593bd9a76a0ba8ebff5ea4550` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-successor-v3/scenario.md`](../../../test/skill-evals/manage-specs-successor-v3/scenario.md) = `60174a93e1a97990eb978618cb954d201adc1e8495ab169e140d804316b113f0`
- Protocol: [`test/skill-evals/manage-specs-successor-v3/protocol.json`](../../../test/skill-evals/manage-specs-successor-v3/protocol.json) = `82de007040e561ce2313d1bf673c112d9fb766908b09193024b9bb6c868036d1`
- Fixture: [`test/skill-evals/manage-specs-successor-v3/fixture`](../../../test/skill-evals/manage-specs-successor-v3/fixture) = `202a6aeba2f752411ea59e1e6ed0f715015f5d686757d39b420ed26d92a9ddfe`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`

**Critical path**: Read authentication and audit ownership evidence, present the successor classification, and stop before creating reciprocal supersession links until approval.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。

### 02. `brainstorming-api-route-v3` - `brainstorming`

- Live approval ID: [`live-brainstorming-api-route-v3-haiku-v4-rerun-3`](../../../test/skill-evals/brainstorming-api-route-v3/live-approval.json)
- Project / case: `node-retrieval-api` / `brainstorming-api-route-v3`
- Proposal ID: `proposal-brainstorming-api-route-v3-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/brainstorming-api-route-v3/baseline.json`](../../../test/skill-evals/brainstorming-api-route-v3/baseline.json) = `4303d4d12e9272d448423afb23876ec78f6ed663b0f4d2011e1305ee6f157bea` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-api-route-v3/scenario.md`](../../../test/skill-evals/brainstorming-api-route-v3/scenario.md) = `ec3e98b060831934be5c6117fc9001efa36c984b9f607b40ef2d83a8123e9f6a`
- Protocol: [`test/skill-evals/brainstorming-api-route-v3/protocol.json`](../../../test/skill-evals/brainstorming-api-route-v3/protocol.json) = `e5315f1d94ed43ec69071e81ec6c9035f803bafeba6c897418d6f890f61650cd`
- Fixture: [`test/skill-evals/brainstorming-api-route-v3/fixture`](../../../test/skill-evals/brainstorming-api-route-v3/fixture) = `3c99678936692158ab5a69adfccbdd170e6f11f8e25cbcd4eabd1806779fb457`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `brainstorming` / `current-explicit-file` = `3ef4002ba6295d65b4733e183f07bfdb9f9a3452641d982914ab5f1342755796`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
- Current Skill snapshot: `writing-plans` / `current-explicit-file` = `b2d467994de3690321a9a2951137bd029b0eb6e6ee063253e6f1ea0b6d544e05`

**Critical path**: Read the API callers and current contracts, ask the first material question, and deliver the first evidence-backed design comparison before any document write.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
