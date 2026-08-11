# 语义文档修订 Haiku v4 Live authorization batch 1

- Status: `approved-live-authorized`
- Batch ID: `haiku-v4-semantic-document-revision-live-authorization-batch-v1`
- Batch SHA-256: `sha256:680f38eb78b483b911cb83d81b2bc37c66728c499c147341db9f4d9098f22cc3`
- Manifest: [`eval-live-authorization-batch-v4-semantic-document-revision.json`](./eval-live-authorization-batch-v4-semantic-document-revision.json)
- Scope: 对 3 个真实 Red 路径使用当前 Product Skill snapshot 运行严格串行 Live Implementer/Reviewer；`writing-plans-semantic-revision` 的 Baseline 为 `control-pass`，明确不进入 Live cohort。
- Authorization basis: 用户明确授权不断迭代直到完成目标，并允许除最终审核外的其余授权自动通过。本批次将该 blanket execution authorization 应用于随后生成并完整 Hash 绑定的当前 Live cohort；不声称用户逐字引用过该后生成 Hash。

本授权只允许当前绑定的 Live Implementer/Reviewer 执行，不接受输出、不自动批准 Skill 结果，也不授权 unrelated changes。任一绑定输入变化都会使该授权失效并要求重新生成 Batch Hash。

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 3 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `brainstorming-semantic-revision` - `brainstorming`

- Live approval ID: [`live-brainstorming-semantic-revision-haiku-v4-v1`](../../../test/skill-evals/brainstorming-semantic-revision/live-approval.json)
- Project / case: `py-search-ranking-revision` / `brainstorming-semantic-revision`
- Proposal ID: `proposal-brainstorming-semantic-revision-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/brainstorming-semantic-revision/baseline.json`](../../../test/skill-evals/brainstorming-semantic-revision/baseline.json) = `902c6e618b2e9f61452b89e557d908cfdae3c0d0164e1863973c7a6325c31e9e` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-semantic-revision/scenario.md`](../../../test/skill-evals/brainstorming-semantic-revision/scenario.md) = `8f2d9f225c285e22f21945d2de46ccc622a60c48c0aaf2b3af800308349413ed`
- Protocol: [`test/skill-evals/brainstorming-semantic-revision/protocol.json`](../../../test/skill-evals/brainstorming-semantic-revision/protocol.json) = `7dd7e2130d1dbf964ac63e5fe977064cdf8b6a04f686d5e6f200f1ea96a5d05d`
- Fixture: [`test/skill-evals/brainstorming-semantic-revision/fixture`](../../../test/skill-evals/brainstorming-semantic-revision/fixture) = `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `brainstorming` / `current-explicit-file` = `87fcd1a9cff07ba11a54a8af4e9148f6195835b666dea97f1eefd536d9cf31a9`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `c2dc722474c3b2f6e9d276118f81f4b054d1227bf173d60296abd49e8c1114f5`

**Critical path**: Read the full current ranking contract, obtain the material design decision, reconcile every retained and changed obligation into one complete reviewed Spec, then write only after whole-file approval.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。

### 02. `manage-specs-semantic-revision` - `manage-specs`

- Live approval ID: [`live-manage-specs-semantic-revision-haiku-v4-v1`](../../../test/skill-evals/manage-specs-semantic-revision/live-approval.json)
- Project / case: `py-search-ranking-owner` / `manage-specs-semantic-revision`
- Proposal ID: `proposal-manage-specs-semantic-revision-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/manage-specs-semantic-revision/baseline.json`](../../../test/skill-evals/manage-specs-semantic-revision/baseline.json) = `e1d5a3dd881d5106bd32e4da58ec38cd983160203e82c1e1bfd90bcb1af13ee5` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-semantic-revision/scenario.md`](../../../test/skill-evals/manage-specs-semantic-revision/scenario.md) = `13805d7d7d0ab272c0db5ca176e72be6a3e667266615cb20297c5d1caabc2741`
- Protocol: [`test/skill-evals/manage-specs-semantic-revision/protocol.json`](../../../test/skill-evals/manage-specs-semantic-revision/protocol.json) = `a89d521a94cc74ada7318672a3b623386fa01f7f88512ba13c35b30df30056ea`
- Fixture: [`test/skill-evals/manage-specs-semantic-revision/fixture`](../../../test/skill-evals/manage-specs-semantic-revision/fixture) = `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `manage-specs` / `current-explicit-file` = `c2dc722474c3b2f6e9d276118f81f4b054d1227bf173d60296abd49e8c1114f5`

**Critical path**: Classify the current ranking owner, obtain exact identity confirmation, then reconcile the complete existing Spec into one draft revision without losing unaffected decisions.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。

### 03. `generating-tasks-semantic-revision` - `generating-tasks`

- Live approval ID: [`live-generating-tasks-semantic-revision-haiku-v4-v1`](../../../test/skill-evals/generating-tasks-semantic-revision/live-approval.json)
- Project / case: `py-feature-policy-tasks-revision` / `generating-tasks-semantic-revision`
- Proposal ID: `proposal-generating-tasks-semantic-revision-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/generating-tasks-semantic-revision/baseline.json`](../../../test/skill-evals/generating-tasks-semantic-revision/baseline.json) = `4a380a1c5954eb552c0a60e56ce528bbaa6528ec14d45a881b3ba2cea1240809` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-semantic-revision/scenario.md`](../../../test/skill-evals/generating-tasks-semantic-revision/scenario.md) = `ceb2af5764fe97942deb559d679df8962a3331158fb4d74beab88861de8bcb3c`
- Protocol: [`test/skill-evals/generating-tasks-semantic-revision/protocol.json`](../../../test/skill-evals/generating-tasks-semantic-revision/protocol.json) = `f44103d65009cd2b0c23a6c5d26eebcb4d2aa5d8aad0019cd4a14bdadd71aeb4`
- Fixture: [`test/skill-evals/generating-tasks-semantic-revision/fixture`](../../../test/skill-evals/generating-tasks-semantic-revision/fixture) = `635abafdeff28c8816a16e982ba940499188d8a68a1cf837b234bd557adc9709`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `generating-tasks` / `current-explicit-file` = `47d01e11940af612cbca1ca2117b159433aafa88a81ea1f041cfb4fcaad56b06`

**Critical path**: Read the partially completed Tasks contract, preserve valid execution identity and evidence, remove obsolete work, revise the surviving task, add the new outcome with a fresh ID, rebuild the DAG, and stop at pending review.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
