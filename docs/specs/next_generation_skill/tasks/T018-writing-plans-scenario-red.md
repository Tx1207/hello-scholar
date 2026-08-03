# T018：为 `writing-plans` 职责收窄编写 Scenario 和 Red Baseline

- Status: `approved`
- PR: `PR 3 - Plan 与 Tasks 拆分`
- Depends On: T001, T002, T008
- Parallel: Yes。可与 T015 并行，但不得修改 `writing-plans`。

## 目标

用两个真实 Accepted Spec 项目证明当前 `writing-plans` 的两个缺口：它会把高层方案、源码片段、细粒度步骤和执行选项写进日期 Plan；当 Spec 仍有重大设计空洞时，也缺少稳定的零写入返回门。一个场景生成高层 Bundle Plan，另一个场景必须停止并返回 Spec。

## 文件边界

### Add

- `test/skill-evals/writing-plans-bundle/scenario.md`
- `test/skill-evals/writing-plans-bundle/protocol.json`
- `test/skill-evals/writing-plans-bundle/fixture/`
- `test/skill-evals/writing-plans-bundle/baseline.json`
- `test/skill-evals/writing-plans-bundle/evidence/baseline/`
- `test/skill-evals/writing-plans-spec-gap/scenario.md`
- `test/skill-evals/writing-plans-spec-gap/protocol.json`
- `test/skill-evals/writing-plans-spec-gap/fixture/`
- `test/skill-evals/writing-plans-spec-gap/proposal-approval.json`
- `test/skill-evals/writing-plans-spec-gap/baseline.json`
- `test/skill-evals/writing-plans-spec-gap/evidence/baseline/`

并为主场景增加 `test/skill-evals/writing-plans-bundle/proposal-approval.json`。

`evidence/baseline/` 只保存 `baseline.json` 引用的最小脱敏失败证据。

### Must Not Modify

- `skills/superpowers-skills/writing-plans/`
- `skills/superpowers-skills/generating-tasks/`
- `src/`

## 场景 A：生成高层 Bundle Plan

- `projectId: py-event-export-service`。Fixture 是一个 Python 事件导出服务，有 Architecture、Accepted Spec Revision 3、小型代码树和可运行测试，没有 Plan/Tasks。Spec 已决定架构，不留需要 Plan 重新设计的问题。
- 调用 `$writing-plans` 生成同 Bundle `plan.md`，Front Matter 引用 Spec ID/Revision，初始为 `draft`。
- 正文必须有实施目标、Included/Excluded、技术方案、受影响模块、Add/Modify/Move or Migrate/Delete/Must Not Touch、接口、阶段、测试/实验、迁移、清理、回滚和 Tasks 生成规则。
- 不得包含 Task 复选框、细粒度逐步源码、每步 commit 或执行选项；不得创建 `tasks.md`。
- 如果 Plan 发现 Spec 未决定的重大设计，必须停止并要求返回 Spec，不默默选方案。
- 完整自审并由用户整份批准 Plan 后，下一步是 `$generating-tasks`，不直接进入执行。

## 场景 B：发现重大 Spec 空洞后零写入停止

`projectId: node-webhook-signing-service`。Fixture 是一个与场景 A 不同的 Node webhook 服务，有真实代码和 `node:test`。Spec 虽标为 Accepted，却同时要求签名校验与 key rotation，但没有决定 key identity、失败响应合同或旧签名兼容期；这些选择会改变公共 API、安全边界和迁移方案，Plan 无权猜。

目标行为：

1. 读取代码/调用方后明确列出缺失的设计决定、影响和最小返回问题，引用 Spec 章节与真实文件。
2. 不创建或修改 `plan.md`、`tasks.md`、Spec、代码、Index 或临时报告；不得自己选择一种签名方案填进 Plan。
3. 告诉用户先回到 `brainstorming/manage-specs` 修订 Spec。即使用户初始请求写 Plan，也不能把请求本身当成补齐设计授权。
4. 这不是无效 Fixture 制造的 parser Red：Front Matter 和 Revision 都合法，失败点是语义设计未决定。

## 独立评测执行合同

1. 两组 Scenario/Protocol、rubric 和否决项先批量提交用户；`proposal-approval.json` 绑定获批 Proposal ID 与 Scenario/Protocol Hash。批准前不运行任何 Baseline Agent。
2. 两个 Protocol 分别固定使用上述 `projectId`；两个 Fixture 的语言、规则、代码树和影响 Plan 判断的状态彼此独立。每个 Fixture 先用绝对源码 CLI 的 `docs check` 和项目测试预检，初始化 Git 并提交/记录 `fixtureBaseCommit`。Baseline 使用修改前 `writing-plans` immutable copy，绝对 `SKILL.md` 路径/Hash 明确传给 `fork_turns: "none"` Implementer。
3. 场景 A 的 Plan 审核批准回复必须由 Eval 主 Agent在停点用 `followup_task` 发送，不能写入初始 Prompt；场景 B 不提供“替 Agent 决定设计”的隐藏答案。
4. Reviewer 使用不同的 `fork_turns: "none"` Agent，只接收获批 rubric、原始对话、产物、命令与 `base..HEAD + index + working tree + untracked + final hashes`。
5. Baseline 绑定 Proposal/Scenario/Protocol/Fixture 和旧 Skill snapshot，如实保存 `fail | control-pass`；Reviewer 不拥有 accepted 决定。任一对照全绿时暂停 Writing Plans 后续验收，只有用户复核后才能建立新 Proposal 并重新批准语义变化，不能在原题上制造失败。

## Red Baseline

分别用修改前 `writing-plans` 派发全新 subagent。场景 A 预期因旧路径、任务级内容、缺 Front Matter 或直接选执行器失败；场景 B 预期因擅自补设计/写文件而失败。保留真实证据，不通过损坏 Fixture 隐藏原 Skill 的优点。

## 验证与完成

- 两组 Protocol/Baseline 通过 T002 合同并如实记录结果；只有真实 `fail` 才进入 T019，`control-pass` 不计数且等待用户裁决。
- 确定性检查能分辨“高层 Plan”和“内含 Tasks 的旧 Plan”，不只检查文件名。
- `npm test` 通过，本 Task 没有修改 Skill。
