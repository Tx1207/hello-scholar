# T048：最终回归、安装验收和 `0.2.0` 收口

- Status: `approved`
- PR: `PR 7 - Legacy 迁移与完整闭环`
- Depends On: T047, T067
- Parallel: No。这是所有实现和 Live Eval 之后的最后质量门。

## 目标

把版本收口到 `0.2.0`，验证所有本地合同、Skill 证据、CLI、安装/卸载和用户文档保护。这个 Task 不新增产品能力、不修前序实现；发现失败时回到对应 owner Task。

## 与当前发布状态比较

- 当前 `package.json` 是 `0.1.0`，只代表旧文档模型。
- 下一代新增 docs CLI 和多个 Skill，但必须继续兼容原有 install/uninstall、Codex/Claude、link/copy。
- 旧测试里很多行为是静态/历史 Scorecard；最终门还要确认所有新 `test/skill-evals/` 证据 Hash 对应当前文件，并且普通测试不启动 Live Eval。

## 文件边界

### Modify

- `package.json`：只把版本改为 `0.2.0`，不新增 Live Eval script 或依赖。
- `test/test_cli_install.js`：补充安装/卸载不删除用户 v2 文档的回归用例。

### Add

- `test/test_release_contract.py`

### Must Not Modify

- 任何 Skill、`src/`、AGENTS、README、迁移说明
- 任何 Scenario、Protocol、Baseline、Scorecard 或证据
- 用户项目文档

仓库当前没有 lockfile；本 Task 不为单一版本字段新增 lockfile。

## Release 静态合同

`test/test_release_contract.py` 至少验证：

1. `package.json` version 恰好为 `0.2.0`，没有生产依赖，也没有 `codex exec`、网络或 Live Eval package script。
2. 所有产品 case 都有合法 `protocol.json`、`baseline.json` 和最终 `scorecard.json`；历史 Framework E2E v1 保持只读且没有 Scorecard，Framework E2E v2 后继额外有三份通过证据。
3. 所有 Scorecard 的 Scenario/Protocol/Skill/共享用户价值 rubric Hash 当前，硬门、业务质量、用户价值、有序 `criticalPath` 和命令满足各自 Protocol；不存在用旧 Hash 冒充通过，也不存在墙钟质量字段。
4. 活跃 Skill/模板/AGENTS/README 不指导写 `hello-scholar/memory/` 或 `hello-scholar/runs/`；迁移说明和只读 legacy 检测允许引用旧源路径。
5. Visual Companion、九个淘汰 Skill 和未创建的 `project-structure` 均不存在；`handoff`、显式 TDD、`using-git-worktrees`、`crash-audit`、`takeoff`、`landing` 仍存在且合同正确。
6. `docs migrate` 不存在于 CLI action、usage 或 package script。
7. Framework Execution 由 Implementer under test 作为产品主 Agent直接执行 Tasks；Scorecard 的 Reviewer 只用于 Eval，活跃文档没有把它变成产品强制链。
8. 从 Protocol 的 `primarySkill` / `countsTowardProductSkill` / `projectId` 统计 T065 catalog 中的候选 Skill；只有 Baseline 真实 Red、当前 Skill Live Eval pass 且用户 accepted、并且至少覆盖两个不同真实项目的候选才可提交用户裁决。复制 Fixture、重复 case 和仅重命名 `projectId` 不得通过人审；Framework E2E 和 `control-pass` 均不计数。最终保留名称和数量只由这些证据及用户裁决决定，不能预先锁死为 14。
9. T067 的函数合同注释静态守卫通过；本次升级新增或行为修改的生产函数/可复用 helper 都在函数体第一处说明 `Purpose`、`Input`、`Output`，并在需要时说明 `Errors` 或 `Side effects`。

## CLI 和安装回归

扩展 `test/test_cli_install.js`，在临时项目预先创建：

- `hello-scholar/architecture.md`
- 一个 `hello-scholar/specs/.../spec.md`
- 一个 `hello-scholar/handoffs/...md`
- 一个 `runs/<run-id>/record.md`

分别覆盖 Codex/Claude 的 link/copy 安装与卸载。卸载后管理块和 owned Skill 应被移除，但上述四类用户文档 bytes 必须完全不变。复跑 T051 的升级 Fixture，确认 owned retired copy、有效旧链接和悬空旧链接都被清理，无 marker/坏 marker/跨工具 marker/其他目标链接均保留。原有 unowned Skill、跨工具 ownership、重复安装和失败回滚测试继续通过。

## 最终执行顺序

1. 运行所有聚焦静态合同：Skill Eval、Framework E2E、legacy path、函数合同注释、release contract。
2. 运行 `npm test`，确认 Node 和 Python 全绿。
3. 运行 `node bin/hello-scholar.js help`，确认 install/uninstall 和 `docs check/docs sync` 帮助正确，且没有 migrate。
4. 在临时项目分别 smoke test：Codex link/copy、Claude link/copy、重复安装确认、卸载和用户文档保留。
5. 在有效小 Fixture 运行 `docs check`、`docs sync` 两次，确认第二次字节级零变化；在错误 Fixture 确认 sync 不部分覆盖旧 Index。
6. 检查 `git diff --check`、最终 diff 和未跟踪文件，确认没有 Live Eval 临时工作区、根目录垃圾、缓存或意外生成文档。

## 失败处理

- 不在本 Task 顺手改 Skill、parser 或 Prompt。按失败归属重开 T004-T047 的具体 Task，修复并重新生成受影响 Hash/Live Eval。
- 如果任何 Skill Hash 变化，所有受影响 Scorecard 都视为过期，不能只改 JSON Hash；必须按 Workflow 重新运行。
- 不因测试慢而把 Live Eval 接入 `npm test`，也不删除现有质量门。

## 完成标准

- `npm test`、docs CLI、安装/卸载和两种安装模式全部通过。
- 用户最终决定保留的每个产品 Skill 都有至少两个当前且 accepted 的专属 case，并覆盖至少两个不同 `projectId`；Framework E2E 连续三次通过。
- Framework E2E 三次来自 Protocol v2 后继目录；历史 v1 Red 保持原字节且未增加 Scorecard。
- 版本为 `0.2.0`，没有新依赖、lockfile、自动迁移或 Live Eval 默认脚本。
- T067 的函数合同注释守卫通过，后续行为修改没有留下过期合同。
- 用户文档在卸载后保持原字节，仓库无临时评测产物。
- 本 Task 不执行 publish、push、commit 或 release tag；这些外部动作需要用户另行明确授权。
