# T071：为历史 Framework E2E 创建 Protocol v2 后继场景

- Status: `completed`
- PR: `PR 0 / PR 7 - Eval 历史保护与最终闭环`
- Depends On: T068, T069, T072, T077
- Parallel: No。Proposal 必须在任何后继 Baseline 或 T047 Live Eval 前完成并获用户批准。

## 为什么要做

`framework-e2e-paged-cache` 已保存一次真实 Protocol v1 Red Baseline。它证明旧框架无法完成完整闭环，但 v1 没有逐字多轮消息、安全 Prompt 投影、共享用户价值门和非计时 `criticalPath`。T068 明确规定历史 v1 输入与证据只读，也禁止在 v1 目录新增 Scorecard。

因此 T047 不能继续向原目录写三份 Live Scorecard，也不能修改原 Protocol 后回填 Hash。正确做法是保留历史 Red，另建一个 v2 后继 Proposal；用户批准新 Hash 后由 T082 运行新的 v2 Baseline，再在实现完成后连续运行三次 Live Eval。

## 与原做法比较

| 历史 v1 | v2 后继 |
|---|---|
| 原 Scenario/Protocol/Fixture/Approval/Baseline/evidence 字节不变 | 新目录保存当前可审核 Proposal |
| 后续回复只有角色，没有逐字文本 | Plan、Tasks、实施、Architecture 四次回复逐字受 Hash 绑定 |
| Implementer 隔离主要靠文档约定 | `promptProjection` 明确隐藏考卷、Protocol、rubric 和未来回复 |
| 只有业务 rubric 和总超时 | 业务、共享用户价值分别过门，`criticalPath` 用证据核对动作顺序和必要停点 |
| 不允许新增 Scorecard | 新 v2 目录承载 Baseline 与三次 Live 证据 |

## 文件边界

### Add

- `test/skill-evals/framework-e2e-paged-cache-v2/scenario.md`
- `test/skill-evals/framework-e2e-paged-cache-v2/protocol.json`
- `test/skill-evals/framework-e2e-paged-cache-v2/proposal-approval.json`
- `test/skill-evals/framework-e2e-paged-cache-v2/fixture/`

Proposal 阶段不创建 `baseline.json`、Scorecard 或 evidence 占位文件。Baseline 和 evidence 由独立 T082 在用户批准当前 Hash 后通过真实运行产生。

### Modify

- `docs/specs/next_generation_skill/tasks/T047-framework-e2e-live-eval.md`
- `docs/specs/next_generation_skill/tasks/T048-final-regression-and-release.md`
- Task 导航和 Proposal 批量审核文档。

### Must Not Modify

- `test/skill-evals/framework-e2e-paged-cache/` 下的全部历史文件。
- 生产 Skill、源码、AGENTS 或迁移说明。
- 36 个产品 Skill 专属 case 的项目计数。

## Fixture 规则

后继场景继续使用同一个 `py-paged-cache-engine` 真实项目，因为目标是重跑同一跨 Skill 闭环，不用换项目伪造新覆盖。复制历史原始 Fixture 文件作为新的 Hash 输入；不复制历史 Baseline/evidence，也不修改旧 Fixture。

Fixture 包含 Accepted Paged Cache Spec、当前 contiguous allocator、可运行测试、确定性 Benchmark、Architecture 和项目 AGENTS。Proposal Hash 绑定新目录自己的 Fixture bytes。

## Protocol v2 合同

- `scenarioId` 和 `caseId` 使用 `framework-e2e-paged-cache-v2`。
- `projectId` 保持 `py-paged-cache-engine`。
- `primarySkill: framework-e2e`、`countsTowardProductSkill: false`，不为目标 Skill 虚增专属 case。
- Target Skills 保持 `writing-plans`、`generating-tasks`、`record-experiment`、`converge-to-spec`、`docs-maintenance`。
- 每项 `skillExpectations` 分别声明 `baselineLoad: absent | pre-change-explicit-file`、固定的 `liveLoad: current-explicit-file` 和独立的 `branch`；Baseline 使用修改前 immutable Skill/absent 状态，Live 使用 `skillSources` 指向的当前显式 Skill 文件。每项实际 snapshot Hash 写入运行证据。
- Implementer/Reviewer 都为全新 `gpt-5.6-terra`、不同 Agent ID、`forkTurns: none` Agent；Terra 不可用时记环境阻塞并停止，不回退其他模型。完整 Scenario/Protocol 和未来回复对 Implementer 不可见。
- 业务 rubric 覆盖文档合同、批准门、实现正确、实验 provenance、Converge/Fresh Evidence 和 Architecture 当前事实。
- 引用当前共享用户价值 rubric Hash。
- `criticalPath` 绑定从 Approved Bundle、分离审批和直接实施，到最小 Record、正式 Benchmark、Converge/Fresh Evidence 及获批 Architecture 事务的可观察顺序；不含分钟、毫秒、暂停计数或其他墙钟通过线。

## 逐字多轮消息

首轮只投影 Scenario 的原始用户请求。后续消息必须在真实停点发送：

1. Plan 停点：`我批准你刚刚展示的当前 Plan 内容和 Revision。请记录批准状态，然后生成可审核的 Tasks；生成后停止，不要实施。`
2. Tasks 停点：`我批准你刚刚展示的当前 Tasks Revision。请只记录批准状态并停止；这不是本轮实施授权。`
3. 实施停点：`我现在单独授权你按当前已批准 Tasks 实施全部任务。`
4. Architecture 停点：`我批准你刚刚提交的 Architecture 语义 Proposal 和其中引用的当前文件 SHA-256；请只按该 Proposal 更新 Architecture。`

消息文本、发送者、content role 和 stop condition 全部写进 Protocol Hash。首轮 Prompt 不能提前包含这些回复。

## Proposal 与运行边界

1. 新 Scenario、Protocol、Fixture 和 rubric 作为 Proposal 与其他 pending v2 case 一次提交用户审核。
2. `proposal-approval.json` 初始为 `decision: pending`、`replyEvidence: null`，绑定当前三份 Hash。
3. 用户批准当前 Hash 前，不运行 v2 Baseline、不创建 Agent、不写证据。
4. 批准后的首次 Agent 运行属于 T082；它用修改前 Skill snapshot 保存一次诚实 v2 `fail | control-pass` Baseline。
5. 只有 T082 得到真实 `fail` 才打开 T047；`control-pass` 停止并交用户判断框架增益。

## T047 修改思路

- 全部写入路径改到 `framework-e2e-paged-cache-v2/`。
- 历史 v1 Baseline只作为来源说明，不能作为新 v2 Scorecard 的直接 Baseline。
- 三次 Scorecard 都使用业务与用户价值两组评分门，并分别通过 hard rejects、`criticalPath`、交互、命令、产物和完整树证据；任一次失败都重新从三次全新运行计数。
- 三次 Reviewer pass 后仍由用户批量审阅并分别决定 `accepted`。

## 验证

- 对历史目录执行递归 Hash 前后比较，确认零字节变化。
- 用 T002/T068、T077 和 T081 校验新 Proposal Schema、逐字消息、安全投影、rubric Hash、Terra 身份和非计时 `criticalPath`。
- 确认新目录没有 Baseline/Scorecard/evidence 占位文件。
- 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_skill_eval_contract.py'`。
- 运行 `npm test` 和 `git diff --check`。

## 完成标准

- 历史 v1 Red 证据原样可验证，且没有新 Scorecard。
- v2 后继场景独立、完整、可读，未来回复、业务质量、用户价值和关键路径合同都受当前 Hash 绑定。
- 本 Task完成于纯 Proposal 状态，没有启动 Agent 或制造运行证据；用户批准后的 Baseline 由 T082 单独拥有。
- T082/T047/T048 只消费新 v2 目录，不再违反历史只读合同。
