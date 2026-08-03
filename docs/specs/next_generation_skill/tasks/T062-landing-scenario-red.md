# T062：为 `landing` 显式价值编写两个 Scenario

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T001, T002
- Parallel: Yes。只创建评测资产和修改前证据，不修改 `landing`。

## 为什么要做

`landing` 被保留，用于把已存在的大胆方向压成有价值、有边界、可验证且有止损的目标形态。当前 Skill 的 Value Ranking、五个现实反模式和 Target Shape Statement 很有价值，但 Front Matter 与正文明确写“Takeoff 后自动使用”。这会在用户只想审阅方向时自动推进阶段，也与用户已经确认的“可选 Skill 不自动串联”冲突。

本 Task 用两个用户明确要求落地的真实项目证明 Skill 的独立价值。Takeoff 后未经要求不自动承接的边界由 Router 与 T063 的静态合同保证，不单列运行时退出 Protocol。

## 当前 Skill 与目标合同比较

### 保留

- 必须能从上下文恢复 bold thesis、旧模型和主要现实问题；缺失时先补输入。
- `Must Keep | Rewrite and Keep | Defer | Delete` 四类价值排序，以及每个重要项的 Criterion/Evidence/Why/Cost/Treatment。
- 五个 `references/anti-patterns.md` 现实检查、用户异议重新定价、Ambition/Stage Boundary/Verification/Stop Rule。
- Feasible Plan 只写 Target Shape Statement，不写实现顺序或文件步骤。

### 改变

- 删除 Takeoff 后“自动使用/自动承接”的入口。
- 保留窄 model invocation：只有用户明确说 Landing/落地/把前述方向压实/太理想化需要现实校准等清楚意图，并且能恢复前序方向时进入。
- Takeoff 可以询问用户是否转给 Landing，但用户答应前 Landing 不运行；普通“风险、MVP、先验证、下一步”仍不触发。

## 文件边界

### Add

- `test/skill-evals/landing-explicit-feasibility/scenario.md`
- `test/skill-evals/landing-explicit-feasibility/protocol.json`
- `test/skill-evals/landing-explicit-feasibility/proposal-approval.json`
- `test/skill-evals/landing-explicit-feasibility/fixture/`
- `test/skill-evals/landing-explicit-feasibility/baseline.json`
- `test/skill-evals/landing-explicit-feasibility/evidence/baseline/`
- `test/skill-evals/landing-explicit-durable-queue/scenario.md`
- `test/skill-evals/landing-explicit-durable-queue/protocol.json`
- `test/skill-evals/landing-explicit-durable-queue/proposal-approval.json`
- `test/skill-evals/landing-explicit-durable-queue/fixture/`
- `test/skill-evals/landing-explicit-durable-queue/baseline.json`
- `test/skill-evals/landing-explicit-durable-queue/evidence/baseline/`

### Must Not Modify

- `skills/hai-skills/landing/`
- `skills/hai-skills/takeoff/`
- 其他 Skill、Router、AGENTS、README 或生产源码

## 场景 A：用户明确要求把大胆方向压实

`projectId: py-vector-index-service`。Fixture 是一个可运行的 Python 向量检索服务，包含 AGENTS、Git、Architecture、调用方、容量基线和测试。上下文中已有清楚 Takeoff thesis：从同步单节点索引改成多租户异步索引服务；真实约束包括公开查询 API、单机部署预算和无运维团队。用户明确说“用 landing 把上面的方向压实，别丢掉多租户隔离的野心”。

合格行为必须：

1. 从真实上下文复述 thesis、旧模型和主要现实问题，不再做一轮 Takeoff。
2. 用四类价值排序逐项处理多租户隔离、异步写入、跨区域复制、兼容层和运维面；重要保留项有完整证据字段和具体收益。
3. 把公开 API、预算、最大 blast radius 分开定价，指出需要用户裁决的取舍；不能把 AI 建议冒充最终决定。
4. 实际使用五个 anti-pattern 的判断结果，形成目标形态、阶段边界、便宜验证和止损条件。
5. 保留核心野心，但不写“先改哪个文件、第一 PR 做什么”的执行步骤，也不自动进入 Brainstorming。

Protocol 声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`：用 Baseline 证明通用 Agent不能稳定完成完整价值排序和现实压力测试，并要求 Live Agent 完整读取当前 Skill 后进入 Landing。

## 场景 B：用户明确要求校准耐久队列方向

`projectId: node-durable-queue-service`。Fixture 是一个与场景 A 不同的 Node 后台队列服务，有公开投递 API、消费者重试语义、持久状态、调用方和可运行测试。用户明确要求“用 landing 把耐久队列方向压实：保留 exactly-once 的目标，但把交付、成本与止损说清楚”。

合格行为必须：

1. 从项目事实恢复耐久队列 thesis、旧模型和主要现实问题，区分 API 合同、持久格式、幂等键与纯内部实现。
2. 用四类价值排序处理 exactly-once 目标、重试/死信、跨区域副本、兼容读取和运维成本；重要项都有 Criterion/Evidence/Why/Cost/Treatment。
3. 给出目标形态、阶段边界、最便宜的验证和明确止损条件，不把建议伪装成用户已批准的设计决定。
4. 不写文件、实现步骤或自动进入 Brainstorming；完成后停在方向/可行性层，等待用户选择下一阶段。

Protocol 声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`：用 Baseline 证明通用 Agent不能稳定完成价值排序、真实合同定价和止损边界，Live Agent完整读取当前 Skill 后才进入 Landing。

## Proposal、Baseline 与隔离

1. 两组 Scenario/Protocol/rubric 批量交用户，两个 Protocol 分别固定使用上述 `projectId`；Fixture 的语言、规则、代码树、测试和方向事实彼此独立。每个 case 有独立 Proposal ID、Hash 和决定。rubric 覆盖价值证据、野心保留、现实约束、目标形态、阶段/验证/止损和显式入口。
2. Fixture 含项目规则、Git、可运行代码/测试和会影响价值排序的真实事实。预检绝对 CLI和依赖，提交 Base并记录 `fixtureBaseCommit`。
3. 两场均声明 `baselineLoad: absent`、`liveLoad: current-explicit-file`、`branch: enter`。当前 Skill 只交给 Live Agent；每场 Implementer/Reviewer 均为不同的 `fork_turns: "none"` Agent。
4. Reviewer 只收到获批 rubric、原始多轮上下文、输出、命令和 Base-to-final 全证据，不接收 T063 或隐藏答案。
5. Baseline 预期为真实 Red；全绿时按 T001/T002 写 `control-pass` 并暂停，不制造失败。

## 验证与完成

- 两组 Protocol/Baseline 通过 T002；两个目录各计一个 `landing` primary case。
- 两场的 Red 都来自 Landing 价值结构、真实合同定价或止损边界缺失；环境/Loader 问题无效。
- 运行 `npm test`，生产 Skill和项目源码零修改。
