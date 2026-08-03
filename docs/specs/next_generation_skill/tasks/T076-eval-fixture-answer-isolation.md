# T076：清理 Eval Fixture 中会替目标 Skill 直接作答的项目规则

- Status: `completed`
- PR: `PR 0 - Skill Eval 基础设施修正`
- Depends On: T068, T072
- Parallel: Yes。可以按 Scenario 目录隔离处理；Proposal Hash 必须等全部 Fixture 稳定后统一刷新。

## 为什么要做

真实项目 Fixture 必须有 `AGENTS.md`、代码、测试和项目事实，但项目规则不能直接复述正在评测的 Skill 答案。当前少数 Record 场景把“探索何时补录”“正式实验先建 Record”“失败与负结果如何分类”直接写进 Implementer 必读的 `AGENTS.md`。这样即使旧 Skill 或缺失 Skill 没有提供价值，通用 Agent也可能照抄项目规则答对，Baseline 失去归因意义。

这个 Task 不是把 Fixture 变成空壳，也不是藏掉真实项目合同。它区分两类信息：项目独有、实现者本来就应知道的事实继续可见；只为提示目标 Skill 分支或评分答案而写的句子移出 Implementer 可见范围，留在 Hash 绑定的 Scenario/Protocol 供 Reviewer 使用。

## 与原 Fixture 的比较

| 原做法 | 本 Task 后 |
|---|---|
| `AGENTS.md` 直接给出 Skill 的分支结论 | `AGENTS.md` 只给语言、项目风险、数据/接口、不可变证据和真实命令边界 |
| 项目规则告诉 Agent 哪个 Run 应写成 `failed/completed` | Agent 必须从 exit code、validity 和 hypothesis evidence 自己判断 |
| 验证脚本可能同时充当业务测试和评分答案 | 项目测试只验可观察 artifact/代码合同；表达质量、Skill 分支和 hard rejects 由 evaluator-only Protocol/Reviewer 判断 |
| 为防泄漏删掉测试 | 保留每个 Skill 至少两个真实项目 case 和可运行项目测试，只删除不属于项目事实的提示答案 |

## 文件边界

### Modify

- `test/skill-evals/record-exploration-backfill/fixture/AGENTS.md`
- `test/skill-evals/record-exploration-backfill/fixture/docs/exploration-boundary.md`
- `test/skill-evals/record-formal-prelaunch/fixture/AGENTS.md`
- `test/skill-evals/record-terminal-evidence/fixture/AGENTS.md`
- 审计发现同类直接答案的其他 pending v2 Fixture 项目规则
- 对应 Scenario/Protocol 的 disclosure 说明和 pending Approval Hash
- `test/skill-evals/WORKFLOW.md`、T001/T002/T068 中的 Fixture 隔离规则

### Must Not Modify

- 历史 Protocol v1 Fixture
- 生产 Skill、项目实现、真实输入数据或用户请求原文
- 已保存的 Baseline/Scorecard/evidence
- 为了制造 Red 而故意损坏依赖、测试、Git 或 CLI

## 判断规则

保留这些 Implementer 可见事实：

- 项目语言、依赖、命令、公共 API、持久格式、数据来源和安全限制；
- 已接受 Spec/Plan 中真实存在的外部合同；
- 哪些源码、日志、结果或生成文件不可直接修改；
- 能在真实项目中运行的单元测试和确定性 artifact verifier。

移除或改写这些内容：

- 只因为本次被测 Skill 才出现的分支名称、标准结论或逐步答案；
- 与 Protocol rubric、hard reject、未来用户回复同义的提示；
- 明确告诉 Agent 哪个 case 应进入/退出哪个 Skill；
- 要求用户可读输出使用某个标准措辞，而项目本身没有该外部合同。

项目 verifier 可以检查用户请求或 Accepted Spec 已经公开承诺的 artifact 事实，例如 sentinel 是否证明只启动一次；它不能替 Reviewer 判断回答是否自然、价值是否清楚、是否正确触发 Skill，或读取 evaluator-only rubric。

## 三个首要修正

1. `record-exploration-backfill`：公开合成数据、隔离 Worktree、秒级成本、无生产路径等风险事实；不在项目规则中直接宣布“允许先跑以及所有补录截止点”。Agent 根据这些事实、用户请求和目标 Skill 作分类。
2. `record-formal-prelaunch`：保留这是 Accepted Spec 的正式保留 Benchmark、固定输入和不可重跑合同；删除重复教授完整 Record 流程的句子，事前要求由用户请求、Accepted Bundle 和 Skill共同形成。
3. `record-terminal-evidence`：保留日志/指标不可变和两个过程事实；删除 `failed/completed` 的直接答案和两轮操作脚本，让 Agent从保存的 exit code、valid result 和 hypothesis support 自行分类。

## 实施步骤

1. 逐个读取所有 pending v2 Fixture 的 `AGENTS.md`、项目文档、测试和对应 Protocol，标记“项目事实”与“评测答案”。
2. 只修改存在材料性泄漏的句子，不统一改写所有 Fixture，也不把规则搬到另一个 Implementer 可见文件。
3. 检查项目初始测试仍可运行，场景仍有足够事实完成任务，且没有靠信息缺失制造失败。
4. 在 Proposal 批量审核文档为每个修正场景说明 Implementer 可见事实和 evaluator-only 内容边界。
5. 全部修改结束后重算 Fixture/Protocol Hash；保持 `decision: pending`，交用户一次审核。

## 验证

- 对每个修正场景做“无目标 Skill 可见性”人工 review：仅凭 `AGENTS.md` 是否已经能复述目标分支或标准结论；若能，继续精简
- 运行各 Fixture 的初始单元测试和确定性 verifier 的准备检查，不执行正式 Eval 运行
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_skill_eval_contract.py'`
- 确认每个保留产品 Skill仍至少有两个不同真实 `projectId`
- `git diff --check`

## 完成标准

- Implementer 可见项目规则提供足够真实事实，但不再替目标 Skill 直接选择分支或写结论。
- 真实项目测试继续存在且可运行，rubric、hard rejects、未来消息和表达质量门只对 Reviewer 可见。
- Baseline 失败只能来自旧/缺失 Skill 的行为、用户价值或效率差异，不能来自损坏环境或故意不给事实。
- 所有受影响 Proposal 绑定新 Hash 并保持 pending；用户批准前没有运行任何 Agent Eval。
