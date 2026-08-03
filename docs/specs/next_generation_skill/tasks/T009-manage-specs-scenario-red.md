# T009：为 `manage-specs` 编写 Scenario 并记录 Red Baseline

- Status: `approved`
- PR: `PR 2 - Spec Bundle 与 Manage Specs`
- Depends On: T001, T002, T008
- Parallel: Yes。docs CLI 可用后可与 T012 并行，但不得创建 `manage-specs` Skill。

## 目标

在 `manage-specs` 存在之前，用真实项目 Fixture 证明现有 Skill 无法稳定做到“先查找、再判断修改原 Spec 还是新建”。场景要覆盖相似设计、候选方案、独立设计和后继 Spec，不能只测“新建一个空目录”。

## 事实源

- 执行 plan 第 8.8 节、PR 2 和 Skill Eval 章节。
- PRD `FR-SPEC-001` 至 `FR-SPEC-004`、`FR-INDEX-*`。
- T001/T002 的 Workflow 和静态合同。

## 文件边界

### Add

- `test/skill-evals/manage-specs-existing/scenario.md`
- `test/skill-evals/manage-specs-existing/protocol.json`
- `test/skill-evals/manage-specs-existing/proposal-approval.json`
- `test/skill-evals/manage-specs-existing/fixture/`
- `test/skill-evals/manage-specs-existing/baseline.json`
- `test/skill-evals/manage-specs-existing/evidence/baseline/`
- `test/skill-evals/manage-specs-options/scenario.md`
- `test/skill-evals/manage-specs-options/protocol.json`
- `test/skill-evals/manage-specs-options/proposal-approval.json`
- `test/skill-evals/manage-specs-options/fixture/`
- `test/skill-evals/manage-specs-options/baseline.json`
- `test/skill-evals/manage-specs-options/evidence/baseline/`
- `test/skill-evals/manage-specs-independent/scenario.md`
- `test/skill-evals/manage-specs-independent/protocol.json`
- `test/skill-evals/manage-specs-independent/proposal-approval.json`
- `test/skill-evals/manage-specs-independent/fixture/`
- `test/skill-evals/manage-specs-independent/baseline.json`
- `test/skill-evals/manage-specs-independent/evidence/baseline/`
- `test/skill-evals/manage-specs-successor/scenario.md`
- `test/skill-evals/manage-specs-successor/protocol.json`
- `test/skill-evals/manage-specs-successor/proposal-approval.json`
- `test/skill-evals/manage-specs-successor/fixture/`
- `test/skill-evals/manage-specs-successor/baseline.json`
- `test/skill-evals/manage-specs-successor/evidence/baseline/`

每个 `evidence/baseline/` 只保存对应 `baseline.json` 引用的最小脱敏失败证据。

### Must Not Modify

- `skills/hello-scholar/`
- `skills/superpowers-skills/brainstorming/`
- `src/`

## 四个场景

1. `manage-specs-existing` 使用 `projectId: py-search-ranking-service`：Python 搜索排序服务的 Topic 中已有 `SPEC-001` Accepted Revision 2，用户提出同一问题的语义修改。期望结果是 `Update Existing Spec`，保持 ID/目录，Revision 加 1，更新 `updated` 和 Revision History，不新建日期 Spec。
2. `manage-specs-options` 使用 `projectId: node-cache-strategy-service`：Node 缓存服务针对同一个淘汰策略问题给出 A/B/C 候选方案。期望将方案和决定放在同一 Spec，不为每个方案生成 Bundle。
3. `manage-specs-independent` 使用 `projectId: py-batch-retrieval-api`：Python 检索服务在已有排序 Topic 之外新增一项可独立批准、实施、验证和回滚的批量查询能力。期望判断 `Create Independent Spec`，先向用户确认，确认前不写文件；确认后分配不重用的全局 ID。
4. `manage-specs-successor` 使用 `projectId: node-session-token-service`：Node 会话服务的新 token 模型根本替代已有 Spec。期望判断 `Create Successor Spec`，先确认，然后在新旧 Spec 中维护无环的 `supersedes` / `superseded_by`。

四个 Fixture 的语言、代码树、项目规则、测试和会影响分类的调用/数据事实分别构造，不能从同一模板复制后只换名称。每个 Fixture 都要有至少两个可能相关的 Spec，以及可由 T008 `docs sync` 生成的 Index 状态。不把正确分类直接写进用户 prompt。

## 独立评测执行合同

1. 四组 Scenario/Protocol/rubric 先作为一个 Proposal 批次交用户；每个 `proposal-approval.json` 绑定 Proposal ID、当前 Scenario/Protocol/Fixture Hash 和明确回复证据。用户批准前不启动 Baseline、不评价分类质量。
2. 每个 Fixture 含 AGENTS、Git、有效 Bundle、可运行的最小源码/测试和会影响分类的真实调用关系。用绝对 `node <hello-scholar-repo>/bin/hello-scholar.js` 运行预检；目标 `manage-specs` 有意 absent，其他环境失败不算 Red。
3. 初始化后提交 Base commit 并记录 `fixtureBaseCommit`。每场使用不同的 `fork_turns: "none"` Implementer；不提供不存在的目标文件、不泄露 T010 或正确分类。
4. Independent/Successor 的确认回复只在 Agent 先给分类/证据并停下后，由 Eval 主 Agent用 `followup_task` 发送；首轮 Prompt 不含未来批准。Options 如需用户选择也按 Protocol 逐轮发送。
5. 每场另派不同的 `fork_turns: "none"` Reviewer，只接收获批 rubric、原始交互、命令和 `base..HEAD + index + working tree + untracked + final hashes`。
6. Baseline 绑定 Proposal/Scenario/Protocol/Fixture 和 `manage-specs: absent` snapshot，真实失败如实保存；Reviewer 不能替用户接受未来输出。

## Protocol 与 Baseline

- `targetSkills` 为 `["manage-specs"]`，Implementer/Reviewer 各 1，质量门固定为 90，逐维只允许 `0 / 90 / 100`。
- 允许修改对应 Fixture 的 `hello-scholar/specs/`；禁止 `hello-scholar/memory/`、全局 Plan/Tasks 目录、日期 Spec 和无关源码。
- 确定性验证需检查 Bundle 数量、ID/Revision、替代关系、旧文件 bytes 和 Index 链接。
- 对每个场景使用不同的全新 subagent 运行 absent Baseline。Baseline 只要有一项与缺少目标 Skill 直接相关的硬门槛失败即有效；不得使用无效 Fixture 制造假 Red。

## 验证

- 用 T002 工具校验四组 Protocol/Baseline 的 Schema 和 Hash。
- 四个 Baseline 分别如实记录 `fail | control-pass`，且证据路径在各自场景目录内。任一 `control-pass` 都暂停 `manage-specs` 后续验收；只有用户复核后才能新建 Proposal、修改 Scenario/rubric 并重新批准 Hash，不能直接强化原题制造 Red。
- 运行 `npm test`。

## 完成标准

- 四类决策都有完整、可独立执行的场景和诚实对照证据；四组都取得真实 `fail` 才进入 T010，任一 `control-pass` 都保持停止。
- 场景同时约束“不重复 Spec”、“不代替用户批准”和“不写旧路径”。
- 本 Task 没有实现 `manage-specs`。
