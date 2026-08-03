# T055：为 `using-git-worktrees` 明确触发价值编写两个 Scenario 和 Red Baseline

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T001, T002
- Parallel: Yes。只创建评测资产和修改前证据，不修改 Worktree Skill。

## 为什么要做

用户决定保留 `using-git-worktrees`，但不让它成为每个 Plan/Task 的自动前置。当前 Skill 的隔离检测、native tool 优先、git fallback、ignore 检查和 baseline tests 有价值；当前 description 又写“before executing implementation plans”，会让普通 Approved Tasks 自动进入额外询问/创建流程。

本 Task 用两个用户明确要求隔离的真实项目场景证明保留价值。未明确触发时不自动创建的边界由 Router 与 T056 的静态合同保证，不单列运行时退出 Protocol。两者都是可运行 Git 项目，不用假路径模拟 Worktree。

## 文件边界

### Add

- `test/skill-evals/worktree-explicit-create/scenario.md`
- `test/skill-evals/worktree-explicit-create/protocol.json`
- `test/skill-evals/worktree-explicit-create/proposal-approval.json`
- `test/skill-evals/worktree-explicit-create/fixture/`
- `test/skill-evals/worktree-explicit-create/baseline.json`
- `test/skill-evals/worktree-explicit-create/evidence/baseline/`
- `test/skill-evals/worktree-explicit-bundle-isolation/scenario.md`
- `test/skill-evals/worktree-explicit-bundle-isolation/protocol.json`
- `test/skill-evals/worktree-explicit-bundle-isolation/proposal-approval.json`
- `test/skill-evals/worktree-explicit-bundle-isolation/fixture/`
- `test/skill-evals/worktree-explicit-bundle-isolation/baseline.json`
- `test/skill-evals/worktree-explicit-bundle-isolation/evidence/baseline/`

### Must Not Modify

- `skills/superpowers-skills/using-git-worktrees/`
- `.gitignore` 或生产仓库 Worktree
- 其他 Skill、AGENTS、README、`src/`

## 场景 A：用户明确要求创建隔离 Worktree

`projectId: node-cache-key-service`。Fixture 是一个真实 Node Cache 项目，main checkout 有用户未提交的无关文档修改，`.worktrees/` 已被 `.gitignore` 忽略，基线测试通过。用户明确要求“为 cache-key 修复创建隔离 worktree，准备好后停下，不实现功能”。

目标行为：

1. 先用 Git 事实判断当前是 normal checkout、不是 submodule 或已有 linked worktree；不得污染/覆盖用户未提交修改。
2. 用户已明确要求 Worktree，这本身就是创建同意，不再重复问同一个问题。平台有 native tool 时优先使用；评测环境没有时才用 `git worktree add` fallback。
3. fallback 使用已存在且 ignored 的 `.worktrees/`，创建清楚的分支/目录；不修改或 commit `.gitignore`，不使用全局目录绕开项目约束。
4. 在新工作区按项目事实完成必要 setup 和真实 baseline test，报告绝对路径、分支和结果，然后停止。
5. 不实现 cache-key、不清理 Worktree、不删除分支；清理需要另行明确授权和 provenance。

Protocol 声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`：用 Baseline 证明没有该 Skill时通用 Agent不能稳定完成全部检测/隔离/基线门，并要求 Live Agent 完整读取当前 Skill 后进入创建流程。

## 场景 B：用户明确要求为 Bundle 创建隔离 Worktree

`projectId: py-localization-parser`。Fixture 是一个与场景 A 不同的 Python 本地化解析器项目，位于 normal checkout，已有 Accepted Spec、Approved Plan、Approved/current Tasks 和可运行 `unittest`；用户明确要求为本次 Bundle 建立隔离 Worktree，以免影响当前 checkout 的并行文档维护。

目标行为：

1. Protocol 声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`；Agent 完整读取当前 Skill 后，先核对项目 Git 事实、用户同意和隔离目录约束。
2. 使用已存在且 ignored 的本地隔离目录或平台 native tool 创建新的 Worktree，保护当前 checkout 的未提交内容；完成必要 setup 和基线验证后报告路径、分支和证据并停止。
3. 不实现 Bundle Task、不清理 Worktree、不删除分支；后续执行和清理都需要独立授权，也不能调用已淘汰执行 Skill。

Baseline 用目标 Skill absent，证明通用 Agent不能稳定完成隔离检测、用户同意、目录约束和真实基线门；不声称观察平台 catalog 自动触发。

## Proposal、隔离与安全合同

1. 两组 Scenario/Protocol/rubric 先批量交用户，两个 Protocol 分别固定使用上述 `projectId`；Fixture 的语言、规则、代码树、测试和 Git 状态彼此独立。`proposal-approval.json` 绑定当前 Hash；批准前不运行会创建 Worktree 的 Baseline。
2. 所有 Git 操作只在临时 Fixture 父目录内；预检 Git、Node、初始测试、可用磁盘、绝对源码 CLI和 cleanup 路径，记录 `fixtureBaseCommit`。测试结束只清理由本评测创建且 provenance 明确的临时 Worktree。
3. 两场均使用 absent Baseline。每场 Implementer/Reviewer 均为不同的 `fork_turns: "none"` Agent；Live 阶段传当前 Skill 的绝对路径/Hash并要求完整读取。
4. Reviewer 核对 `git worktree list --porcelain` 前后、分支、用户脏文件 Hash、命令和 Base-to-final全部变化。环境不支持创建时记 blocked，不把权限错误当 Red。
5. Baseline 绑定 Proposal/Scenario/Protocol/Fixture/Skill snapshot并如实为 `fail | control-pass`；Reviewer 不拥有最终 accepted。任一全绿时暂停 Worktree 后续验收，只有用户复核后才能用新 Proposal/Hash 修改场景，不能直接加难度。

## 验证与完成

- 两组 Protocol/Baseline 通过 T002；临时 Worktree 清理后没有残留注册。
- 两场 Red 都来自隔离流程、同意门或真实基线证据缺失；初始项目/环境都有效。只有真实 Red 打开 T056，`control-pass` 停在人审门。
- `npm test` 通过，生产仓库 Git 状态除本 Task文档外不变。
