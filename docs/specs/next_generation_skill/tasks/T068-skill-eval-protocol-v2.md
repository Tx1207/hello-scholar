# T068：升级 Skill Eval 协议并保护历史运行证据

- Status: `completed`
- PR: `PR 0 - Skill Eval 基础设施修正`
- Depends On: T001, T002
- Parallel: No。必须在任何尚未运行的 Baseline 或 Live Eval 之前完成。

## 为什么要做

T001/T002 建立了 Scenario、Protocol、Hash、Implementer 和 Reviewer 的基本合同，但第一次批量 Proposal 审核暴露了四个会让结果失去可信度的问题：多轮场景只写了“下一轮是什么角色”，没有把下一轮用户原话写入 Hash；Implementer 可能读到包含 rubric、硬否决项和预期产物的完整 Protocol；rubric 只有缩写式维度和连续分数门，不同 Reviewer 很难稳定复现同一评分；单一 `load` 字段没有说明它属于 Baseline 还是 Live，可能把修改前 Skill 错发给实现后评测。

这不是生产 Skill 行为问题，而是“考试题和答案没有真正隔离”的评测框架问题。如果在这里继续跑 Baseline，后面即使 Agent 表现很好，也无法证明它没有提前看到答案。这个 Task 只升级本地 Eval 合同，不增加 `testing-skills` Skill、命令、外部 API 或自动 Agent Runner。

## 和原协议的比较

| 项目 | Protocol v1 | Protocol v2 |
|---|---|---|
| 多轮回复 | 只写 `contentRole` 和停止条件，同一 Hash 下可临时换回复 | 后续每轮保存逐字 `message`，首轮固定引用 Scenario 的原始请求，全部受 Protocol Hash 绑定 |
| Implementer 输入 | 文档说要隔离，但合同没有完整证明原始 Scenario/Protocol 不可见 | 只发送当前轮安全投影；原始 Scenario、完整 Protocol、未来回复、rubric 和 hard rejects 都是读取禁区 |
| Reviewer 输入 | 与 Implementer 的可见边界不够明确 | Reviewer 在运行结束后才能看到获批完整合同和全部证据 |
| 评分 | 维度可能只有 ID，最低分可为 85，容易凭感觉打连续分 | 每维有可读 `criterion`，只允许 `0 / 90 / 100`，各维和总分门统一为 90，并逐维引用证据 |
| Skill 加载 | 单一 `load` 同时承担对照和实现后含义 | `baselineLoad` 只允许 absent/修改前副本，`liveLoad` 固定为当前副本，`branch` 独立描述业务分支 |
| 历史证据 | 没有定义协议升级后的保护方式 | 已运行的 v1 记录按原字节和 Hash 只读保留；不能把新 Hash 回填到旧运行 |

这里的安全投影不是另存一份可能漂移的“简化 Protocol 文件”。Eval 主 Agent在派发当前回合时，只从用户已审核的 v2 Protocol 中取允许字段；完整合同仍只有一个事实源。

## 人话规则

1. Implementer 只知道“当前用户现在说了什么、项目在哪、这一轮允许读哪份 Skill、时间上限是多少”。它不能看到评分答案或还没发生的用户批准。
2. Reviewer 可以看到完整题目和评分规则，但必须等 Implementer 结束后才介入，且不能替用户作最终质量决定。
3. Protocol、Scenario 或 Fixture 语义变化后，旧批准立即失效。更新 Hash 只能表示“现在待审的文件是什么”，不能冒充用户已批准。
4. 已有 Baseline 的 Protocol 是历史运行输入。不得修改它后再把 Baseline 中的 Hash 换成新值；需要 v2 复测时另建后继 case，重新审核并重新运行。
5. 没有 Baseline 的 Proposal 可以原地升级 v2，但所有原 `approved` 决定都要重置为 `pending`，清空旧回复证据，再把当前 Hash 一次性提交用户批量审核。

## 文件边界

### Modify

- `test/skill-evals/WORKFLOW.md`
- `test/skill_eval_contract.py`
- `test/test_skill_eval_contract.py`
- `test/skill-evals/*/protocol.json`，仅限尚无 `baseline.json` 的场景。
- 对应尚无 Baseline 的 `proposal-approval.json`。
- `docs/specs/next_generation_skill/tasks/T001-skill-eval-workflow.md`
- `docs/specs/next_generation_skill/tasks/T002-skill-eval-static-contract.md`
- `docs/specs/next_generation_skill/tasks/README.md`

### Add

- 本 Task 文件。
- 只有在已有 v1 Baseline 还需要继续复测时，才为它新增独立 v2 后继 Scenario 目录。

### Must Not Modify

- 任何已有 `baseline.json`、`scorecard.json` 或 `evidence/` 文件。
- 已有 Baseline 所绑定的 v1 `scenario.md`、`protocol.json`、Fixture 和 Approval。
- 生产 Skill、安装目录、CLI、外部项目或历史 Agent 输出。

## 实施细节

1. v2 `skillExpectations` 的每个目标都必须声明 `baselineLoad: absent | pre-change-explicit-file`、`liveLoad: current-explicit-file` 和 `branch: enter | exit | optional`。Baseline snapshot 匹配前者，Live snapshot 匹配后者及当前 `skillSources` Hash；不得再用一个 `load` 混写两个阶段。
2. 为 v2 Protocol 增加 `promptProjection`，三个布尔门必须明确禁止 Implementer 读取原始 Scenario、原始 Protocol 和未来轮次。
3. `interaction.rounds[0]` 只能使用 `messageSource: scenario.original-user-request`；第二轮起必须有非空逐字 `message`、`sender`、`contentRole` 和可观察 `stopCondition`。
4. 每个 rubric dimension 保留业务 ID、权重和 critical 标记，补充 Reviewer 能看懂的 `criterion`；所有维度 `minimum` 和 `minimumTotal` 固定为 90。
5. Protocol 保存全局离散锚点：`0` 表示材料性缺失、错误、越权或无证据；`90` 表示核心与边界全部满足，仅有轻微表达/组织问题；`100` 表示所有可观察要求都有直接证据且没有可定位缺陷。
6. Scorecard 每维只能使用 `0`、`90` 或 `100`，并保存非空的证据理由。硬否决项命中时仍直接失败，不能靠其他维度平均分抵消。
7. 静态合同同时覆盖阶段加载不一致、消息缺失、未来消息泄漏、投影门打开、criterion 缺失、非法分数、旧 Hash 和同一 Agent 等失败路径。
8. v2 运行记录把命令模板/真实解析命令逐项绑定到 `protocol.commands`，把逐轮消息 Hash、Prompt Hash、停点顺序和 Prompt 隔离绑定到实际证据；`pass/control-pass` 完成全部轮次，`fail` 只允许真实连续前缀。
9. Proposal 审核前检查 Fixture 项目规则没有直接复述被测 Skill 分支、标准分类、未来回复或用户可读答案；真实项目事实和公开测试保留，evaluator-only 内容不进入 Implementer 可见树。
10. v1 兼容只用于读取和验证已有历史运行，不能用于创建新的 Baseline、Live Eval 或 accepted 结果。不要把兼容扩大为生产双轨流程。
11. 批量迁移完成后重新计算无 Baseline Proposal 的 Scenario、Protocol 和 Fixture Hash，保持 `decision: pending`。向用户一次展示所有当前 Proposal 的场景目标、rubric、硬否决项和 Hash；用户批准前不启动任何 Eval Agent。
12. 本次升级新增或修改的 Python 具名函数/可复用 helper，函数体第一处写 `Purpose / Input / Output`，存在错误或副作用时补 `Errors / Side effects`。

## 验证

- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_skill_eval_contract.py'`
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_function_contract_comments.py'`
- `PYTHONDONTWRITEBYTECODE=1 npm test`
- `git diff --check`
- 对所有场景执行本地静态合同检查，确认无 Baseline 的 v2 Proposal 只因 `pending` 而未进入运行阶段，已有 v1 Baseline 仍绑定原 Hash。

这些命令只能读取本地合同和 Fixture，不得启动 subagent、访问网络或生成 Baseline。

## 完成标准

- 不了解当前对话的 Agent只读本文件，就能独立完成协议升级和历史证据保护。
- Baseline/Live 加载状态分别受 Hash 绑定，多轮用户输入受 Hash 绑定，Implementer 看不到 evaluator-only 信息，Reviewer 的评分离散且有证据。
- 所有无 Baseline Proposal 都绑定当前 v2 Hash 并保持待审核；用户批准前没有运行任何 Baseline。
- 任何已有 Baseline、证据、原始输入 Hash 都没有被“修正”为新协议事实。
- 静态测试、函数合同守卫和完整仓库回归通过。
