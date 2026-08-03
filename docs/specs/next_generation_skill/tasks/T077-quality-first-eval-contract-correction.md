# T077：把 Eval 从墙钟评分纠偏为质量优先的关键路径合同

- Status: `completed`
- PR: `PR 0 - Skill Eval Workflow 与静态证据门`
- Depends On: T068, T069, T070, T072, T076
- Parallel: No。它修正已经实施的 Protocol v2 基础合同，必须先于任何新 Proposal 批次和 Baseline。

## 为什么要做

上一版把“首个有效动作、授权到启动、无谓暂停和总耗时”都做成硬性时间门。用户确认质量高于时间，效率应该体现在 Skill 的动作顺序、必要停点和延后工作，而不是要求不同难度的真实项目在统一分钟数内结束。

时间门还会制造错误归因：机器资源不足、subagent 排队或 runner watchdog 触发，并不能证明 Skill 的流程差。真正需要判断的是 Agent 是否先做必要事实核对、是否重复确认、是否把非关键文档挡在实验启动前，以及结果是否对用户有价值。

## 与旧合同的比较

| 旧合同 | 本 Task 的合同 |
|---|---|
| Protocol v2 保存 `speed` / `speedLimits` | v2 明确拒绝这两个字段 |
| Baseline/Scorecard 保存 `timing` 并参与 pass/fail | v2 明确拒绝 `timing`；耗时最多是 runner 诊断 |
| `skill-efficiency` 可作为失败分类 | `failureKind` 只保留 `skill-behavior` 与 `skill-user-value` |
| 时间阈值代表流程效率 | 每场保留一句非计时 `criticalPath` |
| watchdog 超时可直接判 Skill 失败 | watchdog 只表示运行未完成，不能自动做质量裁决 |
| 速度和质量分别过门 | 业务质量、用户价值、关键路径、相对增益和用户决定分别有证据，不做墙钟评分 |

## `criticalPath` 的预先思路

`criticalPath` 不是一句“尽快完成”，也不是隐藏的时间 KPI。它必须用人话写出从请求到有效结果的最短合理流程，例如：先读取当前 owner 事实，再提交可审核决定；正式实验则先建立最小可复现 Record，再 exactly-once 启动，最后补终态证据。

Reviewer 不单独凭这句话打分，而是用当前业务 rubric、hard rejects、多轮 stop condition、获批命令、产物和完整树证据验证顺序。这样既保留“流程不能拖慢用户”的产品要求，也不会让简单任务和 Framework E2E 共用武断时限。

## 文件边界

### Modify

- `test/skill-evals/WORKFLOW.md`
- `test/skill_eval_contract.py`
- `test/test_skill_eval_contract.py`
- 当前全部 Protocol v2 的 `protocol.json`
- 对应 pending `proposal-approval.json` 的 Protocol Hash

### Must Not Modify

- `test/skill-evals/framework-e2e-paged-cache/` 的历史 Protocol v1 字节
- 生产 Skill
- Baseline、Scorecard 或真实运行 evidence
- 普通 `npm test` 的无 Agent、无网络边界

## 实施细节

1. Protocol v2 要求非空 `criticalPath`，并拒绝 `speed`、`speedLimits`。
2. Baseline 和 Scorecard 拒绝 `timing`；`failureKind` 去掉 `skill-efficiency`。
3. 保留历史 v1 的 `speed.absoluteTimeoutSeconds` 校验，不能借升级回填历史证据。
4. 为 37 个 v2 Protocol 写场景专属关键路径；不得批量填同一句空泛模板。
5. 更新 pending Approval 的当前 Protocol Hash，保持 `decision: pending`、`replyEvidence: null`。
6. Workflow 明确 runner watchdog 与 Skill 质量的边界。
7. `control-pass` 要求业务和用户价值全绿且关键路径无材料性违规；不得制造 Red。
8. 用户若在 `control-pass` 后因明确偏好保留 Skill，只记录为偏好保留。需要时运行当前 Skill 的 retention/non-regression Eval；没有新证据时不声称增益。

## 验证

- 静态测试证明 v2 缺少/空 `criticalPath` 会失败。
- 静态测试证明 v2 的 `speed`、`speedLimits`、Baseline/Scorecard `timing` 会失败。
- 静态测试证明历史 v1 的原超时字段仍可验证。
- 扫描 37 个 Protocol，确认都有不同业务语义的非空 `criticalPath`。
- 运行 Skill Eval 合同测试、函数注释守卫、完整测试和 `git diff --check`。

## 完成标准

- Skill 质量不再由分钟或毫秒决定。
- 用户仍能从可观察证据判断流程是否合理、是否重复停顿、是否把文档挡在关键动作前。
- runner 未完成与 Skill 质量失败被诚实区分。
- 历史 v1 和所有 pending 审批状态未被伪造。

