# T020：用当前 Codex subagent 验证 `writing-plans`

- Status: `approved`
- PR: `PR 3 - Plan 与 Tasks 拆分`
- Depends On: T017, T019
- Parallel: No。这是 PR 3 的集成验收。

## 目标

运行 T018 的两个场景，验证 `writing-plans` 能生成可批准的高层 Bundle Plan，也能在 Spec 有重大设计空洞时零写入停止；不会把 Tasks/实施代码塞进 Plan或静默替用户做设计决定。

## 文件边界

### Add

- `test/skill-evals/writing-plans-bundle/scorecard.json`
- `test/skill-evals/writing-plans-bundle/evidence/live/`
- `test/skill-evals/writing-plans-spec-gap/scorecard.json`
- `test/skill-evals/writing-plans-spec-gap/evidence/live/`

`evidence/live/` 只保存 Scorecard 实际引用的必要脱敏审批对话、diff 摘要和命令输出，不覆盖 Baseline 证据。

### Must Not Modify

- `skills/superpowers-skills/writing-plans/`
- `skills/superpowers-skills/generating-tasks/`
- T018 的 Scenario、Protocol、Baseline

## 执行和评审

1. 按 Workflow 核对两个 Proposal/Hash 仍获用户批准；预检绝对源码 CLI、当前 Skill copy 和 Fixture 命令，为每场提交/记录 Base commit。
2. 每场派发不同的全新 `fork_turns: "none"` Implementer；Prompt 给工作目录、当前轮逐字消息、项目规则、读取禁区和当前 `writing-plans/SKILL.md` 绝对路径/Hash并要求完整读取；完整 Scenario/Protocol、rubric、T019 和预期答案保持 evaluator-only。
3. 场景 A 检查 Plan 在完整自审和整份用户审核前保持 draft、高层章节、与 Spec 一致、无 Tasks/代码步骤/旧路径。批准前不调用 `generating-tasks`；Eval 主 Agent用 `followup_task` 发送整份批准后，下一步只转交新 Skill。
4. 场景 B 检查具体设计空洞和影响被指出、所有项目文件保持 Base bytes、返回正确 owner，且没有猜签名合同。
5. 每场派发不同的 `fork_turns: "none"` Reviewer，只接收已批准 rubric、原始对话、Base-to-final diff 和命令证据。
6. 写全部当前 Hash、Agent ID、硬门、评分和 Reviewer 建议；失败时重开 T019/T018，不在本 Task 修 Skill 或改场景。Reviewer pass 后批量请用户审阅，只有用户明确接受当前证据才写 `userDecision: accepted`。

## 完成标准

- 两个 Scorecard 都通过 T002 合同，硬门槛全通过，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 对比 T018 Red，产物从“日期 Plan + 内嵌 Tasks”变为“Bundle 高层 Plan + 明确 Tasks 转交”。
- `npm test` 通过，临时工作区已清理。
