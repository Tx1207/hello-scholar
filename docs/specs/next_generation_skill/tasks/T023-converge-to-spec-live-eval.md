# T023：用当前 Codex subagent 验证 `converge-to-spec`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T022
- Parallel: No。两个场景必须使用不同临时工作区和 Agent，评测期间不改 Skill。

## 目标

分别运行 T021 的语义偏差和完成就绪场景，证明 `converge-to-spec` 能找出测试之外的合同偏差，也能拒绝用 Stale Bundle、假完成复选框、缺失 Record 和过去验证摘要声明完成。

## 文件边界

### Add

- `test/skill-evals/converge-to-spec/scorecard.json`
- `test/skill-evals/converge-to-spec/evidence/live/`
- `test/skill-evals/converge-completion-gate/scorecard.json`
- `test/skill-evals/converge-completion-gate/evidence/live/`

两个 `evidence/live/` 目录只保存 Scorecard 引用的必要脱敏输出、diff 摘要和命令证据，不覆盖 Baseline 证据。

### Must Not Modify

- `skills/hello-scholar/converge-to-spec/`
- T021 的 Scenario、Protocol、Fixture 和 Baseline
- `AGENTS.md`、其他生产 Skill或 Fixture 生产文件

## 执行方法

1. 每个场景按 T001 建新的临时 Git 工作区并以 copy 模式安装当前 Skills，不复用上下文或产物。
2. 分别派发全新 Implementer under test，只给工作目录、当前轮逐字消息、项目规则、读取禁区和当前 `converge-to-spec/SKILL.md` 的绝对路径/Hash并要求完整读取；完整 Scenario/Protocol、rubric 和 T021/T022 的答案保持 evaluator-only。`$converge-to-spec` 名称只表达业务意图，不用来冒充平台自动发现证据。
3. 语义场景先核对默认阶段零 diff，四类偏差和清理漏项都有真实 `file:line`/合同证据；Eval 主 Agent再用 `followup_task` 发送用户追加请求，确认只有 `tasks.md` 和生成 Index 变化，新 Task 可独立执行，Tasks `revision + 1` 且审批重置，Agent 停止等待重新批准而没有继续实施。
4. 完成门场景核对它运行/读取 docs check 后因 Stale 拒绝 Ready，报告 Task Completion、正式 Record、清理和 fresh-evidence 缺口；Architecture 既不被写入也不被当作完成前置。Fixture bytes 必须完全不变。
5. 两个场景都不能调用已淘汰 Skill、直接修代码、同步 Stale 文档、勾选 Task、伪造 Record、手改 Index 或生成报告。
6. 运行前核对用户批准 Proposal/Hash；每个 Fixture预检绝对源码 CLI并提交 Base commit。Implementer/Reviewer 都用 `fork_turns: "none"`，Prompt 显式给当前 `converge-to-spec/SKILL.md` 绝对路径/Hash并要求完整读取。
7. 每个场景派发与 Implementer 不同的全新 Reviewer，只给获批 rubric、Scenario、Protocol、原始输出、Base-to-final 完整 diff 和命令证据。
8. 写当前 Proposal/Scenario/Protocol/Fixture/Skill Hash、Agent ID、硬门、评分、命令/退出码、有序关键路径证据和 Reviewer 建议。漏报、越界或错误完成声明均记为 `fail` 并重开 T022/T021；两场 pass 后交用户审核，只有明确接受当前证据才标记 accepted。

## 完成标准

- 两个 Scorecard 通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 语义场景比 Red 多出可证明的四类覆盖；完成场景同时展示“测试可通过”和“Bundle 仍不能完成”。
- Eval Reviewer 是测试角色；产物没有重新引入产品必需 Review 或执行 subagent 链。
- 运行 `python3 -m unittest test/test_converge_to_spec_skill.py` 和 `npm test`，清理临时工作区。
