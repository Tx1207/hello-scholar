# T043：将 `using-helloscholar` 改为五路 Router

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T013, T019, T022, T024, T025, T026, T027, T028, T029, T030, T031, T032, T034, T037, T040, T042, T046, T049, T065
- Parallel: No。Router 是顶层入口，必须等保留 Skill 合同、删除清单、共享引用和 Handoff 路径稳定后修改。

## 目标

保留 `using-helloscholar` 的 Skill 发现和优先级职责，删除过宽的“1% 可能性”强制话术，改为 Fast、Design、Execution、Experiment、Maintenance 五路判断。Router 只选择当前下一步，不替下游 Skill 复制完整流程。

## 预先设计思路

路由依据是“用户现在要完成什么 + 项目已经有什么”，而不是任务里出现了哪个关键词。顺序如下：

1. 用户明确指定 Skill、流程或禁止动作时，先尊重该指令。
2. 如果当前 Agent 是收到完整 Task 的 subagent，跳过顶层 Router，直接执行 Task 指定流程。
3. 顶层 Agent 读取最小项目状态：是否是简单局部改动、是否需要新设计、是否已有 Current Bundle、是否要启动实验、是否只维护文档。
4. 选择一个“立即主路径”，声明理由，再读取并执行对应 Skill。多个后续阶段可能存在，不等于当前同时启动五条路径。

## 与原 Skill 比较

### 保留原内容

- `<SUBAGENT-STOP>` 的语义。
- 用户指令 > Hello-scholar Skills > 默认行为的优先级。
- 调用 Skill 前读取当前版本，不能凭记忆。
- Process Skill 先于实现 Skill。
- Claude/Copilot/Gemini/Codex 的真实访问方式；三个 tool-mapping references 先由 T065 清理为最终 Skill 清单，本 Task 只消费并验证，不重复编辑。
- 使用 Skill 时向用户简短说明用途。

### 删除或替换

- 删除 `1% chance`、`ABSOLUTELY MUST`、不可协商等把所有任务推向重流程的重复强制段落和 Red Flags 表。
- 删除进入 Plan Mode 前无条件 Brainstorm 的流程图分支。
- 用五路决策表和少量边界例子替代“所有问题先扫所有 Skill”的长篇纪律提醒。
- 不删除按需调用相关 Skill 的原则；改变的是相关性判断，不是允许忽略明确适用的 Skill。
- 删除所有已淘汰 Skill 名称和 `project-structure` 路由；工具映射只描述平台能力，不宣传已删除产品流程。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `using-helloscholar` 保持 model-invoked 顶层 Router，因为 Agent 需要自动选择当前路径；description 只承担五路触发，不复制下游步骤。
- `Fast | Design | Execution | Experiment | Maintenance` 是五个 branch；每次只选择当前一条立即路径，并以“给出理由并进入唯一 owner”为完成条件。
- 下游合同全部通过 context pointer/Skill name 到达；用户显式 Skill、Handoff、TDD 和按需工具作为边界规则 co-locate，不展开成第二套流程。
- 删除 1% 强制话术、重复纪律、旧 Skill sediment 和无行为增益的 no-op，让 Router 明显短于现版本。

## 文件边界

### Modify

- `skills/superpowers-skills/using-helloscholar/SKILL.md`
- `skills/superpowers-skills/using-helloscholar/SKILL.zh_CN.md`
- `test/test_using_helloscholar_skill.py`

### Add

- `test/test_using_helloscholar_routes.py`

### Must Not Modify

- 任何下游 Skill
- `skills/superpowers-skills/using-helloscholar/references/`（T065 已同步，当前 Task只读验证）
- `AGENTS.md`、`README.md`
- `src/`
- T042 的 Scenario/Protocol/Baseline

## 五路合同

| Path | 何时选择 | 立即下一步 | 核心文档行为 |
|---|---|---|---|
| `Fast` | 局部 Bug、文案、格式、单测试、不改变行为的内部重构、临时调试 | 当前主 Agent直接回答/实施并验证；仅用户或 Approved Task 点名时进入 TDD | 不创建或修改 Spec/Plan/Tasks/Record/Architecture |
| `Design` | 新能力、公共接口/模块/数据或高风险设计变化，需要方案取舍 | `brainstorming`，写入前由 `manage-specs` 管身份 | 先只处理 Spec；批准前不实施 |
| `Execution` | 已有 Accepted Spec、Approved Current Plan、Current Tasks，且 Tasks 当前 Revision 已批准、本轮另有实施授权 | 当前主 Agent按 Tasks 依赖直接执行；可按需用平台 subagent，但不调用执行 Skill | 从现有 Bundle 执行，不重复设计 |
| `Experiment` | 正式实验、Benchmark、Eval、训练，或符合条件的探索 | `record-experiment` | 按正式事前/探索补录合同写根目录 Run |
| `Maintenance` | Index、用户主动要求的 Architecture、恢复或旧文档迁移 | `docs-maintenance` 或经审核的迁移说明 | 只写所选维护 owner 允许的文件 |

## 边界和冲突处理

- 用户明确要求 Handoff 时直接调用保留的 `handoff`，写 `hello-scholar/handoffs/`；显式命名 Skill 不必为了凑五路先改写意图。
- 一个请求可能跨阶段，例如“设计并最终实现”。Router 只启动 Design；每个审批门通过后由下游 Skill 路由下一阶段，不在第一条响应自动创建全部文档。
- 已有 Bundle 但 Stale 时仍属 Execution 意图，不过必须先按 `writing-plans` / `generating-tasks` 同步对应层；不回到 Brainstorm，除非发现 Spec 设计缺失。
- Execution 不能只检查文件存在：必须同时确认 Tasks `approval: approved`、`approved_revision == revision`，且用户当前请求明确授权实施。合同获批不等于自动开始；任一门缺失时停在对应审核/授权点。
- 普通 Feature/Bugfix、测试请求或出现 `Validation` 字样都不会自动调用 TDD。只有用户当前请求或 Approved Task 明确点名 TDD，才读取并严格执行该 Skill。
- 正式 Benchmark 即使服务于实现，也先走 Experiment 的 Record 门；完成后再回到当前 Task/Converge。
- Bundle 完成且代码显示材料性结构变化时，Router 只提醒用户可更新 Architecture 并说明范围；用户确认后才交给 `docs-maintenance architecture`，不能把它自动串入闭环。
- Maintenance 的迁移只能通过 context pointer 完整读取 T046 已创建的说明并先给 Mapping Proposal，不能出现自动迁移入口或复制详细映射规则。
- 无法判断且不同路径会实质改变写入/风险时，列出已知状态并问一个最小问题，不静默选重流程。

## 文本规模和触发描述

- Front Matter `description` 仍说明它是顶层会话 Router，但不声称每个 subagent 或每个回复都要重新跑完整路由。
- 正文应明显短于当前重复纪律版本，把上下文留给真正工作的下游 Skill。
- 中英文的五路名称、边界、审批门和平台 references 一致。
- 三份平台 reference 由 T065 删除已淘汰示例并保留真实 tool mapping；本 Task 只断言结果，不再写第二遍。`spawn_agent` 仍可用于 Eval 和按需委派，但不是产品执行链。

## 测试顺序

1. 在 `test/test_using_helloscholar_routes.py` 先写五路静态/决策 Fixture，确认当前 Router 因缺少显式路径和过宽强制规则失败。
2. 修改中英文 Skill，并调整现有 `test/test_using_helloscholar_skill.py`：保留 name、全 Skill 组、平台 references、takeoff/landing 优先级测试；移除只为旧“1%”文案服务的断言。
3. 断言 Fast 零核心文档且不自动 TDD、已有 Bundle 由主 Agent直接执行且不重复 Brainstorm、正式实验先 Record、Index 进入 docs-maintenance。
4. 断言 `<SUBAGENT-STOP>`、用户优先、Process 优先和 tool mapping references 仍存在。
5. 运行 `python3 -m unittest test/test_using_helloscholar_skill.py test/test_using_helloscholar_routes.py`、`npm test`。

## 完成标准

- T042 的五个场景都有唯一且可解释的目标路由。
- Router 不再把简单请求拖入文档闭环，也没有放松明确适用 Skill 的使用纪律。
- 现有平台适配、用户优先和 subagent 边界完整保留。
- Router 没有复制下游 Skill 细节或直接写用户文档。
- Router/平台 references 不含九个已淘汰 Skill 或 `project-structure`，但仍正确说明可选 subagent 工具。
