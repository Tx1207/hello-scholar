# T065：维护候选 Skill catalog 和三份平台 Tool Reference

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T010, T013, T016, T019, T022, T024, T025, T026, T027, T028, T029, T030, T031, T032, T034, T037, T040, T049, T050, T056, T063, T066
- Parallel: No。所有产品 Skill 的最终名称、入口和删除决定稳定后，才能一次收口共享清单。

## 为什么要做

当前 `docs/need_skills/` 仍把多个即将删除的 Superpowers Skill 标成已选择，统计也混合“历史候选库”和“当前候选 catalog”。`using-helloscholar/references/codex-tools.md` 还明确说 `spawn_agent` 用于 `dispatching-parallel-agents` / `subagent-driven-development`，并引用 `finishing-a-development-branch`。如果各删除 Task顺手修改这些共享文件，会发生并行冲突；如果完全不改，Router 和用户会继续看到已淘汰流程。

本 Task 只收口共享 catalog 和平台工具映射。它不删除候选 Skill 历史，也不把平台 subagent 能力一起删掉：Eval 和主 Agent按需委派仍需要真实工具说明。

## 当前候选 catalog

Baseline 前 hello-scholar v0.2 的候选集合有 14 个。它是当前评测入口，不是最终产品承诺；每项先用两个真实项目验证独立价值，最终保留名称和数量由 Baseline 证据与用户裁决决定：

| Skill | Source directory | 当前定位 |
|---|---|---|
| `using-helloscholar` | `skills/superpowers-skills/using-helloscholar/` | 五路 Router |
| `brainstorming` | `skills/superpowers-skills/brainstorming/` | 设计对话 |
| `manage-specs` | `skills/hello-scholar/manage-specs/` | Spec 身份与 Revision |
| `writing-plans` | `skills/superpowers-skills/writing-plans/` | 高层实施方案 |
| `generating-tasks` | `skills/superpowers-skills/generating-tasks/` | 独立可执行 Tasks |
| `record-experiment` | `skills/hello-scholar/record-experiment/` | Run provenance |
| `converge-to-spec` | `skills/hello-scholar/converge-to-spec/` | Bundle 收敛 |
| `docs-maintenance` | `skills/hello-scholar/docs-maintenance/` | Check/Index/Architecture/Recover |
| `handoff` | `skills/productivity-skills/handoff/` | 按需会话交接 |
| `test-driven-development` | `skills/superpowers-skills/test-driven-development/` | 明确要求时的 Red-Green-Refactor |
| `using-git-worktrees` | `skills/superpowers-skills/using-git-worktrees/` | 明确隔离意图时准备 Worktree |
| `crash-audit` | `skills/hello-scholar/crash-audit/` | 明确请求的盲点审计 |
| `takeoff` | `skills/hai-skills/takeoff/` | 明确意图的方向放大 |
| `landing` | `skills/hai-skills/landing/` | 明确意图的可行性压实 |

九个 retired Skill、Visual Companion 和未创建的 `project-structure` 都不是当前候选项。系统级/仓库 authoring 的 `writing-great-skills` 也不计入这 14 个 Baseline 候选。

## 文件边界

### Modify

- `docs/need_skills/need-skill.md`
- `docs/need_skills/minimum-skill-record.md`
- `docs/need_skills/reference-skill.md`
- `skills/superpowers-skills/using-helloscholar/references/codex-tools.md`
- `skills/superpowers-skills/using-helloscholar/references/copilot-tools.md`
- `skills/superpowers-skills/using-helloscholar/references/gemini-tools.md`

### Add

- `test/test_current_skill_catalog.py`

### Must Not Modify

- 任何生产 `SKILL.md` 或 Skill 目录
- `skills/superpowers-skills/using-helloscholar/SKILL*.md`（T043 owner）
- AGENTS、README（T045 owner）
- `src/install.js` / `src/fs-ops.js`（T051 owner）
- 候选 Skill 源码、`references/code/`、PRD/Plan 或 Eval 证据

## 三份 Catalog 的具体处理

1. 在三份文件顶部把“候选资料覆盖统计”和“当前 Baseline 候选 catalog”分开。候选来源项目、`REF-SKILL-*` 行和未采用候选历史保持原 ID 与内容；它们不是安装 catalog，不能被 14 这个数字覆盖。
2. 新增或重写一个明确标记为 `hello-scholar v0.2 Baseline 候选 Skill（14）` 的表，使用上面的精确 name/path/定位，并明确最终清单等待证据和用户裁决。三份文件的候选表必须语义一致，不能一份说 14、一份仍按旧 17 项流程。
3. 原 `NEED-SKILL-*` 历史编号不重排。九个 retired 条目移出“当前需要/最小工作流”并明确标记为 v0.2 历史决定及替代 owner；不要保留可点击到已删除源文件的当前使用链接。
4. 把 `manage-specs`、`generating-tasks`、`record-experiment`、`converge-to-spec`、`docs-maintenance`、`using-helloscholar` 和 `crash-audit` 补入当前表；更新 Brainstorm/Plan/Handoff/Worktree 的旧路径与旧职责。
5. `minimum-skill-record.md` 的“最小工作流覆盖”改成 `Spec -> Plan -> Tasks -> 主 Agent直接执行 -> Fresh Evidence`；另写清 Converge 仅在 Bundle 末端/显式请求时加入，Architecture 仅在用户发起或确认材料性结构变化后更新。Handoff/TDD/Worktree/Crash/Takeoff/Landing 放在明确按需区，不再写执行器、强制 Review 或自动分支收尾。
6. 不删除与产品集合无关的论文、研究、可视化等候选条目，也不把它们批量改为 unselected；本 Task只修活跃 mapping 与相关统计解释。

## 平台 Tool Reference 的具体处理

1. 删除九个 retired Skill 作为“使用这些工具的当前例子”的文字，以及 `finishing-a-development-branch` 的清理引用；三份 reference 不再推荐已删除产品流程。
2. 保留每个平台真实存在的 subagent/parallel/wait 映射，因为 T001 Eval 和主 Agent按需委派仍可使用。文案明确这是平台能力，不是产品必须链；不能因删除 dispatch Skill 就假称工具不存在。
3. 保留 shell、file edit、search、worktree/native tool 等仍正确的映射。只在实际平台 reference 已过时时修改，不借本 Task重写整份平台教程。
4. Codex reference 使用当前项目已经验证的 `spawn_agent` / `followup_task` / `wait_agent` 语义；不新增 API Client、`codex exec` 或外部服务。Copilot/Gemini 保留各自真实工具名，不强行翻译成 Codex 名称。
5. 三份 reference 只解释工具，不复制 Router 五路、Skill 流程或 14 项完整正文；当前清单由三份 catalog 统一拥有。

## 测试合同

`test/test_current_skill_catalog.py` 必须：

1. 从三份 catalog 的具名 Baseline 候选表解析当前 14 个 name/path，断言集合一致、无重复、每个目录存在且中英文 `SKILL` Front Matter name 匹配；测试不得把候选数量当作最终发布数量。
2. 断言九个 retired、`project-structure`、Visual Companion 和 `writing-great-skills` 不在当前候选表；它们出现在明确历史/候选文字中不应误报。
3. 断言候选 section 的 `REF-SKILL-*` ID 集合和无关内容未被本 Task批量删除，覆盖统计的含义与实际解析结果一致。
4. 扫描三份平台 reference，禁止把 retired Skill 写成当前消费者；同时正向断言 subagent/并行/等待等通用映射仍存在，并标明可选平台能力或 Eval 用途。
5. 失败信息显示文件、section 和具体 name；不用全仓宽泛 grep，也不把历史 Plan/Task引用当产品入口。

## 验证

- 先写测试证明旧 active catalog、旧最小流程和 Codex retired 示例失败，再做最小文档修改。
- 运行 `python3 -m unittest test/test_current_skill_catalog.py`。
- 运行 Router 现有 reference 测试、Skill discovery 聚焦测试和 `npm test`。
- 人工 diff 检查无关候选行、原始 ID 和来源记录没有被重排或格式化。

## 完成标准

- 三份 catalog 能让新 Agent一眼区分“当前 14 个 Baseline 候选 Skill”和“历史候选资料”，并明确最终清单尚待证据和用户裁决。
- 活跃表、路径、职责和最小流程一致，九个 retired 不再被推荐，候选历史仍可追溯。
- 三份平台 reference 保留真实工具能力，但不再把它们绑定到已删除产品 Skill。
- 本 Task没有修改生产 Skill、安装器、Router 主体、AGENTS 或 README。
