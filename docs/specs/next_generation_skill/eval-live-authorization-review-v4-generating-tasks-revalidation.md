# Generating Tasks Haiku v4 Revalidation Live Authorization

- Status: `completed-pending-user-review`
- Batch ID: `haiku-v4-generating-tasks-revalidation-live-authorization-v1`
- Batch SHA-256: `sha256:bd10f643fd2a9197712c1904c3e83e3b5dfbfb69ae5da1851186646b75ddfac4`
- Manifest: [`eval-live-authorization-batch-v4-generating-tasks-revalidation.json`](./eval-live-authorization-batch-v4-generating-tasks-revalidation.json)
- Scope: 两个 Protocol v4 successor 的有效 Red Baseline，绑定当前 `generating-tasks` Skill snapshot。
- Authorization basis: 用户明确要求直接运行、由当前会话自行审核且不再为中间阶段反复询问。这是 blanket execution authorization 应用于随后完整 Hash 绑定的 Batch，不声称用户逐字引用过该后生成 SHA-256。

本授权只允许严格串行的 fresh Haiku Live Implementer/Reviewer；不接受输出，也不重标历史 evidence。

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 2 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `generating-tasks-v4-feature-policy-revalidation` - `generating-tasks`

- Live approval ID: [`live-generating-tasks-v4-feature-policy-revalidation-haiku-v1`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/live-approval.json)
- Project / case: `py-feature-policy-engine` / `generating-tasks-v4-feature-policy-revalidation`
- Proposal ID: `proposal-generating-tasks-v4-feature-policy-revalidation-haiku`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/generating-tasks-v4-feature-policy-revalidation/baseline.json`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/baseline.json) = `0dad3a3021dc62ac1bb4d5046b61bd42f40ae621907dfb4807d6f0a0bbd6d895` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-v4-feature-policy-revalidation/scenario.md`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/scenario.md) = `a4a639c1e740b0c050049de820e570acac677d6405d8ebb924ef98c0077266bf`
- Protocol: [`test/skill-evals/generating-tasks-v4-feature-policy-revalidation/protocol.json`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/protocol.json) = `239cba58666ea63762aeea582b0eac3dd1469376504129bccb91d879b20825fb`
- Fixture: [`test/skill-evals/generating-tasks-v4-feature-policy-revalidation/fixture`](../../../test/skill-evals/generating-tasks-v4-feature-policy-revalidation/fixture) = `552900ceea3fd669cf55a785143a6e1cc583645a28863365ab74afc286f21315`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `generating-tasks` / `current-explicit-file` = `f3cdb7d2d6f341ac2d9d4b2a6df7505889d2243334c6ce2f66209a7912aacfe8`

**Critical path**: Read the Accepted Spec and Approved Plan, then produce the first independently executable Task coverage result without implementing it.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。

### 02. `generating-tasks-v4-migration-revalidation` - `generating-tasks`

- Live approval ID: [`live-generating-tasks-v4-migration-revalidation-haiku-v1`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/live-approval.json)
- Project / case: `node-config-format-cli` / `generating-tasks-v4-migration-revalidation`
- Proposal ID: `proposal-generating-tasks-v4-migration-revalidation-haiku`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/generating-tasks-v4-migration-revalidation/baseline.json`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/baseline.json) = `302125f860a9f508ec2dbca5b1d3d8dc25a68a729d10ba613a8bfa028d59d0da` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-v4-migration-revalidation/scenario.md`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/scenario.md) = `f93f77f40a3b78671f7aa3dc77ffb40cd25fff04a79e7e88c847d32e15d59032`
- Protocol: [`test/skill-evals/generating-tasks-v4-migration-revalidation/protocol.json`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/protocol.json) = `b7ef1a72588a4c42001fe8fb628b49c4552f9195940d4cc47ca026c7bab467a8`
- Fixture: [`test/skill-evals/generating-tasks-v4-migration-revalidation/fixture`](../../../test/skill-evals/generating-tasks-v4-migration-revalidation/fixture) = `776e8dad7591a35621d54eb7234a9c382f87256be98c10775b66a2c51ed3b18e`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `generating-tasks` / `current-explicit-file` = `f3cdb7d2d6f341ac2d9d4b2a6df7505889d2243334c6ce2f66209a7912aacfe8`

**Critical path**: Read the approved migration contract, then produce dependency-ordered cutover, cleanup, regression, rollback, and recovery Tasks without running them.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
