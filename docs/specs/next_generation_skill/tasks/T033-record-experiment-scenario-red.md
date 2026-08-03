# T033：为 `record-experiment` v2 编写 Scenario 并记录 Red Baseline

- Status: `approved`
- PR: `PR 5 - 根目录 Runs 与 Record`
- Depends On: T002, T008
- Parallel: Yes。可以准备评测资产，但不得修改 `record-experiment` 或现有 Record 测试。

## 目标

用三个真实场景证明当前 `record-experiment` 仍不满足下一代合同。Red 不能只靠措辞差异：必须真实暴露旧 `hello-scholar/memory/experiment-records/` 路径、单文件 Run 布局、人工维护 Index，以及“所有实验一律事前建档”会阻塞低风险探索的问题。

## 事实源

- 执行 plan 第 6.5、7.3、8.7、10 节和 PR 5。
- PRD `FR-RECORD-001` 至 `FR-RECORD-005`、实验优先路径和 Record 固定格式。
- T001/T002 的 Skill Eval 工作流和证据合同。
- 当前 `skills/hello-scholar/record-experiment/` 只作为修改前 Baseline，不作为目标行为事实源。

## 当前 Skill 与目标 Skill 的关键差异

| 当前行为 | 下一代目标 |
|---|---|
| 写 `hello-scholar/memory/experiment-records/runs/<run-id>.md` | 写项目根目录 `runs/<run-id>/record.md` |
| Skill 用模板手工维护旧 `INDEX.md` | `runs/INDEX.md` 只由 `hello-scholar docs sync` 生成 |
| 所有 Full record 都是绝对事前硬门 | 正式/昂贵/长时间/不可逆实验事前记录；满足全部隔离条件的低风险探索可以限时补录 |
| 一份 Markdown 同时承担 Run 身份和全部路径说明 | 一个 Run 目录只有一个 `record.md`，原始输出、指标、日志和 checkpoint 分目录保存 |
| 当前模板没有下一代 Front Matter | `record.md` 使用固定 Front Matter 和 12 节正文 |

当前 Skill 中关于实验身份、精确命令、Git/配置/Seed、上游 provenance、失败和负结果的规则是有效资产；场景必须验证这些能力在升级后仍存在，不能把“换路径”误写成“删掉证据纪律”。

## 文件边界

### Add

- `test/skill-evals/record-formal-prelaunch/scenario.md`
- `test/skill-evals/record-formal-prelaunch/protocol.json`
- `test/skill-evals/record-formal-prelaunch/proposal-approval.json`
- `test/skill-evals/record-formal-prelaunch/fixture/`
- `test/skill-evals/record-formal-prelaunch/baseline.json`
- `test/skill-evals/record-formal-prelaunch/evidence/baseline/`
- `test/skill-evals/record-exploration-backfill/scenario.md`
- `test/skill-evals/record-exploration-backfill/protocol.json`
- `test/skill-evals/record-exploration-backfill/proposal-approval.json`
- `test/skill-evals/record-exploration-backfill/fixture/`
- `test/skill-evals/record-exploration-backfill/baseline.json`
- `test/skill-evals/record-exploration-backfill/evidence/baseline/`
- `test/skill-evals/record-terminal-evidence/scenario.md`
- `test/skill-evals/record-terminal-evidence/protocol.json`
- `test/skill-evals/record-terminal-evidence/proposal-approval.json`
- `test/skill-evals/record-terminal-evidence/fixture/`
- `test/skill-evals/record-terminal-evidence/baseline.json`
- `test/skill-evals/record-terminal-evidence/evidence/baseline/`

三个 `evidence/baseline/` 目录只保存对应 `baseline.json` 引用的最小脱敏失败证据。

### Must Not Modify

- `skills/hello-scholar/record-experiment/`
- `src/`
- `test/test_record_experiment_skill.py`
- `test/fixtures/record_experiment_10_scenario_*`

## 三个场景

### 1. `record-formal-prelaunch`

`projectId: py-cache-benchmark`。Fixture 是一个 Python Cache 性能项目，包含 Accepted Spec、Approved Current Plan/Tasks、可运行 Benchmark 脚本和干净 Git 状态。用户要求启动一个用于 Spec 验收的正式 Benchmark。

预期行为：

1. 启动命令前创建 `runs/<run-id>/record.md`，写全 Front Matter、精确命令、CWD、Git、模型/配置、数据/Seed、预期信号、失败信号和停止条件。
2. 预先创建或声明同一 Run 下的 `outputs/`、`results/`、`logs/`、`checkpoints/` 路径。
3. 不出现 `hello-scholar/memory/`、`hello-scholar/runs/`、`run.json` 或第二份说明文件。
4. `runs/INDEX.md` 只能通过 `hello-scholar docs sync` 产生，不能套用旧 Index 模板手写。

### 2. `record-exploration-backfill`

`projectId: node-prompt-routing-sandbox`。Fixture 是一个与正式 Cache Benchmark 不同的 Node Prompt 路由实验项目，明确满足全部探索条件：使用一个隔离 Worktree、无生产数据、无公共 API/持久格式变化、可丢弃、时间与成本上限明确，且结果不会直接进入正式路径。这里选择 Worktree 只是为了让隔离证据容易验证，不表示产品会为所有探索自动创建 Worktree；现有隔离 Branch 或等价临时工作目录也可以满足目标合同。

预期行为：

1. Skill 允许先启动，不伪称违反正式实验硬门。
2. 在写依赖结果的 Spec 前补齐 `record.md`；如果尚未补齐，必须阻止进入该边界。
3. 不为每次轮询写事件；只记录启动、关键证据变化和终态。
4. 如果任一隔离条件不成立，退回正式事前记录路径。

### 3. `record-terminal-evidence`

`projectId: py-model-quantization-lab`。Fixture 是一个独立的 Python 模型量化项目，包含两个已经有正确根目录 Record 的 Run：一个 CUDA OOM 失败，一个有效但不支持假设的负结果。用户要求完成收口。

预期行为：

1. 失败 Run 保持 `failed` 并记录短错误证据；负结果 Run 保持 `completed`，结论和决定明确为不采用，而不是伪装成失败或删除。
2. 每个 Run 只修改已有 `record.md`；大日志留在 `logs/`，指标文件留在 `results/`。
3. 结束后一次补齐结果、观察、结论、决定和后续行动，不生成 report/summary/README。

## Protocol 与 Red Baseline

- 三个 Protocol 的 `targetSkills` 都是 `["record-experiment"]`，Implementer/Reviewer 各 1，质量门固定为 90，逐维只允许 `0 / 90 / 100`。
- Formal 场景验证命令必须确认“Record 先于 Benchmark 进程证据出现”；探索场景必须验证补录边界；终态场景必须验证失败和负结果都保留。
- 禁止路径至少包含 `hello-scholar/memory/` 和 `hello-scholar/runs/`；禁止文件至少包含 `run.json`、`README.md`、`report.md`、`summary.md`、`final-report.md`。
- 使用修改前当前 Skill 分别运行三个全新 subagent。Baseline 应因旧路径、旧布局或探索时机合同失败；不能用损坏脚本、缺依赖或无效 Fixture 制造 Red。
- `baseline.json` 记录当前 Skill 目录 Hash、真实 Agent ID、失败硬门、命令退出码和证据相对路径。

## 独立评测执行合同

1. 三组 Scenario/Protocol/rubric 先作为一个 Proposal 批次交用户；三个 Protocol 分别固定使用上述 `projectId`，Fixture 在语言/依赖、项目规则、代码树、测试和实验状态上彼此独立。每个 `proposal-approval.json` 绑定获批 Proposal ID、当前 Scenario/Protocol/Fixture Hash 和明确回复证据。批准前不运行实验或 Baseline Agent。
2. Fixture 预检 Git、项目依赖、初始测试/Benchmark dry-run、时间/成本安全边界和绝对 `node <hello-scholar-repo>/bin/hello-scholar.js`。修改前 Skill immutable copy 必须存在且 Hash 正确；意外环境失败不算 Red。
3. 每个临时仓库提交/记录 `fixtureBaseCommit`。每场使用不同的 `fork_turns: "none"` Implementer，Prompt 只给工作目录、当前轮逐字消息、项目规则、读取禁区和旧 `record-experiment/SKILL.md` 绝对路径/Hash并要求完整读取；完整 Scenario/Protocol、rubric、T034 和目标答案保持 evaluator-only。
4. 探索补录边界和终态选择等未来用户回复由 Eval 主 Agent按 Protocol 在停点通过 `followup_task` 发送。每场另派不同的 `fork_turns: "none"` Reviewer，只看获批 rubric、原始交互、事件时序、命令和 Base-to-final 全部变化。
5. Baseline 绑定 Proposal/Scenario/Protocol/Fixture 与修改前 Skill snapshot；后续 v2 Skill Hash 变化不使历史对照失效。Reviewer 只建议结果，不拥有用户 accepted。每场如实记录 `fail | control-pass`；任一全绿时暂停该 Skill 后续验收，只有用户复核后才能用新 Proposal/Hash 改场景，不能直接加难度。

## 验证

- 用 T002 合同校验三个 Protocol 和 Baseline 的 Schema/Hash。
- 确认三个 Baseline 都通过合同并如实记录；只有 `fail` 才能计数和进入 T034，`control-pass` 停在人审门。
- 运行 `npm test`。

## 完成标准

- 正式事前记录、探索限时补录、失败/负结果收口都有独立场景和诚实对照证据；后续实施只消费真实 Red。
- 场景同时保护现有 Skill 的实验身份和 provenance 能力。
- 本 Task 没有修改 Skill、模板、源码或旧质量门。
