# T052：建立旧路径与淘汰 Skill 的最终回归守卫

- Status: `approved`
- PR: `PR 7 - Legacy 迁移与完整闭环`
- Depends On: T045, T046, T049, T050, T051, T065
- Parallel: No。这是所有路径 owner 修改完成后的统一静态门。

## 目标

增加一个本地确定性测试，防止活跃 Skill、模板、AGENTS、README 或 CLI 帮助再次指导 Agent 写入 `hello-scholar/memory/`、错位 `hello-scholar/runs/`、已删除的 Visual Companion 路径，或重新引用已淘汰的执行/Review/流程 Skill。同时保留必要的只读 legacy 识别、迁移说明和测试反例。

## 为什么不能简单全仓库 `grep` 为零

下一代系统仍需要：

- `src/document-discovery.js` 只读发现旧路径并报告 notice；
- `docs/migration/document-model-v2.md` 说明旧源路径如何映射；
- 执行 plan、PRD、Tasks 和测试 Fixture 记录历史合同或构造反例。

这些引用是合法的。真正必须禁止的是“生产入口告诉 Agent 在旧路径创建/更新文件”。守卫要按 owner 和语境检查，不能因为迁移文档写了旧源路径就失败，也不能用一个宽泛 allowlist 放过新的活跃写入。

## 与改造前比较

| 改造前的活跃写入 | 前序 owner Task |
|---|---|
| Brainstorm 日期 Spec 和 Visual 目录 | T013、T050 |
| Writing Plans 旧 Plan 路径 | T019 |
| 已删除执行/Review Skills 中的旧路径和互相引用 | T024-T032 删除目录；T065 清理共享清单 |
| Record 的旧 experiment-records 路径 | T034 |
| Handoff 的旧 memory 路径 | T049，Skill 保留 |
| README 的旧 Documentation Preference | T045 |

T052 不重新拥有这些产品修改。发现残留时，应报告具体文件并重开对应 Task；只有测试守卫本身由 T052 新增。

## 文件边界

### Add

- `test/test_legacy_path_contract.py`

### Must Not Modify

- 任何 Skill、模板、AGENTS、README 或 `src/`
- `docs/migration/document-model-v2.md`
- 执行 plan、PRD 和 Task 文件
- 现有测试 Fixture

如果前序 Task 完成后守卫仍失败，不在本 Task 顺手改生产文件；先确定 owner，再回到该 Task 修复并重跑其验证。

## 守卫分层

### 1. 活跃写入表面：严格禁止旧目标

递归检查以下生产表面：

- `skills/**/SKILL.md`
- `skills/**/SKILL.zh_CN.md`
- 活跃 Skill 的 `assets/`、`references/` 和 Prompt 模板
- `AGENTS.md`、`AGENTS-zh.md`、`README.md`
- CLI usage 和 package scripts

这些表面不得包含会作为当前输出目标的：

- `hello-scholar/memory/specs/`
- `hello-scholar/memory/plans/`
- `hello-scholar/memory/experiment-records/`
- `hello-scholar/memory/handoffs/`
- `hello-scholar/memory/brainstorm/visual/`
- `hello-scholar/runs/`

生产 Skill 原则上应完全没有上述精确字符串。确有必要提旧路径时应链接迁移说明，而不是在 Skill 中复制迁移逻辑。

### 2. 只读 legacy 表面：允许但必须明确语义

- `src/document-discovery.js` / `document-validation.js` 可以包含旧路径，只能进入 `legacyPaths`、`misplacedPaths`、notice/error 等只读诊断；测试必须证明调用不会创建、移动或删除源文件。
- `docs/migration/document-model-v2.md` 可以列旧源路径，但同一文件必须同时包含 Mapping Proposal、`pending` 用户决定、明确批准门和禁止自动迁移/双写。
- `test/` 可以构造旧路径 Fixture 或 `assertNotIn`，不作为生产写入指导。
- `docs/specs/next_generation_skill/` 可以记录设计和 Task 历史，不纳入活跃写入扫描。

测试不要维护一个“任何未来文件都可加入”的宽泛目录 allowlist。对生产外允许项使用少量具名文件/语义断言，新增例外必须在测试 diff 中可见。

### 3. 正向 owner 断言

除了禁止旧路径，还要确认目标 owner 没被一起删掉：

- Brainstorm 中英文 Skill 写 Bundle `spec.md`，Visual Companion 六个文件不存在。
- Writing Plans 写同 Bundle `plan.md`；Generating Tasks 写 `tasks.md`。
- Record 中英文 Skill 写 `runs/<run-id>/record.md`，Index 模板已删除。
- Handoff 中英文 Skill 写 `hello-scholar/handoffs/`，两份模板仍存在。
- 九个淘汰 Skill 目录均不存在，当前 Skill catalog、Router 和工具映射不建议调用它们。
- `skills/hello-scholar/project-structure/` 不存在；文件边界由 Architecture、Task 和 AGENTS 承担。
- README/AGENTS 包含 Architecture、Spec Bundle、根目录 Runs 和 Handoffs 新路径。

### 4. 自动迁移和 Live API 禁止项

静态断言：

- `src/cli.js` 的 action/usage 不含 `docs migrate`；`package.json` 没有 migrate 或 Live Eval script。
- 不存在 `src/migrate*.js`、`scripts/migrate*`、`testing-skills` Skill、`codex exec` Runner 或 API Client。
- `npm test` 的入口仍只是本地 Node/Python 测试；不读取环境凭证，不启动 subagent 或访问网络。

## 测试实现要求

1. 使用 `pathlib` 从仓库根目录收集明确表面，POSIX 相对路径排序，失败信息显示 `path:line` 和命中的旧目标。
2. 不用脆弱的“字符串 `memory` 全禁”规则；普通 prose、Python memory 概念和迁移 source path 不能误报。
3. 为扫描函数写小型临时 Fixture 自测：活跃 Skill 的旧写入应失败，迁移说明的受审映射应通过，缺批准门的伪迁移说明应失败。
4. 检查删除/保留文件用明确相对路径，不用目录数量猜测。
5. 测试只读，不修文件、不生成报告、不调用 Git 或网络。

## 验证顺序

1. 先为 scanner 写临时非法 Fixture：一个活跃假 Skill 指导写 `hello-scholar/memory/specs/`、一个缺批准门的伪迁移说明、一个重新推荐 retired Skill 的假 Router。运行聚焦测试并观察这些 Fixture 因正确诊断变 Red；不要求依赖全部完成后的真实仓库重新出现旧错误。
2. 再加入合法对照 Fixture：受审核迁移 source path、测试中的 `assertNotIn` 和只读 legacy notice 必须通过，证明 scanner 不是全局字符串禁令。
3. 对正式仓库运行同一 scanner，要求一次 Green。若仍有残留，核对 owner 为 T013/T019/T024-T032/T034/T043/T045/T049/T050/T051/T065 并回到对应 Task，T052 不顺手改生产文件。
4. 运行 `python3 -m unittest test/test_legacy_path_contract.py`、所有相关路径测试和 `npm test`。
5. 运行只读 `rg` 复核活跃生产表面，确认没有测试漏扫的文件类型。

## 完成标准

- 活跃生产入口不再指导写任何旧核心路径，所有新路径 owner 都存在。
- Legacy 发现和迁移说明仍能只读识别旧数据，并且不能绕过用户审核。
- Visual Companion 和九个淘汰 Skill 已删除；Handoff、TDD、Worktree 与其他保留 Skill 路径正确。
- 守卫本身是本地、确定性、只读测试，不增加运行时或 API 复杂度。
