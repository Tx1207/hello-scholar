# next_generation_skill Task 导航

这个目录是 `PR 0` 至 `PR 7` 的 Task 合同清单。每个 `Txxx-*.md` 都是一份可以单独交给后续 Agent 的完整任务合同；它会说明为什么做、与原 Skill/做法的区别、精确文件边界、实施细节、验证和完成标准，不依赖当前对话才能理解。

## 审核和实施边界

- 当前已把用户批量确认并批准的推荐方案写入 Plan、PRD 和 Tasks。
- T001-T076 来自前序审核；T077-T081 记录用户随后确认的质量优先 Eval、37 个 Protocol、人本流程、Proposal Batch v2 和 Terra 运行身份纠偏。T082/T083 从原先混合的 T071/T039 中拆出“批准后真实运行 Baseline”，不增加产品范围。T001-T008、T029、T039 的 Proposal、T067-T069、T071-T081 的当前工程产物已经实施并通过对应静态验证；T070 已由 T077 取代。T082/T083 和其他生产 Skill Task 不得越过真实 Baseline 门。Protocol/rubric/`criticalPath` 是独立 Proposal，必须绑定当前 Hash 获得用户批准后才能运行 Agent；它只定义有序必要动作，墙钟时间和 watchdog 不参与质量判断。批准绑定当前审核内容；任一绑定输入发生语义修改时，必须重新交用户审核。
- `approved` 只表示 Task 合同获批，不代表生产 Skill 已可修改。当前用户已授权基础合同实施，但生产 Skill 仍严格遵循 `Proposal 批准 -> Baseline -> 用户批量审核 -> 只修改真实 Red owner -> Live Eval`。
- 实施时以上级目录的执行 Plan 为主要事实源，PRD 补充产品行为，当前代码用于确认真实边界。三者实质冲突时停止并请用户判定。
- 每个 Agent 每次只接收一个完整 Task，并且只能修改该 Task 的文件边界，不得顺手完成后续 Task。依赖已经满足、文件边界不重叠且各 Task 的 `Parallel` 允许时，可以把不同 Task 同时派给不同 Agent；任一条件不满足就保持串行。
- 新增或重大修改 Skill 按 `Proposal -> Baseline Observation -> 用户批量审核 -> Implementation -> Live Eval` 执行。当前 14 个名称是 Baseline 候选集合，每项默认至少两个真实项目 case；最终保留名称和数量由真实 Baseline 证据与用户裁决决定，不能为凑数量保留。删除类 Skill 一项一个 Task；T051 清已安装副本，T065 维护候选 catalog/tool references，T052 做最终路径守卫。
- 写任何生产 Skill 前，实施 Task 都要求完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、原 checkout 的 `/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `GLOSSARY.md`。`.agents/` 被仓库忽略，不会自动进入新 Worktree；路径缺失时停止，不以待淘汰的 `writing-skills` 或记忆替代。
- Live Eval 只使用当前 Codex 会话的 Eval Implementer/Reviewer subagent，不使用 `codex exec` 或额外 API。产品运行时则由当前主 Agent直接执行 `tasks.md`，两者不能混为一谈。

## 已锁定的产品决定

主流程：

```text
Spec -> Plan -> Tasks -> 当前主 Agent逐 Task直接执行
-> AGENTS 新鲜证据门
```

`converge-to-spec` 只在 Bundle 末端或用户明确要求时加入，默认只读。Architecture 只由用户发起，或 Bundle 完成且结构发生材料性变化时提醒用户确认后加入。

当前候选：

```text
using-helloscholar
brainstorming
manage-specs
writing-plans
generating-tasks
record-experiment
converge-to-spec
docs-maintenance
handoff
test-driven-development
using-git-worktrees
crash-audit
takeoff
landing
```

- TDD 只在用户或 Approved Task 明确点名时启动；启动后完整 Red-Green-Refactor 生效。
- Worktree 不自动进入主流程：用户/Approved Task 点名时使用，Agent 因风险建议时创建前仍需同意；清理需要单独授权和真实 provenance。
- TDD、Worktree 只在用户明确调用或当前 Approved Task 明确点名时使用；Crash Audit、Takeoff、Landing 只在用户明确调用时使用。它们都不因普通 Feature、Bugfix、Plan 或关键词自动进入。
- `project-structure` 取消新增；文件位置由 Architecture、Plan/Task Files 和 AGENTS 约束。
- Router 用一句话说明路径和本轮文档范围后默认继续；用户可以要求完整流程，但 Spec、Plan、Tasks 仍分别整份审核，批准 Tasks 也不自动授权代码实施。
- Brainstorm 只逐个询问材料性问题，信息充分后整份审核 Spec；Spec 使用七个核心章节和按需条件章节，价值与决定在最前。

完整删除：

```text
executing-plans
subagent-driven-development
requesting-code-review
receiving-code-review
dispatching-parallel-agents
systematic-debugging
finishing-a-development-branch
verification-before-completion
writing-skills
```

- Brainstorm Visual Companion 整套删除，不迁移、不保留兼容入口；存量用户产物只在迁移审核时决定保留或删除。
- 重新 install/uninstall 时只清理能够证明由 hello-scholar 拥有的九个 retired Skill target；无 marker、坏 marker、跨工具 ownership、指向其他位置的同名目标和用户文档都保留。
- `handoff` 保留，新默认路径为 `hello-scholar/handoffs/`。
- `record-experiment` 当前文件是中间状态；正式实验事前记录，合格探索允许在锁定边界前补录，最终路径为 `runs/<run-id>/record.md`。
- 迁移只由 `docs/migration/document-model-v2.md` 指导：AI 先提交 Mapping Proposal，用户审核后再执行；不增加命令、API、自动迁移或新旧双写。

## Task 清单

| ID | PR | 任务 | Depends On | Status |
|---|---|---|---|---|
| [T001](T001-skill-eval-workflow.md) | PR 0 | Skill Eval 工作流与证据合同 | None | `completed` |
| [T002](T002-skill-eval-static-contract.md) | PR 0 | Scorecard、Hash 和证据路径静态校验 | T001 | `completed` |
| [T003](T003-framework-e2e-red-baseline.md) | PR 0 | Framework E2E 场景与 Red Baseline | T001, T002 | `completed` |
| [T004](T004-frontmatter-parser.md) | PR 1 | 受限 Front Matter 解析器 | T003 | `completed` |
| [T005](T005-document-discovery.md) | PR 1 | 文档发现与路径边界 | T004 | `completed` |
| [T006](T006-document-validation.md) | PR 1 | 文档合同、引用和 Stale 校验 | T004, T005 | `completed` |
| [T007](T007-index-generation.md) | PR 1 | 三类 Index 与原子同步 | T006 | `completed` |
| [T008](T008-docs-cli-integration.md) | PR 1 | `docs check` / `docs sync` CLI | T007 | `completed` |
| [T009](T009-manage-specs-scenario-red.md) | PR 2 | `manage-specs` Scenario 与 Red Baseline | T001, T002, T008 | `approved` |
| [T010](T010-manage-specs-implementation.md) | PR 2 | 实现 `manage-specs` | T008, T009 | `approved` |
| [T011](T011-manage-specs-live-eval.md) | PR 2 | `manage-specs` Live Eval | T010 | `approved` |
| [T012](T012-brainstorming-scenario-red.md) | PR 2 | `brainstorming` 升级 Scenario 与 Red Baseline | T001, T002, T008 | `approved` |
| [T013](T013-brainstorming-implementation.md) | PR 2 | 升级 `brainstorming` 主流程 | T010, T012, T050 | `approved` |
| [T014](T014-brainstorming-live-eval.md) | PR 2 | `brainstorming` Live Eval | T011, T013 | `approved` |
| [T015](T015-generating-tasks-scenario-red.md) | PR 3 | `generating-tasks` Scenario 与 Red Baseline | T001, T002, T008 | `approved` |
| [T016](T016-generating-tasks-implementation.md) | PR 3 | 实现 `generating-tasks` | T008, T015 | `approved` |
| [T017](T017-generating-tasks-live-eval.md) | PR 3 | `generating-tasks` Live Eval | T016 | `approved` |
| [T018](T018-writing-plans-scenario-red.md) | PR 3 | `writing-plans` 收窄 Scenario 与 Red Baseline | T001, T002, T008 | `approved` |
| [T019](T019-writing-plans-implementation.md) | PR 3 | 收窄 `writing-plans` 为高层 Plan | T016, T018 | `approved` |
| [T020](T020-writing-plans-live-eval.md) | PR 3 | `writing-plans` Live Eval | T017, T019 | `approved` |
| [T021](T021-converge-to-spec-scenario-red.md) | PR 4 | Converge 偏差与完成门 Scenario | T002, T016 | `approved` |
| [T022](T022-converge-to-spec-implementation.md) | PR 4 | 实现 Converge 偏差审计与完成就绪门 | T008, T021 | `approved` |
| [T023](T023-converge-to-spec-live-eval.md) | PR 4 | `converge-to-spec` Live Eval | T022 | `approved` |
| [T024](T024-remove-executing-plans.md) | PR 4 | 删除 `executing-plans` | T019, T025 | `approved` |
| [T025](T025-remove-subagent-driven-development.md) | PR 4 | 删除 `subagent-driven-development` | T019 | `approved` |
| [T026](T026-remove-requesting-code-review.md) | PR 4 | 删除 `requesting-code-review` | T020, T025 | `approved` |
| [T027](T027-remove-receiving-code-review.md) | PR 4 | 删除 `receiving-code-review` | T025 | `approved` |
| [T028](T028-remove-dispatching-parallel-agents.md) | PR 4 | 删除 `dispatching-parallel-agents` | T016, T025 | `approved` |
| [T029](T029-remove-systematic-debugging.md) | PR 4 | 删除 `systematic-debugging` | None | `completed` |
| [T030](T030-remove-finishing-development-branch.md) | PR 4 | 删除 `finishing-a-development-branch` | T024, T025 | `approved` |
| [T031](T031-remove-verification-before-completion.md) | PR 4 | 删除 `verification-before-completion` | T023, T024, T025, T029 | `approved` |
| [T032](T032-remove-writing-skills.md) | PR 4 | 删除 `writing-skills` | T029, T031 | `approved` |
| [T033](T033-record-experiment-scenario-red.md) | PR 5 | `record-experiment` Scenario 与 Red Baseline | T002, T008 | `approved` |
| [T034](T034-record-experiment-implementation.md) | PR 5 | 根目录 Run 与分级记录时机 | T008, T033 | `approved` |
| [T035](T035-record-experiment-live-eval.md) | PR 5 | `record-experiment` Live Eval | T034 | `approved` |
| [T036](T036-tdd-explicit-trigger-scenario-red.md) | PR 6 | TDD 显式触发 Scenario 与 Red Baseline | T001, T002 | `approved` |
| [T037](T037-tdd-explicit-trigger-implementation.md) | PR 6 | 收窄 TDD 为显式触发 Skill | T036 | `approved` |
| [T038](T038-tdd-explicit-trigger-live-eval.md) | PR 6 | TDD 显式触发 Live Eval | T037 | `approved` |
| [T039](T039-docs-maintenance-scenario-red.md) | PR 6 | `docs-maintenance` 四模式 Proposal | T002, T008 | `completed` |
| [T040](T040-docs-maintenance-implementation.md) | PR 6 | 实现 `docs-maintenance` | T022, T083 | `approved` |
| [T041](T041-docs-maintenance-live-eval.md) | PR 6 | `docs-maintenance` Live Eval | T040 | `approved` |
| [T042](T042-using-helloscholar-scenario-red.md) | PR 6 | Router Scenario 与 Red Baseline | T002 | `approved` |
| [T043](T043-using-helloscholar-implementation.md) | PR 6 | 实现五路 Router 与直接 Execution | T013, T019, T022, T024-T032, T034, T037, T040, T042, T046, T049, T065 | `approved` |
| [T044](T044-using-helloscholar-live-eval.md) | PR 6 | `using-helloscholar` Live Eval | T014, T017, T020, T023, T035, T038, T041, T043 | `approved` |
| [T045](T045-shared-rules-and-readme.md) | PR 6 | 同步 AGENTS、README 和公共规则 | T011, T014, T017, T020, T023, T035, T038, T041, T044, T046, T049-T051, T054, T057, T059, T061, T064, T065 | `approved` |
| [T046](T046-reviewed-migration-guide.md) | PR 6 | 用户审核后才执行的迁移说明 | T008, T013, T019, T034, T049, T050 | `approved` |
| [T047](T047-framework-e2e-live-eval.md) | PR 7 | 三次 Framework E2E v2 Live Eval | T046, T052, T082 | `approved` |
| [T048](T048-final-regression-and-release.md) | PR 7 | 最终回归、安装验收和 `0.2.0` 收口 | T047 | `approved` |
| [T049](T049-handoff-path.md) | PR 6 | Handoff 新写入路径移出 `memory/` | T034, T053 | `approved` |
| [T050](T050-remove-visual-companion.md) | PR 2 | 删除 Brainstorm Visual Companion | T012 | `approved` |
| [T051](T051-retired-skills-catalog-guard.md) | PR 6 | 安全清理淘汰 Skill 的已安装副本 | T024-T032 | `approved` |
| [T052](T052-legacy-path-guard.md) | PR 7 | 旧路径与淘汰 Skill 最终守卫 | T045, T046, T049-T051, T065 | `approved` |
| [T053](T053-handoff-scenario-red.md) | PR 6 | `handoff` 两个真实场景与 Baseline | T001, T002 | `approved` |
| [T054](T054-handoff-live-eval.md) | PR 6 | `handoff` Live Eval | T049 | `approved` |
| [T055](T055-worktree-scenario-red.md) | PR 6 | Worktree 明确触发价值场景与 Baseline | T001, T002 | `approved` |
| [T056](T056-worktree-explicit-trigger-implementation.md) | PR 6 | 收窄 Worktree 入口 | T055 | `approved` |
| [T057](T057-worktree-live-eval.md) | PR 6 | Worktree Live Eval | T056 | `approved` |
| [T058](T058-crash-audit-scenario-red.md) | PR 6 | `crash-audit` 两个真实场景与 Baseline | T001, T002 | `approved` |
| [T059](T059-crash-audit-live-eval.md) | PR 6 | `crash-audit` Live Eval | T058 | `approved` |
| [T060](T060-takeoff-scenario-red.md) | PR 6 | `takeoff` 两个真实场景与 Baseline | T001, T002 | `approved` |
| [T061](T061-takeoff-live-eval.md) | PR 6 | `takeoff` Live Eval | T066 | `approved` |
| [T062](T062-landing-scenario-red.md) | PR 6 | `landing` 两个显式价值场景与 Baseline | T001, T002 | `approved` |
| [T063](T063-landing-explicit-trigger-implementation.md) | PR 6 | 取消 Landing 自动承接 | T062 | `approved` |
| [T064](T064-landing-live-eval.md) | PR 6 | `landing` Live Eval | T063 | `approved` |
| [T065](T065-current-skill-catalog-and-tool-references.md) | PR 6 | Baseline 候选 Skill catalog 与平台 Tool Reference | T010, T013, T016, T019, T022, T024-T032, T034, T037, T040, T049, T050, T056, T063, T066 | `approved` |
| [T066](T066-takeoff-explicit-trigger-implementation.md) | PR 6 | 收窄 Takeoff 为用户明确意图触发 | T060 | `approved` |
| [T067](T067-function-contract-comments.md) | PR 7 | 函数输入、输出与用途合同注释 | T008 | `completed` |
| [T068](T068-skill-eval-protocol-v2.md) | PR 0 | Eval Protocol v2 与历史证据保护 | T001, T002 | `completed` |
| [T069](T069-user-value-quality-gate.md) | PR 0 | 用户价值与表达质量独立门 | T068 | `completed` |
| [T070](T070-critical-path-and-experiment-speed.md) | PR 0 / PR 5 | 旧关键路径时间门（由 T077 纠偏） | T069 | `superseded` |
| [T071](T071-framework-e2e-protocol-v2-successor.md) | PR 0 / PR 7 | Framework E2E v2 后继 Proposal | T068, T069, T072, T077 | `completed` |
| [T072](T072-eval-run-evidence-binding.md) | PR 0 | 命令、交互与 Prompt 隔离运行证据 | T068-T070 | `completed` |
| [T073](T073-formal-launch-provenance.md) | PR 0 / PR 5 / PR 7 | Router/E2E 正式实验 exactly-once provenance | T071, T072, T077 | `completed` |
| [T074](T074-index-metadata-idempotence.md) | PR 2 / PR 5 | Index bytes/mode/mtime 幂等证据 | T007, T039 | `completed` |
| [T075](T075-document-contract-reconciliation.md) | PR 0 / PR 7 | 第一轮文档合同一致性 | T068, T069, T071-T074, T077 | `completed` |
| [T076](T076-eval-fixture-answer-isolation.md) | PR 0 | 真实 Fixture 项目事实与评测答案隔离 | T068, T072 | `completed` |
| [T077](T077-quality-first-eval-contract-correction.md) | PR 0 | 质量优先、非计时关键路径纠偏 | T068-T070, T072, T076 | `completed` |
| [T078](T078-eval-scenario-portfolio-correction.md) | PR 0 / PR 6 | 37 场景组合与显式价值 case | T077 | `completed` |
| [T079](T079-human-centered-flow-contract-reconciliation.md) | PR 0 / PR 2-6 | 人本主流程与文档审核合同对齐 | T077, T078 | `completed` |
| [T080](T080-proposal-batch-v2-regeneration.md) | PR 0 | 37 项 Proposal Batch v2 重建 | T077-T079 | `completed` |
| [T081](T081-eval-terra-agent-model-contract.md) | PR 0 | Eval Terra 子代理模型合同 | T068, T071, T072, T080 | `completed` |
| [T082](T082-framework-e2e-v2-red-baseline.md) | PR 0 / PR 7 | Framework E2E v2 真实 Red Baseline | T071, T073, T080, T081 | `approved` |
| [T083](T083-docs-maintenance-red-baselines.md) | PR 6 | `docs-maintenance` 四模式真实 Red Baseline | T039, T074, T080, T081 | `approved` |

表格中的 `T024-T032`、`T049-T051` 是为了可读性压缩；Task 文件 Front Matter 逐项列出真实依赖，自动依赖检查以文件为准。

## PR 门槛

- PR 0 先建立本地合同和 Framework Red；后续 Skill 才有统一证据格式。
- PR 1 提供确定性文档内核；任何依赖 docs check/sync 的实现不得越过 T008。
- PR 2/3 建立 Spec -> Plan -> Tasks，不进入代码实施。
- PR 4 先让 Converge 接住 Bundle 完成职责，再逐项删除九个重复 Skill；T024 依赖 T025 是刻意的“先删消费者、再删 provider”。
- PR 5 独立完成根目录 Runs，不依赖旧执行链。
- PR 6 先准备各 Skill Proposal 并在用户批准后取得真实 Red；`docs-maintenance` 的 Proposal/运行分别由 T039/T083 拥有。随后完成显式 TDD、Docs Maintenance、Handoff、Worktree、Takeoff、Landing、迁移说明、retired 安装清理、Baseline 候选 catalog 和 Router；T065 先清共享 references，T043 再消费，避免双 owner。
- PR 7 消费已审核迁移说明，执行最终守卫、三次 E2E、函数合同注释守卫和发布回归；T067 是工程可读性要求，不新增产品行为。
- T068 是 PR 0 的评测基础设施修正：无 Baseline Proposal 升级后重新待审，已有历史运行保持原协议和 Hash，不允许回填伪造。
- T069 建立用户价值独立门；T070 的墙钟质量门已经由 T077 明确纠偏为非计时 `criticalPath`，保留其 Record 关键动作顺序，不再使用毫秒 pass/fail。T071 在不修改历史 v1 的前提下提供 v2 Proposal，T082 在当前 Batch 获批后单独取得真实 Red，T047 只消费该 Red。
- T072-T076 收紧获批输入到真实运行的证据链，并清理会稀释 Skill 独立价值的 Fixture 提示；它们不增加产品 Skill、Agent Runner 或外部 API。
- T077-T081 是用户在质量优先讨论后确认的第二轮合同修正：37 个 v2 Proposal、候选 Skill 数量、人本审核路径、Batch v2 和固定 Terra 子代理身份由同一事实源绑定。T081 把 `gpt-5.6-terra`、独立 Agent ID 与 `forkTurns: none` 写入运行合同；模型不可用是环境阻塞，不得静默回退。T082/T083 只拆分并承接原已批准 Baseline 运行范围，不授权跳过 Batch 审核或直接修改生产 Skill。
