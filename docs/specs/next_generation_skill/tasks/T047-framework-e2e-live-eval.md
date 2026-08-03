# T047：连续三次运行 Framework E2E Live Eval

- Status: `approved`
- PR: `PR 7 - Legacy 迁移与完整闭环`
- Depends On: T046, T052, T082
- Parallel: No。完整框架和旧路径守卫全部通过后才能运行。

## 目标

在当前 Codex 会话内连续三次运行 `framework-e2e-paged-cache-v2`，每次使用新的隔离工作区、Implementer 和 Reviewer。这个 Fixture 明确包含材料性架构变化，因此用真实产物验证 `Spec -> Plan -> Tasks -> Implementation -> Record -> Converge -> Fresh Evidence`，并在用户批准后另行更新 Architecture；它不把该条件分支推广为所有任务的固定闭环，也不让完整文档阻塞正式 Benchmark 启动。

## 与早期证据的关系

- T003 的历史 v1 `baseline.json` 只证明旧框架在当时不能完成场景，整个目录保持只读，也不能直接作为 v2 Scorecard 的 Baseline。
- T071 创建独立 v2 后继 Proposal，T082 在用户批准当前 Hash 后保存新的真实 Red；本 Task 只消费该 Red，不修改考题或对照。
- 各 Skill 的单项 Live Eval 证明局部行为，本 Task 检查跨 Skill 交接、文件 owner、顺序和最终状态。
- 普通 `npm test` 只校验已保存证据；真正的三次 Agent 执行只在本 Task 按 Workflow 手动编排。

## 文件边界

### Add

- `test/skill-evals/framework-e2e-paged-cache-v2/scorecard.json`（第 1 次运行）
- `test/skill-evals/framework-e2e-paged-cache-v2/scorecard-run-2.json`
- `test/skill-evals/framework-e2e-paged-cache-v2/scorecard-run-3.json`
- `test/skill-evals/framework-e2e-paged-cache-v2/evidence/run-1/`
- `test/skill-evals/framework-e2e-paged-cache-v2/evidence/run-2/`
- `test/skill-evals/framework-e2e-paged-cache-v2/evidence/run-3/`
- `test/test_framework_e2e_scorecard.py`

### Must Not Modify

- `test/skill-evals/framework-e2e-paged-cache-v2/scenario.md`
- `test/skill-evals/framework-e2e-paged-cache-v2/protocol.json`
- `test/skill-evals/framework-e2e-paged-cache-v2/proposal-approval.json`
- `test/skill-evals/framework-e2e-paged-cache-v2/baseline.json`
- `test/skill-evals/framework-e2e-paged-cache-v2/evidence/baseline/`
- v2 Fixture
- `test/skill-evals/framework-e2e-paged-cache/` 下的全部历史 v1 文件
- 任何 Skill、`src/`、AGENTS、README 或迁移说明

如果 v2 Scenario/Protocol/Fixture 已不再代表目标产品，停止并重开 T071，生成新 Proposal 并重新让用户审核，再由 T082 取得新 Red；不能在 E2E Task 偷改考试题。

## 三次运行方法

对 `run-1`、`run-2`、`run-3` 完整重复以下流程：

1. 完整读取 `test/skill-evals/WORKFLOW.md`，核对 T071 v2 Proposal ID、用户批准的业务 rubric、共享用户价值 rubric、`criticalPath`、Scenario/Protocol/Fixture Hash，以及 T082 的真实 Red Baseline 全部当前；任一输入变化停止并重开 T071/T082，不把旧批准沿用到新考题。`criticalPath` 只定义必要动作顺序，不含墙钟质量阈值。
2. 从原始 Fixture 创建新的临时目录和 Git 仓库，提交 Base 并记录 `fixtureBaseCommit`；不得复制上一次工作区。预检 Git/Node/Python、初始测试和绝对源码 CLI。
3. 用当前仓库 `copy` 模式安装 Skills，解析 Protocol 每个 `targetSkills` 对应的绝对 `SKILL.md` 路径和目录 Hash，形成显式 path map。不能依赖临时项目名称发现；activation probe 只有平台可观察 catalog 时才另行记录。
4. Eval 主 Agent用 `fork_turns: "none"` 派发全新 Implementer under test，首轮只给工作目录、原始用户请求、项目规则、读取禁区和显式 Skill path map/Hash；完整 Scenario/Protocol、rubric，以及未来的 Plan 批准、Tasks 批准、独立实施授权和 Architecture 批准都不得出现在首轮 Prompt。Eval 主 Agent不实现 Paged Allocator。该 Implementer 代表产品中的当前主 Agent，直接执行 `tasks.md`，不得调用已淘汰执行 Skill或嵌套每 Task 实现 subagent。
5. Eval 主 Agent只在四个真实停点分别用 `followup_task` 发送对应回复：看到 draft Plan 摘要后批准 Plan；看到 pending-review Tasks 的覆盖/依赖摘要后批准当前 Tasks Revision；Implementer 再次停止后单独授权本轮实施；Converge 和 Fresh Evidence 完成、Implementer 给出 Architecture 语义 Proposal 与当前 SHA-256 后才批准 Architecture。任何阶段未停、提前写入或把前一项批准解释为后一项授权都记为失败。随后主 Agent核对依赖执行、代码/测试/Benchmark、根目录 Run 和 Converge，并读完 Protocol 全部命令。
6. 用 `fork_turns: "none"` 派发与本次 Implementer 不同、也未参加其他运行的全新 Reviewer。Reviewer 只收到获批 rubric、原始请求/回复、产物、命令，以及 `fixtureBaseCommit..HEAD`、index、working tree、全部 untracked 和 final file hashes；不给实现 Task、隐藏答案或主 Agent疑点。
7. 保存脱敏的 Agent ID、Proposal/Scenario/Protocol/Fixture/Skill/共享 rubric Hash、完整 final-tree 证据、命令/退出码、硬门、业务与用户价值评分和有序关键路径证据；删除临时工作区。runner watchdog 仅可防止无限运行，不进入质量评分。
8. 任一次失败都如实写 `fail`。不得在当前 Task 修改 Skill 后重跑覆盖失败证据；先重开对应 Implementation/Scenario Task，修复通过后再从三次全新运行重新计数。

## 每次必须通过的硬门

- 从 Accepted Spec 生成同 Bundle `plan.md` 和 `tasks.md`，Revision/Current 状态正确。
- Eval 主 Agent不直接实现；每次由一个 fresh Implementer under test 作为产品主 Agent直接执行全部 Tasks。独立 Reviewer 只属于 Eval，不是产品完成的强制步骤。
- Paged Block Allocator 正确，外部入口兼容，旧正式执行路径和未选实现已清理。
- 测试在 `tests/`，Benchmark 在 `scripts/`，无 `*_new/*_final/*_copy/*_v2` 或根目录垃圾。
- 正式 Benchmark 启动前已有 `runs/<run-id>/record.md`；原始输出在 `outputs/`，指标在 `results/`。
- 启动前 Record 已包含最小复现字段；获批 `criticalPath` 证明必要的批准、Record 和 Benchmark 动作按序发生，完整背景不阻塞启动。
- 无 `hello-scholar/memory/`、`hello-scholar/runs/`、`run.json` 或第二说明文件。
- Tasks 完成；只有用户明确要求，或 Bundle 末端需要只读收敛时才运行 Converge。命令证据证明主 Agent随后取得 AGENTS Fresh Evidence；若 Bundle 有材料性结构变化，只提醒用户决定是否更新 Architecture。Architecture 只在用户确认后反映已实现系统并引用 Spec。
- 所有验证命令退出码为 0，diff 没有场景外改动。

## 三份 Scorecard 与专用静态门

- 三个 JSON 都使用 T001/T002 的单次 Scorecard 字段；第 1 次沿用标准文件名 `scorecard.json`，第 2/3 次使用同 Schema 的具名文件。
- `test/test_framework_e2e_scorecard.py` 读取三份证据，验证 Scenario/Protocol/Skill Hash 当前；三次规定的 Implementer/Reviewer 产生 6 个互不重复的 ID，且没有产品执行嵌套 Agent；三次硬门全 true、命令全绿、质量门逐次通过。
- 三次的业务和用户价值两组总分都至少 90，每个维度都不得低于 90，逐维只允许 `0 / 90 / 100`。
- 三次都必须满足获批 `criticalPath` 的有序动作、真实停点和证据合同；不保存或比较墙钟、暂停计数或中位数速度字段。
- token 不可观测时为 `null` 并有原因；不伪造数字。
- 专用测试只读 JSON/Hash，不调用 Agent、网络或 `codex exec`。
- 三次 Reviewer pass 后，把三份产物、证据和差异批量交用户审核。每份 Scorecard 保留独立运行 ID 和决定；只有用户明确接受当前三份 Hash 后才写 `userDecision: accepted`，Reviewer 不能代替。

## 验证与完成

- `python3 -m unittest test/test_framework_e2e_scorecard.py test/test_skill_eval_contract.py`
- `npm test`
- 确认运行 `npm test` 时没有创建临时 Agent 工作区、没有网络调用、没有新增 Run。
- 三次全部通过、用户 accepted 且临时工作区已删除；任何失败都不能用中位数掩盖。
