# Generating Tasks Sonnet v3 Live authorization 批量审核

- Status: `pending-user-review`
- Batch ID: `generating-tasks-sonnet-v3-live-authorization-batch-v1`
- Batch SHA-256: `sha256:142dc3d25dd9c9e95d2e1573a1a7ef823518a99508570ffd6f0cac5d1ff0d712`
- Manifest: [`eval-live-authorization-batch-v3-generating-tasks-v1.json`](./eval-live-authorization-batch-v3-generating-tasks-v1.json)
- Scope: 两个不计入产品覆盖的 `generating-tasks` Sonnet v3 诊断 Red。两项均重绑定真实 Red Baseline、当前 Scenario/Protocol/Fixture、共享用户价值 rubric 和当前 `generating-tasks` 显式 Skill tree。
- Run state at review creation: 未启动 Live Implementer 或 Reviewer，未创建 Scorecard 或 Live evidence。

## 一次批准到底批准什么

用户日后若要授权，应明确回复本页的 **Batch ID** 和 **Batch SHA-256**。该 Hash 绑定 manifest 的完整 UTF-8 bytes；manifest 再逐项绑定两个真实 Red Baseline、当前输入、共享 rubric 与当前生产 Skill snapshot。因此，它不是对旧 Proposal 的重复批准，也不是对任何输出的最终接受。

批准后，主流程只能把这两份 `live-approval.json` 从 `pending` 更新为 `approved` 并记录最小脱敏回复证据；它们的所有已绑定输入仍必须当前。随后才可以为每个场景从新的隔离 Fixture Git Base 串行启动全新 Sonnet Implementer 与不同的全新 Sonnet Reviewer。

## 不在本次批准中的内容

- 不接受任何 Skill 输出，任何未来 Scorecard 初始仍为 `userDecision: pending`。
- 不批准新的 Baseline、生产 Skill 修改、Fixture/Scenario/Protocol/rubric 改写，或任何其它 Wave。
- 不允许并发正式 Eval；每次最多一个正式 Agent，Implementer 和 Reviewer 必须为不同的新 Agent ID。

若任一已绑定 Scenario、Protocol、Fixture、Baseline、共享 rubric 或当前 `generating-tasks` snapshot 发生变化，这个 Batch 立即失效，必须重新生成 Hash 并重新审核。

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 2 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `generating-tasks-v3-feature-policy` - `generating-tasks`

- Live approval ID: [`live-generating-tasks-v3-feature-policy-sonnet-v1`](../../../test/skill-evals/generating-tasks-v3-feature-policy/live-approval.json)
- Project / case: `py-feature-policy-engine` / `generating-tasks-v3-feature-policy`
- Proposal ID: `proposal-generating-tasks-v3-feature-policy-sonnet`
- Agent model: `claude-sonnet-5`
- Red Baseline: [`test/skill-evals/generating-tasks-v3-feature-policy/baseline.json`](../../../test/skill-evals/generating-tasks-v3-feature-policy/baseline.json) = `3ff2b9f4e59b9880eb64616cac0213caaa665074c7029a4cb64973127a781323` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-v3-feature-policy/scenario.md`](../../../test/skill-evals/generating-tasks-v3-feature-policy/scenario.md) = `b0d3541a632f212fa545ffe56cc1b9059f2c7ed48f6cb8b9536582d4ac31f816`
- Protocol: [`test/skill-evals/generating-tasks-v3-feature-policy/protocol.json`](../../../test/skill-evals/generating-tasks-v3-feature-policy/protocol.json) = `932c163d7ce551f30b08a4b027bed96fb4edbab8884f04f16a7f1621447f02f1`
- Fixture: [`test/skill-evals/generating-tasks-v3-feature-policy/fixture`](../../../test/skill-evals/generating-tasks-v3-feature-policy/fixture) = `552900ceea3fd669cf55a785143a6e1cc583645a28863365ab74afc286f21315`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `generating-tasks` / `current-explicit-file` = `f28c3d018d6b8f5b6da981ac84db04774d3ced0eca87f29d8c7f2b0e62a7f5fa`

**Critical path**: Read the Accepted Spec and Approved Plan, then produce the first independently executable Task coverage result without implementing it.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。

### 02. `generating-tasks-v3-migration` - `generating-tasks`

- Live approval ID: [`live-generating-tasks-v3-migration-sonnet-v1`](../../../test/skill-evals/generating-tasks-v3-migration/live-approval.json)
- Project / case: `node-config-format-cli` / `generating-tasks-v3-migration`
- Proposal ID: `proposal-generating-tasks-v3-migration-sonnet`
- Agent model: `claude-sonnet-5`
- Red Baseline: [`test/skill-evals/generating-tasks-v3-migration/baseline.json`](../../../test/skill-evals/generating-tasks-v3-migration/baseline.json) = `0152fefae609b841e7dc73fb1ed9b16d8f84eb3a6b3b99b6e73807b7149e1131` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-v3-migration/scenario.md`](../../../test/skill-evals/generating-tasks-v3-migration/scenario.md) = `0a2f24b5e5a77a25aa5749831dd4707b6eaded6c0e4fe857e63f8135d6bec016`
- Protocol: [`test/skill-evals/generating-tasks-v3-migration/protocol.json`](../../../test/skill-evals/generating-tasks-v3-migration/protocol.json) = `1f2fd5fe7bd548fc6d33d16531f4cf892fdabcd4981781b037472eac554337a1`
- Fixture: [`test/skill-evals/generating-tasks-v3-migration/fixture`](../../../test/skill-evals/generating-tasks-v3-migration/fixture) = `776e8dad7591a35621d54eb7234a9c382f87256be98c10775b66a2c51ed3b18e`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `generating-tasks` / `current-explicit-file` = `f28c3d018d6b8f5b6da981ac84db04774d3ced0eca87f29d8c7f2b0e62a7f5fa`

**Critical path**: Read the approved migration contract, then produce dependency-ordered cutover, cleanup, regression, rollback, and recovery Tasks without running them.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
