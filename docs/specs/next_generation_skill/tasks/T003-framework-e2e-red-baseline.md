# T003：编写 Framework E2E 场景并记录 Red Baseline

- Status: `completed`
- PR: `PR 0 - Skill Eval Workflow 与静态证据门`
- Depends On: T001, T002
- Parallel: No。它是后续完整闭环验收的基准。

## 为什么要做

如果没有下一代 Skill 也能完成场景，那么后续 Live Eval 无法证明 Skill 带来了真实行为。本 Task 要在任何新 Skill 实现前，用现有仓库创建一个完整 Paged Cache 场景，并留下可复核的失败证据。

## 事实源

- 执行 Plan 中标为历史 v1 的“首个完整 E2E 测试场景”、第 10 节和 PR 0；需要继续评测时只使用 T071 的 v2 后继，不修改本 Task 已保存的 v1 输入或证据。
- `test/skill-evals/WORKFLOW.md`。
- `test/skill_eval_contract.py`。

## 文件边界

### Add

- `test/skill-evals/framework-e2e-paged-cache/scenario.md`
- `test/skill-evals/framework-e2e-paged-cache/protocol.json`
- `test/skill-evals/framework-e2e-paged-cache/proposal-approval.json`
- `test/skill-evals/framework-e2e-paged-cache/fixture/AGENTS.md`
- `test/skill-evals/framework-e2e-paged-cache/fixture/hello-scholar/architecture.md`
- `test/skill-evals/framework-e2e-paged-cache/fixture/hello-scholar/specs/kv-cache-acceleration/SPEC-001-paged-cache/spec.md`
- `test/skill-evals/framework-e2e-paged-cache/fixture/src/kv_cache/contiguous_allocator.py`
- `test/skill-evals/framework-e2e-paged-cache/fixture/scripts/benchmark_cache.py`
- `test/skill-evals/framework-e2e-paged-cache/fixture/tests/test_contiguous_allocator.py`
- `test/skill-evals/framework-e2e-paged-cache/baseline.json`
- `test/skill-evals/framework-e2e-paged-cache/evidence/baseline/`

`evidence/baseline/` 只保存 `baseline.json` 实际引用的小型脱敏 diff/命令失败摘录，不复制临时工作区。

### Must Not Modify

- 任何 `skills/` 文件。
- 任何 `src/` 生产文件。
- 仓库现有测试 Fixture。

## 场景必须包含的真实状态

Protocol 固定使用 `projectId: py-paged-cache-engine`。它代表这个独立 Python KV Cache 项目，而不是运行编号；T047 的三次重复运行继续使用同一 `projectId`，并且因为 `primarySkill: framework-e2e`、`countsTowardProductSkill: false`，不能给任何产品 Skill 增加项目数。

1. `architecture.md` 只描述当前 contiguous allocator，不预先声称 Paged Cache 已实现。
2. `spec.md` 使用 `schema: 1`、`kind: spec`、`id: SPEC-001`、`topic: kv-cache-acceleration`、`status: accepted` 和正整数 Revision，并具有可验证的 Acceptance Criteria。
3. 现有 Python 代码和测试可运行，但只支持 contiguous allocator。Benchmark 脚本要能显示改造前基线，不预先实现目标方案。
4. Fixture 可以在临时目录独立初始化 Git，不引用仓库外的绝对路径或秘密。

## scenario.md 必须要求

1. 调用 `$writing-plans` 在 Spec Bundle 中生成高层 `plan.md`。
2. Plan 第一版为 `draft`。Implementer 展示 Plan 摘要并停止；Eval 主 Agent通过第一条 `followup_task` 发送脚本化用户批准，Plan 才变为 `approved`，随后调用 `$generating-tasks` 生成独立 `tasks.md`。
3. Tasks 第一版必须有独立审批字段且为 `revision: 1`、`approval: pending-review`、`approved_revision: null`、`status: pending`。Implementer 展示 Tasks 覆盖/依赖并停止；第二条 `followup_task` 批准当前 Tasks Revision 后才能写 `approval: approved`、`approved_revision: 1`。
4. Task 合同获批不等于授权本轮实施。Eval 主 Agent通过第三条独立 `followup_task` 发送“按当前 Approved Tasks 开始实施”，之后该 Implementer 才代表产品中的当前主 Agent直接逐项实施；不调用 `executing-plans`、`subagent-driven-development` 或嵌套每 Task subagent。
5. 实现 Paged Block Allocator，保持外部入口兼容，并删除旧的正式执行路径。每个 Task 必须在 Validation/Completion 有新鲜证据后才能勾选。
6. 测试放 `tests/`，Benchmark 放 `scripts/`，不创建 `*_new`、`*_final`、`*_v2` 或无关顶层目录。
7. 正式 Benchmark 使用 `record-experiment`，记录位于 `runs/<run-id>/record.md`，原始输出和指标分别进入该 Run 的 `outputs/` 和 `results/`。
8. 全部 Task 后调用 `converge-to-spec` 检查 Current、Tasks 当前 Revision 已批准、Spec/Plan/Tasks 对齐、正式 Record 和清理；随后当前 Implementer 自己在当前工作树运行并读完完整测试、Benchmark 和 docs 命令。只有 Spec 完成/里程碑需要同步 Architecture；若需要，先给语义 Proposal 和当前 Hash，第四条 `followup_task` 用户批准后才写。顺序不得倒置为先写 Architecture 再验证。
9. 实施结束后由 Eval 主 Agent 派发不同的只读 Reviewer subagent。Reviewer 是评测隔离角色，不是产品主流程的必需 Skill；最终证据返回 Implementer/Reviewer Agent ID、文件变化、命令与退出码、评审结论和剩余风险。

## Protocol 门槛

- `targetSkills` 至少包含 `writing-plans`、`generating-tasks`、`record-experiment`、`converge-to-spec` 和 `docs-maintenance`；不得包含任何已淘汰 Skill。
- Implementer 和 Reviewer 各至少 1 个，且不得是同一 Agent。
- 该历史 v1 Protocol 当时的 `minimumOverallScore` 与所有维度门均为 90，逐维只允许 `0 / 90 / 100`，`absoluteTimeoutSeconds` 为 1200。该字段只属于冻结的历史证据，不能作为后继运行的质量合同；T071 的 v2 Proposal 使用非计时 `criticalPath`，并明确拒绝 `speed`、`speedLimits` 和运行证据中的 `timing`。
- 预期产物覆盖 `plan.md`、`tasks.md`、Paged Allocator 代码/测试、Benchmark 和根目录 Run Record。
- 禁止产物覆盖 `hello-scholar/memory/`、`hello-scholar/runs/`、`run.json`、Run 内第二份说明文档和上述后缀文件。
- 额外硬门确认产品 Implementer 没有调用已淘汰 Skill、没有嵌套派发实现 subagent；Eval 外层仍有且只有独立的 Implementer/Reviewer 角色。
- `primarySkill` 写为 `framework-e2e`（非产品 Skill 计数值），本目录不计入任何产品 Skill 的“至少两个专属 case”。该历史 v1 Protocol 的 `skillExpectations` 按当时 Schema 保存旧 `writing-plans`/`record-experiment` 的 immutable 状态和尚不存在 Skill 的 `absent` 状态，原字节不再修改；T071 的 v2 后继改用 `baselineLoad` / `liveLoad` / `branch` 三字段合同。

## Proposal、隔离与证据合同

1. Scenario/Protocol/rubric 先作为 Proposal 提交用户，`proposal-approval.json` 绑定当前 Hash；批准前不运行 Baseline。任何交互脚本或硬门语义修改都重新咨询。
2. 预检 Python/Node/Git、Fixture 初始测试、绝对 `node <hello-scholar-repo>/bin/hello-scholar.js` 和每项 Skill expectation；有意 absent 合法，意外 Loader/依赖失败不算 Red。
3. Fixture 初始化后提交 Base commit 并写入 `fixtureBaseCommit`。Implementer/Reviewer 都用 `fork_turns: "none"`；显式加载的旧 Skill由绝对 `SKILL.md` 路径/Hash提供，absent Skill 不伪造文件。
4. Plan、Tasks、实施、Architecture 的未来批准回复只在对应停点通过 `followup_task` 发送，不放进首轮 Prompt。Reviewer 只收到获批 rubric、完整原始交互、确定性命令和 Base 到最终树的 committed/index/working-tree/untracked/final-hash 证据。
5. Baseline 绑定 Proposal/Scenario/Protocol/Fixture 和各目标 Skill的历史 snapshot；后续生产 Skill实现不使 Red 过期。

## Red Baseline 执行

1. 完整按上述合同创建隔离工作区，但不安装未实现的新 Skills，不给 Agent看后续 Task 或预期修复。
2. 派发一个全新 `fork_turns: "none"` Implementer，只给工作目录、原始用户请求、项目规则、读取禁区和显式 Skill snapshot；完整 Scenario/Protocol 与 rubric 保持 evaluator-only。Eval 主 Agent只在真实停点按 Hash 绑定脚本发送后续回合；另派独立 Reviewer核对失败。
3. 运行 Protocol 中的确定性命令，保留 diff 和失败输出。
4. 至少应观察到“缺少目标 Skill”、“旧路径”、“没有独立 Tasks”或“没有根目录 Run”中的一项失败。如果全部通过，不得伪造 Red或擅自加难题；写入 `control-pass`，停止 PR 0 并把 Framework 是否仍有独立价值交用户裁决。
5. 将真实 `fail | control-pass` 写入 `baseline.json`，用 T002 合同校验，然后删除临时工作区。只有真实 Red 才满足本 Task 的完成标准并允许后续实现。

## 验证

- `python3 -m unittest test/test_skill_eval_contract.py`
- `npm test`
- 人工检查 Baseline 失败与下一代框架缺失有直接因果关系，不是 Fixture 语法错误、环境缺少 Python 或其他无关失败。

## 完成标准

- Scenario 、Protocol、Fixture 和 Baseline 都可以脱离当前对话理解。
- Baseline 由真实的当前会话 subagent 执行产生，如实为 `fail | control-pass` 并通过 T002 静态合同校验；只有 `fail` 打开后续实施门，`control-pass` 保持 PR 0 停止并等待用户裁决。
- 本 Task 没有实现或修改任何生产 Skill。
