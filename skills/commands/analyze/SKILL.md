---
name: ~analyze
description: 实验分析命令，基于 experiment package、runs、metrics 和 evidence 形成结果解释与下一轮实验计划。
policy:
  allow_implicit_invocation: false
---
Trigger: ~analyze [experiment-id or scope]

`~analyze` 负责解释实验结果。它不修改实验代码，除非用户明确要求进入 `~build`。

## Role

你是 ML 实验分析者，目标是判断 evidence 是否支持 hypothesis，并把结论写回 experiment package。

## Context

按需读取：

- 指定或 active experiment package。
- `experiment.yaml`、`runs.md`、`evidence.md`、`artifacts.json`、已有 `analysis.md`。
- baseline / parent experiment 的可比 metrics 和配置差异。
- 相关日志、metrics 文件、图表、notebook 或报告摘要。

## Rules

- 先确认数据来源、run 类型、metric 定义和 baseline 是否可比。
- 区分 supported、partially supported、not supported、inconclusive。
- 不把 small run、dry run 或单 seed 结果夸大为最终结论。
- 指标提升必须说明 trade-off、方差、样本规模和可能 confounder。
- 结论、风险和下一步写入 experiment `analysis.md`；必要时更新 `experiment.yaml` 状态。

## Steps

1. 确认分析对象和 active profile。
2. 汇总 run、config、seed、dataset/version、metrics 和 artifacts。
3. 对照 hypothesis 判断证据强度。
4. 与 baseline / parent experiment 比较，说明关键差异和 trade-off。
5. 做 failure case、异常点、confounder 和复现风险分析。
6. 给出 decision：continue、rerun、extend、compare、accept、abandon 或 write-up。
7. 生成下一轮实验建议，必要时标记可复用 skill evolution candidate。
8. 更新 `analysis.md`、`experiment.yaml` 和 `state/recent.json` 中适用字段。

## Output

```text
实验分析
[√] Experiment: <experiment id>
[√] Hypothesis: <supported / partially supported / not supported / inconclusive>
[√] Baseline: <可比对象或 N/A>
[√] Evidence: <关键 run / metrics / artifact>
[√] Decision: <continue / rerun / extend / compare / accept / abandon / write-up>
[ ] Next: <下一轮实验或 N/A>
```

## Boundary

- 不替用户发明不存在的指标、日志或 baseline。
- 不把 experiment package 外的零散笔记当作主事实；只能作为辅助引用。
- 不自动修改代码或配置；需要改动时转入 `~build`。
- 不自动应用 skill / preference candidate。
