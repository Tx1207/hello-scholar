# 统计报告标准

## 最小报告包

每个主要对比都要报告：
- 指标定义和方向，
- 分析单元，
- 样本量 / 运行次数，
- 描述性统计，
- 不确定性估计，
- 推断检验，
- 效应量，
- 存在多组对比时的校正策略，
- 假设条件或样本量较弱时的限制。

## 必需字段

### 描述性
- `mean ± std` when repeated runs are comparable
- `95% CI` when inference is discussed
- median / IQR when distribution is strongly non-normal

### 推断性
- 精确的检验名称
- 适用时报告检验统计量和自由度
- p-value 格式
- 效应量
- 多重比较校正方法

## 不要这样做
- 只报告 best run
- 只报告 p-value
- 隐藏不显著的对比
- 把不稳定趋势当结论
- 切换检验方法却不说明原因

## 默认措辞规则

使用三层表达：
1. **Observation**：数值上发生了什么变化
2. **Support**：检验结果 / 效应量说明了什么
3. **Boundary**：仍有哪些不确定性
