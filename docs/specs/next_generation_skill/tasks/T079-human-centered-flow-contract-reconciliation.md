# T079：把 PRD、Plan 和 Skill Tasks 统一为面向用户的轻量流程

- Status: `completed`
- PR: `PR 0 / PR 2 / PR 3 / PR 4 / PR 6 - 产品与 Skill 合同纠偏`
- Depends On: T077, T078
- Parallel: No。它是后续生产 Skill 实施前的当前产品事实源。

## 为什么要做

旧文档把完整闭环画成每次任务都经过 Architecture、Converge 和 Architecture Update，也保留了 Brainstorm 分章节确认、固定 15 节 Spec、固定 14 个最终 Skill 和 Eval 时间门。用户反馈加入多个 Skill 后 AI 变慢，根因不是 Skill 文件数量本身，而是流程把说明、重复确认和非关键文档放在了有效动作前。

本 Task 不通过新增 Router 命令、执行器或调度 Skill解决问题。它把已经确认的轻量规则写回唯一事实源，并要求后续 Skill 最大限度复用原有有效内容，只调整入口、停点、文档范围和用户表达。

## 已确认的产品合同

1. Router 用一句人话说明所选路径和本轮核心文档范围，然后默认继续；只有材料性不确定才逐个询问。
2. Fast Path 写入五类核心文档数量为零。
3. 只有需要长期合同、改变公共接口/数据/模块职责或有材料性风险的决定进入 Design；不确定且会改变路径时可以问用户。
4. 正式实施主链为 `Spec -> Plan -> Tasks -> 主 Agent直接执行`；用户可以要求在一个 Goal 中走完整流程，但不能跳过审核和实施授权。
5. Brainstorm 一次只问一个材料性问题；信息足够后一次审核完整 Spec，不逐章节确认。
6. Spec 固定七个核心章节，价值和当前决定放在最前；候选方案、迁移、回滚、证据、未决问题和 Revision History 按需出现。
7. Plan 和 Tasks 分别整份审核；批准 Tasks Revision 不自动等于当前回合实施授权。
8. Spec 身份保持 `Existing`、`Independent`、`Successor`、`Human Classification` 四类。
9. Converge 只在 Bundle 末端或用户明确要求时运行，默认只读；需要追加 Task 时先走新的 Tasks Revision 审核。
10. Architecture 只由用户发起；或 Bundle 完成且项目结构、关键模块职责、公共流程或持久位置发生材料性变化时，Agent 提醒用户确认后更新。
11. 14 个 Skill 是 Baseline 候选集合，最终数量可以缩减。

## 与原 Skill 的比较

| Skill / 做法 | 保留 | 调整 |
|---|---|---|
| `using-helloscholar` | 路由判断、用户指令优先、按需读取 | 一句话路径/文档范围；默认继续；不串行加载全部 Skill |
| `brainstorming` | 项目探索、一个问题、方案比较、权衡、自审 | 只问材料性问题；完整 Spec 一次审核；七核心章节 |
| `manage-specs` | 检索、Revision、ID、替代关系、四类身份 | 分类不确定时询问；结果先解释对用户的影响 |
| `writing-plans` | 真源、范围、文件、接口、迁移、测试、清理、回滚 | 完整 Plan 一次审核，不承载 Task 细节 |
| `generating-tasks` | 精确路径、依赖、验证、完成条件、禁止占位 | 完整 Tasks 一次审核，不开始实施 |
| `converge-to-spec` | Missing/Partial/Contradictory/Unrequested 与清理 | 只在末端/显式运行，默认只读 |
| `docs-maintenance` | Check、Index、Architecture、Recover | Architecture 改为条件入口并先确认 |
| `record-experiment` | 正式事前、探索后补、终态证据 | 最小记录后立即启动，非关键文档延后 |

## 文件边界

### Modify

- PRD
- 执行 Plan
- Task 导航
- 尚未实施的 Router、Brainstorm、Manage Specs、Plan、Tasks、Converge、Docs Maintenance、Record、E2E 和 catalog Tasks

### Must Not Modify

- 生产 Skill；它们仍受 Proposal -> Baseline -> 用户审核门约束
- 历史 v1 Scenario/Protocol/Baseline/evidence
- 已生成的真实实验结论
- 新增命令、API、自动迁移或执行 Skill

## 实施细节

1. 删除所有把 Architecture、Converge 或完整文档链描述成普通任务固定步骤的正文和验收项。
2. 将固定 15 节 Spec 替换为七核心章节加条件章节；保留原 Skill 的模块、接口、数据流、错误处理、测试、清理和回滚能力。
3. 把“分章节确认”替换为“材料性问题逐个问、完整文档整份审核”。
4. 明确完整流程请求只减少用户重复调用 Skill 的成本，不预先批准未来产物。
5. 把固定最终 14 个 Skill 改为候选 14；最终 catalog 在 Baseline 用户裁决后形成。
6. 同步全部尚未实施 Task 的场景、实现细节、静态测试和 Live Eval 验收，不依赖当前聊天才能解释新规则。
7. 使用普通用户能理解的中文说明价值、停点和下一步；技术字段保持原名。

## 验证

- 扫描 PRD、Plan 和 Tasks，不再出现 v2 时间质量门、固定 39 项、固定最终 14 个 Skill或 Brainstorm 逐章节确认。
- 每个受影响 Task 仍是独立完整文件，并含原 Skill 比较和生产 Skill authoring gate。
- Architecture、Converge、完整流程和 Tasks 实施授权的边界在 PRD、Plan、Tasks 中一致。
- 运行文档合同测试、完整静态测试和 `git diff --check`。

## 完成标准

- 用户能从 Router 一句话知道接下来做什么和会写哪些文档。
- 文档只在能保存长期价值时产生，不为展示流程而产生。
- 完整流程仍可请求，但不会以重复确认和固定附加 Skill拖慢执行。

