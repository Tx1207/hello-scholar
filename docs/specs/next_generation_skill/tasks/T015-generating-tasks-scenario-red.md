# T015：为 `generating-tasks` 编写 Scenario 并记录 Red Baseline

- Status: `approved`
- PR: `PR 3 - Plan 与 Tasks 拆分`
- Depends On: T001, T002, T008
- Parallel: Yes。docs CLI 可用后可以与 T018 并行，但不得创建目标 Skill。

## 目标

用两个已有 Accepted Spec 和 Approved Plan 的真实项目证明：当前 `writing-plans` 把高层策略和细粒度任务混在一份 Plan，而当前仓库没有专门生成 `<spec-bundle>/tasks.md` 的 Skill。Red 要证明独立、完整 Task 合同的缺口，不是用无效 Plan 制造失败。

## 事实源

- 执行 plan 第 8.3、8.4 节和 PR 3。
- PRD 第 8.4 节、`FR-TASK-001` 至 `FR-TASK-006`。
- 当前 `skills/superpowers-skills/writing-plans/SKILL.md` 中的 Bite-Sized Task、Spec Coverage、No Placeholders 和精确命令规则。

## 文件边界

### Add

- `test/skill-evals/generating-tasks/scenario.md`
- `test/skill-evals/generating-tasks/protocol.json`
- `test/skill-evals/generating-tasks/proposal-approval.json`
- `test/skill-evals/generating-tasks/fixture/`
- `test/skill-evals/generating-tasks/baseline.json`
- `test/skill-evals/generating-tasks/evidence/baseline/`
- `test/skill-evals/generating-tasks-migration/scenario.md`
- `test/skill-evals/generating-tasks-migration/protocol.json`
- `test/skill-evals/generating-tasks-migration/fixture/`
- `test/skill-evals/generating-tasks-migration/proposal-approval.json`
- `test/skill-evals/generating-tasks-migration/baseline.json`
- `test/skill-evals/generating-tasks-migration/evidence/baseline/`

两个 `evidence/baseline/` 只保存对应 `baseline.json` 引用的最小脱敏失败证据。

### Must Not Modify

- `skills/superpowers-skills/generating-tasks/`
- `skills/superpowers-skills/writing-plans/`
- `src/`

## 场景 A：功能拆分与显式 TDD 传递

`projectId: py-feature-policy-engine`。Fixture 是 Python feature-policy 库，包含 `hello-scholar/architecture.md`、一份 Accepted `spec.md`、一份与 Spec Revision 一致的 Approved `plan.md`、小型现有源码和 `unittest`，但没有 `tasks.md`。

1. Fixture 包含 `hello-scholar/architecture.md`、一份 Accepted `spec.md`、一份与 Spec Revision 一致的 Approved `plan.md`、小型现有源码和测试，但没有 `tasks.md`。
2. Spec 的验收标准使用稳定 ID（例如 `AC-1`、`AC-2`），Plan 完整定义 Add/Modify/Delete/Must Not Touch、阶段、测试、迁移、清理和回滚，不留需要重新设计的歧义。
3. 用户请求调用 `$generating-tasks`，从当前 Approved Plan 生成 `tasks.md`，不修改 Spec/Plan/代码。

## 硬门槛

- 输出路径是同 Bundle 的 `tasks.md`，Front Matter 引用正确 Spec ID、Spec Revision 和 Plan Revision，并精确初始化 `revision: 1`、`approval: pending-review`、`approved_revision: null`、`status: pending`。
- 每个 Task 有唯一 ID、人话目标、Spec Coverage、Depends On、Parallel、Files、Work、Validation 和 Completion。
- 任务依赖无环，标记为并行的 Task 不修改同一文件或相互依赖。
- 任务复用原 `writing-plans` 的精确路径、可执行验证命令/预期信号、No Placeholders 和合适粒度要求，但不重做架构决策，也不把 TDD 设为所有任务的默认流程。
- Fixture 的 Approved Plan 明确要求其中一个行为使用 TDD；只有覆盖该要求的 Task 写 Red-Green-Refactor，其他 Task 只写与风险相称的 Validation。这样同时验证“显式要求会传递”和“未指定时不自动扩张”。
- 每个 Spec AC 至少被一个必需 Task 覆盖；Plan 的迁移、删除旧路径和回归不能丢失。
- 无 `TBD`、`TODO`、“类似上一任务”、“添加适当测试”或只说“测试通过”的空泛验收。
- `spec.md` 和 `plan.md` bytes 不变，不创建全局 `tasks/`、memory 文件或代码。

## 场景 B：迁移、删除、清理与回滚不丢失

`projectId: node-config-format-cli`。Fixture 是一个与场景 A 不同的 Node CLI 项目，已有两种配置格式、兼容读取器和 `node:test`。Accepted Spec 已决定只保留新持久格式；Approved Plan 明确列出数据迁移、双读窗口、切换门、删除旧 writer/flag/dependency、回归矩阵和失败回滚，但没有细粒度 Tasks。

目标 `tasks.md` 必须：

1. 把迁移准备、兼容读取验证、切换、旧路径删除、回归和回滚验证拆成有依赖的独立 Task，不能只生成“实现新格式” happy path。
2. 每个删除 Task 明确精确文件/符号、何种前置证据允许删除、验证命令和失败时如何保持可恢复；禁止笼统写“清理旧代码”。
3. `Parallel` 必须服从真实文件边界：修改同一 reader/config/Fixture 的任务不能并行，独立文档/测试准备只有在无依赖时才可并行。
4. 每个 Task 可单独交给不了解对话的 Agent 阅读；不得用“同上”“按 Plan 实现”或隐藏答案。
5. 同样使用完整审批 Front Matter，Spec/Plan bytes 和源码保持不变。

## 独立评测执行合同

1. 两组 Scenario/Protocol 先作为一个 Proposal 批次提交用户，包含 rubric、硬否决项、受批准的 `criticalPath` 和 SHA-256；`proposal-approval.json` 绑定用户批准回复。批准当前 Hash 前不启动 subagent、不写 Baseline。`criticalPath` 只描述有序必要动作，不含墙钟阈值。
2. 两个 Protocol 分别固定使用上述 `projectId`；Fixture 的语言、规则、代码树、测试和迁移事实彼此独立。每个 Fixture 含 AGENTS、Git、可运行源码/测试和有效 Bundle；用绝对 `node <hello-scholar-repo>/bin/hello-scholar.js` 预检 `docs check` 和初始测试。目标 Skill 有意 absent，其他意外环境失败不算 Red。
3. 初始化后提交 Base commit，记录 `fixtureBaseCommit`。每场全新 Implementer/Reviewer 都用 `fork_turns: "none"`；Baseline 不提供不存在的目标文件，也不泄露 T016。
4. Reviewer 只看已批准 rubric、原始请求、产物、命令和 `base..HEAD + index + working tree + untracked + final hashes`，不看设计答案。任何多轮用户回复由 Eval 主 Agent按 Protocol 用 `followup_task` 发送。
5. 两份 Baseline 绑定 Proposal/Scenario/Protocol/Fixture 和 `generating-tasks: absent` snapshot，并如实写 `result: fail | control-pass`；Reviewer 建议不能替用户作最终质量决定。任一对照全绿时停止后续验收，只有用户复核后才能用新 Proposal/Hash 修改或新增场景，不能直接加难度重跑。

## Red Baseline

按上述合同在目标 Skill 不存在时分别派发全新 subagent。预期因没有独立 Skill、任务被写进 Plan、审批 Front Matter/任务合同缺失，或迁移/清理/回滚被漏掉而失败。写入两份真实 `baseline.json`，并保留最小脱敏证据。

## 验证与完成

- 两组 Protocol/Baseline 通过 T002 合同并如实记录结果；只有真实 `fail` 才打开 T016，`control-pass` 停在人审门且不计数。
- Fixture 的 Spec/Plan 本身通过 `hello-scholar docs check`，Red 不来自无效前置文档。
- `npm test` 通过，本 Task 没有实现 Skill。
