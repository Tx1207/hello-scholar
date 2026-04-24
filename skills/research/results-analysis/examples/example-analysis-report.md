# 严格分析报告

## 分析问题
- 在 cross-subject decoding 上比较 Full Model、Frozen Encoder 和 Subject Adapter。
- 判断 adapter 是否在不牺牲稳定性的情况下缩小 transfer gap。

## 数据清单
- 3 model families
- 5 random seeds per family
- subject-level WER and CER
- training logs for convergence
- ablation outputs for adapter width

## 执行摘要
- Subject Adapter 相比 Frozen Encoder 的 mean WER 绝对降低 3.8 点。
- 多重比较校正后，配对检验显示该提升具有统计显著性。
- Full fine-tuning 整体仍最强，但 Subject Adapter 提供了最佳 compute-performance tradeoff。
- 性能方差低于 Frozen Encoder，说明 transfer path 更稳定。

## 主要发现

### 1. 主对比
- Full fine-tuning: `31.4 ± 1.9` WER
- Subject Adapter: `33.2 ± 1.3` WER
- Frozen Encoder: `37.0 ± 2.1` WER

观察：
- Subject Adapter 在全部 5 个 seed 上都稳定优于 Frozen Encoder。

解释：
- transfer bottleneck 不只是 feature reuse 问题；轻量 adaptation head 捕捉到了纯 freezing 会漏掉的 subject-specific alignment。

影响：
- 后续应优先探索 adapter 变体，再考虑投入更重的 full-model tuning。

### 2. 稳定性
- Subject Adapter 在 transfer-friendly 方法中 seed 方差最小。
- 收敛曲线在第 8 个 epoch 后振荡更少。

解释：
- Adapter tuning 不仅平均效果更好，也更容易优化。

### 3. 消融
- 将 adapter width 从 256 降到 64 会使 WER 变差 1.6 点。
- 从 256 增加到 512 只带来边际提升。

解释：
- 中等宽度已经捕捉到大部分收益；scale-up 不是当前瓶颈。

## 注意事项
- 只有 5 个 seed；对尾部分布的推断仍然有限。
- subject 数量不大，因此 subject-level heterogeneity 可能仍被低估。
- 训练时间对比依赖相同硬件假设。

## 建议下一步
- 将该发现推进为聚焦 adapter vs freezing 的 `results-report` 笔记。
- 在 held-out low-resource subjects 上补一轮鲁棒性检查。
