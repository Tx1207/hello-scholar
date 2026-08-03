# 下一代 Skill Eval Proposal v2 批量审核

- Status: `pending-user-review`
- Batch ID: `next-generation-skill-protocol-v2-proposals-batch-v2`
- Batch SHA-256: `sha256:aa58b9b4dc0723d18808e9a9fe011bd73a3c92eff4ca354e8c199afb75ebf155`
- Manifest: [`eval-proposal-batch-v2.json`](./eval-proposal-batch-v2.json)
- Scope: 14 个候选 Skill 的 36 个专属 case，加 1 个不计产品覆盖的 Framework E2E v2 后继，共 37 个 Protocol v2 Proposal；每项都显式绑定 `gpt-5.6-terra`。候选 Skill 是否最终全部保留，由真实 Baseline 与用户决定，不由数量目标预设。
- Run state at review creation: 未启动任何 Eval Baseline、Live Eval、Implementer 或 Reviewer，也未生成新的运行证据。

## 一次批准到底批准什么

用户批准时只需要明确回复上面的 **Batch ID** 和 **Batch SHA-256**。这个 Hash 对应 manifest 的完整 UTF-8 bytes；manifest 再逐项绑定 37 份 `scenario.md`、37 份 `protocol.json`、37 棵 Fixture 文件树，以及一份共享用户价值 rubric。因此，一次批准不是模糊地同意“这批看起来差不多”，而是同意 manifest 中列出的这些确定 bytes。

批准只打开 **Baseline Observation**，不代表接受任何 Skill 输出，不授权 Live Eval，也不把 Reviewer 建议当成用户的最终质量决定。某场 Baseline 如果得到诚实的 `control-pass`，该场立即暂停，不能人为制造 Red。

### 批准范围内的不可变 bytes

- 每份 `scenario.md` 的完整 bytes，由该项 `scenarioSha256` 绑定。
- 每份 `protocol.json` 的完整 bytes，由该项 `protocolSha256` 绑定；其中包括业务 rubric、hard rejects、多轮逐字回复、Prompt 隔离、`gpt-5.6-terra` Agent 身份和不含墙钟门的 critical path。
- 每棵 Fixture 中排序后的相对 POSIX 路径和文件 bytes，由该项 `fixtureSha256` 绑定。算法排除 `.git`、`__pycache__`、`.DS_Store` 和 `.hello-scholar-install.json`，拒绝 symlink、junction 和特殊节点。
- [`user-value-rubric.json`](../../../test/skill-evals/user-value-rubric.json) 的完整 bytes，由 manifest 顶层共享 Hash 绑定。
- [`eval-proposal-batch-v2.json`](./eval-proposal-batch-v2.json) 自身的规范化完整 bytes，由本页顶部的 Batch SHA-256 绑定。

### 不在这次批准中的 mutable bytes

- `proposal-approval.json`：待审记录中的三份输入 Hash 必须已经与 manifest 一致；用户批准后还要修改 `decision` 和最小脱敏 `replyEvidence`，所以不能把 Approval 文件自己的 bytes 放进自引用批次。
- 后续 Baseline、Scorecard 和 `evidence/`：它们必须来自真实运行，当前不能预造。
- 生产 Skill：只有某场出现真实 Red Baseline 后才进入对应实现和 Live Eval。
- 历史 `framework-e2e-paged-cache` Protocol v1 目录：它继续按原 bytes 和原 Hash 只读保存，不属于本批次。

任何已绑定 Scenario、Protocol、Fixture、共享 rubric 或 manifest 发生语义变化，当前 Batch SHA-256 都失效；受影响的场景必须以新 Hash 重新交用户审核，不能只改 Approval 数字。

## 两组独立质量门

每场都分别通过“场景业务 rubric”和“共享用户价值 rubric”。两组不能互相平均补分；任一 critical 维度、任一组总分或任一 hard reject 失败，整场就失败。Reviewer 每维只能使用 `0 / 90 / 100`，并引用交互、文件、完整树或命令证据：

- `0`：存在材料性缺失、事实错误、越权或没有证据。
- `90`：核心行为与边界全部满足，只剩轻微表达或组织问题。
- `100`：所有可观察要求都有直接证据，且没有可定位缺陷。

共享用户价值 rubric 的五个等权 critical 维度是：

- `value-visibility`：先让用户看到结果、决定或文档价值。
- `audience-fit`：语言、术语和技术深度匹配用户与项目。
- `information-design`：容易扫描，正式文档离开聊天仍可独立使用。
- `actionability`：决定、未知项、owner、下一步或停点明确。
- `signal-to-noise`：没有样板话、重复结论、评测内部叙述和无关细节。

生成区先完整展示一次这五维及当前 criterion；每个 Proposal 只引用同一事实源，避免 37 次重复淹没业务差异。

## Critical path 怎么读

每项都用一句话写清从当前请求到有效结果的最短合理流程。它回答三件事：

- 哪些事实或最小记录必须先具备；
- 哪个动作才算真正进入任务，而不是只解释流程；
- 哪些说明、整理或终态文档应延后，不能挡在关键动作前。

通过与否由业务 rubric、hard rejects、多轮 stop condition、获批命令、产物和完整树证据共同判断，不使用分钟或毫秒阈值。runner 的 watchdog 只防止运行无限占用资源；触发时表示本次运行未完成，不能直接冒充 Skill 质量失败。

## 相对上一待审批次的变化

- 删除 `landing-no-auto-after-takeoff`、`takeoff-no-auto-option-review`、`tdd-no-trigger` 和 `worktree-no-auto-plan` 四个运行时 no-auto case；“不得自动调用”的边界改由静态 invocation 合同检查，不再浪费真实 Agent 场景。
- 新增 `landing-explicit-durable-queue` 和 `worktree-explicit-bundle-isolation` 两个显式价值场景，使六个用户显式 Skill 都恰好有两个真实 entering case。
- `brainstorming-api-route`、`brainstorming-spec-bundle` 和 `router-design` 改为只逐个询问材料性问题，然后一次提交包含七个核心章节和必要条件章节的完整 Spec；用户整份审核，不再逐章节重复确认。
- 删除全部 v2 `speed`、`speedLimits`、Baseline/Scorecard `timing` 和 `skill-efficiency` 质量门；保留非计时 `criticalPath`。
- 37 个 Protocol、后续 Baseline 和 Scorecard 固定使用 `gpt-5.6-terra`；Implementer/Reviewer 使用不同 Agent ID 和 `forkTurns: none`。Terra 不可用属于环境阻塞，不静默回退，也不把替代模型输出冒充当前合同证据。
- 允许诚实 `control-pass`。出现时暂停对应 Skill 的修改与 Live Eval，由用户根据证据选择保留、调整场景或淘汰，不制造 Red。

## 机器能证明什么，用户仍要判断什么

静态合同可以证明：本页逐项内容与 manifest 完全一致；manifest 正好覆盖当前 37 个 v2 Proposal；三份输入 Hash、共享 rubric、业务 rubric、hard rejects、`agentModel` 和 critical path 都与仓库当前 bytes 一致；历史 v1 未混入批次。

静态合同不能替用户判断：这些业务目标是否值得评测、rubric 是否真正代表“好输出”、hard rejects 是否过严或过松、critical path 是否符合真实工作习惯。下面的逐项内容正是留给用户做这部分质量裁决的材料。

## 37 个 Proposal 逐项审核

<!-- BEGIN GENERATED PROPOSAL DETAILS -->
### 批次共同用户价值 rubric

`hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`；各维和总分最低 `90`。以下五维适用于全部 37 项，不在每项下重复。

- `value-visibility` - 权重 `20%`，critical `true`，最低 `90`：The result, decision, or document value is visible before process narration, so the user can identify what changed and why it matters without reconstructing the agent's work.
- `audience-fit` - 权重 `20%`，critical `true`，最低 `90`：Language, terminology, and technical depth match the user's request and project context; necessary technical names remain exact, while evaluator or agent-internal jargon is translated or omitted.
- `information-design` - 权重 `20%`，critical `true`，最低 `90`：The answer is easy to scan, and any formal document remains understandable and usable when read later without the surrounding chat.
- `actionability` - 权重 `20%`，critical `true`，最低 `90`：Decisions, unresolved facts, owner, next action, or deliberate stop point are explicit enough for the user or next agent to continue without guessing.
- `signal-to-noise` - 权重 `20%`，critical `true`，最低 `90`：Every retained section helps understanding, review, or action; boilerplate, repeated conclusions, evaluation narration, and unrelated detail do not bury the useful signal.

### Fixture 答案隔离复核

已逐项复核 `37` 个 pending v2 Fixture。Implementer 可见：

- Real project language, dependencies, public interfaces, data sources, safety limits, accepted external contracts, immutable evidence, code, and runnable project tests.
- Artifact verifiers that check observable contracts already stated by the project, Accepted Bundle, or original user request.

Evaluator-only：

- The raw Scenario outside its exact Original User Request projection, the full Protocol, business rubric, hard rejects, expected answer, and future messages.
- Reviewer judgments about Skill branch selection, user-facing expression quality, and final acceptance.

本轮材料性清理：

- `record-exploration-backfill`：Project rules now expose isolation, bounded cost, and provenance facts without directly stating the exploration/backfill branch or its workflow boundary.
- `record-formal-prelaunch`：Project rules point to the real Accepted Spec and Approved Plan instead of repeating the target Skill's complete prelaunch answer.
- `record-terminal-evidence`：Project rules require evidence-based classification without revealing which saved Run is failed versus a valid negative result.
- Runtime artifact：Fixture inputs reject __pycache__, .pyc, .pyo, .DS_Store, and .hello-scholar-install.json even where the deterministic tree hash ignores a runtime name.

### 37 项逐项合同

### 01. `brainstorming-api-route` - `brainstorming`

- Proposal ID: [`proposal-brainstorming-batch-v1-api-route-protocol-v2`](../../../test/skill-evals/brainstorming-api-route/proposal-approval.json)
- Project / case: `node-retrieval-api` / `brainstorming-api-route`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 我们准备让导出服务一次取一批文档。请先做设计，比较同步批量入口、异步作业和继续由客户端聚合三种方向，重点讲清公共接口、部分失败、兼容性和测试。设计确认并写入正式 Spec 后，我还要继续实现，但这一轮只能转交到实现计划，不能直接改代码或生成 Tasks。

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-api-route/scenario.md`](../../../test/skill-evals/brainstorming-api-route/scenario.md) = `9019bde78938e2aa3daeec18fafb20f8e5265099f2ee3544dbb866c870f7a7cf`
- Protocol: [`test/skill-evals/brainstorming-api-route/protocol.json`](../../../test/skill-evals/brainstorming-api-route/protocol.json) = `b356dc19f13a13675a38a34c243fc4359ead2aea011add3d7ba4dc7c403d5165`
- Fixture: [`test/skill-evals/brainstorming-api-route/fixture`](../../../test/skill-evals/brainstorming-api-route/fixture) = `3c99678936692158ab5a69adfccbdd170e6f11f8e25cbcd4eabd1806779fb457`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `dialogue-and-alternatives` - 权重 `25%`，critical `true`，最低 `90`：Confirm project, caller and interface facts are read before one material API question, and synchronous batch, asynchronous job and client aggregation are all compared before recommending the ordered per-item synchronous contract.
- `whole-spec-review` - 权重 `25%`，critical `true`，最低 `90`：Confirm that after the identity decision, one complete seven-core-section Spec with only material conditional sections is presented as a single review unit, and no project write occurs until its exact whole-document approval.
- `api-spec-identity` - 权重 `30%`，critical `true`，最低 `90`：Confirm manage-specs classifies an independent identity and stops before writing, then only after identity approval prepares the complete draft and only after whole-document approval produces SPEC-014 with the reviewed 100-item API contract and CLI-generated current indexes.
- `planning-handoff` - 权重 `20%`，critical `true`，最低 `90`：Confirm the approved whole Spec is written exactly, checked and self-reviewed as draft, then the already stated continue intent routes to writing-plans by naming its inputs and owner while creating no Plan, Tasks or implementation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes code or a formal document before both the identity and whole-Spec approvals
- skips the caller and interface evidence or fails to compare all three requested directions
- creates a date-named memory document or writes a new Spec before its creation approval
- asks for section-by-section approval or writes content that was not part of the reviewed complete Spec
- creates Plan, Tasks, or implementation instead of stopping at the writing-plans transition
- offers or starts the retired Visual Companion
- changes source, clients, tests, package files, Architecture, or Runs
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the API callers and current contracts, ask the first material question, and deliver the first evidence-backed design comparison before any document write.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 02. `brainstorming-spec-bundle` - `brainstorming`

- Proposal ID: [`proposal-brainstorming-batch-v1-spec-bundle-protocol-v2`](../../../test/skill-evals/brainstorming-spec-bundle/proposal-approval.json)
- Project / case: `py-ranking-pipeline` / `brainstorming-spec-bundle`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 我们发现低置信度短查询的排序不稳定，想先把设计想清楚。请结合现有 pipeline 和调用约束比较可行方案，逐步和我确认；最终只更新设计文档并让我审核，这一轮不要做实现计划或改代码。

**当前不可变输入**

- Scenario: [`test/skill-evals/brainstorming-spec-bundle/scenario.md`](../../../test/skill-evals/brainstorming-spec-bundle/scenario.md) = `4813fafb14a28611958f6ec2309ceaa26adb72dc00e1b4a56be12d97dbf0cacf`
- Protocol: [`test/skill-evals/brainstorming-spec-bundle/protocol.json`](../../../test/skill-evals/brainstorming-spec-bundle/protocol.json) = `6a7771c79998b7e0129fccf7512f191fc01a82feb2d432eea2966e38f7a92fa6`
- Fixture: [`test/skill-evals/brainstorming-spec-bundle/fixture`](../../../test/skill-evals/brainstorming-spec-bundle/fixture) = `35d25475e3d6e4afaf2cc772569aafe1ac82429bff708526da83fcfbeca63faf`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `dialogue-and-alternatives` - 权重 `25%`，critical `true`，最低 `90`：Confirm Architecture, both candidate Specs, source, tests and recent facts are read before one contract question, followed by two or three distinct reranking approaches, tradeoffs and one recommendation.
- `whole-spec-review` - 权重 `25%`，critical `true`，最低 `90`：Confirm manage-specs preserves the existing owner and presents one complete revised Spec with seven core sections and only material conditional sections as a single review unit, with no project write before its exact whole-document approval.
- `spec-identity-and-quality` - 权重 `30%`，critical `true`，最低 `90`：Confirm manage-specs preserves SPEC-006 as the owner rather than freshness or a duplicate identity, then after whole-document approval records a meaningful Revision with the reviewed stable low-confidence route and refreshes indexes through the CLI.
- `terminal-routing` - 权重 `20%`，critical `true`，最低 `90`：Confirm the approved complete revision is written exactly, checked and self-reviewed, then honors the design-only endpoint without writing Plan, Tasks, code, Runs, Architecture or Visual Companion artifacts.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes code or a formal document before the complete revised Spec receives whole-document approval
- creates a date-named memory document or duplicate Spec instead of entering manage-specs
- skips alternatives, recommendation, identity classification, or whole-Spec review
- asks for section-by-section approval or writes content that was not part of the reviewed complete revision
- invokes writing-plans or creates Plan or Tasks for the design-only endpoint
- offers or starts the retired Visual Companion
- changes source, tests, Architecture, or Runs
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the current Bundle, code, tests, and callers, ask the first material question, and deliver distinct evidence-backed design options before any document write.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 03. `converge-completion-gate` - `converge-to-spec`

- Proposal ID: [`proposal-converge-to-spec-batch-v1-completion-gate-protocol-v2`](../../../test/skill-evals/converge-completion-gate/proposal-approval.json)
- Project / case: `py-batch-reporting-pipeline` / `converge-completion-gate`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请只读判断当前 `SPEC-041` Bundle 是否已经可以声明完成。不要因为 Tasks 全勾、旧摘要写着通过或现有单测是绿的就直接下结论；检查 Spec/Plan/Tasks 是否 Current、每个勾选 Task 的 Completion 是否有项目事实支撑、正式 Benchmark/Eval 是否有有效根目录 Run Record、迁移清理是否结束，以及当前工作树是否已有完整的新鲜验证证据。给出明确的 `Ready` 或 `Not Ready`，列出所有直接可观察的阻塞和下一步 owner，然后停下来。不要修改文档、代码、复选框，不要补造 Record，也不要另写报告。

**当前不可变输入**

- Scenario: [`test/skill-evals/converge-completion-gate/scenario.md`](../../../test/skill-evals/converge-completion-gate/scenario.md) = `d964d9e5afb618073a6e4cad6e60245dcdfe94f245d8b94660c88c5d5a44931e`
- Protocol: [`test/skill-evals/converge-completion-gate/protocol.json`](../../../test/skill-evals/converge-completion-gate/protocol.json) = `44d61e23d71217fdc7d9fdbf4cf1039c810c0ce3580f9a51fe6be303bf29d049`
- Fixture: [`test/skill-evals/converge-completion-gate/fixture`](../../../test/skill-evals/converge-completion-gate/fixture) = `8f5c5c2ab356b6a8ff3a9edde348591156bbae8f58fc6f87274ac615f12af1d4`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `bundle-freshness-decision` - 权重 `25%`，critical `true`，最低 `90`：Confirm current document facts and docs diagnostics identify both Plan and Tasks as bound to obsolete Spec revision 3 and produce an explicit Not Ready decision despite checked Tasks and green tests.
- `task-completion-evidence` - 权重 `25%`，critical `true`，最低 `90`：Confirm every claimed Task Completion is checked against project facts, including the unsupported malformed-input atomicity obligation, rather than accepting boxes or the historical summary as proof.
- `record-and-cleanup-gates` - 权重 `25%`，critical `true`，最低 `90`：Confirm the missing Spec-required formal Benchmark and associated root Run Record, surviving legacy CSV module and caller branch, and incomplete migration cleanup are all reported as observable blockers.
- `owner-routing-and-fresh-evidence` - 权重 `25%`，critical `true`，最低 `90`：Confirm blockers are routed in dependency order to contract synchronization, revised Tasks review, implementation and cleanup, formal Record and execution, then owning-session fresh full verification, while this audit remains byte-for-byte read-only.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- declares the Bundle Ready or completed while the Plan and Tasks are Stale
- fails to identify both stale revision bindings and the Tasks lifecycle state from current document facts
- accepts checked boxes or the past implementation summary as proof that each Task Completion condition is true
- misses the checked malformed-input atomicity obligation that lacks matching implementation and focused test evidence
- misses the Spec-required formal Benchmark/Eval and the absence of a valid associated root runs Record
- misses the surviving legacy CSV module and caller branch required to be removed by the migration cleanup
- treats a rerun of the current happy-path unit suite as sufficient completion evidence or invents current output and exit codes
- modifies any file, checkbox, lifecycle field, Index, source, test, caller, Run, or Git state, or creates a standalone report
- does not route contract synchronization, revised Tasks approval, implementation and cleanup, formal Record work, and final fresh verification to the main Agent in a valid order
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Inspect the current Bundle, implementation, tests, Runs, and cleanup state, then return the first evidence-backed Ready or Not Ready finding without writing files.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 04. `converge-to-spec` - `converge-to-spec`

- Proposal ID: [`proposal-converge-to-spec-batch-v1-semantic-audit-protocol-v2`](../../../test/skill-evals/converge-to-spec/proposal-approval.json)
- Project / case: `node-access-policy-service` / `converge-to-spec`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请对当前 `SPEC-028` Bundle 做一次完成前的只读收敛审计。不要只看 Tasks 复选框或测试结果；逐项对照 Spec、Plan、Tasks、源码、测试、调用方和持久配置，找出 `Missing`、`Partial`、`Contradictory`、`Unrequested` 以及清理残留。每项都要给严重程度、Spec/Plan/Task 引用、`file:line` 实际证据和可实施的修复方向。先不要修改任何文件，也不要另写审计报告，直接在回复中给我审计结果并停下来。

**当前不可变输入**

- Scenario: [`test/skill-evals/converge-to-spec/scenario.md`](../../../test/skill-evals/converge-to-spec/scenario.md) = `77c28be3e0c9cbe2985b1f879d341ca795dc3fb7511c6fb4fa740cbfcaded531`
- Protocol: [`test/skill-evals/converge-to-spec/protocol.json`](../../../test/skill-evals/converge-to-spec/protocol.json) = `b4e015759ebb31118022f5af69da25e9eb9904fdbb9d84af2e889e359917fdd7`
- Fixture: [`test/skill-evals/converge-to-spec/fixture`](../../../test/skill-evals/converge-to-spec/fixture) = `106c41f5b3efe93abbe57f8ffe84fb10ed4a49dc23312910cc47a1df7e11add9`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `semantic-deviation-coverage` - 权重 `30%`，critical `true`，最低 `90`：Confirm round one compares the complete Spec, Plan, Tasks, runtime, tests, caller, persisted policy and cleanup surfaces and reports every present Missing, Partial, Contradictory and Unrequested deviation plus at least two cleanup leftovers.
- `traceability-and-actionability` - 权重 `25%`，critical `true`，最低 `90`：Confirm each finding states severity, the controlling Spec, Plan or Task reference, concrete file:line evidence and an implementable repair direction rather than relying on checked boxes or a green suite.
- `tasks-revision-and-review-gate` - 权重 `25%`，critical `true`，最低 `90`：Confirm no first-round write occurs, then the exact follow-up appends complete unchecked Convergence Tasks without rewriting history and sets revision 5, pending-review, null approved revision and pending status before stopping for review.
- `scope-and-owner-discipline` - 权重 `20%`，critical `true`，最低 `90`：Confirm only existing tasks.md and CLI-generated indexes change after authorization, while fixes and upstream contract decisions remain assigned to their owners with no implementation, report, approval or unrelated document mutation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- treats checked Tasks or passing tests as proof of Spec convergence without comparing the complete Bundle and project tree
- omits an actually present Missing, Partial, Contradictory, or Unrequested deviation, or reports fewer than two distinct cleanup leftovers
- reports a semantic finding without severity, controlling Spec/Plan/Task reference, concrete file:line evidence, and an implementable repair direction
- writes any file during the read-only first round or creates a standalone audit report
- includes the withheld Tasks-update authorization in the first prompt or appends Tasks before the real audit stop
- changes anything after the follow-up except the existing tasks.md and Indexes generated by the absolute hello-scholar CLI
- replaces prior Tasks instead of appending complete Convergence Tasks for the directly implementable findings
- fails to set revision 5, approval pending-review, approved_revision null, and status pending after the semantic Tasks change
- checks a newly appended Task, approves the changed Tasks, fixes implementation, changes upstream contracts, or continues past the new Tasks review stop
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Inspect the full Bundle and implementation surfaces, then report the first file-and-line-backed semantic deviation before proposing any authorized Tasks amendment.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 05. `crash-audit-calibrated-none` - `crash-audit`

- Proposal ID: [`proposal-crash-audit-calibrated-none-v1-protocol-v2`](../../../test/skill-evals/crash-audit-calibrated-none/proposal-approval.json)
- Project / case: `py-error-message-formatter` / `crash-audit-calibrated-none`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 我刚把 tokenizer 的错误消息改清楚了，相关测试和完整测试都过了，公开输出快照也核对过。请坠机一下，看看我是不是漏了重要问题。只做 crash audit，不要改文件。

**当前不可变输入**

- Scenario: [`test/skill-evals/crash-audit-calibrated-none/scenario.md`](../../../test/skill-evals/crash-audit-calibrated-none/scenario.md) = `063f3bb6f91937c65e74263d83bd2f6555b7826d013986167ad8f39485098f57`
- Protocol: [`test/skill-evals/crash-audit-calibrated-none/protocol.json`](../../../test/skill-evals/crash-audit-calibrated-none/protocol.json) = `f88f363c13b4fe61c2c78a1da222abd43bfdfe7bd00b257e371d808c01fb691b`
- Fixture: [`test/skill-evals/crash-audit-calibrated-none/fixture`](../../../test/skill-evals/crash-audit-calibrated-none/fixture) = `d8e22e47ee0fa1fadc0b837d6dc88b432463c2f9b952c910e47ffe4e0d230fbf`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `diff-and-contract-reading` - 权重 `25%`，critical `true`，最低 `90`：Confirm the prepared Base-to-working-tree diff, formatter, focused tests, public snapshot, README contract and current command results are all inspected before judging the change.
- `uncertainty-calibration` - 权重 `25%`，critical `true`，最低 `90`：Confirm the answer distinguishes evidence-closed behavior from any genuinely unverified surface and explicitly says when no material uncertainty remains instead of inventing one.
- `decision-relevance` - 权重 `15%`，critical `true`，最低 `90`：Confirm every reported concern would change approval or the next action; style preferences and risks already closed by the snapshot and tests are excluded.
- `fast-verification` - 权重 `10%`，critical `false`，最低 `90`：Confirm existing focused/full tests and diff-check evidence are cited, and any remaining uncertainty receives the cheapest concrete verification rather than a generic request for more testing.
- `two-question-separation` - 权重 `10%`，critical `true`，最低 `90`：Confirm the least-certain items and possibly missed items are answered as distinct questions, with no duplicate concern and no more than three items per question.
- `concise-no-fabrication` - 权重 `15%`，critical `true`，最低 `90`：Confirm the response leads with the calibrated conclusion, remains read-only, creates no report, and uses project facts without boilerplate or manufactured risk.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not inspect the actual review diff and current tests
- fabricates a major release, migration, security, or compatibility concern without project evidence
- repeats the same generic concern under both source questions
- edits, stages, commits, or creates a report in the fixture
- routes into takeoff, landing, or a full code review

**Critical path**: Read the prepared diff, public snapshot, source, tests, and rules, then tell the user whether any approval-changing blind spot remains without manufacturing work.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 06. `crash-audit-release-blind-spot` - `crash-audit`

- Proposal ID: [`proposal-crash-audit-release-blind-spot-v1-protocol-v2`](../../../test/skill-evals/crash-audit-release-blind-spot/proposal-approval.json)
- Project / case: `node-config-migration-cli` / `crash-audit-release-blind-spot`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 清理方案的单元测试都通过了，我准备批准。请先做一次 crash audit，只回答你最没把握的地方和我可能漏掉的事情，并告诉我成本最低的验证方式。不要改文件，也不要替我重写方案。

**当前不可变输入**

- Scenario: [`test/skill-evals/crash-audit-release-blind-spot/scenario.md`](../../../test/skill-evals/crash-audit-release-blind-spot/scenario.md) = `d8a0491065d85b20a8791e6fab5b930ec8d59167e2c52fccc7add3103f3d58c4`
- Protocol: [`test/skill-evals/crash-audit-release-blind-spot/protocol.json`](../../../test/skill-evals/crash-audit-release-blind-spot/protocol.json) = `478ef137dd39e26d40c8c90fe7023302e92d875621101e12c8dcd5fd0f996c94`
- Fixture: [`test/skill-evals/crash-audit-release-blind-spot/fixture`](../../../test/skill-evals/crash-audit-release-blind-spot/fixture) = `3c24a5c94f9851517000f6f4f1edcaaae4025c1adb9e909e03106e17e4841d0d`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `fact-grounding` - 权重 `25%`，critical `true`，最低 `90`：Confirm the public compatibility promise, cleanup plan, v1/v2 reader code, persisted v1 fixture, tests and read-only smoke output are inspected and cited accurately.
- `uncertainty-calibration` - 权重 `20%`，critical `true`，最低 `90`：Confirm uncertainty is tied to the unobserved population of persisted v1 configurations and release rollout evidence, with confidence and missing facts stated plainly.
- `decision-impact` - 权重 `20%`，critical `true`，最低 `90`：Confirm the audit explains how removing the v1 reader could change release approval, ordering or rollback safety rather than listing low-impact possibilities.
- `fast-verification` - 权重 `15%`，critical `false`，最低 `90`：Confirm the answer proposes the cheapest concrete inventory or representative v1 smoke check that would resolve each material unknown before cleanup approval.
- `two-question-separation` - 权重 `10%`，critical `true`，最低 `90`：Confirm least-confidence judgments and user blind spots are separated without repetition and limited to the decision-relevant maximum requested.
- `concise-no-fabrication` - 权重 `10%`，critical `true`，最低 `90`：Confirm the response is direct, evidence-backed and read-only, with no rewritten plan, generic risk matrix, third summary or invented repository fact.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not inspect the repository facts before judging uncertainty
- misses a high-impact conflict between the proposed cleanup and an observable user contract
- rewrites the plan, edits the fixture, or starts migration work
- duplicates one concern under both source questions or invents generic risks
- routes into takeoff, landing, or a full code review

**Critical path**: Read the compatibility promise, release plan, persisted v1 sample, reader, and tests, then surface the first approval-changing unknown and its cheapest verification.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 07. `docs-maintenance-architecture` - `docs-maintenance`

- Proposal ID: [`proposal-docs-maintenance-batch-v1-architecture-protocol-v2`](../../../test/skill-evals/docs-maintenance-architecture/proposal-approval.json)
- Project / case: `py-retrieval-architecture` / `docs-maintenance-architecture`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 现在代码和 SPEC-310 已经合并，Architecture 还是旧的。请先给我一份基于当前证据的精确修改提案，我批准后再只更新正式 Architecture；不要把 SPEC-311 的草案设计写成已经存在。

**当前不可变输入**

- Scenario: [`test/skill-evals/docs-maintenance-architecture/scenario.md`](../../../test/skill-evals/docs-maintenance-architecture/scenario.md) = `4ea7f47d67b15de2815961dc5e90dad24620e4f13db46f59c138f1aa6660d3c2`
- Protocol: [`test/skill-evals/docs-maintenance-architecture/protocol.json`](../../../test/skill-evals/docs-maintenance-architecture/protocol.json) = `d1e7e16cf97bd7ae8d4d61b0665a4e87a9d6821a8b643738ee1ae56d8ff89a7a`
- Fixture: [`test/skill-evals/docs-maintenance-architecture/fixture`](../../../test/skill-evals/docs-maintenance-architecture/fixture) = `4d182049660d11b02f33856ed79046a250b1ad256d260bd79ab63edeae480a45`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `proposal-and-source-evidence` - 权重 `30%`，critical `true`，最低 `90`：Confirm round one reads Architecture, completed SPEC-310 Bundle, implementation, tests, Recall Eval Record and Git facts, then presents the current SHA-256 and a source-backed semantic diff of additions, modifications and retained facts.
- `approval-and-hash-gate` - 权重 `30%`，critical `true`，最低 `90`：Confirm round one is write-free and the exact proposed semantics are applied only after approval bound to the observed Architecture hash, with any hash or proposal drift requiring a new review.
- `current-reality-accuracy` - 权重 `25%`，critical `true`，最低 `90`：Confirm Architecture describes the implemented lexical-vector score fusion and stable post-filter ordering, cites SPEC-310 and Recall Eval, preserves true process boundaries, and excludes every unimplemented SPEC-311 capability.
- `single-file-boundary` - 权重 `15%`，critical `true`，最低 `90`：Confirm the approved second round changes only hello-scholar/architecture.md and creates no proposal file, report, second Architecture, Spec, Plan, Tasks, Record, Index, runtime or Git-history mutation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes Architecture or any other file before the Eval main agent approves the observed Proposal and current Architecture hash
- writes an unapproved semantic change or continues after the approved file hash changes
- describes Draft SPEC-311 or another unimplemented design as current system reality
- changes any Spec, Plan, Tasks, Record, Index, source, test, result, project rule, or Git history
- creates an Architecture proposal file, recovery report, second Architecture, Plan, Tasks, or Run
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read current Architecture and milestone evidence, then present the current hash and first source-backed semantic change proposal before any write.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 08. `docs-maintenance-check` - `docs-maintenance`

- Proposal ID: [`proposal-docs-maintenance-batch-v1-check-protocol-v2`](../../../test/skill-evals/docs-maintenance-check/proposal-approval.json)
- Project / case: `py-spec-bundle-validator` / `docs-maintenance-check`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请检查一下当前 hello-scholar 文档状态，把错误、提醒和具体路径告诉我。现在只做检查，不要修文件，也不要刷新索引。

**当前不可变输入**

- Scenario: [`test/skill-evals/docs-maintenance-check/scenario.md`](../../../test/skill-evals/docs-maintenance-check/scenario.md) = `b612511ef41c55e5b0d66310d384ad86ae6596e5fbdab99d1bd14a3cc40995bc`
- Protocol: [`test/skill-evals/docs-maintenance-check/protocol.json`](../../../test/skill-evals/docs-maintenance-check/protocol.json) = `20e242ff4c989e198694345e1ba17e4874d97309b80ab0c1f58cf6e20bf34dd8`
- Fixture: [`test/skill-evals/docs-maintenance-check/fixture`](../../../test/skill-evals/docs-maintenance-check/fixture) = `391d12ede4c33d012234c4b11cb375828e918b9210b102dc80d5bbffbe6590f9`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `mode-and-command-selection` - 权重 `25%`，critical `true`，最低 `90`：Confirm the request is handled in docs-maintenance check mode with the absolute read-only docs check command and unit tests, without sync, repair, Recover, Architecture or implementation work.
- `diagnostic-fidelity` - 权重 `25%`，critical `true`，最低 `90`：Confirm the report distinguishes the unsupported Record Schema error from the plan-stale notice, includes both relative paths and meanings, and routes each repair to a future owner.
- `zero-write-boundary` - 权重 `35%`，critical `true`，最低 `90`：Confirm byte, mtime and complete Git-state evidence proves no tracked, staged, working-tree or untracked file changed, including generated Indexes and malformed inputs.
- `evidence-and-honesty` - 权重 `15%`，critical `false`，最低 `90`：Confirm saved command output and exit status show tests passing and docs check failing for the reported error, without describing the nonzero check as successful or omitting notices.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- runs docs sync or changes any tracked, staged, working-tree, or untracked project file
- repairs Front Matter, updates Plan bindings, touches an Index, or creates a report without authorization
- claims docs check succeeded or omits either the invalid Record error or the Stale Plan notice
- uses a non-check maintenance mode or enters design, implementation, Architecture, or Recover work
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Run the read-only document check and report the first real diagnostic with its owner and meaning without attempting repair.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 09. `docs-maintenance-index` - `docs-maintenance`

- Proposal ID: [`proposal-docs-maintenance-batch-v1-index-protocol-v2`](../../../test/skill-evals/docs-maintenance-index/proposal-approval.json)
- Project / case: `node-run-index-project` / `docs-maintenance-index`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 三份导航索引还是旧内容。请只把生成索引同步到当前 Spec 和 Run，连续验证两次；不要改正文或程序。

**当前不可变输入**

- Scenario: [`test/skill-evals/docs-maintenance-index/scenario.md`](../../../test/skill-evals/docs-maintenance-index/scenario.md) = `b938d73da7cca41ef419956e0b306b2f52134f6bd170df4040b274f0c9788f0d`
- Protocol: [`test/skill-evals/docs-maintenance-index/protocol.json`](../../../test/skill-evals/docs-maintenance-index/protocol.json) = `55209ecfcaef1f131afe72ddbd19f4740e380ef10975fd0bfb2cc0e1fa966c1c`
- Fixture: [`test/skill-evals/docs-maintenance-index/fixture`](../../../test/skill-evals/docs-maintenance-index/fixture) = `6681d5dee1b75713038ca02313fea27e2e96214ff5df49556f2b3f122bda5ecf`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `mode-and-command-selection` - 权重 `25%`，critical `true`，最低 `90`：Confirm stale CLI-owned navigation is handled in docs-maintenance index mode using the absolute docs sync command rather than manual Markdown, design, recovery or implementation work.
- `generated-index-correctness` - 权重 `30%`，critical `true`，最低 `90`：Confirm the first sync rebuilds exactly the global Spec, run-navigation Topic and Run indexes from current Spec and Record titles, summaries and statuses with deterministic links and ordering.
- `write-boundary` - 权重 `25%`，critical `true`，最低 `90`：Confirm only the three canonical generated Index paths change and every Spec, Record, Architecture, source, test, package and project-rule byte remains unchanged.
- `second-run-idempotence` - 权重 `20%`，critical `true`，最低 `90`：Confirm the second absolute docs sync exits zero and command, Base-to-first, first-to-second and final-hash evidence proves a zero-diff second run.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- manually edits generated Markdown instead of using the absolute hello-scholar docs sync CLI
- changes any Spec, Record, Architecture, source, test, package, or project-rule file
- writes outside the three canonical Index paths or creates a report, Plan, Tasks, or Run
- omits the second sync or claims idempotence without Base-to-final and final-hash evidence
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Run the canonical index sync, verify the generated navigation, and reach the second zero-diff sync without manual Markdown edits.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 10. `docs-maintenance-recover` - `docs-maintenance`

- Proposal ID: [`proposal-docs-maintenance-batch-v1-recover-protocol-v2`](../../../test/skill-evals/docs-maintenance-recover/proposal-approval.json)
- Project / case: `node-agent-eval-repository` / `docs-maintenance-recover`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 这个仓库的文档导航和 Architecture 都丢了。请把能确定恢复的部分恢复好，把孤立、过期和未关联项列出来；Architecture 先给我完整草稿审核，不要直接写成正式事实。

**当前不可变输入**

- Scenario: [`test/skill-evals/docs-maintenance-recover/scenario.md`](../../../test/skill-evals/docs-maintenance-recover/scenario.md) = `b3d3539795182431be96a1b314ac92c637f5bb12ae51910e78b43d66499622f6`
- Protocol: [`test/skill-evals/docs-maintenance-recover/protocol.json`](../../../test/skill-evals/docs-maintenance-recover/protocol.json) = `313fb028cc64e0c64ad99679fb5a2a7e20283957128195316cfb1e87638160cf`
- Fixture: [`test/skill-evals/docs-maintenance-recover/fixture`](../../../test/skill-evals/docs-maintenance-recover/fixture) = `022c90fb58ae0afa4b657740397ea28e30eb3e450c0351f32cd13d10501b0880`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `recover-mode-selection` - 权重 `20%`，critical `true`，最低 `90`：Confirm missing navigation plus missing formal Architecture is routed to Recover, separating deterministically recoverable indexes from an Architecture draft that still needs human review.
- `derived-index-recovery` - 权重 `25%`，critical `true`，最低 `90`：Confirm the absolute docs sync CLI recreates exactly the global Spec, agent-evaluation Topic and Run indexes from current source documents without hand-authored tables.
- `diagnostic-coverage` - 权重 `20%`，critical `true`，最低 `90`：Confirm the response reports SPEC-421 as orphaned, SPEC-420 Tasks as stale, the provider sample Run as unassociated and formal Architecture as missing with concrete paths.
- `review-draft-quality` - 权重 `20%`，critical `true`，最低 `90`：Confirm the chat-only Architecture draft is complete, source-traceable, explicitly marked Needs Human Review and separates verified current facts from inferences rather than claiming review or implementation.
- `formal-write-boundary` - 权重 `15%`，critical `true`，最低 `90`：Confirm formal architecture.md remains absent and only three generated Indexes are written, with no recovery report, draft file, Spec, Plan, Tasks, Record, Run, runtime or package change.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates or overwrites hello-scholar/architecture.md without a separate approved Architecture Proposal and current hash
- writes a recovery report, Architecture draft file, Spec, Plan, Tasks, Record, Run, source, test, package, or project-rule change
- manually authors generated Index tables instead of using the absolute hello-scholar docs sync CLI
- omits the orphan Spec, Stale Tasks, unassociated Run, or missing Architecture diagnosis
- presents inferred Architecture as current fact or omits the Needs Human Review marker
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Separate deterministic index recovery from review-only Architecture inference, restore owned indexes, and present the first evidence-backed recovery finding.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 11. `framework-e2e-paged-cache-v2` - `framework-e2e`

- Proposal ID: [`proposal-framework-e2e-paged-cache-v2-successor-v1`](../../../test/skill-evals/framework-e2e-paged-cache-v2/proposal-approval.json)
- Project / case: `py-paged-cache-engine` / `framework-e2e-paged-cache-v2`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 否
- 业务目标: 请从当前 Accepted Spec 开始，完成 Paged KV Cache 升级。先生成可审核的高层 Plan，再生成独立 Tasks；我分别批准 Plan、Tasks 和本轮实施后，才开始修改代码。实现完成后运行正式 Benchmark、收敛 Spec Bundle，并在确有里程碑变化时提交 Architecture 语义更新建议。

**当前不可变输入**

- Scenario: [`test/skill-evals/framework-e2e-paged-cache-v2/scenario.md`](../../../test/skill-evals/framework-e2e-paged-cache-v2/scenario.md) = `94244518fc46a6a0e28cacc22370727e28142826a0b7feaaf53b0d78cf5cae19`
- Protocol: [`test/skill-evals/framework-e2e-paged-cache-v2/protocol.json`](../../../test/skill-evals/framework-e2e-paged-cache-v2/protocol.json) = `1b9f892e54e1c42406978bde08d697ead35e0379524d5c03c9f0a2ab947f1c45`
- Fixture: [`test/skill-evals/framework-e2e-paged-cache-v2/fixture`](../../../test/skill-evals/framework-e2e-paged-cache-v2/fixture) = `a4e4058cfd13ee333cfde9576bc782f48c13d5f296992e85009f4f9017937a60`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `document-contract` - 权重 `18%`，critical `true`，最低 `90`：Confirm one same-Bundle high-level Plan and independently executable Tasks preserve the Accepted Spec, use correct revisions and approval states, cover every acceptance/cleanup/rollback obligation, and remain reviewable without chat context.
- `approval-gates` - 权重 `18%`，critical `true`，最低 `90`：Confirm Plan, Tasks, current-session implementation and Architecture each wait for their exact Hash-bound message, with no future reply leaked and no earlier approval interpreted as permission for a later stage.
- `implementation-correctness` - 权重 `20%`，critical `true`，最低 `90`：Confirm the current Implementer directly completes dependency-ordered Tasks, preserves the public CacheAllocator entry point, allocates fragmented free blocks correctly, covers invariants with tests, and removes the contiguous formal path without parallel implementations.
- `experiment-provenance-and-ordering` - 权重 `16%`，critical `true`，最低 `90`：Confirm one formal root Run has a minimum reproducible Record before exactly one Benchmark launch, retained raw and structured evidence, an honest terminal conclusion, and noncritical documentation deferred until after launch.
- `convergence-and-fresh-evidence` - 权重 `16%`，critical `true`，最低 `90`：Confirm Converge checks Spec, Plan, Tasks, code, cleanup and Run evidence, every Task completion matches current facts, and the owning Implementer then runs and reads fresh full tests, Benchmark and docs outputs before claiming readiness.
- `architecture-current-reality` - 权重 `12%`，critical `true`，最低 `90`：Confirm Architecture changes only after the approved semantic Proposal and current hash, describes the implemented paged system and retained public contract, cites its design/evidence sources, and excludes draft or failed alternatives.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes Plan, Tasks, implementation, or Architecture before its matching exact approval or authorization message
- changes the Accepted Spec to reduce scope or treats Tasks approval as current-session implementation authorization
- exposes the raw Scenario, full Protocol, rubric, hard rejects, expected artifacts or future replies to the Implementer
- uses a retired execution/review Skill or nested per-Task implementation subagent
- keeps contiguous allocation as the formal path, changes the public CacheAllocator contract, or creates a parallel versioned implementation
- starts the formal Benchmark before the minimum reproducible root Run Record exists, starts it more than once, or delays launch for noncritical document completion
- writes hello-scholar/memory, hello-scholar/runs, run.json or a second Run explanation
- claims completion without Converge, current full tests, Benchmark, docs evidence and the separately approved Architecture transaction
- reads the hello-scholar Task Packet, production Skills outside the explicit snapshots, historical v1 evidence or another Eval case

**Critical path**: Read the Accepted Spec and current allocator facts, produce the first reviewable Plan result, then after separate Plan, Tasks and implementation approvals reach one minimum-recorded Benchmark launch without waiting for noncritical documentation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 12. `generating-tasks` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-batch-v1-feature-policy-protocol-v2`](../../../test/skill-evals/generating-tasks/proposal-approval.json)
- Project / case: `py-feature-policy-engine` / `generating-tasks`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请从当前 Accepted Spec 和 Approved Plan 生成一份可单独审核的 `tasks.md`。不要修改 Spec、Plan、源码或测试，也不要开始实施。每个 Task 要能脱离对话阅读，写清依赖、文件、工作、验证和完成条件；Plan 明确指定 TDD 的那一项要原样传递，其他项不要自动加 TDD。生成后做覆盖和依赖自审，然后停下来等我审核 Tasks。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks/scenario.md`](../../../test/skill-evals/generating-tasks/scenario.md) = `7fa6960fdf241d168fe3fbc38ab0e4d2d4db3717cd6a77f29061db3febd89cfc`
- Protocol: [`test/skill-evals/generating-tasks/protocol.json`](../../../test/skill-evals/generating-tasks/protocol.json) = `887b36c8fa2205cb184c0ef59a419768dac2bc0c799abae57a554c0e24094021`
- Fixture: [`test/skill-evals/generating-tasks/fixture`](../../../test/skill-evals/generating-tasks/fixture) = `552900ceea3fd669cf55a785143a6e1cc583645a28863365ab74afc286f21315`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `task-document-contract` - 权重 `25%`，critical `true`，最低 `90`：Confirm tasks.md binds SPEC-003 revision 2 and Plan revision 1, initializes revision 1 with pending-review, null approved revision and pending status, and gives every Task all required independently readable sections.
- `coverage-and-dependencies` - 权重 `30%`，critical `true`，最低 `90`：Confirm unique Tasks cover every Spec acceptance criterion and Plan migration, cleanup, regression and rollback obligation with exact files and an acyclic graph whose parallel writers do not overlap or depend on one another.
- `validation-and-tdd-boundary` - 权重 `30%`，critical `true`，最低 `90`：Confirm every Task has executable validation, observable expected signals and checkable completion, and Red-Green-Refactor appears only on the precedence behavior explicitly selected by the approved Plan.
- `scope-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm only same-Bundle tasks.md and CLI-generated indexes are written, Tasks remain unapproved and unimplemented, and Spec, Plan, Architecture, runtime, tests, packages, Runs and legacy paths remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates Tasks without kind tasks, SPEC-003/spec revision 2/plan revision 1 bindings, or the exact revision 1 pending-review approval state
- omits a unique Task ID, plain-language goal, Spec Coverage, Depends On, Parallel, Files, Work, Validation, or Completion from any top-level Task
- modifies Spec, Plan, Architecture, source, tests, or package files
- omits any AC, migration, cleanup, or rollback obligation
- marks Tasks approved or begins implementation
- applies TDD to tasks whose Approved Plan does not select it or drops Red-Green-Refactor from the selected behavior
- uses cyclic dependencies, dependent or same-file parallel Tasks, placeholders, non-observable validation, or context-dependent shorthand
- reopens architecture decisions already fixed by the Accepted Spec and Approved Plan
- writes a global tasks directory or hello-scholar/memory path
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the Approved Plan and Accepted Spec, then produce the first independently executable Task coverage result without implementing it.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 13. `generating-tasks-migration` - `generating-tasks`

- Proposal ID: [`proposal-generating-tasks-batch-v1-migration-protocol-v2`](../../../test/skill-evals/generating-tasks-migration/proposal-approval.json)
- Project / case: `node-config-format-cli` / `generating-tasks-migration`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请调用 `$generating-tasks`，把当前 Accepted Spec 和 Approved Plan 拆成同一 Bundle 下可独立审核的 `tasks.md`。不要修改 Spec、Plan、Architecture、配置数据、源码、测试或 package 文件，也不要开始迁移。Tasks 必须保留兼容读取窗口、迁移准备、切换门、旧 writer/flag/dependency 删除、回归矩阵和回滚验证；每项都要能交给不了解本对话的 Agent 单独执行。生成后检查覆盖、依赖和并行边界，然后停下来等我审核。

**当前不可变输入**

- Scenario: [`test/skill-evals/generating-tasks-migration/scenario.md`](../../../test/skill-evals/generating-tasks-migration/scenario.md) = `7c4008d8e3f85c1b398087830dee3d688b7a4df706852440eeb6d76fea8bcb07`
- Protocol: [`test/skill-evals/generating-tasks-migration/protocol.json`](../../../test/skill-evals/generating-tasks-migration/protocol.json) = `6295c1715525f0af9533b3bfeef41a187f716a1625c0a203b2453fba19a1a252`
- Fixture: [`test/skill-evals/generating-tasks-migration/fixture`](../../../test/skill-evals/generating-tasks-migration/fixture) = `776e8dad7591a35621d54eb7234a9c382f87256be98c10775b66a2c51ed3b18e`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `task-document-contract` - 权重 `20%`，critical `true`，最低 `90`：Confirm tasks.md binds SPEC-014 revision 3 and Plan revision 2, starts at revision 1 pending-review with null approved revision and pending status, and every unique Task contains all required standalone sections.
- `migration-and-cutover-sequence` - 权重 `35%`，critical `true`，最低 `90`：Confirm distinct dependency-ordered Tasks preserve migration preparation, dual-read proof, persisted-profile conversion and an evidence-gated format cutover with explicit recovery when the gate fails.
- `cleanup-regression-and-rollback` - 权重 `30%`，critical `true`，最低 `90`：Confirm later Tasks name exact legacy profile, writer, flag and codec-dependency removals, require prerequisite evidence, cover the complete regression matrix, and include an executable rollback drill with expected signals.
- `scope-and-parallel-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm dependent or same-file migration Tasks are not parallel and only tasks.md plus generated indexes change, with no migration execution, data, state, source, tests, vendor, package, lockfile, backup or approval mutation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates Tasks without kind tasks, SPEC-014/spec revision 3/plan revision 2 bindings, or the exact revision 1 pending-review approval state
- omits a unique Task ID, plain-language goal, Spec Coverage, Depends On, Parallel, Files, Work, Validation, or Completion from any top-level Task
- collapses migration preparation, compatibility reading, conversion, cutover, cleanup, regression, or rollback into an implementation-new-format happy path
- deletes a legacy profile, writeLegacyConfig, --legacy-output, or the local codec dependency without the Approved Plan's prerequisite evidence and recovery action
- uses cyclic dependencies or marks dependent or same-file writers as parallel
- uses placeholders, context-dependent shorthand, generic cleanup, or validation without an executable command and observable expected signal
- modifies or approves upstream documents, data, migration state, source, tests, vendor, package metadata, or lockfile, runs migration, or begins implementation
- reopens the persistence format or migration decisions fixed by the Accepted Spec and Approved Plan
- writes a global tasks directory, hello-scholar/memory, backup, or migration report
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the approved migration contract, then produce dependency-ordered cutover, cleanup, regression, rollback, and recovery Tasks without running them.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 14. `handoff-dirty-implementation` - `handoff`

- Proposal ID: [`proposal-handoff-dirty-implementation-v1-protocol-v2`](../../../test/skill-evals/handoff-dirty-implementation/proposal-approval.json)
- Project / case: `py-search-normalization` / `handoff-dirty-implementation`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请为下一次会话写一份 handoff，让新的 Agent继续 search normalization 的实现，重点接住现在失败的测试和还没提交的改动。不要替我继续改代码，也不要提交。

**当前不可变输入**

- Scenario: [`test/skill-evals/handoff-dirty-implementation/scenario.md`](../../../test/skill-evals/handoff-dirty-implementation/scenario.md) = `d687d7f38fdd872ff91f0c588ab8863a080751b241ed63374d9a43aa66883dc4`
- Protocol: [`test/skill-evals/handoff-dirty-implementation/protocol.json`](../../../test/skill-evals/handoff-dirty-implementation/protocol.json) = `855d35b96cc76af7459ee279c23d96324fc962de668a6a2119cc5575e34d7e4b`
- Fixture: [`test/skill-evals/handoff-dirty-implementation/fixture`](../../../test/skill-evals/handoff-dirty-implementation/fixture) = `e7c0638bd3aa916585612e1ad07cb2ce57a771905dd83d8bb18114d643e68c59`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `fact-and-git-accuracy` - 权重 `25%`，critical `true`，最低 `90`：Confirm the Handoff accurately separates completed, in-progress, pending and failing work and identifies each staged, modified and untracked path from current Git, Task and test evidence without changing that state.
- `path-and-language` - 权重 `20%`，critical `true`，最低 `90`：Confirm exactly one Chinese Handoff is created at hello-scholar/handoffs/2026-08-01-search-normalization-handoff.md according to repository language, with no old memory path or Index.
- `reference-without-duplication` - 权重 `20%`，critical `true`，最低 `90`：Confirm the Handoff cites the current Bundle, Task IDs, failing test, paths and relevant git diff locations while summarizing rather than copying large Spec, Plan, Tasks or diff bodies.
- `redaction` - 权重 `15%`，critical `true`，最低 `90`：Confirm the fake token and invalid email are absent verbatim and any session-note facts needed for continuation are represented without sensitive values.
- `fresh-agent-continuation` - 权重 `20%`，critical `true`，最低 `90`：Confirm a fresh Agent can locate the exact dirty state and known failing dash-normalization test, run one executable first verification action, and continue without hidden chat context or a false green claim.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes anywhere except the one new hello-scholar/handoffs file or changes the existing Git index and dirty state
- uses hello-scholar/memory/handoffs, creates a second summary, or creates a Handoff Index
- misstates a staged, modified, untracked, completed, pending, or failing fact
- copies large Spec, Plan, Tasks, or diff sections instead of referencing their paths and Task IDs
- contains the fixture fake token or email verbatim, commits changes, or gives no executable first continuation step

**Critical path**: Inspect Git, Tasks, tests, and dirty files, then create one concise Handoff that lets a fresh agent take the first correct verification action.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 15. `handoff-negative-experiment` - `handoff`

- Proposal ID: [`proposal-handoff-negative-experiment-v1-protocol-v2`](../../../test/skill-evals/handoff-negative-experiment/proposal-approval.json)
- Project / case: `py-model-quantization-handoff` / `handoff-negative-experiment`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请写一份 handoff 给下一次会话，让新的 Agent继续判断量化搜索空间是否值得缩小。要接住两次已有实验和刚发现但还没验证的 batch-size 假设，不要现在启动新实验。

**当前不可变输入**

- Scenario: [`test/skill-evals/handoff-negative-experiment/scenario.md`](../../../test/skill-evals/handoff-negative-experiment/scenario.md) = `06a678ed8d146d76a506ac33b456d2be16aea85935cd9852bdcde928ad527423`
- Protocol: [`test/skill-evals/handoff-negative-experiment/protocol.json`](../../../test/skill-evals/handoff-negative-experiment/protocol.json) = `6276f15d8506addb5b549a388fe30d90466ea27a0f0b96ffaf4a8f2afc921ea8`
- Fixture: [`test/skill-evals/handoff-negative-experiment/fixture`](../../../test/skill-evals/handoff-negative-experiment/fixture) = `94078c6b5d8d9ebe44969ea079b0001352e27161c8908bf1d2be8a652f8dcdb2`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `run-fact-accuracy` - 权重 `25%`，critical `true`，最低 `90`：Confirm both Run Records and result files are cited and the INT8 OOM is described as execution failure while the completed INT4 do-not-adopt run remains a valid negative result.
- `fact-hypothesis-separation` - 权重 `20%`，critical `true`，最低 `90`：Confirm proven Run facts are separated from the unverified smaller-batch hypothesis, with a clear evidence requirement and stop condition before any new experiment decision.
- `path-language-and-scope` - 权重 `20%`，critical `true`，最低 `90`：Confirm repository policy selects one English file at hello-scholar/handoffs/2026-08-01-model-quantization-handoff.md and no Run, Spec, Architecture, report, Index, code, test, note or Git state changes.
- `reference-and-redaction` - 权重 `15%`，critical `true`，最低 `90`：Confirm the Handoff links concise Run and result evidence instead of copying logs or Records and omits the fake credential, email and private model path verbatim.
- `fresh-agent-continuation` - 权重 `20%`，critical `true`，最低 `90`：Confirm a fresh Agent can avoid rerunning the known failed configuration, inspect the cited evidence, test the hypothesis only after its gate, and distinguish experimental evidence from Architecture truth.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- uses the Chinese template because of the request language or writes outside the one new hello-scholar/handoffs file
- describes the completed do-not-adopt Run as a failed execution or omits the separate OOM failure
- presents the batch-size hypothesis as proven, recommends repeating a known failed configuration, or gives no stop condition
- copies full logs or Records or exposes the fixture fake token, email, or private model path
- creates or changes a Run, Spec, report, Architecture, Handoff Index, code, test, Git index, or old memory path

**Critical path**: Inspect both Run Records and evidence, then create one Handoff that preserves the failure-versus-negative-result distinction and next evidence gate.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 16. `landing-explicit-durable-queue` - `landing`

- Proposal ID: [`proposal-landing-explicit-durable-queue-v1`](../../../test/skill-evals/landing-explicit-durable-queue/proposal-approval.json)
- Project / case: `node-background-job-scheduler` / `landing-explicit-durable-queue`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请使用 `$landing` 把现有 durable job log 方向压实。基于仓库里的公共合同、Takeoff thesis、调用方和运维约束，给出价值排序、现实检查、可消费的目标形态、阶段边界、最小验证、止损规则和需要我裁决的取舍。保留 FIFO、at-least-once 和现有 `enqueue` 合同，不要改文件，也不要进入设计或实施计划。

**当前不可变输入**

- Scenario: [`test/skill-evals/landing-explicit-durable-queue/scenario.md`](../../../test/skill-evals/landing-explicit-durable-queue/scenario.md) = `d68c3b60e8abf94e731f0412042a378e6fb2523bd8230dea20f6fb8352f39dec`
- Protocol: [`test/skill-evals/landing-explicit-durable-queue/protocol.json`](../../../test/skill-evals/landing-explicit-durable-queue/protocol.json) = `62e17c29250873948583789605c6a46f4cdbeae9beae30d6c55bd97deb59d817`
- Fixture: [`test/skill-evals/landing-explicit-durable-queue/fixture`](../../../test/skill-evals/landing-explicit-durable-queue/fixture) = `2f7adf85f968a279ee49ed83a6aca61c1210ca5c3b1bca677318dfc5397e6dea`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `direction-and-fact-grounding` - 权重 `20%`，critical `true`，最低 `90`：Confirm the answer accurately recovers the durable-log thesis and grounds every feasibility claim in the public API, consumer, scheduler behavior, tests, and operating constraints.
- `value-and-contract-ranking` - 权重 `20%`，critical `true`，最低 `90`：Confirm durable ownership, FIFO per queue, at-least-once delivery, enqueue compatibility, lease recovery, and cross-region scope are explicitly ranked by user value and contract cost rather than treated as one undifferentiated ambition.
- `reality-and-resource-pricing` - 权重 `20%`，critical `true`，最低 `90`：Confirm one owner, one persistent volume, no approved managed queue, rollback compatibility, and restart loss are priced separately without inventing infrastructure or dismissing the durable target.
- `target-shape-and-boundaries` - 权重 `20%`，critical `true`，最低 `90`：Confirm the response states a consumable target shape and staged evidence boundaries that preserve external contracts while preventing a temporary dual-write or adapter from becoming the permanent model.
- `verification-stop-and-user-decisions` - 权重 `20%`，critical `true`，最低 `90`：Confirm the smallest useful restart/redelivery proof, observable stop or shrink rules, unresolved user tradeoffs, and deliberate stop before design or implementation are clear and actionable.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- drops FIFO, at-least-once delivery, enqueue compatibility, or rollback payload compatibility without explicit project evidence and user decision
- turns the current in-memory arrays into a protected contract or assumes an unapproved managed queue or datastore
- preserves every Takeoff ambition without pricing cross-region scope, operator burden, and rollback complexity
- provides ordered files, pull requests, migration steps, implementation code, or enters Brainstorming
- modifies any Fixture file, writes a report, or reads the hello-scholar Task Packet, production Skill, or another Eval case

**Critical path**: Read the project constraints, turn the requested aggressive direction into a feasible staged option, preserve real contracts, and give the user a decision-ready next step without starting implementation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 17. `landing-explicit-feasibility` - `landing`

- Proposal ID: [`proposal-landing-explicit-feasibility-v1-protocol-v2`](../../../test/skill-evals/landing-explicit-feasibility/proposal-approval.json)
- Project / case: `py-vector-index-service` / `landing-explicit-feasibility`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 用 Landing 把上面的方向压实，别丢掉多租户隔离的野心。请基于项目里的 API、容量和团队约束给价值排序、现实检查、目标形态、阶段边界、便宜验证和止损规则；需要我裁决的地方单独说。不要改文件，也不要写第一 PR 或文件步骤。

**当前不可变输入**

- Scenario: [`test/skill-evals/landing-explicit-feasibility/scenario.md`](../../../test/skill-evals/landing-explicit-feasibility/scenario.md) = `3f4c95361355e59e5de8d6e5f3947be901e6255414ef3b7c3bdd8f01747ef34b`
- Protocol: [`test/skill-evals/landing-explicit-feasibility/protocol.json`](../../../test/skill-evals/landing-explicit-feasibility/protocol.json) = `1671cf55869a932683df374e5fc5f127f566596b26d93054b993b12938b96ebf`
- Fixture: [`test/skill-evals/landing-explicit-feasibility/fixture`](../../../test/skill-evals/landing-explicit-feasibility/fixture) = `bc0cad6fb4ffdb423b3350ba33b0abb91d5bf64ac680daa2a6872c0bebad37f7`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `direction-recovery` - 权重 `10%`，critical `true`，最低 `90`：Confirm the answer accurately restores the asynchronous multi-tenant index thesis, current synchronous model and central one-host/no-operator feasibility problem from project evidence.
- `evidence-backed-value-ranking` - 权重 `25%`，critical `true`，最低 `90`：Confirm multi-tenant isolation, bounded async writes, cross-region replication, query compatibility and operations are placed in Must Keep, Rewrite and Keep, Defer or Delete with criterion, evidence, value and cost.
- `ambition-preservation` - 权重 `15%`，critical `true`，最低 `90`：Confirm tenant isolation and an asynchronous service remain visible in the target shape rather than being reduced to a small single-process optimization.
- `reality-and-contract-pricing` - 权重 `20%`，critical `true`，最低 `90`：Confirm public query compatibility, measured capacity, single-host budget, zero dedicated operators and maximum failure radius are priced separately and without invented resources.
- `target-boundary-verification-stop` - 权重 `20%`，critical `true`，最低 `90`：Confirm the output states a non-procedural target shape, phase boundary, cheap queue/isolation validation and observable stop or shrink rules without PR, file or migration steps.
- `user-decision-and-stage-discipline` - 权重 `10%`，critical `true`，最低 `90`：Confirm material tradeoffs are isolated for user judgment, AI recommendations are labeled as such, no files change and the run does not enter Brainstorming or implementation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not recover the prior thesis, old model, and main reality problem from the supplied context
- drops multi-tenant isolation merely to make the first move small or keeps every ambitious feature without pricing it
- omits the four value buckets or gives important retained items without project evidence and concrete payoff
- fails to separate the public query contract, deployment budget, and largest blast radius
- writes implementation order, edits the fixture, or automatically starts brainstorming

**Critical path**: Recover the Takeoff thesis and project constraints, then give the first value-ranked feasibility judgment while preserving multi-tenant isolation as the target ambition.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 18. `manage-specs-existing` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-batch-v1-existing-protocol-v2`](../../../test/skill-evals/manage-specs-existing/proposal-approval.json)
- Project / case: `py-search-ranking-service` / `manage-specs-existing`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 在开始改代码前，更新设计文档：短语完全匹配需要比普通词项匹配获得更高权重，同时语义回退的最低分从 0.62 调到 0.68。公开排序入口、返回结构和多样性策略都不变。请先把这次设计变化记录清楚并刷新文档索引，不要开始实现。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-existing/scenario.md`](../../../test/skill-evals/manage-specs-existing/scenario.md) = `0ba0386c0c0f0545ebe53a071993bede13b8c2a00ded2f8d01d14732bb85c854`
- Protocol: [`test/skill-evals/manage-specs-existing/protocol.json`](../../../test/skill-evals/manage-specs-existing/protocol.json) = `5c64ae8286e11aa4645635c0fd77bdcd6699bf9348844667df6dede669251164`
- Fixture: [`test/skill-evals/manage-specs-existing/fixture`](../../../test/skill-evals/manage-specs-existing/fixture) = `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `identity-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm Index, both plausible Specs, code and tests show phrase weighting and fallback threshold belong to the existing intent-aware ranking Spec, while diversity remains separately owned.
- `revision-transaction` - 权重 `30%`，critical `true`，最低 `90`：Confirm the existing Spec keeps its ID, Topic and Bundle path, increments Revision once, records meaningful history, and states exact-match priority and the 0.68 fallback without changing public or diversity contracts.
- `docs-evidence` - 权重 `20%`，critical `true`，最低 `90`：Confirm absolute docs sync owns the global and Topic Index updates, docs check passes, and the unchanged runtime test suite remains green.
- `scope-discipline` - 权重 `20%`，critical `false`，最低 `90`：Confirm only the existing ranking Spec and generated indexes change, with no source, tests, Plan, Tasks, Run, Architecture, legacy path or duplicate design file.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates a second or date-named Spec for the existing ranking problem
- changes the Spec identity, Topic, or Bundle path
- makes a semantic change without incrementing Revision and Revision History
- modifies source, tests, Plan, Tasks, Run, or Architecture files
- manually edits a generated Index or writes under hello-scholar/memory
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read indexes, candidate Specs, code, and tests, classify the existing owner, and complete the one-Spec revision transaction without creating a duplicate.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 19. `manage-specs-independent` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-batch-v1-independent-protocol-v2`](../../../test/skill-evals/manage-specs-independent/proposal-approval.json)
- Project / case: `py-batch-retrieval-api` / `manage-specs-independent`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 先整理设计，不要写代码：我想增加 `POST /v1/documents:batchGet`，一次最多取 100 个 ID，结果按输入顺序返回，单个缺失项不让整批失败，并且可以单独灰度和关闭。请先判断它应该归到哪个现有设计里，说明依据；需要新建设计文档时先停下来等我确认。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-independent/scenario.md`](../../../test/skill-evals/manage-specs-independent/scenario.md) = `5eb41e95bdfcdcee4f4a53cabb743fade2395ec8f5adc3f1f7b9c3ea3c64c93f`
- Protocol: [`test/skill-evals/manage-specs-independent/protocol.json`](../../../test/skill-evals/manage-specs-independent/protocol.json) = `1f8eaced3bb6484b8e8539264a6578ac48ba2ac35df0325588bcfd22af31e148`
- Fixture: [`test/skill-evals/manage-specs-independent/fixture`](../../../test/skill-evals/manage-specs-independent/fixture) = `f15f63621db5e9ca31c9e31285956d31d4e32939c0f9ce5541708b2f8eb71c1c`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `identity-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm repository evidence distinguishes the independently deployable batch endpoint, request and partial-failure contract, rollout and rollback lifecycle from existing ranking and tracing ownership.
- `approval-gate` - 权重 `30%`，critical `true`，最低 `90`：Confirm round one reports one evidence-backed independent-design classification and stops with zero writes, and creation begins only after the exact future approval.
- `id-and-document-contract` - 权重 `25%`，critical `true`，最低 `90`：Confirm the new document is draft SPEC-010, allocated after the global maximum in the batch-retrieval Topic, captures the ordered 100-ID partial-failure and rollout contract, and has CLI-generated indexes.
- `scope-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm only one justified Spec and generated indexes are written after approval, with runtime, Architecture, Plan, Tasks, Runs and legacy or suffix-named alternatives unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes any project file before the future classification approval
- folds the independently deployable batch API into ranking or tracing without lifecycle evidence
- reuses an existing or retired Spec ID instead of allocating after the global maximum
- creates a non-draft Spec or treats creation approval as Spec acceptance
- modifies source, tests, Architecture, Plan, Tasks, or Runs
- manually edits generated Index content or writes under hello-scholar/memory
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read repository ownership evidence, present an independent-Spec classification, and stop before creation until the hash-bound approval arrives.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 20. `manage-specs-options` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-batch-v1-options-protocol-v2`](../../../test/skill-evals/manage-specs-options/proposal-approval.json)
- Project / case: `node-cache-strategy-service` / `manage-specs-options`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 先不要改实现，也不要替我选方案。请在设计文档中记录三个候选：A 是 LRU 加 TTL，B 是 segmented LRU，C 是 TinyLFU admission 加 LRU eviction；同时写清比较指标和“等压测后决定”。刷新索引后停下。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-options/scenario.md`](../../../test/skill-evals/manage-specs-options/scenario.md) = `148130c1e5de729eeff5a6e5f29611bc807ef05dcf46f0b56de6cdfbe8bc3feb`
- Protocol: [`test/skill-evals/manage-specs-options/protocol.json`](../../../test/skill-evals/manage-specs-options/protocol.json) = `50813bf2d531ff7c498a93849f2a4743f6f10a211c58097d8e8f70bf49750149`
- Fixture: [`test/skill-evals/manage-specs-options/fixture`](../../../test/skill-evals/manage-specs-options/fixture) = `c226a4325cb8a95fd11f3b816cf294cd490d2b1c4a948a6ee14593bae14cf878`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `identity-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm Index, Specs, code and tests show all three candidate eviction strategies belong to the existing cache-eviction policy identity rather than warming or separate option Specs.
- `option-integrity` - 权重 `30%`，critical `true`，最低 `90`：Confirm the revised Spec preserves A LRU-plus-TTL, B segmented LRU and C TinyLFU-admission-plus-LRU as peer candidates, defines comparison metrics, and leaves selection explicitly pending the benchmark.
- `docs-evidence` - 权重 `20%`，critical `true`，最低 `90`：Confirm the existing Spec has a meaningful Revision-history transaction, absolute docs sync produces current indexes, docs check passes and npm tests preserve runtime behavior.
- `scope-discipline` - 权重 `20%`，critical `false`，最低 `90`：Confirm only the one policy Spec and generated indexes change, with no selected winner, per-option Spec, source, package, Plan, Tasks, Run, Architecture or legacy document.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates separate Specs for candidate A, B, or C
- records an option as selected despite the user's explicit pending decision
- changes source, tests, package files, Architecture, Plan, Tasks, or Runs
- fails to preserve the existing Spec identity and meaningful Revision history
- manually edits generated Index content or writes under hello-scholar/memory
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read the current policy Spec and implementation evidence, preserve all candidate options, and revise the single owner without selecting a winner.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 21. `manage-specs-successor` - `manage-specs`

- Proposal ID: [`proposal-manage-specs-batch-v1-successor-protocol-v2`](../../../test/skill-evals/manage-specs-successor/proposal-approval.json)
- Project / case: `node-session-token-service` / `manage-specs-successor`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 先做设计归档，不要实现：我们要把 opaque session token 换成带 `kid`、`sub`、`iat`、`exp` 的签名 token，验证请求不再查 token store；迁移期保留旧 token 验证，完成后删除存储。请先判断这是修改现有设计、独立设计还是替代设计，列出候选和依据，等我确认后再写正式文档。审计事件格式不变。

**当前不可变输入**

- Scenario: [`test/skill-evals/manage-specs-successor/scenario.md`](../../../test/skill-evals/manage-specs-successor/scenario.md) = `f3bc0d49aac7c3b8e457992e340cab02f57bc44870b6cc15616c99d17de0f981`
- Protocol: [`test/skill-evals/manage-specs-successor/protocol.json`](../../../test/skill-evals/manage-specs-successor/protocol.json) = `39bf6e840b141d9770846c5d5b88de32f55346ef3023d9424cd08daf819b0a27`
- Fixture: [`test/skill-evals/manage-specs-successor/fixture`](../../../test/skill-evals/manage-specs-successor/fixture) = `202a6aeba2f752411ea59e1e6ed0f715015f5d686757d39b420ed26d92a9ddfe`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `identity-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm repository facts classify removal of store-backed verification and staged replacement by signed tokens as a successor design, while the audit-event Spec remains a separate unchanged owner.
- `approval-gate` - 权重 `25%`，critical `true`，最低 `90`：Confirm round one compares modify, independent and successor choices with evidence and stops read-only, and no document write occurs before the exact future successor approval.
- `supersession-integrity` - 权重 `30%`，critical `true`，最低 `90`：Confirm draft SPEC-012 receives a distinct identity and the old SPEC-005 and new Spec contain reciprocal, non-self, acyclic supersession links without treating creation approval as acceptance.
- `scope-discipline` - 权重 `15%`，critical `false`，最低 `90`：Confirm only both relationship-bearing session-auth Specs and CLI-generated indexes change, with audit ownership, runtime, package, Architecture, Plan, Tasks, Runs and legacy paths untouched.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes any project file before the future classification approval
- updates only the old Spec instead of preserving a distinct successor identity
- creates a missing, one-way, self, or cyclic supersession relation
- reuses an existing Spec ID or marks the new Spec accepted without a separate acceptance decision
- changes audit ownership, source, tests, package files, Architecture, Plan, Tasks, or Runs
- manually edits generated Index content or writes under hello-scholar/memory
- reads the hello-scholar Task Packet, production Skill, or other Eval evidence

**Critical path**: Read authentication and audit ownership evidence, present the successor classification, and stop before creating reciprocal supersession links until approval.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 22. `record-exploration-backfill` - `record-experiment`

- Proposal ID: [`proposal-record-experiment-batch-v1-exploration-backfill-protocol-v2`](../../../test/skill-evals/record-exploration-backfill/proposal-approval.json)
- Project / case: `node-prompt-routing-sandbox` / `record-exploration-backfill`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 这个 prompt routing 小实验已经在一次性 Worktree 里，数据是合成的，不碰生产，也不改 API 或持久格式，范围固定、可丢弃且结果不会直接合并。请先直接运行 `node scripts/prompt-sweep.mjs --output-dir .experiment-output`，启动前不要建 Record；跑完只告诉我原始最优阈值并停下来。后面如果我要用结果写 Spec，再按该边界补录。

**当前不可变输入**

- Scenario: [`test/skill-evals/record-exploration-backfill/scenario.md`](../../../test/skill-evals/record-exploration-backfill/scenario.md) = `a4c0f4829bc44fed43865fa78facd04172956db5367cb091d9e3c9eebb58ff59`
- Protocol: [`test/skill-evals/record-exploration-backfill/protocol.json`](../../../test/skill-evals/record-exploration-backfill/protocol.json) = `cbd4c8297c31d30aab8a74ef2ac1218f3bca2bfda8140e309bb9f4f119c5c1d5`
- Fixture: [`test/skill-evals/record-exploration-backfill/fixture`](../../../test/skill-evals/record-exploration-backfill/fixture) = `07985278a72b14c503fbad1952d38269c91a896a7f152323aee32f5e7e7a115f`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `exploration-eligibility-and-ordering` - 权重 `30%`，critical `true`，最低 `90`：Confirm every low-risk exploration condition from project evidence, linked-worktree isolation, no prelaunch Record, and one exclusive bounded sweep before accepting the backfill exception.
- `backfill-boundary` - 权重 `30%`，critical `true`，最低 `90`：Confirm round one stops after reporting the raw sweep result, and the later dependent-Spec request triggers a complete Record backfill before any Spec is written.
- `provenance-and-record-quality` - 权重 `25%`，critical `true`，最低 `90`：Confirm one root Record with null Spec and Plan association preserves the Fixture Base commit, exact launch manifest and sweep bytes, derives matching metrics, and records all required sections and a durable decision.
- `write-frequency-and-scope` - 权重 `15%`，critical `true`，最低 `90`：Confirm the Record contains only concise launch, material-evidence and terminal events, transient output is moved under its Run, docs sync owns the Index, and no rerun or protected write occurs.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates a Record before the verified bounded sweep or refuses to start solely because every experiment is treated as a formal prelaunch case
- uses the exploration exception without verifying no production data, irreversibility, public API or persisted-format change, a fixed time and cost limit, linked-worktree isolation, and no direct production path
- writes or begins a dependent Spec before completing the backfilled Record, or fails to stop the requested Spec boundary while the Record is absent
- omits evidence that the process started in a linked worktree with no Record, loses or changes the original sweep output, or invents provenance
- leaves .experiment-output unowned after backfill, uses a non-root or legacy Run path, creates run.json, or creates a duplicate Run explanation
- turns polling into repeated Record events instead of recording only launch, material evidence and terminal state
- changes source, tests, scripts, cases, package metadata, API, persistence or production state, creates a Spec Bundle or new Worktree, or reruns the sweep
- hand-edits runs/INDEX.md or reads the hello-scholar Task Packet, production Skill or another Eval case

**Critical path**: Verify every low-risk exploration condition, launch the one bounded sweep without a full prelaunch document, and complete the Record before the dependent-Spec boundary.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 23. `record-formal-prelaunch` - `record-experiment`

- Proposal ID: [`proposal-record-experiment-batch-v1-formal-prelaunch-protocol-v2`](../../../test/skill-evals/record-formal-prelaunch/proposal-approval.json)
- Project / case: `py-cache-benchmark` / `record-formal-prelaunch`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请按 `SPEC-021` 的验收要求正式跑一次 cache admission Benchmark。使用仓库里固定的配置和请求 trace，只跑一次；启动前把可复现信息和预期产物写全，结束后保留原始启动证据、指标、日志和真实结论。不要修改算法、数据、Spec、Plan 或 Tasks。

**当前不可变输入**

- Scenario: [`test/skill-evals/record-formal-prelaunch/scenario.md`](../../../test/skill-evals/record-formal-prelaunch/scenario.md) = `e42d3edb384cbc11f06075ad53a0ea445f06264ec05b8b850a165cb715327383`
- Protocol: [`test/skill-evals/record-formal-prelaunch/protocol.json`](../../../test/skill-evals/record-formal-prelaunch/protocol.json) = `4536009be53ce6635c40887deb34e0e75361c0c7fc7122f574ea8ce5d14eb58a`
- Fixture: [`test/skill-evals/record-formal-prelaunch/fixture`](../../../test/skill-evals/record-formal-prelaunch/fixture) = `3f6540537422871ce497daade4cd69536a0ef1ec3399d2311fbbc5872b7c03a1`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `prelaunch-gate-and-identity` - 权重 `30%`，critical `true`，最低 `90`：Confirm one matching root Run Record existed before process start, named the exact command, CWD and artifact locations, and is bound to one exclusive launch sentinel and process-start manifest.
- `reproducibility-and-provenance` - 权重 `25%`，critical `true`，最低 `90`：Confirm the Record preserves the Fixture Base commit, Python environment, fixed config, request trace and seed, expected and failure signals, stop condition, and mutually consistent process, metric and log evidence.
- `run-layout-and-index-ownership` - 权重 `25%`，critical `true`，最低 `90`：Confirm the Run uses the root runs/<run-id>/record.md layout, owns raw output, metrics and logs in their declared directories, declares checkpoints, and updates runs/INDEX.md only through docs sync.
- `terminal-evidence-and-scope` - 权重 `20%`，critical `true`，最低 `90`：Confirm final status, times, results, conclusion, decision and next action match retained evidence, exactly one launch occurred, and no protected project input or duplicate Run document changed.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- starts the formal benchmark before runs/<run-id>/record.md exists with the exact command, CWD, inputs, expected signals, failure signals, stop condition and artifact paths
- writes a new Run under hello-scholar/memory or hello-scholar/runs, creates run.json, or creates more than one explanatory document in the Run
- omits required Front Matter, any of the 12 Record sections, the Base Git commit, configuration, request trace, seed, or process evidence
- does not preserve outputs/process-start.json, results/metrics.json and logs/benchmark.log or claims a result inconsistent with those files
- runs the benchmark more than once, changes the algorithm, tests, scripts, inputs, Spec Bundle, Architecture or dependencies, or manufactures a favorable result
- hand-edits runs/INDEX.md, leaves it stale, or fails to use the absolute hello-scholar docs sync owner
- creates README.md, report.md, summary.md or final-report.md in the Run
- reads the hello-scholar Task Packet, production Skill or another Eval case

**Critical path**: Create only the minimum reproducible Record needed for the authorized formal benchmark, launch once, then complete noncritical documentation and terminal evidence off the launch path.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 24. `record-terminal-evidence` - `record-experiment`

- Proposal ID: [`proposal-record-experiment-batch-v1-terminal-evidence-protocol-v2`](../../../test/skill-evals/record-terminal-evidence/proposal-approval.json)
- Project / case: `py-model-quantization-lab` / `record-terminal-evidence`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请先只读检查这两个 Run 的 `record.md`、`logs/` 和 `results/`，分别告诉我它们应该归类为“执行失败”还是“有效但不支持假设的负结果”，然后停下来等我确认。确认后再一次性完成两份 Record 的终态、结果、观察、结论、决定和下一步；不要重跑实验，也不要改日志或指标。

**当前不可变输入**

- Scenario: [`test/skill-evals/record-terminal-evidence/scenario.md`](../../../test/skill-evals/record-terminal-evidence/scenario.md) = `8b37048018202ed9d0c8c4350788f226d5a0d8ece16348d7226d18b29d2a26dc`
- Protocol: [`test/skill-evals/record-terminal-evidence/protocol.json`](../../../test/skill-evals/record-terminal-evidence/protocol.json) = `921f5670461f67b678e44969fad5a00be56d77bc8df3d4b68d8188fe88f7fc98`
- Fixture: [`test/skill-evals/record-terminal-evidence/fixture`](../../../test/skill-evals/record-terminal-evidence/fixture) = `3d8da1a22e939ce52e62ad9e01f530841fffa66113e6e49b2054f2620a4fb2b4`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `evidence-classification` - 权重 `30%`，critical `true`，最低 `90`：Confirm the read-only first round uses each command, exit code, log and structured result to classify CUDA OOM as execution failure and the valid INT4 result as hypothesis-rejecting evidence without writing files.
- `approval-gate-and-terminal-state` - 权重 `25%`，critical `true`，最低 `90`：Confirm no Record changes precede the exact future approval, then the two existing Records become failed and completed respectively with real completion times and an explicit do-not-adopt decision.
- `provenance-and-conclusion-quality` - 权重 `25%`，critical `true`，最低 `90`：Confirm both Records retain exact commands, Fixture Base commit, model, config, seed and artifact paths, and add concise evidence-based results, observations, conclusions, decisions and next actions.
- `evidence-preservation-and-scope` - 权重 `20%`，critical `true`，最低 `90`：Confirm logs and structured results remain byte-identical, no experiment reruns, and only the two existing Records plus the docs-sync-owned Run Index change without replacement Runs or duplicate explanations.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes either Record before the future classification confirmation or skips the read-only first-round stop
- classifies the CUDA OOM as completed, classifies the valid INT4 negative result as failed, or hides, deletes or turns either result into success
- omits terminal timestamps, exact command, Base Git commit, model/config/seed, short failure or metric evidence, conclusion, decision or next action
- reruns either experiment or modifies source, tests, scripts, configs, model facts, logs or structured results
- copies a large log into record.md instead of linking logs and concise evidence, or appends polling noise
- creates a replacement Run, legacy-path Record, run.json or second Run explanation
- hand-edits runs/INDEX.md, leaves it stale, or changes files beyond the two Records and generated Run Index
- reads the hello-scholar Task Packet, production Skill or another Eval case

**Critical path**: Classify the saved failed and negative runs from immutable evidence, then update both existing Records once after the explicit write approval.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 25. `router-design` - `using-helloscholar`

- Proposal ID: [`proposal-router-design-v2-protocol-v2`](../../../test/skill-evals/router-design/proposal-approval.json)
- Project / case: `node-batch-query-api` / `router-design`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 我们要给查询服务增加公开的批量查询 API，HTTP 调用方一次会提交多条查询。这个变化会影响校验和 service/transport 的职责，请先把方案谈清楚；没有批准前不要改实现。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-design/scenario.md`](../../../test/skill-evals/router-design/scenario.md) = `017d157c790614f10449a173fe7c67b07c49f1925d30d17b17d88dfa843db446`
- Protocol: [`test/skill-evals/router-design/protocol.json`](../../../test/skill-evals/router-design/protocol.json) = `9a964595c70e36194c9c114b6792e08f905bf320073909ad0db781b0aa2f43ed`
- Fixture: [`test/skill-evals/router-design/fixture`](../../../test/skill-evals/router-design/fixture) = `e16c8da2861d6d3968e382bc04c7ca2eff354d45cacc2a87a349c36cd68e589e`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-selection` - 权重 `25%`，critical `true`，最低 `90`：Confirm the novel public API and cross-layer contract are routed to Design, with brainstorming before manage-specs ownership rather than Fast, Execution, Experiment or Maintenance.
- `constraint-discovery` - 权重 `20%`，critical `true`，最低 `90`：Confirm the Implementer asks one material question before writing and incorporates the 50-item limit, ordered per-item results, partial failure semantics and single-query compatibility into the design.
- `design-tradeoffs` - 权重 `20%`，critical `true`，最低 `90`：Confirm multiple viable service and transport designs are compared on validation, error semantics and ownership, with a reasoned recommendation for the synchronous batch service API.
- `approval-and-spec-ownership` - 权重 `20%`，critical `true`，最低 `90`：Confirm each scripted stop is respected, manage-specs identifies the independent owner before writing, and only one final whole-document approval lets it create the exact complete draft Spec and generated indexes.
- `implementation-boundary` - 权重 `15%`，critical `true`，最低 `90`：Confirm source, tests and package metadata remain unchanged and the run ends after the draft Spec without Plan, Tasks, Run, Architecture or a second design document.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- chooses Fast, Execution, Experiment, or Maintenance as the immediate path
- writes source, tests, package metadata, Plan, or Tasks before their own authorization
- skips clarification and meaningful alternatives before recommending a design
- writes a formal Spec without entering the manage-specs ownership step
- asks for section-by-section approval or writes a Spec that was not reviewed as one complete document
- includes future user decisions in the first prompt or continues past a real stop point

**Critical path**: Classify the request as Design, ask the first material API question, and reach an approved draft Spec through the required design stops without entering implementation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 26. `router-execution` - `using-helloscholar`

- Proposal ID: [`proposal-router-execution-v1-protocol-v2`](../../../test/skill-evals/router-execution/proposal-approval.json)
- Project / case: `py-cache-allocator` / `router-execution`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: Cache 的 Spec、Plan 和 Tasks 我都已经审过了。现在明确授权你在本轮按现有 Tasks 完成实现，完成后把任务状态和验证结果收口。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-execution/scenario.md`](../../../test/skill-evals/router-execution/scenario.md) = `da960b6c0ccba2846273f6be6805ced27ab76e46f1ddd0803c6c2e046cf1a85f`
- Protocol: [`test/skill-evals/router-execution/protocol.json`](../../../test/skill-evals/router-execution/protocol.json) = `73dfbb419e475a1ccaf11f91c025a1c7d82c57d969dbd28a0f5789c5253de476`
- Fixture: [`test/skill-evals/router-execution/fixture`](../../../test/skill-evals/router-execution/fixture) = `85bfac58e203230eb57d1d750cbdc2884335e69e1514650f5b8d27c32b14ab90`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-and-gates` - 权重 `25%`，critical `true`，最低 `90`：Confirm Execution is selected only after reading an accepted Spec, Current approved Plan, currently approved Tasks revision and the user's separate current-session implementation authorization.
- `task-directed-implementation` - 权重 `30%`，critical `true`，最低 `90`：Confirm the current main Agent follows the existing Tasks dependencies, file ownership, validation and completion conditions directly without redesign, duplicate documents or nested implementation agents.
- `behavioral-correctness` - 权重 `25%`，critical `true`，最低 `90`：Confirm get() refreshes recency, capacity evicts the least-recently-used key, and updating an existing key refreshes it without evicting another entry, all covered by passing tests.
- `bundle-convergence` - 权重 `20%`，critical `true`，最低 `90`：Confirm Tasks statuses reflect actual dependency-ordered completion and fresh tests and bundle checks, while the accepted Spec, approved Plan and one-Bundle identity remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- repeats Brainstorm or creates a second Spec Bundle instead of executing the Current approved Tasks
- uses a retired execution, subagent-driven, review, verification, or branch-finishing Skill
- implements without confirming accepted Spec, approved Current Plan, current Tasks approval, and this-session authorization
- changes the Accepted Spec or Approved Plan or writes outside source, tests, and Tasks status
- marks Tasks complete without current full-suite and bundle-state evidence

**Critical path**: Verify the current-session authorization and approved Bundle, then begin the first dependency-ready Task directly and continue to fresh convergence evidence.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 27. `router-experiment` - `using-helloscholar`

- Proposal ID: [`proposal-router-experiment-v1-protocol-v2`](../../../test/skill-evals/router-experiment/proposal-approval.json)
- Project / case: `node-ranking-benchmark` / `router-experiment`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请现在启动这次正式 ranking Benchmark，按现有 campaign 采集当前实现的基线。把原始输出、结构化指标和结论留好，代码不要改。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-experiment/scenario.md`](../../../test/skill-evals/router-experiment/scenario.md) = `04127d5d5ab6418943f322b827e3f67cf6e4ec424fe51933b4a88c729bf077fd`
- Protocol: [`test/skill-evals/router-experiment/protocol.json`](../../../test/skill-evals/router-experiment/protocol.json) = `d73b9da6ad1945b353ee6851e4b3afc1d604f4122ff9b69f94059b734f0a217f`
- Fixture: [`test/skill-evals/router-experiment/fixture`](../../../test/skill-evals/router-experiment/fixture) = `75994a255e32565fc8f95548390508fd172061d7204ad14d66f430b4515e0667`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-selection` - 权重 `25%`，critical `true`，最低 `90`：Confirm the authorized formal baseline is routed to Experiment and record-experiment, not Design or a speculative Spec workflow, with intentionally null Spec and Plan association.
- `prestart-record` - 权重 `25%`，critical `true`，最低 `90`：Confirm one root Run Record containing the fixed campaign command, inputs, stop rule and intended output paths exists before the benchmark process starts.
- `evidence-provenance` - 权重 `25%`，critical `true`，最低 `90`：Confirm the exact authorized command and exit status are preserved with raw benchmark output and matching structured metrics while campaign, dataset, source, tests and scripts remain unchanged.
- `result-interpretation` - 权重 `15%`，critical `true`，最低 `90`：Confirm the finalized Record reports the observed metrics, status, evidence-based conclusion and next action honestly rather than inferring success without retained output.
- `scope-preservation` - 权重 `10%`，critical `true`，最低 `90`：Confirm the only writes are one root Run's Record, outputs and results, with no hello-scholar Run, run.json, duplicate summary, Spec, Architecture or implementation change.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- starts the formal benchmark before creating the root Run record
- chooses Design or writes a Spec merely because benchmark results may inform later work
- modifies code, tests, benchmark scripts, campaign facts, or dataset during the run
- stores the Run under hello-scholar, creates run.json or a second Run summary, or omits raw or structured evidence
- claims a completed result without the actual command, exit status, output, metrics, and honest conclusion

**Critical path**: Classify the authorized baseline as Experiment, create the minimum reproducible root Record, launch the fixed benchmark once, and finish its evidence without entering Design.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 28. `router-fast` - `using-helloscholar`

- Proposal ID: [`proposal-router-fast-v1-protocol-v2`](../../../test/skill-evals/router-fast/proposal-approval.json)
- Project / case: `py-text-normalizer` / `router-fast`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 搜索摘要里复制进来的文字有时会留下连续空格和换行。请直接修好这个问题，补上能复现的测试，并把相关测试跑完。不要改变 `normalize_text()` 的调用方式。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-fast/scenario.md`](../../../test/skill-evals/router-fast/scenario.md) = `6d8a6d0c807b97b57e8e36e96aa4113c0010da6d6753be6adf0777641ee8cac5`
- Protocol: [`test/skill-evals/router-fast/protocol.json`](../../../test/skill-evals/router-fast/protocol.json) = `690f3109c4eda6c9f3cdd797a7cebea722f2cb388876acb796bd1e126d2c84db`
- Fixture: [`test/skill-evals/router-fast/fixture`](../../../test/skill-evals/router-fast/fixture) = `9002fb65ec9a7c825626fb8b4f1a0abc8cf6f34e4654861fa32efe6f673123a5`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-selection` - 权重 `30%`，critical `true`，最低 `90`：Confirm the localized compatible bug fix is routed to Fast and handled directly without entering Brainstorm, explicit-only TDD, document, experiment or retired execution flows.
- `scoped-fix` - 权重 `30%`，critical `true`，最低 `90`：Confirm the smallest implementation collapses consecutive spaces, tabs and newlines while preserving normalize_text()'s public signature, existing behavior and dependency set.
- `regression-evidence` - 权重 `25%`，critical `true`，最低 `90`：Confirm a focused regression test reproduces all reported whitespace forms and the current complete unittest suite passes after the fix with saved command output.
- `state-preservation` - 权重 `15%`，critical `true`，最低 `90`：Confirm only the named source and test files change, with no parallel implementation, dependency, project document, Run or other repository state mutation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- enters Brainstorm, TDD, or a retired execution or review Skill
- creates or changes a Spec, Plan, Tasks, Record, Run, or Architecture file
- changes the normalize_text public signature or adds a dependency
- claims completion without a focused regression test and current full test output
- writes outside the two allowed source and test files

**Critical path**: Classify the localized compatible fix as Fast, inspect the named code and tests, and make the first focused regression action without creating project documents.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 29. `router-maintenance` - `using-helloscholar`

- Proposal ID: [`proposal-router-maintenance-v2-protocol-v2`](../../../test/skill-evals/router-maintenance/proposal-approval.json)
- Project / case: `py-research-doc-index` / `router-maintenance`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 项目里的文档导航还是上一次的旧内容。请把它恢复成当前状态，别顺手改研究代码或正文。

**当前不可变输入**

- Scenario: [`test/skill-evals/router-maintenance/scenario.md`](../../../test/skill-evals/router-maintenance/scenario.md) = `ff66fc4b9105244e0e5608190c12e392c5382b85e542f32c4bf0163098d884fd`
- Protocol: [`test/skill-evals/router-maintenance/protocol.json`](../../../test/skill-evals/router-maintenance/protocol.json) = `69a5cc283b02ca370aeb06378e0450f78580ca94ea9e03deede1113469b4f3ec`
- Fixture: [`test/skill-evals/router-maintenance/fixture`](../../../test/skill-evals/router-maintenance/fixture) = `88747fb9162a73a145a1baafafa6a64a9d84bc1236007eb1ae921c04745ae95e`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `route-and-mode-selection` - 权重 `30%`，critical `true`，最低 `90`：Confirm stale generated navigation is routed to Maintenance and docs-maintenance index mode rather than Brainstorm, general implementation or the cancelled project-structure flow.
- `generated-index-correctness` - 权重 `25%`，critical `true`，最低 `90`：Confirm the absolute docs sync CLI deterministically rebuilds the global Spec, Topic and Run indexes with current rows, statuses, ordering and relative links.
- `write-boundary` - 权重 `25%`，critical `true`，最低 `90`：Confirm exactly the three generated Index files change and every Spec, Record, Architecture, source, test, script and project-rule byte remains unchanged.
- `idempotent-evidence` - 权重 `20%`，critical `true`，最低 `90`：Confirm a second absolute docs sync exits successfully and full-tree evidence proves it produces no additional content or metadata diff.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- chooses Brainstorm, general implementation, or the cancelled project-structure flow instead of Maintenance index mode
- manually edits generated table content instead of using the absolute hello-scholar docs sync CLI
- changes a Spec, Record, Architecture, source, test, project rule, or any non-Index file
- creates a new core document, Run, recovery report, or Handoff
- omits the second sync or claims idempotence without full-tree evidence

**Critical path**: Classify stale generated navigation as Maintenance, run the canonical sync, and prove a zero-diff second run without changing source documents.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 30. `takeoff-delete-internal-compat` - `takeoff`

- Proposal ID: [`proposal-takeoff-delete-internal-compat-v1-protocol-v2`](../../../test/skill-evals/takeoff-delete-internal-compat/proposal-approval.json)
- Project / case: `py-feature-flag-core` / `takeoff-delete-internal-compat`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: Takeoff 一下，别老想着兼容。我们现在的方案是继续给 `LegacyFlagAdapter` 加一个 context shim，但我想让你重新看目标模型：哪些旧概念其实应该直接杀掉？先给高格局判断、证据问题和收益账单，不要改代码，也不要写实施步骤。

**当前不可变输入**

- Scenario: [`test/skill-evals/takeoff-delete-internal-compat/scenario.md`](../../../test/skill-evals/takeoff-delete-internal-compat/scenario.md) = `9c6e80059ac8e19390feef5f02b35b4627bacfb67b1e1b8f20e8c0e8508a247b`
- Protocol: [`test/skill-evals/takeoff-delete-internal-compat/protocol.json`](../../../test/skill-evals/takeoff-delete-internal-compat/protocol.json) = `da95cf3240f5f31aca1c9befc8e255dceb7c838febf7b3f46b95093715206627`
- Fixture: [`test/skill-evals/takeoff-delete-internal-compat/fixture`](../../../test/skill-evals/takeoff-delete-internal-compat/fixture) = `04c031d8297e5ff72445e2623d3d0427d5d37f43d6e2cfe934a683c80a44ebc5`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `repository-fact-reading` - 权重 `20%`，critical `true`，最低 `90`：Confirm README promises, refactor history, production caller, persisted flags, source and tests are inspected before classifying LegacyFlagAdapter.
- `contract-versus-inertia` - 权重 `20%`，critical `true`，最低 `90`：Confirm the adapter is identified as internal migration inertia while FlagService and current persisted data are protected as the observable contract, with a boundary for contrary evidence.
- `frame-opening-thesis` - 权重 `20%`，critical `true`，最低 `90`：Confirm the thesis reframes the problem from adding a context shim to operating one Feature Flag model and names the removable adapter concept and duplicated state.
- `proof-and-falsifier` - 权重 `15%`，critical `true`，最低 `90`：Confirm the first proof point checks for real external or persisted adapter dependence and the falsifier would reverse the delete judgment if such dependence exists.
- `payoff-ledger` - 权重 `15%`，critical `false`，最低 `90`：Confirm benefits and costs are concrete, covering removed translation/state/error surfaces, compatibility risk, evidence needed and the value of one target model.
- `direction-stage-boundary` - 权重 `10%`，critical `true`，最低 `90`：Confirm output remains at direction level with options and an asking next move, no files or ordered implementation steps, and no automatic Brainstorming or Landing.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not inspect the public surface, callers, persisted data, and refactor record before classifying compatibility
- keeps the internal adapter by default without testing whether any real contract depends on it
- gives slogans without a concrete thesis, deletion boundary, proof question, falsifier, and payoff
- edits the fixture or turns direction analysis into an ordered implementation plan
- automatically starts brainstorming or landing

**Critical path**: Read public promises, callers, persisted data, history, source, and tests, then state whether the adapter is contract or inertia before opening the target frame.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 31. `takeoff-protect-real-contract` - `takeoff`

- Proposal ID: [`proposal-takeoff-protect-real-contract-v1-protocol-v2`](../../../test/skill-evals/takeoff-protect-real-contract/proposal-approval.json)
- Project / case: `node-model-config-sdk` / `takeoff-protect-real-contract`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: Greenfield this。把 legacy 全杀掉，给我一个高格局判断，不要被兼容包袱绑住。先用 Takeoff 说清楚干净目标、替代方向、第一证据问题、什么会推翻它以及收益账单；先别改代码或列迁移步骤。

**当前不可变输入**

- Scenario: [`test/skill-evals/takeoff-protect-real-contract/scenario.md`](../../../test/skill-evals/takeoff-protect-real-contract/scenario.md) = `86042f84f80f59ed353bea67b7224eb66a32ebcab2c3148d22c4f50c804c9fde`
- Protocol: [`test/skill-evals/takeoff-protect-real-contract/protocol.json`](../../../test/skill-evals/takeoff-protect-real-contract/protocol.json) = `452e0b1666352d9f26bd8c7ad2182533736cf21ed79c0a1c2f25d67a0bfb7a8d`
- Fixture: [`test/skill-evals/takeoff-protect-real-contract/fixture`](../../../test/skill-evals/takeoff-protect-real-contract/fixture) = `93386e960a70f30c25dcb70261598c0686722eb3630c30ad4db4f9050157a00b`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `repository-fact-reading` - 权重 `15%`，critical `true`，最低 `90`：Confirm README, both versioned schemas, persisted v1/v2 fixtures, two consumer examples, SDK source, internal wrapper and tests are inspected before judgment.
- `contract-classification` - 权重 `25%`，critical `true`，最低 `90`：Confirm the internal LegacyModelConfig dual track is separated from the observable load entry point and v1 persisted format, which are priced as migration/version contracts rather than dismissed.
- `clean-target-thesis` - 权重 `20%`，critical `true`，最低 `90`：Confirm the clean target is one internal model and one normalized runtime representation while preserving an explicit boundary for supported external input versions.
- `option-tradeoffs` - 权重 `15%`，critical `true`，最低 `90`：Confirm conservative retention, immediate clean target and staged convergence are compared on user breakage, internal complexity, migration evidence and time to simplicity.
- `proof-falsifier-payoff` - 权重 `15%`，critical `true`，最低 `90`：Confirm the first proof point asks for active-version/consumer evidence, the falsifier changes the deletion boundary, and the payoff ledger quantifies removed dual-track cost without hiding compatibility work.
- `direction-stage-boundary` - 权重 `10%`，critical `true`，最低 `90`：Confirm the output stays at high-level direction with an asking next move, makes no file change or migration plan, and does not auto-enter Brainstorming or Landing.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- does not inspect the documented API, versioned schema, persisted v1 file, and both consumer examples
- treats a documented or persisted external contract as disposable merely because the user asked for boldness
- keeps the internal legacy wrapper forever without offering a clean target model
- writes migration steps, edits the fixture, or creates design artifacts
- automatically starts brainstorming or landing

**Critical path**: Read public entry points, schemas, persisted v1 data, consumers, and internal wrappers, then separate removable internal dual-track state from priced external contracts.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 32. `tdd-approved-task-trigger` - `test-driven-development`

- Proposal ID: [`proposal-tdd-approved-task-trigger-v1-protocol-v2`](../../../test/skill-evals/tdd-approved-task-trigger/proposal-approval.json)
- Project / case: `py-config-upgrader` / `tdd-approved-task-trigger`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请执行当前 Approved Tasks 的 T001，并在完成后给出验证结果。不要处理后续工作，也不要修改 Spec 或 Plan。 The user authorizes this implementation turn but does not repeat the word TDD. The explicit TDD trigger comes from the approved/current Task contract.

**当前不可变输入**

- Scenario: [`test/skill-evals/tdd-approved-task-trigger/scenario.md`](../../../test/skill-evals/tdd-approved-task-trigger/scenario.md) = `ec1c367c7e89e6e0b18d29fd2be14b0db7e7abbc7917f22eaad6b5b0d1a5a1f8`
- Protocol: [`test/skill-evals/tdd-approved-task-trigger/protocol.json`](../../../test/skill-evals/tdd-approved-task-trigger/protocol.json) = `01543814bbc0acb3880861d90acbe5698c378aac27ee5693f74e1737fce9bbac`
- Fixture: [`test/skill-evals/tdd-approved-task-trigger/fixture`](../../../test/skill-evals/tdd-approved-task-trigger/fixture) = `7502c3aa82108e4330eab553e37d6cbdbe9f6138dbb2bacb07c807c488bde5f2`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `approved-task-trigger` - 权重 `25%`，critical `true`，最低 `90`：Confirm the Implementer reads current approved Task T001 and recognizes its explicit Process: test-driven-development as the trigger even though the user does not repeat TDD.
- `red-green-sequence` - 权重 `30%`，critical `true`，最低 `90`：Confirm a focused unknown-key test is written first and fails because the key is silently accepted, followed by the minimum validation and saved focused and full Green evidence.
- `validation-correctness` - 权重 `25%`，critical `true`，最低 `90`：Confirm every top-level key outside version, endpoint and retries raises a message naming the unknown key while valid input still emits the unchanged version-2 JSON shape.
- `bundle-scope` - 权重 `20%`，critical `false`，最低 `90`：Confirm only source, focused tests and T001 completion state change, and T001 is checked only after evidence while Spec, Plan, valid sample, schema, later Tasks and dependencies remain unchanged.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- fails to treat the approved Task Process as an explicit TDD trigger
- changes production code before observing the focused behavior failure
- uses an invalid fixture, syntax error, or already-passing test as Red
- changes the accepted Spec, approved Plan, or valid output schema
- marks T001 complete before focused and full Green verification

**Critical path**: Read the explicit Approved Task trigger, create and observe the focused failing test, then make the minimum Green change before full validation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 33. `tdd-user-trigger` - `test-driven-development`

- Proposal ID: [`proposal-tdd-user-trigger-v1-protocol-v2`](../../../test/skill-evals/tdd-user-trigger/proposal-approval.json)
- Project / case: `node-rate-window` / `tdd-user-trigger`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 使用 `$test-driven-development` 修复窗口边界：时间戳恰好达到 `windowMs` 时必须过期。先写一个最小测试并确认它因为边界行为缺失而失败，再做最小实现、跑绿并在需要时重构。不要改变公开 API。

**当前不可变输入**

- Scenario: [`test/skill-evals/tdd-user-trigger/scenario.md`](../../../test/skill-evals/tdd-user-trigger/scenario.md) = `60a722973b5b37d40fd822a4a6d878e06e5ffb576f866b01490efd6b9043df7d`
- Protocol: [`test/skill-evals/tdd-user-trigger/protocol.json`](../../../test/skill-evals/tdd-user-trigger/protocol.json) = `2d70f24dc1f24509255368d57e0038b2781f2160ca8b13485cd615140684afcd`
- Fixture: [`test/skill-evals/tdd-user-trigger/fixture`](../../../test/skill-evals/tdd-user-trigger/fixture) = `bd6ff75d8eedb8ee39dacb19c2eec3e89f0e7edeaeec753d17d7079576755456`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `red-proof` - 权重 `30%`，critical `true`，最低 `90`：Confirm an isolated test for an accepted call at 0 followed by a call at 1000 is added first and observed failing by the intended boundary assertion before any production byte changes.
- `minimal-green` - 权重 `25%`，critical `true`，最低 `90`：Confirm the smallest production correction makes the focused test green, with any refactor occurring only after Green and without clocks, persistence, packages or unrelated behavior.
- `boundary-correctness` - 权重 `25%`，critical `true`，最低 `90`：Confirm timestamps whose age equals windowMs expire while younger timestamps still count, the public constructor and allow(nowMs) signatures stay fixed, and the final full suite passes.
- `scope-discipline` - 权重 `20%`，critical `false`，最低 `90`：Confirm only the named source and test files change and saved command chronology proves valid Red then focused and full Green without report or dependency artifacts.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- changes production code before a focused failing boundary test is observed
- uses a syntax, import, or setup error as Red
- adds a test that passes before implementation
- changes the public API or adds dependencies
- finishes without a green focused test and green full suite

**Critical path**: Honor the user TDD request, create and observe the boundary Red before any production byte changes, then reach focused and full Green.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 34. `worktree-explicit-bundle-isolation` - `using-git-worktrees`

- Proposal ID: [`proposal-worktree-explicit-bundle-isolation-v1`](../../../test/skill-evals/worktree-explicit-bundle-isolation/proposal-approval.json)
- Project / case: `py-localization-parser` / `worktree-explicit-bundle-isolation`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请使用 `$using-git-worktrees` 为 `SPEC-003` 的 brace escaping 实现准备隔离 Worktree，分支名是 `fix/localization-brace-escaping`，路径使用项目已忽略的 `.worktrees/localization-brace-escaping`。确认 Git 拓扑、保护我当前的 release-copy 草稿，并在新 Worktree 跑完 baseline tests 后停下；不要实现 T001，也不要清理 Worktree。

**当前不可变输入**

- Scenario: [`test/skill-evals/worktree-explicit-bundle-isolation/scenario.md`](../../../test/skill-evals/worktree-explicit-bundle-isolation/scenario.md) = `37ae9038b727e8272690113129852a4b0761b0253f7f7000482a9f0ca06a2ab2`
- Protocol: [`test/skill-evals/worktree-explicit-bundle-isolation/protocol.json`](../../../test/skill-evals/worktree-explicit-bundle-isolation/protocol.json) = `b22d30cc085637df5a1464f71948b4e4e4537086744f0b4355dcda59b100323c`
- Fixture: [`test/skill-evals/worktree-explicit-bundle-isolation/fixture`](../../../test/skill-evals/worktree-explicit-bundle-isolation/fixture) = `74cf31ea1af3151b03af1feb7bb6e9740640c905702fdbc63b97ef99b640721b`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `topology-and-consent` - 权重 `20%`，critical `true`，最低 `90`：Confirm the explicit creation request is honored after inspecting Git directory, common directory, branch, superproject state, status, and registered Worktrees without asking for duplicate consent.
- `safe-project-local-creation` - 权重 `25%`，critical `true`，最低 `90`：Confirm an actually available native Worktree tool is preferred, otherwise the ignored .worktrees convention is verified before creating exactly fix/localization-brace-escaping at the requested project-local path.
- `dirty-state-isolation` - 权重 `25%`，critical `true`，最低 `90`：Confirm source-checkout hashes and status prove the release-copy draft is unchanged and uncommitted, while the new Worktree starts from committed Base and does not copy the draft line.
- `bundle-and-baseline-readiness` - 权重 `20%`，critical `true`，最低 `90`：Confirm the isolated checkout contains the committed Accepted Spec, Approved Plan and Tasks, remains implementation-clean, and passes the complete Python baseline from its own root.
- `report-and-stop-boundary` - 权重 `10%`，critical `true`，最低 `90`：Confirm the response reports the absolute Worktree path, branch, isolated Git state and exact test result, then stops without T001 implementation, Task mutation, cleanup, staging or commit.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- copies, overwrites, stages, commits, removes, or cleans the user's release-copy draft
- creates a nested Worktree without checking current Git topology and existing registered Worktrees
- uses Git fallback when a real native Worktree tool is available or skips ignore verification before project-local fallback
- uses a different branch or path, implements T001, changes the Bundle, source, tests, dependencies, or .gitignore, or performs cleanup
- reads the hello-scholar Task Packet, production Skill, or another Eval case

**Critical path**: Honor the explicit isolation request, verify repository and ignore state, create a separate worktree on the intended base, validate it, and leave the primary checkout unchanged.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 35. `worktree-explicit-create` - `using-git-worktrees`

- Proposal ID: [`proposal-worktree-explicit-create-v1-protocol-v2`](../../../test/skill-evals/worktree-explicit-create/proposal-approval.json)
- Project / case: `node-cache-key-service` / `worktree-explicit-create`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请为 cache-key normalization 修复创建一个隔离 Worktree，使用分支 `fix/cache-key-normalization`。准备好环境并跑完 baseline tests 后停下，不要实现功能，也不要清理 Worktree。 This request is explicit creation consent. The Implementer must not ask the same consent question again.

**当前不可变输入**

- Scenario: [`test/skill-evals/worktree-explicit-create/scenario.md`](../../../test/skill-evals/worktree-explicit-create/scenario.md) = `4c685c371e438769241706c186ee0eec4614bbcc0324a68771dbeefa73131c4e`
- Protocol: [`test/skill-evals/worktree-explicit-create/protocol.json`](../../../test/skill-evals/worktree-explicit-create/protocol.json) = `771af6e75526f724e9b73c81048951101df5244fca33f049dd7a48f66f227ede`
- Fixture: [`test/skill-evals/worktree-explicit-create/fixture`](../../../test/skill-evals/worktree-explicit-create/fixture) = `ab1aa30bf912984ceacf20f2192642586eeedcf9cd44c5134798a81d91abc1c3`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `isolation-detection` - 权重 `25%`，critical `true`，最低 `90`：Confirm Git directory, common directory, branch, superproject, status and existing Worktrees are inspected to establish a normal checkout before creating nested isolation.
- `safe-worktree-creation` - 权重 `30%`，critical `true`，最低 `90`：Confirm an actually available native Worktree tool is preferred, otherwise the ignored .worktrees convention is verified and the exact fix/cache-key-normalization branch and project-local path are created once.
- `dirty-state-preservation` - 权重 `25%`，critical `true`，最低 `90`：Confirm source-checkout hashes and Git status prove the user's dirty cache-key note is neither copied, overwritten, staged, committed nor removed and no other project byte changes.
- `baseline-and-stop` - 权重 `20%`，critical `true`，最低 `90`：Confirm node tests run successfully inside the new Worktree and the response reports its absolute path, branch and exact result before stopping without implementation or cleanup.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- overwrites, stages, commits, or removes the user's dirty documentation change
- creates a nested Worktree without checking existing isolation and submodule state
- uses Git fallback when an actual native Worktree tool is available
- skips ignore verification before project-local Git fallback
- implements the cache-key feature or cleans up without separate authorization

**Critical path**: Inspect repository topology and dirty state, create exactly one authorized isolated Worktree, run its baseline tests, and stop before implementation.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 36. `writing-plans-bundle` - `writing-plans`

- Proposal ID: [`proposal-writing-plans-batch-v1-bundle-protocol-v2`](../../../test/skill-evals/writing-plans-bundle/proposal-approval.json)
- Project / case: `py-event-export-service` / `writing-plans-bundle`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请使用 `$writing-plans`，从当前 Accepted `SPEC-017` revision 3 生成同一 Spec Bundle 下可单独审核的高层 `plan.md`。Plan 要写清实现目标、范围、技术方案、模块和文件边界、接口、阶段、测试/实验、迁移、清理、回滚和 Tasks 生成规则，但不要写 Task 复选框、逐步源码、微操作清单、逐步 commit 或执行器选择，也不要创建 `tasks.md` 或开始实现。先生成 `draft` 并停下来等我审核；我批准当前 Plan 后，只记录 `approved` 并说明下一步是 `$generating-tasks`。

**当前不可变输入**

- Scenario: [`test/skill-evals/writing-plans-bundle/scenario.md`](../../../test/skill-evals/writing-plans-bundle/scenario.md) = `dea6b42a0980c7e61b941d4af2748184d399ec4eea4460748592a955db9ecb65`
- Protocol: [`test/skill-evals/writing-plans-bundle/protocol.json`](../../../test/skill-evals/writing-plans-bundle/protocol.json) = `e04da35846b2315a324eede54fab457d391df5ebde39ea89934754c6a1cd0930`
- Fixture: [`test/skill-evals/writing-plans-bundle/fixture`](../../../test/skill-evals/writing-plans-bundle/fixture) = `ffd01092431e667fd9e9b2ae7a3f4fdce48e17b5eba76efc5233608742cd7c27`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `source-of-truth-and-gates` - 权重 `25%`，critical `true`，最低 `90`：Confirm Architecture, accepted SPEC-017 revision 3, source, tests, callers and rules are read as the fixed design, with revision 1 remaining draft until the exact future Plan approval.
- `high-level-plan-contract` - 权重 `30%`，critical `true`，最低 `90`：Confirm plan.md is an independently reviewable high-level implementation strategy with goal, scope, approach, module and file boundaries, interfaces, phases and testing, without Task checklists, source-level steps or executor choices.
- `coverage-and-migration` - 权重 `25%`，critical `true`，最低 `90`：Confirm every accepted criterion and Must Not Touch boundary is mapped, including compatibility, migration window, cleanup gate, error contract, rollback and the rule for later Tasks generation.
- `scope-and-terminal-routing` - 权重 `20%`，critical `true`，最低 `90`：Confirm only the same-Bundle Plan and generated indexes change, approval changes only after review, and the run stops with generating-tasks as next owner without Tasks, code, Runs or upstream edits.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- writes outside the current Bundle plan and generated Indexes
- writes under hello-scholar/memory or creates tasks.md, code, tests, Runs, or an implementation report
- includes Task checkboxes, complete implementation code, executor micro-steps, per-step commits, or an execution-agent menu
- omits an accepted AC, interface, migration, cleanup, rollback, or Must Not Touch boundary
- marks the Plan approved before its matching future user reply or begins implementation after approval
- changes the Accepted Spec or silently makes a new architecture or public-contract decision
- routes anywhere other than generating-tasks after Plan approval
- reads the hello-scholar Task Packet, current production Skill, or other Eval evidence

**Critical path**: Read the Accepted Spec and real implementation boundaries, then create the first reviewable high-level Plan and stop before Tasks or code.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。

### 37. `writing-plans-spec-gap` - `writing-plans`

- Proposal ID: [`proposal-writing-plans-batch-v1-spec-gap-protocol-v2`](../../../test/skill-evals/writing-plans-spec-gap/proposal-approval.json)
- Project / case: `node-webhook-signing-service` / `writing-plans-spec-gap`
- Agent model: `gpt-5.6-terra`
- 计入产品 Skill case: 是
- 业务目标: 请使用 `$writing-plans` 为当前 Accepted `SPEC-026` 生成实施 Plan，重点覆盖多 key rotation、失败响应和旧签名迁移。先结合真实 handler、verifier、调用方和测试检查 Spec 是否足以约束实现；如果仍有会改变公共 API、安全边界或迁移路径的重大决定没有定稿，请明确列出影响和最小澄清问题，零写入停止并让我先回到 `brainstorming/manage-specs`。不要替我选择方案，也不要先创建一个草稿 Plan 占位。

**当前不可变输入**

- Scenario: [`test/skill-evals/writing-plans-spec-gap/scenario.md`](../../../test/skill-evals/writing-plans-spec-gap/scenario.md) = `6e1facfd459a71835762e3551f0d8bca2235fdb710cb45fa890db5752fb16ee4`
- Protocol: [`test/skill-evals/writing-plans-spec-gap/protocol.json`](../../../test/skill-evals/writing-plans-spec-gap/protocol.json) = `f168470cecb69661f448b61ed0f5f4fe1fe3c6597cda5b35e6dd5475812413d8`
- Fixture: [`test/skill-evals/writing-plans-spec-gap/fixture`](../../../test/skill-evals/writing-plans-spec-gap/fixture) = `b717d5d31a1acc7da9de11bad89dd2fdd3d9531399af6267b26476409accc8c2`

**业务 rubric**（各 critical 维度和总分最低 `90`）

- `fact-reading-and-gap-detection` - 权重 `35%`，critical `true`，最低 `90`：Confirm the accepted Spec, handler, verifier, callers and tests are read and the unresolved key identifier, missing or retired-key HTTP response, and legacy-signature window are identified as real contract gaps.
- `contract-impact-and-questions` - 权重 `30%`，critical `true`，最低 `90`：Confirm each gap is tied to the affected Spec section and real files, its public, security or migration impact is explained, and only the minimum user decision questions are asked without invented defaults.
- `zero-write-stop-gate` - 权重 `25%`，critical `true`，最低 `90`：Confirm the complete Git tree stays byte-identical and no placeholder Plan, Tasks, Index, report, source, test, Spec or Architecture file is created or modified.
- `terminal-routing` - 权重 `10%`，critical `true`，最低 `90`：Confirm the response stops and routes unresolved design back to brainstorming and manage-specs rather than continuing to Tasks or implementation.

- 共享用户价值五维：`value-visibility`、`audience-fit`、`information-design`、`actionability`、`signal-to-noise`。使用批次共同 `hello-scholar-user-value-v1` / `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`，每维和总分分别过门。

**Hard rejects**

- creates or modifies plan.md, tasks.md, a report, an Index, source, tests, Spec, or Architecture
- chooses a key identity, HTTP failure contract, or compatibility window not accepted by the Spec
- treats accepted status as sufficient while ignoring explicit unresolved design decisions
- asks generic implementation questions without citing affected Spec sections and real project files
- routes directly to Tasks or implementation instead of brainstorming/manage-specs
- reads the hello-scholar Task Packet, current production Skill, or other Eval evidence

**Critical path**: Read the accepted contract and callers, identify the first material unresolved public decision, and stop with zero writes while routing it back to design ownership.

该路径只用于核对动作顺序、必要停点和被延后的工作；不设置墙钟通过线。
<!-- END GENERATED PROPOSAL DETAILS -->

## 历史 E2E 说明

`framework-e2e-paged-cache` 已有一次真实 Protocol v1 Red Baseline。它的 Scenario、Protocol、Approval、Fixture、Baseline 和 evidence 继续按原 Hash 只读保存，不在本批 v2 输入中，也不会新增 Scorecard。本批包含的 `framework-e2e-paged-cache-v2` 是独立后继 Proposal；批准后先运行自己的 v2 Baseline，只有真实 Red 才打开 T047 的三次 Live Eval。

## 推荐决定

推荐按顶部 Batch ID 与 Batch SHA-256 整批批准当前 37 个 Protocol v2 Proposal。批准后只更新对应 Approval 记录并用 `gpt-5.6-terra` 打开 Baseline Observation；每个 Baseline 和后续 Live Eval 的输出质量仍分别交用户审核，不能沿用这次 Proposal 批准代替结果接受。
