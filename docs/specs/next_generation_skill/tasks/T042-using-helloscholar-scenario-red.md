# T042：为 `using-helloscholar` 五路 Router 编写 Scenario 与 Red Baseline

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T002
- Parallel: Yes。它记录修改前 Router 的 Red Baseline，可在下游实现前准备；不得修改 Router 或目标 Skill。

## 目标

用 Fast、Design、Execution、Experiment、Maintenance 五个独立场景证明当前 Router 的“1% 可能性就强制调用、进入 Plan 前先 Brainstorm”规则过宽。新 Router 必须根据用户当前意图和项目已有状态选择下一步，不让简单任务进入文档闭环，也不在已有 Bundle 时重复设计。

## 事实源

- 执行 plan 第 5.5、8.1 节和 PR 6。
- PRD 零文档、设计优先、实验优先、实施和 Architecture 维护路径。
- 当前 `skills/superpowers-skills/using-helloscholar/` 作为重大修改前 Baseline。
- T001/T002 Eval 合同，以及执行 plan 已锁定的保留/删除清单。

## 当前 Router 与目标 Router 比较

### 必须保留

- 用户显式指令优先于 Skill 和默认行为。
- Skill 使用前读取当前内容，不依赖记忆。
- Process Skill 优先于实现 Skill。
- 被派发明确 Task 的 subagent 跳过顶层 Router。
- Codex、Claude Code、Copilot、Gemini 的 Skill 访问/工具映射说明。

### 必须改变

| 当前行为 | 目标行为 |
|---|---|
| 任意 1% 可能性都要求调用 Skill | 根据意图和已有文档状态选一条立即路径 |
| 简单问题也可能先进入 Brainstorm | 局部 Bug/文案/格式/单测试走 Fast Path，核心文档数为 0 |
| 进入 Plan 前倾向强制 Brainstorm | 已有 Accepted/Approved/Current Bundle 直接走 Execution |
| 没有独立实验/维护路由 | 正式运行先 `record-experiment`，文档维护进入 `docs-maintenance` |
| Process 列表会自动把 Bug 推到 Debugging/TDD | 已删除 Debugging Skill；TDD 只有用户或 Approved Task 明确指定才启动 |

## 文件边界

### Add

- `test/skill-evals/router-fast/scenario.md`
- `test/skill-evals/router-fast/protocol.json`
- `test/skill-evals/router-fast/proposal-approval.json`
- `test/skill-evals/router-fast/fixture/`
- `test/skill-evals/router-fast/baseline.json`
- `test/skill-evals/router-fast/evidence/baseline/`
- `test/skill-evals/router-design/scenario.md`
- `test/skill-evals/router-design/protocol.json`
- `test/skill-evals/router-design/proposal-approval.json`
- `test/skill-evals/router-design/fixture/`
- `test/skill-evals/router-design/baseline.json`
- `test/skill-evals/router-design/evidence/baseline/`
- `test/skill-evals/router-execution/scenario.md`
- `test/skill-evals/router-execution/protocol.json`
- `test/skill-evals/router-execution/proposal-approval.json`
- `test/skill-evals/router-execution/fixture/`
- `test/skill-evals/router-execution/baseline.json`
- `test/skill-evals/router-execution/evidence/baseline/`
- `test/skill-evals/router-experiment/scenario.md`
- `test/skill-evals/router-experiment/protocol.json`
- `test/skill-evals/router-experiment/proposal-approval.json`
- `test/skill-evals/router-experiment/fixture/`
- `test/skill-evals/router-experiment/baseline.json`
- `test/skill-evals/router-experiment/evidence/baseline/`
- `test/skill-evals/router-maintenance/scenario.md`
- `test/skill-evals/router-maintenance/protocol.json`
- `test/skill-evals/router-maintenance/proposal-approval.json`
- `test/skill-evals/router-maintenance/fixture/`
- `test/skill-evals/router-maintenance/baseline.json`
- `test/skill-evals/router-maintenance/evidence/baseline/`

五个 `evidence/baseline/` 目录只保存对应 `baseline.json` 引用的最小脱敏失败证据。

### Must Not Modify

- `skills/superpowers-skills/using-helloscholar/`
- 任何下游 Skill
- `src/`、AGENTS、README

## 五个场景

1. **Fast** 使用 `projectId: py-text-normalizer`：Python 文本规范化库有一个局部、可复现的空格处理 Bug，只需改一个函数和一个测试，不改变外部接口。期望当前主 Agent直接定位、修复和验证；不调用 Brainstorm 或 TDD，Spec/Plan/Tasks/Record/Architecture 新增或修改数为 0。
2. **Design** 使用 `projectId: node-batch-query-api`：Node 查询服务需要新增公共 API 并改变模块职责，项目没有对应 Spec。期望进入 `brainstorming -> manage-specs`，只逐个询问材料性问题，先完整自审并整份审核七个核心章节及必要条件章节的 Spec；批准前不实现，不直接生成 Plan/Tasks。
3. **Execution** 使用 `projectId: py-cache-allocator`：Python Cache 项目已有 Accepted Spec、Approved Current Plan 和 Current 未完成 Tasks；Tasks 当前 Revision 同时满足 `approval: approved`、`approved_revision == revision`，用户本轮另行明确授权实施。期望当前主 Agent直接按 Depends On、Files、Validation 和 Completion 逐项执行，不调用任何已淘汰执行/Review Skill，也不强制执行/子代理/评审 Skill；不重复 Brainstorm、不新建 Bundle。缺任一审批/授权门时必须停止，不能只看文件存在。
4. **Experiment** 使用 `projectId: node-ranking-benchmark`：Node 排序服务准备启动正式 Benchmark。期望先调用 `record-experiment` 建事前 Record，再启动；不因“可能改设计”先写 Spec。
5. **Maintenance** 使用 `projectId: py-research-doc-index`：Python 研究工具只需要重建过期 Index。期望调用 `docs-maintenance index`，只修改生成 Index，不进入 Brainstorm、一般实现或已取消的 `project-structure`。

五个 Fixture 的语言、规则、代码树、测试和文档状态分别构造，不能从同一项目复制后只换请求或 ID。每个场景都应有足够真实文件让 Router 能判断当前状态，但用户 prompt 不直接写正确路径名。

## Protocol 与 Baseline

- 每个 Protocol 至少把 `using-helloscholar` 放入 `targetSkills`；非 Fast 场景还可加入该路径的关键下游 Skill，以锁定当前目录 Hash。
- Eval Implementer/Reviewer 各 1，质量门固定为 90，逐维只允许 `0 / 90 / 100`。这里的 Implementer under test 代表产品主 Agent并直接完成路由后的最小动作；它不得再嵌套调用产品执行 subagent。Eval 主 Agent不替它改 Fixture。
- 硬门覆盖：选择的唯一路径、必须/禁止 Skill、允许写入、核心文档数量、旧路径和用户确认门。
- 使用修改前 Router 分别跑五个 Baseline。有效 Red 应来自过度路由、重复 Brainstorm、漏掉 Record/维护 owner 或写入越界；不能只因为 prompt 不含某个 magic word 判失败。
- 如果某个场景当前 Router 全绿，如实写 `control-pass` 并暂停 Router 后续验收。不得改原题后直接重跑；只有用户复核独立价值后，才能以新 Proposal ID、更新后的 Scenario/Protocol Hash 和新的明确批准增加或修改场景。

## 独立评测执行合同

1. 五组 Scenario/Protocol/rubric 先作为一个 Proposal 批次交用户；五个 Protocol 分别固定使用上述 `projectId`，用户审核时同时确认它们是真正不同项目。每个 `proposal-approval.json` 绑定 Proposal ID、当前 Hash 和明确回复证据。批准前不启动 Baseline或判断路径质量。
2. 每个 Fixture 预检 AGENTS、Git、初始测试/文档状态和绝对源码 CLI，提交并记录 `fixtureBaseCommit`。修改前 Router及当时存在的下游 Skill使用 immutable explicit-file snapshot；有意不存在的新下游 Skill按 `absent` 记录。
3. 每场使用不同的 `fork_turns: "none"` Implementer。Prompt 只提供工作目录、当前轮逐字消息、项目规则、读取禁区，以及修改前 Router和可用下游 Skill的绝对 `SKILL.md` 路径/Hash map并要求按需要完整读取；完整 Scenario/Protocol、rubric 和 T043 路由答案保持 evaluator-only，不能假设 copy 安装后名称可发现。
4. 设计审批、Execution 实施授权和 Experiment 启动等回复由 Eval 主 Agent按 Protocol在停点用 `followup_task` 发送，未来答案不出现在首轮 Prompt。
5. 每场另派不同的 `fork_turns: "none"` Reviewer，只接收获批 rubric、原始交互、命令、路由/Skill读取证据和 `base..HEAD + index + working tree + untracked + final hashes`。
6. Baseline 绑定 Proposal/Scenario/Protocol/Fixture 和旧 Router/下游 snapshot，并如实记录 `fail | control-pass`；Reviewer 只能建议结果，用户拥有未来 accepted。

## 验证

- 用 T002 校验五个 Baseline 和当前 Router Hash。
- Fast 场景明确统计核心文档改动为 0；Execution 场景确认原 Bundle 数量不变。
- 运行 `npm test`。

## 完成标准

- 五条路径都有独立、真实、可重复的对照证据；只有真实 Red 才计数并打开 T043，`control-pass` 停在人审门。
- 场景保护当前 Router 的用户优先、Skill 读取、Process 优先和 subagent 跳过规则。
- 场景明确区分 Eval Agent 隔离与产品 Execution，不重新引入已删除执行链。
- 本 Task 没有修改 Router 或下游 Skill。
