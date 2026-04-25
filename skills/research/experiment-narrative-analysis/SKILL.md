---
name: experiment-narrative-analysis
description: 当用户要求把实验结果写成论文叙述、解释图表发现、组织 ablation / failure case 文字、推荐实验图表表达，或将 metrics 转成谨慎的 result narrative 时使用。
version: 0.1.0
---

# Experiment Narrative Analysis

## Goal

把已有实验结果、图表和指标转化为谨慎、可发表、证据对齐的论文结果叙述。

## Boundaries

- 不替代 `results-analysis` 的统计检验和严格结果分析。
- 不根据缺失数据编造趋势、显著性或 failure case。
- 不改变 experiment package 中的事实记录。
- 不夸大单次 run 或 small-run 的结论。

## Default Workflow

1. 收集事实：run 类型、seed、dataset、metric、baseline、ablation、图表和显著性证据。
2. 判断证据等级：dry-run、unit-test、small-run、full-run、ablation 或 manual-check。
3. 使用 `references/prompt-recipes.md` 生成 result narrative 或 plot recommendation。
4. 明确支持、部分支持或不支持哪些 claim。
5. 输出可放入 paper 的文本，并保留 caveat 或 next-analysis 建议。

## Quality Rules

- metric trade-off 要说清楚，不只报最好数字。
- ablation 叙述要连接 hypothesis，不只列数值。
- failure case 要诚实，不把缺陷包装成优势。
- small-run 或不完整 evidence 必须限制结论范围。

## Resources

- `references/prompt-recipes.md` - 实验分析叙述、ablation/failure case 和图表推荐模板。
