# T017：用当前 Codex subagent 验证 `generating-tasks`

- Status: `approved`
- PR: `PR 3 - Plan 与 Tasks 拆分`
- Depends On: T016
- Parallel: No。评测期间不修改 Skill。

## 目标

运行 T015 的两个场景，证明新 Skill既能传递显式 TDD/AC 覆盖，也能完整拆出迁移、删除、清理和回滚 Tasks，而不修改 Spec/Plan 或自己开始实现。

## 文件边界

### Add

- `test/skill-evals/generating-tasks/scorecard.json`
- `test/skill-evals/generating-tasks/evidence/live/`
- `test/skill-evals/generating-tasks-migration/scorecard.json`
- `test/skill-evals/generating-tasks-migration/evidence/live/`

`evidence/live/` 只保存 Scorecard 实际引用的必要脱敏产物摘录、diff 摘要和命令输出，不覆盖 Baseline 证据。

### Must Not Modify

- `skills/superpowers-skills/generating-tasks/`
- T015 的 Scenario、Protocol、Baseline
- 任何生产代码

## 执行与评审

1. 读取 Workflow，核对两个场景的 Proposal/Scenario/Protocol Hash 仍获用户批准；变化时停止并回到 T015。预检绝对源码 CLI、当前 Skill copy、Fixture 初始命令，并为每场记录新的 `fixtureBaseCommit`。
2. 每场派发不同的全新 Implementer，使用 `fork_turns: "none"`；Prompt 提供当前 `generating-tasks/SKILL.md` 的绝对路径/Hash并要求完整读取，只提供工作目录、当前轮逐字消息、项目规则和读取禁区；完整 Scenario/Protocol、rubric、T016 和预期 diff 保持 evaluator-only。
3. 场景 A 逐项核对完整审批 Front Matter、Task 字段、AC 覆盖、依赖无环、并行文件不冲突、显式 TDD 只传给对应 Task和占位扫描。还要核对生成后先提交完整 `tasks.md` 给用户审核；批准只迁移审批字段，不触发实施。
4. 场景 B 核对迁移/切换/删除/清理/回归/回滚无遗漏，删除门可执行且共享文件没有错误并行。两场都确认 Spec/Plan bytes 不变。
5. 每场派发不同的 `fork_turns: "none"` Reviewer，让它仅凭随机抽取 Task 理解目标、文件、依赖和验证，并审查整体覆盖。证据使用固定 Base 到最终树的完整变化。
6. 写当前全部 Hash、Agent ID、命令、硬门、评分和 Reviewer 建议。如果发现任务过大、需要重新设计、依赖错误或缺失 AC，记为 `fail` 并重开 T016/T015，不降低评分标准。
7. Reviewer pass 后把两场输出质量、证据和建议批量交给用户；只有用户明确接受当前 Hash 才写 `userDecision: accepted`。

## 完成标准

- 两个 Scorecard 都通过 T002 合同，硬门槛全通过，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 新 `tasks.md` 是独立事实源，与 T015 Red 的“任务仍塞在 Plan”有明确行为差异；任务获批后仍须用户另行授权，才由当前主 Agent直接执行。
- `npm test` 通过，临时工作区已清理。
