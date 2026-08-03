# T075：把 PRD、Plan、Workflow 和 Task 合同统一到当前实际实现

- Status: `completed`
- PR: `PR 0 / PR 7 - 合同一致性与最终闭环`
- Depends On: T068, T069, T071, T072, T073, T074, T077
- Parallel: No。必须读取已稳定的实现事实后修文档，不能让旧示例反过来覆盖新合同。

> 当前说明：本 Task 记录第一轮合同统一。它关于墙钟、首个动作上限、暂停计数和速度评分的结论已被 T077 取代；现行 Protocol v2 只使用非计时 `criticalPath`，不得按下文历史计时方案实施。其他加载状态、证据绑定、并行 ownership 和历史 v1 保护结论继续有效。

## 为什么要做

协议和实现连续加强后，少数规划文档仍保留旧字段、旧顺序和旧计数。例如 Plan 示例还用单一 `load`，PRD 把 Framework Done 写在后置 Architecture 之前却又要求 Architecture 已完成，T001 只强调绝对超时而漏掉三项关键路径门，Task 导航还把“一个 Agent 一个完整 Task”误写成所有 Task 必须串行。

这些不是措辞小问题。后续 subagent只拿一份 Task 时，会按旧合同实现出不同结果。本 Task 的目标是让每个入口讲同一件事，并把“快”和“好”同时写成可验证条件。

## 与原文档的比较

| 原文档风险 | 统一后的合同 |
|---|---|
| `load` 混合 Baseline 与 Live | `baselineLoad`、`liveLoad`、`branch` 三者分开 |
| 只写绝对超时 | 首个有效动作、授权到启动、无谓暂停、绝对超时四项独立过门 |
| Converge Done 依赖尚未获批的 Architecture | `Converge Ready + Fresh Evidence` 可以完成无材料性结构变化的 Bundle；Architecture 仅在用户发起或确认需要时另行更新 |
| “每次只派一个 Task”导致全部串行 | 一个 Agent 一次拥有一个完整 Task；依赖满足且文件边界隔离的 Task 可以并行给不同 Agent |
| `failureKind` 看起来要概括所有失败 | 它只保存最先阻断且能定位 owner 的 primary classification，其他失败留在逐门证据 |
| 规则计数和实际条目不一致 | 正文按实际 15 条校正，不用错误数字制造遗漏 |

## 文件边界

### Modify

- `docs/specs/next_generation_skill/hello-scholar文档驱动 AI 科研开发框架 PRD.md`
- `docs/specs/next_generation_skill/hello-scholar文档驱动 AI 科研开发框架执行plan.md`
- `test/skill-evals/WORKFLOW.md`
- `docs/specs/next_generation_skill/tasks/README.md`
- T001、T002、T003、T025、T039、T068-T071
- 仍含旧 `load`、旧超时或旧 Framework 顺序的其他 owner Task，只修对应合同句

### Must Not Modify

- 产品 Skill、CLI、Fixture、Protocol、Approval、Baseline、Scorecard 或 evidence
- 已接受 Spec 的业务语义
- 与本次不一致无关的相邻文档、旧迁移历史或用户未要求的目录结构

## 实施细节

1. 从 `test/skill_eval_contract.py` 和当时 39 个 Protocol v2 读取实际字段，不凭记忆改示例；T078 后的当前组合为 37 项，最终数量以现行 Manifest 为准。
2. PRD 明确用户价值五维和四项速度门：质量高分不能抵消启动慢，速度通过也不能抵消内容无价值；最终质量裁决仍属于用户。
3. 把人类办公节奏写成两条可执行路径：正式实验先建最小 Record 后尽快启动；低风险隔离探索可先跑，但在形成结论或进入依赖工作前补录。运行中只记关键事件，结束后一次补终态。
4. 把 Converge 的输出命名为 `Ready`：它证明 Spec/Plan/Tasks/代码/实验事实对齐。Fresh Evidence 始终由主 Agent另行取得；Architecture 只在用户发起或确认材料性结构变化时走单独 Proposal/批准/写入，没有这项条件时不阻塞完成。
5. Plan 的 Protocol 示例换成 v2 当前字段，并包含共享用户价值、四项速度、命令模板/真实命令证据和 Prompt 投影的入口说明。
6. README 更新到最新 T 编号，说明并行只取决于依赖和文件边界；绝不让两个 Agent共同拥有同一 Task 或同时编辑同一事实源。
7. 全局搜索旧 `load:`、只有绝对超时的旧句、错误的 “14 条”、旧 memory 路径和旧 Framework Done 顺序。只修改本 Task 明确拥有的合同残留。

## 验证

- `rg -n '"load"|load: absent|load: pre-change|load: current' docs/specs/next_generation_skill test/skill-evals/WORKFLOW.md`
- `rg -n '14 条|每次只派一个 Task|Converge.*Done|Framework Done' docs/specs/next_generation_skill`
- 对 PRD、Plan、Workflow、README 和 owner Tasks 做逐项映射 review，确认同一概念只有一个事实源或明确指针
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_skill_eval_contract.py'`
- `git diff --check`

`rg` 命中代码示例或历史说明时人工判断，不为追求零命中破坏 Protocol v1 的只读事实。

## 完成标准

- 不了解聊天历史的 Agent从任一入口都能得到相同的阶段加载、批准、交互、评分、速度和完成顺序。
- PRD 明确回答“为什么加 Skill 后不能变慢”：最小记录在关键路径，完整文档在进程结束后补齐；四项速度分别验收。
- Plan 示例与实际 Protocol v2 Schema 一致。
- Converge Ready 和最终 Framework Done 不再形成循环依赖。
- Task 并行规则既保护文件 ownership，也允许真正独立的工作并发。
