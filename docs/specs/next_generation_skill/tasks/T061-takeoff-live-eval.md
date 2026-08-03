# T061：用当前 Codex subagent 验证 `takeoff`

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T066
- Parallel: No。两个相反方向场景必须独立运行并分别审查。

## 目标

证明修改后的 `takeoff` 在用户清楚表达放大目标的意图时，能大胆删除内部惯性，同时识别并定价公共 API、持久格式和文档化集成等真实合同。它必须给方向、证据问题和收益账单，但不越界写设计、实施步骤或自动调用 Landing。未显式触发时不进入的边界由 Router、T066 和静态测试负责。

## 文件边界

### Add

- `test/skill-evals/takeoff-delete-internal-compat/scorecard.json`
- `test/skill-evals/takeoff-delete-internal-compat/evidence/live/`
- `test/skill-evals/takeoff-protect-real-contract/scorecard.json`
- `test/skill-evals/takeoff-protect-real-contract/evidence/live/`

### Must Not Modify

- `skills/hai-skills/takeoff/`
- `skills/hai-skills/landing/`
- T060 的 Scenario、Protocol、Proposal、Fixture、Baseline
- 任何生产代码、Spec、Plan 或 Router

## 执行方法

1. 读取 Workflow，确认三份 Proposal/rubric/Hash 仍获批准且 Baseline 为真实 Red；`control-pass` 时停在人审门。
2. 每场重建独立 Git 工作区和 Base，预检初始测试与当前 Skill copy。使用不同的 `fork_turns: "none"` Implementer，显式传当前 `takeoff/SKILL.md` 绝对路径/Hash并要求完整读取。
3. 核对 Agent 实际读取调用方、README/Schema/数据样例和测试，不接受只复述 Scenario 的判断。内部场景应敢删错误概念，外部合同场景应区分保留合同与删除内部双轨。
4. 两个场景检查正式输出的必需语义块、Confidence 枚举、显式 Frame-Opening Move、Options、First Proof Point、Falsifier、具体 Payoff Ledger 和询问式 Next Move；不得出现有顺序的文件/PR/迁移步骤或下游自动串联。
5. 每场派发不同的 `fork_turns: "none"` Reviewer，只给获批 rubric、项目事实、原始输出和 final-tree/命令证据。Reviewer 特别判断“大胆”是否建立在错误忽略合同之上。
6. 写完整 Hash、不同 Agent ID、Terra 模型、硬门、评分、命令、`criticalPath` 顺序和建议，不写 `timing`。失败时重开 T060 或目标 Skill owner；本 Task不改 Skill、不降低 rubric。
7. 两场 pass 后批量交用户审核；每场只有用户明确接受当前 Hash 才标记 accepted。

## 对照增益判断

- 内部场景的增益是消除兼容惯性并给可证伪方向，不是更激进的措辞。
- 合同场景的增益是仍有上限、但不会把真实承诺误判成胆小；永久 shim 和立即破坏都不是高分答案。
- 若当前 Skill 只增加固定标题而没有改变判断质量，不能 accepted。

## 验证与完成

- 两个 Scorecard 通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 两次都完成获批交互和非计时 `criticalPath`；运行 `python3 -m unittest test/test_takeoff_explicit_trigger.py`、`npm test` 并清理临时工作区。
