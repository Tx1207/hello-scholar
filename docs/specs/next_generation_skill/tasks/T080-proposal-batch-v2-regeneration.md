# T080：确定性重建 37 项 Proposal Batch v2

- Status: `completed`
- PR: `PR 0 - Skill Eval Proposal 用户审核门`
- Depends On: T077, T078, T079
- Parallel: No。Batch Hash 必须绑定所有最终输入字节，任何上游语义变化都会使它失效。

## 为什么要做

旧 Batch ID 绑定 39 个含墙钟速度门的 Proposal，并引用四个已经删除的 no-auto 目录。即使只改一个 Protocol 字段，旧 SHA-256 也不能继续使用；否则用户表面批准的是新规则，实际 Hash 绑定的却是旧考卷。

本 Task 只重建可审核输入，不启动 Baseline，不把 Approval 偷改成 approved，也不评价任何 Skill 输出。

## 与旧 Batch 的比较

| 旧 Batch | 新 Batch |
|---|---|
| Batch ID 以 `batch-v1` 结尾 | 新 ID 使用 `batch-v2` |
| 38 个产品 case + 1 E2E | 36 个产品 case + 1 E2E |
| 展示四项速度上限 | 展示非计时 `criticalPath` |
| 固定说 14 个最终保留 Skill | 说明 14 个是候选，最终由 Baseline 和用户决定 |
| 引用已删除 no-auto 场景 | 绑定两个新的显式价值场景 |

## 文件边界

### Add

- `docs/specs/next_generation_skill/eval-proposal-batch-v2.json`

### Modify

- `docs/specs/next_generation_skill/eval-proposal-review.md`
- `test/test_eval_proposal_batch.py`
- 37 份 pending `proposal-approval.json` 的当前输入 Hash

### Remove

- 未获批准且已失效的 `eval-proposal-batch-v1.json`

### Must Not Add Or Modify

- Baseline、Scorecard、evidence
- 生产 Skill
- 历史 v1
- Approval 的 `decision: approved` 或虚构用户回复

## 实施细节

1. 生成器按目录名稳定排序，只收集当前 `protocolVersion: 2` 的目录。
2. Manifest 逐项绑定 Scenario 文件 Hash、Protocol 文件 Hash、Fixture tree Hash、业务 rubric、共享用户价值 rubric、`agentModel` 和 `criticalPath`。
3. 审核页的逐项生成区完全来自 Manifest，并为每个 Proposal 显示 Protocol 绑定的 Agent 模型；不能手工维护 37 份重复内容。
4. 审核页顶部用人话解释相对上一批的四类变化、批准范围、`control-pass` 和关键路径含义。
5. Batch SHA-256 对规范化 Manifest bytes 计算，并写回审核页。
6. 所有 Approval 保持 `pending`、`replyEvidence: null`；只有用户明确回复当前 Batch ID 与 Hash 后才可批准。

## 验证

- Proposal Batch 测试证明 Manifest 正好覆盖 37 个当前 v2 Proposal。
- 审核页的生成区、Batch ID 和 SHA-256 与 Manifest 一致。
- 每份 Approval 的三份输入 Hash 与 Manifest 一致。
- Manifest 不含历史 v1、删除目录或任何墙钟质量字段。
- Manifest 和审核页的 37 项 `agentModel` 全部来自当前 Protocol，且固定为 `gpt-5.6-terra`。
- 用户批准前没有 Baseline、Live Eval、Reviewer、网络或外部 API 运行。

## 完成标准

- 用户可以通过一个 Batch ID 和一个 SHA-256 审核完整 37 项确定字节。
- 批准只打开 Baseline Observation，不接受 Skill 输出，也不授权 Live Eval。
- 任一受绑定输入语义变化都会要求新 Hash 和重新审核。
