# 语义文档修订 Haiku v4 Live authorization batch 4

- Status: `approved-live-authorized`
- Batch ID: `haiku-v4-semantic-document-revision-live-authorization-batch-v4`
- Batch SHA-256: `sha256:91e0f4055f2aaacaa608ff9adcf8be9d4116a0c29e7099fc3c910c8f0b017ed1`
- Manifest: [`eval-live-authorization-batch-v4-semantic-document-revision-v4.json`](./eval-live-authorization-batch-v4-semantic-document-revision-v4.json)
- Scope: fresh 复测 `brainstorming-semantic-revision` 与尚未执行的 `generating-tasks-semantic-revision`。前者绑定补强后的 `brainstorming` Skill；后者因同批授权归档而重新绑定，owner bytes 未变。
- Authorization basis: 用户明确授权不断迭代直到完成目标，并允许除最终审核外的其余授权自动通过。本批次将该 blanket execution authorization 应用于修复后重新生成并完整 Hash 绑定的 Live cohort；不声称用户逐字引用过该后生成 Hash。

本授权只允许当前绑定的 Live Implementer/Reviewer 执行，不接受输出、不自动批准 Skill 结果，也不授权 unrelated changes。任一绑定输入变化都会使该授权失效并要求重新生成 Batch Hash。

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 2 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `brainstorming-semantic-revision` - `brainstorming`

- Live approval ID: [`live-brainstorming-semantic-revision-haiku-v4-v4`](../../../test/skill-evals/brainstorming-semantic-revision/live-approval.json)
- Project / case: `py-search-ranking-revision` / `brainstorming-semantic-revision`
- Proposal ID: `proposal-brainstorming-semantic-revision-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/brainstorming-semantic-revision/baseline.json`](../../../test/skill-evals/brainstorming-semantic-revision/baseline.json) = `902c6e618b2e9f61452b89e557d908cfdae3c0d0164e1863973c7a6325c31e9e` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-semantic-revision/scenario.md`](../../../test/skill-evals/brainstorming-semantic-revision/scenario.md) = `8f2d9f225c285e22f21945d2de46ccc622a60c48c0aaf2b3af800308349413ed`
- Protocol: [`test/skill-evals/brainstorming-semantic-revision/protocol.json`](../../../test/skill-evals/brainstorming-semantic-revision/protocol.json) = `7dd7e2130d1dbf964ac63e5fe977064cdf8b6a04f686d5e6f200f1ea96a5d05d`
- Fixture: [`test/skill-evals/brainstorming-semantic-revision/fixture`](../../../test/skill-evals/brainstorming-semantic-revision/fixture) = `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `brainstorming` / `current-explicit-file` = `37679c6c04d622d14dc74f336e7402882f1a844b9fd33692f9592aa10fe9fe2c`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `c2dc722474c3b2f6e9d276118f81f4b054d1227bf173d60296abd49e8c1114f5`

**Critical path**: Read the full current ranking contract, obtain the material design decision, reconcile every retained and changed obligation into one complete reviewed Spec, then write only after whole-file approval.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。

### 02. `generating-tasks-semantic-revision` - `generating-tasks`

- Live approval ID: [`live-generating-tasks-semantic-revision-haiku-v4-v4`](../../../test/skill-evals/generating-tasks-semantic-revision/live-approval.json)
- Project / case: `py-feature-policy-tasks-revision` / `generating-tasks-semantic-revision`
- Proposal ID: `proposal-generating-tasks-semantic-revision-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/generating-tasks-semantic-revision/baseline.json`](../../../test/skill-evals/generating-tasks-semantic-revision/baseline.json) = `4a380a1c5954eb552c0a60e56ce528bbaa6528ec14d45a881b3ba2cea1240809` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-semantic-revision/scenario.md`](../../../test/skill-evals/generating-tasks-semantic-revision/scenario.md) = `ceb2af5764fe97942deb559d679df8962a3331158fb4d74beab88861de8bcb3c`
- Protocol: [`test/skill-evals/generating-tasks-semantic-revision/protocol.json`](../../../test/skill-evals/generating-tasks-semantic-revision/protocol.json) = `f44103d65009cd2b0c23a6c5d26eebcb4d2aa5d8aad0019cd4a14bdadd71aeb4`
- Fixture: [`test/skill-evals/generating-tasks-semantic-revision/fixture`](../../../test/skill-evals/generating-tasks-semantic-revision/fixture) = `635abafdeff28c8816a16e982ba940499188d8a68a1cf837b234bd557adc9709`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `generating-tasks` / `current-explicit-file` = `d357db67766dec3f2636494d6c54e1c8abd31754311d95bb861ee66d424b8150`

**Critical path**: Read the partially completed Tasks contract, preserve valid execution identity and evidence, remove obsolete work, revise the surviving task, add the new outcome with a fresh ID, rebuild the DAG, and stop at pending review.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
