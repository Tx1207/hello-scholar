# T014：用当前 Codex subagent 验证 `brainstorming`

- Status: `approved`
- PR: `PR 2 - Spec Bundle 与 Manage Specs`
- Depends On: T011, T013
- Parallel: No。这是 PR 2 的集成验收。

## 目标

运行 T012 的两个真实设计场景，验证升级后 Brainstorm 仍能高质量澄清/比较/获得批准，但已将 Spec 身份交给 `manage-specs`，并分别在“只完成设计”和“继续实现”意图下正确结束或转交。

## 文件边界

### Add

- `test/skill-evals/brainstorming-spec-bundle/scorecard.json`
- `test/skill-evals/brainstorming-spec-bundle/evidence/live/`
- `test/skill-evals/brainstorming-api-route/scorecard.json`
- `test/skill-evals/brainstorming-api-route/evidence/live/`

`evidence/live/` 只保存 Scorecard 实际引用的必要脱敏对话片段、diff 摘要和命令输出，不覆盖 Baseline 证据。

### Must Not Modify

- `skills/superpowers-skills/brainstorming/`
- `skills/hello-scholar/manage-specs/`
- T012 的 Scenario、Protocol 和 Baseline

## 运行前批准与隔离

1. 完整读取 `WORKFLOW.md`，验证两个场景当前 Scenario/Protocol Hash 仍等于用户批准 Proposal；不一致就停止并重开 T012 重新咨询，不能沿用旧 rubric。
2. 预检源码仓库绝对 CLI、Fixture 初始测试、Git 和当前 Skill copy；每个 Fixture 建新临时仓库、提交 Base commit，记录 `fixtureBaseCommit`。
3. 每个 Implementer/Reviewer 都使用 `fork_turns: "none"`。Implementer 初始 Prompt 给出临时工作区、原始用户请求、项目规则、读取禁区、当前 `brainstorming` 和所需下游 Skill 的绝对 `SKILL.md` 路径/Hash，要求完整读取；完整 Scenario/Protocol、rubric 和 T013 保持 evaluator-only，不依赖名称发现。
4. 多轮用户批准只由 Eval 主 Agent按 Protocol 用 `followup_task` 发送。全程用 `base..HEAD + index + working tree + untracked` 审查最终树。

## 执行

1. 场景 A 核对只对材料性问题一次一问、多方案权衡、不提前实现、`manage-specs` 调用、原 Bundle Revision 更新、完整 Spec 自审/整份用户审阅和设计后正常终止。
2. 场景 B 使用另一个全新 Implementer，核对独立 Spec 创建确认、公共 API 设计证据和整份 Spec 审核后只转交 `writing-plans`；不得提前创建 Plan/Tasks/代码。
3. 两个场景都确认没有 Visual Companion 提议、服务器命令、memory 路径或已淘汰 Skill。
4. 每场派发不同的全新 Reviewer，只传用户已批准 rubric、Scenario、Protocol、原始对话、final-tree diff 和验证证据。
5. 写当前 Scenario/Protocol/Fixture/Skill Hash、Agent ID、硬门槛、质量、有序关键路径证据和 Reviewer 建议。失败时记录 `fail` 并重开 T013 或 T012，不就地修 Skill。
6. Reviewer pass 后先向用户提交两场输出、证据摘要和评分建议；只有用户明确接受当前 Scorecard/Hash 才写 `userDecision: accepted`。用户要求修改 rubric/场景时回到 T012 新 Proposal，不由 AI 自批。

## 完成标准

- 两个 Scorecard 都通过 T002 合同，所有硬门槛通过，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 新行为与 T012 Red 形成可观察对比，而不是只检查 Skill 文本出现了新路径。
- `npm test` 通过，临时工作区已清理。
