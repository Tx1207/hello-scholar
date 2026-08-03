# T078：把运行时 no-auto 场景改为静态边界，并补足显式 Skill 的真实价值场景

- Status: `completed`
- PR: `PR 0 / PR 6 - Eval 场景组合与显式触发边界`
- Depends On: T077
- Parallel: No。场景集合变化会使 Proposal Batch 和全部相关 Hash 失效。

## 为什么要做

上一批 39 个 v2 Proposal 中有四个运行时 no-auto 场景。它们主要验证“某个显式 Skill 不应自动运行”，却消耗完整 Implementer/Reviewer 场景，而且不能直接证明 Skill 给用户带来的正向价值。

用户确认：no-auto 属于 invocation 静态合同；真实 subagent Eval 应优先验证用户真的调用 Skill 时，它能否在真实项目中产生有价值、可读、可执行的结果。

## 场景组合变化

完整删除四个 v2 Proposal 目录：

- `landing-no-auto-after-takeoff`
- `takeoff-no-auto-option-review`
- `tdd-no-trigger`
- `worktree-no-auto-plan`

新增两个显式 entering 场景：

- `landing-explicit-durable-queue`：用户明确要求把激进队列目标收敛成可实施方案，验证 Landing 不只是说“保守一点”，而是保留目标价值、识别硬约束、分阶段落地并给出决定点。
- `worktree-explicit-bundle-isolation`：用户明确要求隔离一个 Bundle 实施，验证 Worktree Skill 检查仓库/ignore/base 状态、创建正确隔离目录并保持主 checkout 不变。

最终为 36 个产品专属 case 加 1 个 Framework E2E，共 37 个 v2 Proposal。六个显式 Skill `handoff`、TDD、Worktree、Crash Audit、Takeoff、Landing 各有两个 `branch: enter` 的真实项目 case。

## 与原 Skill 测试的比较

| 原测试思路 | 新测试思路 |
|---|---|
| 用昂贵 Agent 场景证明“不自动调用” | 用生产 Skill 的静态 invocation 测试锁定 description 和入口 |
| Landing 第二场只验证不承接 Takeoff | 第二场验证明确 Landing 请求的独立价值 |
| Worktree 第二场只验证普通 Plan 不创建隔离区 | 第二场验证用户明确要求 Bundle 隔离时的完整能力 |
| 固定 39 项数量 | 数量随有效场景变化；当前 37 项由事实源生成 |

## 文件边界

### Delete

- 上述四个 no-auto 场景的完整目录

### Add

- `test/skill-evals/landing-explicit-durable-queue/`
- `test/skill-evals/worktree-explicit-bundle-isolation/`

### Modify

- `test/test_skill_eval_contract.py` 中场景组合和静态边界合同
- TDD、Worktree、Takeoff、Landing 的 Scenario/Implementation/Live Eval Task
- Proposal 生成与审核材料

### Must Not Modify

- 生产 Skill，直到对应真实 Red Baseline 和用户审核完成
- 历史 Protocol v1
- 其他场景的业务难度来人为制造 Red

## 实施细节

1. 新 Fixture 必须有项目规则、代码或真实仓库状态、可运行验证和影响判断的约束，不使用关键词玩具。
2. 两个新 Protocol 都使用 `branch: enter`、当前共享用户价值 rubric 和场景专属 `criticalPath`。
3. Landing rubric 检查价值保留、约束识别、阶段方案、风险/回滚和用户可决策表达。
4. Worktree rubric 检查明确触发、repo/ignore/base 预检、隔离创建、基线验证、主 checkout 不变和可继续工作的交付。
5. no-auto 边界由对应未来生产 Skill Task 的静态测试负责：普通任务、普通 Plan、Takeoff 上下文或风险词不能触发显式 Skill。
6. 删除目录后，所有 manifest、审核页、Proposal 数和覆盖统计都从当前文件树重建，不保留 39 的兼容别名。

## 验证

- Landing Fixture 的项目测试通过。
- Worktree Fixture 的项目测试通过。
- 37 个 v2 Protocol 合同全部有效，Approval 全部保持 pending。
- 六个显式 Skill 每项恰好有两个 entering 产品 case。
- 四个删除目录和审核引用均不存在。
- 完整测试不启动 subagent、网络或外部 API。

## 完成标准

- 真实 Agent 成本用于验证 Skill 的正向用户价值。
- 不自动调用的边界仍由稳定、便宜的静态合同覆盖。
- 场景数量来自真实需要，不成为产品 KPI。

