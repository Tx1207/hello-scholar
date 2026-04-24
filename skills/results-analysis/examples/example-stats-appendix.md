# 统计附录

## 主要指标
- Word Error Rate（WER），越低越好。

## 样本结构
- 分析单元：seed-level run，按共享数据划分和 subject pool 配对。
- 每个条件的 seed 数量：5。

## 描述性统计

| Condition | Mean WER | Std | 95% CI |
|---|---:|---:|---:|
| Full fine-tuning | 31.4 | 1.9 | [29.8, 33.0] |
| Subject Adapter | 33.2 | 1.3 | [32.1, 34.3] |
| Frozen Encoder | 37.0 | 2.1 | [35.1, 38.9] |

## 假设检查
- Shapiro-Wilk on paired differences: `p = 0.19`
- 对主要对比，没有强证据反对正态性假设。
- 鉴于 n 较小，解释保持保守。

## 推断检验

| Contrast | Test | Statistic | p | Effect size | Correction |
|---|---|---|---:|---:|---|
| Subject Adapter vs Frozen Encoder | paired t-test | `t(4) = -4.11` | 0.014 | Cohen's `d = 1.84` | Holm |
| Full fine-tuning vs Subject Adapter | paired t-test | `t(4) = -2.03` | 0.112 | Cohen's `d = 0.91` | Holm |

## 解释边界
- 第一组对比在校正后仍得到支持。
- 第二组对比趋势偏向 full fine-tuning，但在当前样本量下尚无定论。

## 阻塞项 / 限制
- 尚未做 subject-level bootstrap。
- 暂无 calibration analysis。
