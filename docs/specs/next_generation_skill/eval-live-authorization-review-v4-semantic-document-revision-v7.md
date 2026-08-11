# 语义文档修订 Haiku v4 Live authorization batch 7

- Status: `approved-live-authorized`
- Batch ID: `haiku-v4-semantic-document-revision-live-authorization-batch-v7`
- Batch SHA-256: `sha256:72dd5588a3d54c9c0979eb76abb0bb10bcb1578e06db88eb6f485cbffb3ce1ae`
- Manifest: [`eval-live-authorization-batch-v4-semantic-document-revision-v7.json`](./eval-live-authorization-batch-v4-semantic-document-revision-v7.json)
- Scope: 仅 fresh 复测 `generating-tasks-semantic-revision`，绑定 field-level disposition 与 Baseline diff completion 修复后的 `generating-tasks` Skill。`manage-specs` 与 `brainstorming` 的当前有效 pass 保持不变。
- Authorization basis: 用户明确授权不断迭代直到完成目标，并允许除最终审核外的其余授权自动通过。本批次将该 blanket execution authorization 应用于修复后重新生成并完整 Hash 绑定的最小 Live cohort；不声称用户逐字引用过该后生成 Hash。

本授权只允许当前绑定的 Live Implementer/Reviewer 执行，不接受输出、不自动批准 Skill 结果，也不授权 unrelated changes。任一绑定输入变化都会使该授权失效并要求重新生成 Batch Hash。

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 当前绑定与授权边界

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；以下 1 项均来自有效 Red Baseline，并在 Live 前重新绑定当前 Skill snapshot。

### 01. `generating-tasks-semantic-revision` - `generating-tasks`

- Live approval ID: [`live-generating-tasks-semantic-revision-haiku-v4-v7`](../../../test/skill-evals/generating-tasks-semantic-revision/live-approval.json)
- Project / case: `py-feature-policy-tasks-revision` / `generating-tasks-semantic-revision`
- Proposal ID: `proposal-generating-tasks-semantic-revision-haiku-v4`
- Agent model: `claude-haiku-4-5-20251001`
- Red Baseline: [`test/skill-evals/generating-tasks-semantic-revision/baseline.json`](../../../test/skill-evals/generating-tasks-semantic-revision/baseline.json) = `4a380a1c5954eb552c0a60e56ce528bbaa6528ec14d45a881b3ba2cea1240809` (fail / skill-behavior)

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-semantic-revision/scenario.md`](../../../test/skill-evals/generating-tasks-semantic-revision/scenario.md) = `ceb2af5764fe97942deb559d679df8962a3331158fb4d74beab88861de8bcb3c`
- Protocol: [`test/skill-evals/generating-tasks-semantic-revision/protocol.json`](../../../test/skill-evals/generating-tasks-semantic-revision/protocol.json) = `f44103d65009cd2b0c23a6c5d26eebcb4d2aa5d8aad0019cd4a14bdadd71aeb4`
- Fixture: [`test/skill-evals/generating-tasks-semantic-revision/fixture`](../../../test/skill-evals/generating-tasks-semantic-revision/fixture) = `635abafdeff28c8816a16e982ba940499188d8a68a1cf837b234bd557adc9709`
- Shared user-value rubric: `test/skill-evals/user-value-rubric.json` = `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current Skill snapshot: `generating-tasks` / `current-explicit-file` = `cf51bd6518e1905a1b8129df29a9831b78f0a8f575a7986d398a08f67a5e73b9`

**Critical path**: Read the partially completed Tasks contract, preserve valid execution identity and evidence, remove obsolete work, revise the surviving task, add the new outcome with a fresh ID, rebuild the DAG, and stop at pending review.

本授权只允许在重新创建的隔离 Fixture 中进行一次 Live Implementer/Reviewer 流程；不接受输出，也不替代后续用户决定。
<!-- END GENERATED PROPOSAL DETAILS -->
