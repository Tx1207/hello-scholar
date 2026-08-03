# T012：为 `brainstorming` 下一代输出编写 Scenario 和 Red Baseline

- Status: `approved`
- PR: `PR 2 - Spec Bundle 与 Manage Specs`
- Depends On: T001, T002, T008
- Parallel: Yes。可与 T009 并行，但不得修改 Brainstorming。

## 目标

用两个不同的真实项目证明当前 `brainstorming` 虽然有高价值的对话设计流程，但会写 `hello-scholar/memory/specs/YYYY-MM-DD-*.md`，并强制转入 `writing-plans`，不能满足 Spec Bundle 身份和按用户意图结束/转交的规则。本 Task 只准备场景和真实失败证据。

## 事实源

- 当前 `skills/superpowers-skills/brainstorming/SKILL.md` 和 `SKILL.zh_CN.md`。
- 执行 plan 第 8.2 节。
- T001/T002。

## 文件边界

### Add

- `test/skill-evals/brainstorming-spec-bundle/scenario.md`
- `test/skill-evals/brainstorming-spec-bundle/protocol.json`
- `test/skill-evals/brainstorming-spec-bundle/proposal-approval.json`
- `test/skill-evals/brainstorming-spec-bundle/fixture/`
- `test/skill-evals/brainstorming-spec-bundle/baseline.json`
- `test/skill-evals/brainstorming-spec-bundle/evidence/baseline/`
- `test/skill-evals/brainstorming-api-route/scenario.md`
- `test/skill-evals/brainstorming-api-route/protocol.json`
- `test/skill-evals/brainstorming-api-route/proposal-approval.json`
- `test/skill-evals/brainstorming-api-route/fixture/`
- `test/skill-evals/brainstorming-api-route/baseline.json`
- `test/skill-evals/brainstorming-api-route/evidence/baseline/`

两个 `evidence/baseline/` 只保存对应 `baseline.json` 引用的最小脱敏失败证据。

### Must Not Modify

- `skills/superpowers-skills/brainstorming/`
- `skills/hello-scholar/manage-specs/`
- `src/`

## 场景 A：修改已有设计并只完成 Spec

`projectId: py-ranking-pipeline`。Fixture 是一个可运行的 Python 排序流水线，包含现有 Architecture、同 Topic 下的 Accepted relevance Spec、源码/测试和可以触发语义 Revision 的新设计请求。Scenario 通过分段用户回复确认目标和方案，然后要求：

1. 先读项目上下文；只有会材料性改变价值、设计、边界或外部合同的问题才一次问一个，并提供 2–3 个方案和明确推荐。
2. 设计成熟后先完整自审七个核心章节及必要条件章节，再把完整 Spec 作为一个文件交用户整份审核；批准前不写代码，也不逐节索要确认。
3. 批准后调用 `$manage-specs`。由于是同一设计，应更新原 Bundle 的 `spec.md`，而不新建日期文件或重复 Spec。
4. 完成 Spec 自审，再请用户审阅已写文件。
5. 该场景选择“只完成设计”，因此在 Spec 审核后结束，不强制调用 `writing-plans`。

## 场景 B：新增公共 API 并转交 Plan

`projectId: node-retrieval-api`。Fixture 是一个与场景 A 不同的可运行 Node 检索服务，已有 Architecture、源码、测试和另一个 Topic 的 Accepted Spec，但没有本次“批量检索 API”设计。用户要改变公共接口和模块职责，必须先比较“同步批量入口 / 作业式异步入口 / 保持单条接口由调用方聚合”三种方向。

1. Implementer 先读真实调用方、接口测试和 Architecture，一次问一个影响合同的问题，不把正确方案写进初始 Prompt。
2. 通过脚本化多轮回复只解决会材料性改变合同的单个问题；设计成熟后先完整自审，再将完整 Spec 交用户整份审核。批准前源码与测试 bytes 不变。
3. 调用 `manage-specs` 判断这是独立 Spec，先请求创建确认；Eval 主 Agent用 `followup_task` 发送批准后才创建新 Bundle。
4. Spec 自审和用户文件审阅完成后，本场景选择“继续实现”，目标行为只转交 `writing-plans`；不得在同一 Skill 中创建 `plan.md`、`tasks.md` 或代码。
5. 该场景与场景 A 使用不同 Fixture、Agent 和用户回复脚本，不能把一次对话拆成两个 case 计数。

## 硬门槛

- 保留原有高价值主流程，不在批准前写代码。
- 必须调用 `manage-specs`，且输出位于 `hello-scholar/specs/<topic>/SPEC-*/spec.md`。
- 不得创建 `hello-scholar/memory/`、日期 Spec、全局 Plan 或 Tasks。
- 设计完成路由不调用 `writing-plans`，直到用户整份批准 Spec 后另有继续意图。
- API 场景在 Spec 获批后只转交 `writing-plans`，不提前生成 Plan/Tasks 或实现。
- 不评测 Visual Companion 的替代功能；它将在 T050 被整体删除。

## 独立评测执行合同

1. 先完成两个 `scenario.md` 和 `protocol.json`，向用户批量提交 Proposal ID、真实项目背景、rubric 维度/权重、硬否决项、交互脚本和 Scenario/Protocol SHA-256。用户明确批准当前 Hash 前，不启动 Baseline subagent、不判断输出好坏。
2. 两个 Protocol 分别固定使用上述 `projectId`；两个 Fixture 必须有不同项目规则、代码树、测试和影响方案判断的状态，能独立复制、初始化 Git、运行初始测试和 `node <hello-scholar-repo>/bin/hello-scholar.js docs check`。记录绝对源码 CLI、依赖版本和初始命令退出码；环境失败记为 blocked，不算 Red。
3. 为每个临时仓库提交不可变 Base commit 并记录 `fixtureBaseCommit`。证据同时覆盖 `base..HEAD` 的已提交 diff、HEAD 后的 index/working-tree diff、全部 untracked 文件和最终文件 Hash，不能因 Implementer commit 后 working tree 为空而漏审。
4. Baseline 使用修改前 `brainstorming` 与当时可用的下游 Skill immutable copy。Eval 主 Agent把每个目标 `SKILL.md` 的绝对路径和 Hash 交给全新 Implementer，要求完整读取；Implementer 使用 `fork_turns: "none"`，不继承本 Plan、预期修复或未来用户回复。名称自动激活只能另记 activation probe，不能替代显式文件 instruction eval。
5. 所有批准/选择回复由 Eval 主 Agent在对应停点通过 `followup_task` 逐轮发送；初始 Prompt 不包含未来答案。Baseline Reviewer 同样使用 `fork_turns: "none"`，只看到用户已批准 rubric、原始对话、完整 final-tree diff 和确定性证据。
6. `baseline.json` 绑定 Proposal、Scenario、Protocol、Fixture 和全部目标 Skill Hash。Reviewer 只能建议结果；Baseline 如实记录 `fail | control-pass`，用户仍是 rubric 和后续最终 `accepted` 的 owner。任一对照全绿时停止 Brainstorming 后续验收，不改原题；只有用户复核后才能用新 Proposal 和重新批准的 Hash 试验新场景。

## Red Baseline

按上述合同分别使用修改前 `brainstorming` 派发全新 subagent。预期场景 A/B 至少因旧 memory 路径、没有 `manage-specs`、强制 `writing-plans` 或提前实施失败。保留原始输出/final-tree diff 证据，分别写 `baseline.json`，不为了让它失败而删除现有 Brainstorm 能力。

## 验证与完成

- 两组 Protocol/Baseline 通过 T002 合同并如实记录结果；只有两组都得到真实 `fail` 才进入 T013，`control-pass` 不计数且停在人审门。
- 失败点直接对应下一代路径/路由缺失。
- `npm test` 通过，本 Task 没有修改 Skill。
