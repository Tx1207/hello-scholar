# T054：用当前 Codex subagent 验证 `handoff`

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T049
- Parallel: No。T049 完成路径修改后，两个场景分别使用 fresh Agent 运行。

## 目标

验证保留的 Handoff 在新路径下仍能压缩真实代码/实验上下文，让下一位 Agent继续工作，同时守住引用、事实状态、语言和脱敏边界。它不是新的主流程文档，也不进入任何自动 Index。

## 文件边界

### Add

- `test/skill-evals/handoff-dirty-implementation/scorecard.json`
- `test/skill-evals/handoff-dirty-implementation/evidence/live/`
- `test/skill-evals/handoff-negative-experiment/scorecard.json`
- `test/skill-evals/handoff-negative-experiment/evidence/live/`

### Must Not Modify

- `skills/productivity-skills/handoff/`
- T053 的 Scenario、Protocol、Proposal、Fixture 和 Baseline
- 任何生产源码、模板或共享规则

## 执行方法

1. 读取 Workflow，确认两个 Proposal/Scenario/Protocol/Fixture Hash 仍获用户批准；变化时停止并重开 T053。
2. 每场重建独立临时 Git 状态，预检初始命令和当前 Skill copy，记录 `fixtureBaseCommit`。不能复用 Baseline 工作区或上一个场景产物。
3. 每场派发不同的 `fork_turns: "none"` Implementer，Prompt 给当前 `handoff/SKILL.md` 绝对路径/Hash并要求完整读取，只提供工作目录、原始用户请求、项目规则和读取禁区；完整 Scenario/Protocol 与 rubric 保持 evaluator-only。
4. 核对唯一新文件位于 `hello-scholar/handoffs/`；实现交接准确覆盖 staged/modified/untracked/失败测试，实验交接准确区分 failed 与 negative result。旧 memory、第二报告、Index 和秘密都不得出现。
5. 每场派发不同的 `fork_turns: "none"` Reviewer。Reviewer 只接收获批 rubric、原始请求、Handoff、Base-to-final 完整 diff和命令证据，并回答“只凭这份文件能否继续、还缺什么”。
6. 写当前全部 Hash、不同 Agent ID、Terra 模型、`forkTurns`、硬门、评分、命令和 `criticalPath` 证据及 Reviewer 建议，不写 `timing`；失败时重开 T049/T053，不在 Eval Task修 Skill或模板。
7. 两场 pass 后把 Handoff 产物、脱敏证据和建议批量交用户；只有用户明确接受当前 Hash才写 `userDecision: accepted`。

## 与旧 Skill 的对比证据

- 旧版至少因 `hello-scholar/memory/handoffs/` 失败；新版必须只写新路径。
- 压缩、引用、语言选择和脱敏分数不得因路径迁移下降。
- “下一位 Agent 可继续”由独立 Reviewer结合真实项目状态判断，不靠输出自称。

## 验证与完成

- 两个 Scorecard 通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 运行 `python3 -m unittest test/test_handoff_path.py test/test_skill_written_file_language.py` 和 `npm test`。
- 临时工作区清理，仓库只留必要脱敏证据。
