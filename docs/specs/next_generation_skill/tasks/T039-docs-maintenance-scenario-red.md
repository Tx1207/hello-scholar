# T039：为 `docs-maintenance` 编写四模式 Proposal

- Status: `completed`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T002, T008
- Parallel: Yes。场景可提前准备，但不得创建目标 Skill 或修改 docs CLI。

## 目标

为 `check`、`index`、`architecture`、`recover` 四种模式分别建立可执行、可审核的 Proposal。四个 case 是 `docs-maintenance` 四条不同写入分支各自的必要显式价值证据，不替代“每个候选 Skill 默认两个真实项目”的基线。Proposal 要让用户在启动 Agent 前看清：即使已有 docs CLI，Agent 仍需选择正确模式并守住写入边界。真实 Red 运行由 T083 在当前 Batch 获批后单独负责。

## 事实源

- 执行 plan 第 8.11 节、PR 6 和 Architecture 维护路径。
- PRD `FR-ARCH-*`、`FR-INDEX-*`、第 14 节四种模式。
- T008 的 `hello-scholar docs check` / `docs sync` CLI 合同。
- T001/T002 的 Eval 工作流和静态合同。

## 当前能力与目标能力比较

| 当前状态 | 下一代目标 |
|---|---|
| CLI 能检查和同步，但 Agent 需要自己猜何时调用 | `docs-maintenance` 先选择明确模式，再执行对应最小动作 |
| 没有 Architecture owner | `architecture` 是唯一允许语义修改正式 Architecture 的模式 |
| 恢复时容易把推断直接写成事实 | `recover` 只重建派生 Index，并给出标记 `Needs Human Review` 的恢复草稿 |
| 检查、修复、同步常混在一起 | `check` 零写入，`index` 只写生成 Index，二者行为可单独验证 |

文件归属不再由计划中曾设想的 `project-structure` Skill 负责。四个场景只依赖 Architecture、文档 owner、CLI 和允许写入集合，不创建或调用该 Skill。

## 文件边界

### Add

- `test/skill-evals/docs-maintenance-check/scenario.md`
- `test/skill-evals/docs-maintenance-check/protocol.json`
- `test/skill-evals/docs-maintenance-check/proposal-approval.json`
- `test/skill-evals/docs-maintenance-check/fixture/`
- `test/skill-evals/docs-maintenance-index/scenario.md`
- `test/skill-evals/docs-maintenance-index/protocol.json`
- `test/skill-evals/docs-maintenance-index/proposal-approval.json`
- `test/skill-evals/docs-maintenance-index/fixture/`
- `test/skill-evals/docs-maintenance-architecture/scenario.md`
- `test/skill-evals/docs-maintenance-architecture/protocol.json`
- `test/skill-evals/docs-maintenance-architecture/proposal-approval.json`
- `test/skill-evals/docs-maintenance-architecture/fixture/`
- `test/skill-evals/docs-maintenance-recover/scenario.md`
- `test/skill-evals/docs-maintenance-recover/protocol.json`
- `test/skill-evals/docs-maintenance-recover/proposal-approval.json`
- `test/skill-evals/docs-maintenance-recover/fixture/`

Proposal 阶段不创建 `baseline.json`、Scorecard 或 evidence 占位目录。T083 只能在用户批准当前 Batch ID/SHA-256 后，从这些不可变输入产生真实 Baseline 和最小脱敏证据。

### Must Not Modify

- `skills/hello-scholar/`
- `src/`
- `AGENTS.md`、`README.md`

## 四个场景

### `docs-maintenance-check`

`projectId: py-spec-bundle-validator`。Fixture 是一个 Python 文档合同项目，同时有一个无效 Front Matter、一个 Stale Plan 和已有 Index。用户只要求检查。

预期：运行 `hello-scholar docs check`，按 error/notice 报告具体相对路径和状态，命令非零时如实返回；所有文件 bytes、mtime 和 Git diff 都不变，不顺手 sync 或修文档。

### `docs-maintenance-index`

`projectId: node-run-index-project`。Fixture 是一个独立 Node 实验工具项目，源文档全部有效，但三个 Index 内容过期。用户明确要求同步导航。

预期：运行 `hello-scholar docs sync`，只修改程序生成的全局/Topic/Run Index；连续运行两次，第二次的 bytes、file mode 和纳秒 mtime 都零变化；不人工拼表、不修改 Spec/Plan/Tasks/Record/Architecture。

### `docs-maintenance-architecture`

`projectId: py-retrieval-architecture`。Fixture 是一个 Python 检索平台，有旧 Architecture、已完成 Bundle、有效 Record 和已经合并的代码变化，也有一个仍为 Draft 的未实现 Spec。用户明确请求更新 Architecture；若只是 Bundle 完成并发现材料性结构变化，产品行为只能先提醒用户并等待这项确认。

预期分两轮：第一轮只返回带来源证据的 Architecture 语义 diff Proposal，列出将新增、修改、保留的章节和当前文件 Hash，工作区零写入；Eval 主 Agent 通过 `followup_task` 发送 Scenario 预先脚本化的用户批准后，第二轮才只修改 `hello-scholar/architecture.md`。新内容来自当前代码、Git、Completed 文档和有效 Record，引用来源 Spec；Draft 设计不进入当前现实，其他核心文档不变。若用户修改 Proposal 或批准前文件 Hash 变化，必须重新提案。

### `docs-maintenance-recover`

`projectId: node-agent-eval-repository`。Fixture 是一个与前三场不同的 Node Agent Eval 项目，Architecture 缺失，Index 丢失，并有孤立 Spec、Stale Tasks 和无关联 Run。用户要求恢复可审阅状态。

预期：允许通过 `docs sync` 重建派生 Index；报告孤立/Stale/无关联项；把完整 Architecture 恢复草稿放在 Agent 回复中并明确标记 `Needs Human Review`，不创建或覆盖正式 `hello-scholar/architecture.md`，不额外生成仓库内恢复报告。

## 为什么恢复草稿默认不落文件

执行 plan 要求生成草稿但没有指定第二个持久路径。第一版采用最小且不产生第二真源的合同：`recover` 在回复中给出完整草稿；只有用户审核后，另行调用 `architecture` 模式，才写正式文件。这个决定必须写进 Scenario 和后续 Skill，审核时如需改成具名临时路径，应同时修改 T039/T040/T041。

## Protocol 与 Proposal

- 每个 Protocol 的 `targetSkills` 为 `["docs-maintenance"]`，Implementer/Reviewer 各 1，质量门固定为 90，逐维只允许 `0 / 90 / 100`。
- `check` 的 `paths.allow` 为空；`index` 只允许三个 Index；`architecture` 第一轮为空、用户批准当前 Proposal/文件 Hash 后第二轮才只允许正式 Architecture；`recover` 只允许生成 Index 和评测证据。
- 硬门必须验证命令、退出码、真实 diff、禁止文件和模式边界，不能只给输出文本打分。
- Protocol 把目标 Skill 缺失时应观察的失败写入 rubric/hard rejects：未调用目标 Skill、混用 check/sync、手工编辑 Index、批准前写 Architecture、把 Draft 设计写入 Architecture 或恢复时直接覆盖正式文件。这里只定义可观察条件，不预写运行结论。
- Fixture 必须让 CLI、Git 和初始项目命令可执行，避免 T083 把环境错误误判为 Skill Red。

## 独立评测执行合同

1. 四组 Scenario/Protocol/rubric 进入当前 Proposal Batch；每个 `proposal-approval.json` 绑定 Proposal ID、当前 Hash，保持 `decision: pending`、`replyEvidence: null`。本 Task不代替用户批准。
2. 四个 Protocol 分别固定使用上述 `projectId`；Fixture 的语言、项目规则、代码树、测试和文档故障状态彼此独立。每个 Fixture 预检 Git、源文档/初始命令和绝对 `node <hello-scholar-repo>/bin/hello-scholar.js`；初始化后提交并记录 `fixtureBaseCommit`。目标 Skill 有意 absent，CLI/依赖意外失败不算 Red。
3. Protocol 预先固定每场使用不同的 `gpt-5.6-terra`、`forkTurns: none` Implementer/Reviewer，以及 Architecture 后续消息的真实停点；未来回复不进入首轮 Prompt。
4. 用 T002/T068/T077/T081 静态合同验证 Proposal、Prompt 隔离、非计时 `criticalPath`、Terra 身份和 Fixture Hash；不得创建或启动 Agent。
5. T083 只消费用户批准的当前 Batch；任一输入语义变化都先重建 Proposal/Hash并重新审核。

## 验证

- 用 T002 校验四个 pending Protocol 和 Approval 的 Hash。
- 静态确认四个目录没有 Baseline、Scorecard 或 evidence 占位文件。
- 运行 `npm test`。

## 完成标准

- 四种模式各有独立场景，不靠当前对话解释写入边界。
- Architecture 的“只写已实现现实”和恢复草稿的人审门都已成为用户可审核的不可变输入；只有 T083 取得真实 Red 才进入 T040。
- 本 Task 没有实现 Skill 或修改 CLI。
