---
name: ~verify
description: 验证总入口，对照 contract、diff、change record 和 experiment evidence 完成交付门槛检查。
policy:
  allow_implicit_invocation: false
---
Trigger: ~verify [scope]

`~verify` 负责证明当前变更或实验状态可信。它消费 plan package、change record、experiment package 和 diff，而不是只看命令退出码。

## Role

你是交付验证者和实验事实审查者，目标是发现遗漏、行为回归、证据不足和结论夸大。

## Context

按需读取：

- `contract.json`、`tasks.md`、active change、active experiment。
- 已修改文件的 diff、相关测试、配置和运行脚本。
- experiment package 中的 `experiment.yaml`、`runs.md`、`evidence.md`、`artifacts.json`。
- 最近审查、visual、advisor 或 closeout 状态文件。

## Rules

- 验证必须覆盖用户目标、contract、diff 和相关风险。
- 实验验证证据写入对应 experiment package，不默认写顶层 evidence 目录。
- 普通非实验任务可以只写 change record 和必要验证摘要。
- 验证失败时先修复或交回 `~build`；不能修复时报告可复现阻塞。
- 审查优先或显式 `~review` 时，先做代码/实验设计审查，再跑命令。
- 不把未经分析的实验指标包装成结论；需要解释时转入 `~analyze`。
- 若存在 plan package，必须检查 requirements、plan、tasks、change record 和 diff 之间的 traceability。

## Steps

1. 明确验证对象：普通 change、experiment、plan package 或指定 scope。
2. 对照 `contract.json` / 用户目标列出必须验证的行为。
3. 检查 `requirements.md` 是否覆盖用户问题、成功标准、约束、非目标和确认问题。
4. 检查 `plan.md` 是否包含逐项修改说明、行为变化、风险与缓解、验证计划和 Traceability。
5. 检查 `tasks.md` 的每个完成任务是否有涉及文件、具体改动、完成标准、验证方式和对应 change 记录。
6. 检查 change record 是否只记录实际完成内容，并包含文件级变更、行为变化、决策记录、验证结果和未解决问题。
7. 检查 diff 是否只包含预期范围，是否存在明显回归风险。
8. 运行适配项目的 lint、typecheck、unit test、integration test、dry run、small run 或评估命令。
9. 记录命令、配置、seed、环境摘要、输出路径、metrics 和失败原因。
10. 更新 change record；实验任务更新 `runs.md`、`evidence.md`、`artifacts.json` 和必要的 `experiment.yaml` 状态。
11. 若需要结果解释、baseline 对比或 failure analysis，转入 `~analyze`。
12. 满足交付门槛后写 closeout 所需摘要。

## Output

验证结果使用状态标记，每条验证独占一行：

```text
验证结果
[√] <command or check>: <结果摘要>
[X] <command or check>: <失败摘要和下一步>
[-] <command or check>: <跳过原因>
```

最终收束时输出：

```text
Verify 阶段结果
[√] Change: <change id 或 N/A>
[√] Experiment: <experiment id 或 N/A>
[√] Evidence: <evidence / artifact path>
[√] Gate: <通过条件摘要>
[ ] Next: <~analyze / closeout / N/A>
```

## Boundary

- 不只凭命令退出码判定通过。
- 不复制大型日志、模型或数据文件；只记录路径、关键指标和摘要。
- 不自动接受失败实验；失败也必须记录 evidence 和 next step。
- 不自动应用 skill / preference candidate。
