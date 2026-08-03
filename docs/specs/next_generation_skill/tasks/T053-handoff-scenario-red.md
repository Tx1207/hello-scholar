# T053：为 `handoff` 新路径与交接质量编写两个 Scenario 和 Red Baseline

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T001, T002
- Parallel: Yes。只创建评测资产和修改前证据，不修改 Handoff Skill或模板。

## 为什么要做

`handoff` 被保留，但 T049 会把默认写入从 `hello-scholar/memory/handoffs/` 改到 `hello-scholar/handoffs/`。只做路径静态替换不能证明交接文件真的让 fresh Agent 接得住，也不能证明它没有复制已有 Spec/Record/diff、遗漏脏工作树或泄露秘密。

本 Task 用两个不同真实项目先记录修改前 Red。旧 Skill 的压缩、模板语言、引用和脱敏能力是要保留的优点；Red 应来自旧路径或真实交接缺口，不靠空目录和关键词制造。

## 文件边界

### Add

- `test/skill-evals/handoff-dirty-implementation/scenario.md`
- `test/skill-evals/handoff-dirty-implementation/protocol.json`
- `test/skill-evals/handoff-dirty-implementation/proposal-approval.json`
- `test/skill-evals/handoff-dirty-implementation/fixture/`
- `test/skill-evals/handoff-dirty-implementation/baseline.json`
- `test/skill-evals/handoff-dirty-implementation/evidence/baseline/`
- `test/skill-evals/handoff-negative-experiment/scenario.md`
- `test/skill-evals/handoff-negative-experiment/protocol.json`
- `test/skill-evals/handoff-negative-experiment/proposal-approval.json`
- `test/skill-evals/handoff-negative-experiment/fixture/`
- `test/skill-evals/handoff-negative-experiment/baseline.json`
- `test/skill-evals/handoff-negative-experiment/evidence/baseline/`

### Must Not Modify

- `skills/productivity-skills/handoff/`
- `test/test_skill_written_file_language.py`
- 任何生产源码、AGENTS、README 或其他 Skill

## 场景 A：脏工作树中的实现交接

`projectId: py-search-normalization`。Fixture 是一个小型 Python 搜索项目，包含 AGENTS、Git、可运行测试、Accepted/Approved/Current Bundle，以及已完成一半但未提交的规范化改动：有 modified、staged、untracked 三类状态，一条测试仍失败，Tasks 只有部分勾选。用户要求下一会话继续实现并特别关注失败测试。

目标 Handoff 必须：

1. 写到 `hello-scholar/handoffs/YYYY-MM-DD-search-normalization-handoff.md`，按仓库中文偏好使用中文模板。
2. 准确区分已完成、正在做、尚未做、当前失败和未提交文件状态；不能把计划写成事实或声称测试全绿。
3. 引用 Bundle、`git diff`、测试路径和相关 Task ID，不大段复制 Spec/Plan/diff；给下一 Agent 一个可执行的首个验证动作。
4. 不修改代码、Tasks、Git index 或现有文档，不创建第二份总结，不 commit。
5. Fixture 中放一个用于验证脱敏的假 Token/邮箱；Handoff 不能原样包含它们。

## 场景 B：失败与有效负结果实验交接

`projectId: py-model-quantization-handoff`。Fixture 是一个与场景 A 不同依赖和代码树的模型量化项目，含根目录两个 Run：一个 OOM failed、一个 completed 但结论为不采用；Record 和大日志已经是事实源。当前会话还发现一个尚未验证的 batch-size 假设。用户要求下一会话继续判断是否缩小搜索空间。

目标 Handoff 必须：

1. 写到新 Handoff 路径并选择仓库英文模板，证明语言由项目默认而不是本次中文/英文 Prompt 决定。
2. 引用两份 `runs/<run-id>/record.md` 和具体结果文件，不复制完整日志/Record，也不把负结果改写成失败。
3. 明确“已证实事实 / 未验证假设 / 下一步停止条件”，让 fresh Agent 不会重复已失败实验或把假设写进 Architecture。
4. 保留敏感路径/凭证脱敏，不创建新 Run、Spec、报告或 Handoff Index。

## Proposal、Baseline 与隔离合同

1. 两组 Scenario/Protocol/rubric 先批量交用户，两个 Protocol 分别固定使用上述 `projectId`；Fixture 的项目规则、代码/实验树、测试和 Git 状态彼此独立。Proposal 包含完整性、事实准确、去重、脱敏、可继续性和路径硬门；`proposal-approval.json` 绑定当前 Hash。批准前不运行 Baseline。
2. 预检 Fixture 初始测试、Git 状态和绝对源码 CLI，提交干净种子 Base 后再按脚本构造 staged/modified/untracked 状态，记录 `fixtureBaseCommit` 与初始状态 Hash。构造状态本身必须可重复。
3. Baseline 使用修改前 Handoff immutable copy。每场不同的 `fork_turns: "none"` Implementer获得旧 `SKILL.md` 绝对路径/Hash并完整读取，不给 T049 或目标文案。
4. 每场派发不同的 `fork_turns: "none"` Reviewer，只看获批 rubric、原始请求、Handoff、命令和 `base..HEAD + index + working tree + untracked + final hashes`；Reviewer 可额外以“fresh 接手者”身份列出无法继续的缺口。
5. Baseline 绑定 Proposal/Scenario/Protocol/Fixture/旧 Skill snapshot并如实为 `fail | control-pass`。预期旧 memory 路径硬门失败；如果对照全绿则暂停 Handoff 后续验收，不能因为旧 Skill保留了优点而伪造失败。只有用户复核后才能用新 Proposal/Hash 修改场景。

## 验证与完成

- 两组 Protocol/Baseline 通过 T002、环境预检全绿并如实记录行为结果；只有真实 `fail` 进入 T049，`control-pass` 停在人审门。
- 证据不保存真实秘密或整个临时工作区。
- 运行 `npm test`；本 Task没有修改生产 Skill或模板。
