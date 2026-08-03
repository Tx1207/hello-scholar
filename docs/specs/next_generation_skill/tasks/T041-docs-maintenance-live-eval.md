# T041：用当前 Codex subagent 验证 `docs-maintenance`

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T040
- Parallel: No。四模式评测期间不得修改 Skill、CLI 或场景。

## 目标

逐个运行 T039 的四种模式，证明 `docs-maintenance` 能在真实工作区内守住不同写入集合，并且 Architecture 更新/恢复只接受已经实现的事实。

## 与旧做法的比较重点

- 过去 Agent 直接调用 CLI 时容易把 `check` 和修复混在一起；新 Skill 的 `check` 必须真实零 diff。
- 过去 Index 可能被 Agent 手工拼写；新 Skill 必须让 `docs sync` 成为唯一 writer。
- 过去恢复容易把推断写成 Current Architecture；新 Skill 必须把恢复草稿留在人审门外。

## 文件边界

### Add

- `test/skill-evals/docs-maintenance-check/scorecard.json`
- `test/skill-evals/docs-maintenance-check/evidence/live/`
- `test/skill-evals/docs-maintenance-index/scorecard.json`
- `test/skill-evals/docs-maintenance-index/evidence/live/`
- `test/skill-evals/docs-maintenance-architecture/scorecard.json`
- `test/skill-evals/docs-maintenance-architecture/evidence/live/`
- `test/skill-evals/docs-maintenance-recover/scorecard.json`
- `test/skill-evals/docs-maintenance-recover/evidence/live/`

每个 `evidence/live/` 只保存 Scorecard 引用的必要脱敏文件清单、diff 摘要和命令输出，不覆盖 Baseline 证据。

### Must Not Modify

- `skills/hello-scholar/docs-maintenance/`
- `src/`
- 四个场景的 Scenario、Protocol、Baseline 和 Fixture 原件
- 其他 Skill 或共享规则

## 执行方法

1. 按 Workflow 核对四组 Proposal/Scenario/Protocol/Fixture Hash 仍获用户批准；每场使用独立临时 Git 工作区，预检绝对源码 CLI、初始命令和当前 Skill copy，提交并记录 `fixtureBaseCommit`。
2. 分别派发全新 `fork_turns: "none"` Implementer；Prompt 给当前 `docs-maintenance/SKILL.md` 绝对路径/Hash并要求完整读取，只给工作目录、当前轮逐字消息、项目规则和读取禁区；完整 Scenario/Protocol、rubric 和 T040 保持 evaluator-only。
3. 主 Agent 检查实际命令、退出码、从固定 Base commit 到最终树的完整 diff 和文件 bytes：`check` 零写；`index` 只有 Index；`architecture` 第一轮零写，用户批准后只有正式文件；`recover` 只有生成 Index，正式 Architecture 不存在。
4. Architecture 场景逐条核对 Proposal 的当前文件 Hash、代码/Git/Completed/Record 证据和预计 diff。确认第一轮零写后，Eval 主 Agent才用 `followup_task` 发送预先脚本化的用户批准；第二轮确认 Draft 设计未进入正文。批准回复不得出现在初始 Prompt。
5. Recover 场景核对孤立/Stale/无关联报告和回复中的完整 `Needs Human Review` 草稿，确认没有第二仓库真源。
6. 每个场景使用不同的 `fork_turns: "none"` Reviewer，只给它获批 rubric、原始交互、Scenario、Protocol、Base-to-final diff、产物和验证证据。
7. 写当前 Proposal/Scenario/Protocol/Fixture/Skill Hash、Agent ID、硬门、评分、有序关键路径证据和 Reviewer 建议。失败时如实记录并重开 T040/T039，不在 Eval Task改实现。四场 pass 后批量交用户审核，只有明确接受当前 Hash 才标记 accepted。

## 验证与完成

- 四个 Scorecard 都通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- `index` 连续同步第二次零 diff；`check` 即使返回错误也不能产生写入。
- `architecture` Proposal/批准 Hash 有证据且模板/引用通过 T006 文档校验；`recover` 正式 Architecture 保持缺失。
- 运行 `python3 -m unittest test/test_docs_maintenance_skill.py`、`npm test`。
- 临时工作区清理，只保留脱敏评测证据。
