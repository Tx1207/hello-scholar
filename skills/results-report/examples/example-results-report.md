---
type: results-report
date: 2026-03-18
experiment_line: freezing
round: 3
purpose: transfer-summary
status: active
source_artifacts:
  - analysis-output/analysis-report.md
  - analysis-output/stats-appendix.md
  - analysis-output/figure-catalog.md
linked_experiments:
  - Experiments/Freezing-vs-Adapter.md
linked_results:
  - Results/Adapter-Improves-Transfer.md
---

# Freezing / Round 3 / transfer-summary / 2026-03-18

## 执行摘要
- Round 3 测试 subject adapter 是否能恢复“冻结大部分 encoder”带来的性能损失。
- 每个条件 5 个 seeds，adapter 相比 frozen encoder baseline 将平均 WER 降低了 **3.8 个绝对点**。
- 当前证据支持继续保留 adapter branch，而 pure freezing 应降低优先级。

## 实验身份与决策上下文
- Experiment line：freezing
- Round：3
- Purpose：判断 freezing gap 更适合用 lightweight adaptation 解决，还是直接放弃 freezing branch。
- Decision pressure：在安排下一个 low-resource run block 前，需要选择下一条 transfer branch。

## 设置与评估协议
- subject pool 和 split 与 rounds 1-2 相同。
- 每个条件 5 个 seeds。
- 主指标：WER，越低越好。
- 对比方法：Full fine-tuning、Subject Adapter、Frozen Encoder。
- 统计单元：seed-level final WER。

## 主要发现
- Subject Adapter：**27.6 ± 1.0 WER**，95% CI **[26.4, 28.8]**。
- Frozen Encoder：**31.4 ± 1.5 WER**，95% CI **[29.6, 33.2]**。
- Full fine-tuning：**25.9 ± 0.8 WER**，95% CI **[24.9, 26.9]**。
- Adapter 在全部 5 个 paired seed comparisons 中都优于 Frozen Encoder。

## 统计验证
- Adapter vs Frozen Encoder：paired Wilcoxon signed-rank test，**p = 0.031**，Holm-corrected **p = 0.047**，matched-rank biserial effect size **r = 0.90**。
- Full fine-tuning vs Adapter：paired t-test，**p = 0.11**，Cohen's **d = 0.64**。
- 解释：在当前 `n = 5` 下，adapter 相对 pure freezing 的收益已有支持；与 full fine-tuning 的差距方向一致但统计功效仍不足。
- 不支持的 claim 边界：本报告不声称能泛化到当前 subject pool 或 low-resource regime 之外。

## 逐图解释

### Figure 1 - 主对比
- 纳入原因：这是核心决策图。
- 承载证据：mean WER、95% CI 和 paired-seed comparisons。
- 支持解释：lightweight subject adaptation 关闭了大部分 freezing gap。
- 决策含义：后续 transfer 实验应聚焦 adapter design，而不是 frozen-only variants。

### Figure 2 - 训练动态
- 纳入原因：解释稳定性差异。
- 承载证据：跨 seeds 的 per-epoch validation traces。
- 支持解释：frozen baseline 在 epoch 8 后震荡更明显，与更宽的 uncertainty interval 一致。
- 决策含义：该 branch 的弱点不只是 final accuracy 更低，也包括 optimization stability 更差。

## 失败案例 / 负结果 / 局限
- Full fine-tuning 在绝对 WER 上仍领先。
- 证据只覆盖一个 subject pool 和 5 个 seeds。
- 还没有 low-resource stress test 或 out-of-domain subject split。
- 本轮 adapter width 固定，capacity trade-off 仍未解决。

## 哪些结果改变了我们的判断
- Round 3 之前，完全放弃 freezing 仍是合理假设。
- Round 3 之后，更合理的判断是：freezing alone 过于僵硬，但 freezing + lightweight adaptation 仍有希望。

## 下一步
- 为 adapter branch 跑一个 low-resource robustness check。
- 围绕当前最佳 adapter size 做 width ablation。
- 更新 canonical result note：adapter-improves-transfer。

## Artifact 与可复现索引
- `analysis-output/analysis-report.md`
- `analysis-output/stats-appendix.md`
- `analysis-output/figure-catalog.md`
- `analysis-output/figures/figure-01-main-comparison.pdf`
- `analysis-output/figures/figure-02-training-dynamics.pdf`
