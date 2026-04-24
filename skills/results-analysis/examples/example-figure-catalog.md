# 图表目录

# Figure 1 — 主对比
- **文件名**: `figures/figure-01-main-comparison.pdf`
- **用途**: 比较 Full fine-tuning、Subject Adapter 和 Frozen Encoder 的 WER。
- **数据来源**: `metrics/summary.csv`
- **图类型**: 柱状图 + seed-level 点的散点叠加。
- **误差条**: 95% CI。
- **Caption 必须包含**:
  - metric direction,
  - number of seeds,
  - meaning of error bars,
  - whether significance markers are corrected.
- **关键观察**: Subject Adapter 缩小了大部分 freezing gap。
- **解释检查清单**:
  - Is the adapter improvement consistent across seeds?
  - Is the gap practically meaningful, not just statistically significant?
  - Does the figure support a design decision?

## Figure 2 — 收敛动态
- **文件名**: `figures/figure-02-training-dynamics.pdf`
- **用途**: 比较不同 epoch 上的优化稳定性。
- **数据来源**: `logs/train_curves.csv`
- **图类型**: 均值曲线 + 不确定性带。
- **Caption 必须包含**:
  - smoothing rule if any,
  - whether ribbon is std or CI,
  - training/eval split.
- **关键观察**: Frozen Encoder 在第 8 个 epoch 后振荡更大。
- **解释检查清单**:
  - Is instability transient or persistent?
  - Does curve shape match final metric variance?
  - Does this explain why one method is harder to tune?
