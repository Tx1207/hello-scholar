# Manage Specs Haiku v4 Live authorization

- Status: `approved-live-authorized`
- Batch ID: `haiku-v4-manage-specs-live-authorization-batch-v1`
- Batch SHA-256: `sha256:fe3b1196bab4e52bdc56c2a08b1e4545e9905f5a01859dc6008a30ff8b5901ca`
- Manifest: [`eval-live-authorization-batch-v4-manage-specs-v1.json`](./eval-live-authorization-batch-v4-manage-specs-v1.json)
- Scope: two genuine Haiku v4 `manage-specs` Red Baselines rebound to the repaired current Skill snapshot `e7d7edf1a939d8ba66849d4c257428bfbcf8e8e4751e1cdc00d7371e94e7bcc8`.
- Authorization basis: the user explicitly instructed Formal Eval to keep running without pausing for review and authorized up to three Haiku Eval Agents in parallel. This is blanket execution authorization applied to the subsequently hash-bound batch, not a claim that the user separately quoted this generated SHA-256.

This authorization allows only Live Implementer/Reviewer execution in fresh isolated Fixtures. It does not accept output or authorize unrelated changes. Any later Scorecard starts with `userDecision: pending`.

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 2 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `manage-specs-independent-v3` - `manage-specs`

- Live approval ID: [`live-manage-specs-independent-v3-haiku-v4`](../../../test/skill-evals/manage-specs-independent-v3/live-approval.json)
- Project / case: `py-batch-retrieval-api` / `manage-specs-independent-v3`
- Proposal ID: `proposal-manage-specs-independent-v3-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/manage-specs-independent-v3/baseline.json`](../../../test/skill-evals/manage-specs-independent-v3/baseline.json) = `fdff50b58a1b12b68751169d88265260131cc0634c9fc32699cb8554a114b491` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-independent-v3/scenario.md`](../../../test/skill-evals/manage-specs-independent-v3/scenario.md) = `5d8bdcdaf8da15bf01fc6a868f24bb3a1fb630a734fdf5c2386cc8fd43e60485`
- Protocol: [`test/skill-evals/manage-specs-independent-v3/protocol.json`](../../../test/skill-evals/manage-specs-independent-v3/protocol.json) = `29ef3d9318946bf900d5bebc603cfb1c77f8f40b8cdf338e09ad113f30318408`
- Fixture: [`test/skill-evals/manage-specs-independent-v3/fixture`](../../../test/skill-evals/manage-specs-independent-v3/fixture) = `f15f63621db5e9ca31c9e31285956d31d4e32939c0f9ce5541708b2f8eb71c1c`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `e7d7edf1a939d8ba66849d4c257428bfbcf8e8e4751e1cdc00d7371e94e7bcc8`

**Critical path**: Read repository ownership evidence, present an independent-Spec classification, and stop before creation until the hash-bound approval arrives.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。

### 02. `manage-specs-successor-v3` - `manage-specs`

- Live approval ID: [`live-manage-specs-successor-v3-haiku-v4`](../../../test/skill-evals/manage-specs-successor-v3/live-approval.json)
- Project / case: `node-session-token-service` / `manage-specs-successor-v3`
- Proposal ID: `proposal-manage-specs-successor-v3-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/manage-specs-successor-v3/baseline.json`](../../../test/skill-evals/manage-specs-successor-v3/baseline.json) = `7c547ee19d21f182d291808b00ce756adebe0fc593bd9a76a0ba8ebff5ea4550` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-successor-v3/scenario.md`](../../../test/skill-evals/manage-specs-successor-v3/scenario.md) = `60174a93e1a97990eb978618cb954d201adc1e8495ab169e140d804316b113f0`
- Protocol: [`test/skill-evals/manage-specs-successor-v3/protocol.json`](../../../test/skill-evals/manage-specs-successor-v3/protocol.json) = `82de007040e561ce2313d1bf673c112d9fb766908b09193024b9bb6c868036d1`
- Fixture: [`test/skill-evals/manage-specs-successor-v3/fixture`](../../../test/skill-evals/manage-specs-successor-v3/fixture) = `202a6aeba2f752411ea59e1e6ed0f715015f5d686757d39b420ed26d92a9ddfe`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `e7d7edf1a939d8ba66849d4c257428bfbcf8e8e4751e1cdc00d7371e94e7bcc8`

**Critical path**: Read authentication and audit ownership evidence, present the successor classification, and stop before creating reciprocal supersession links until approval.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
