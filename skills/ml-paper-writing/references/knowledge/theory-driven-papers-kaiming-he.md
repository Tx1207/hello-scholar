# 理论驱动型论文：From First Principles

**来源**：Kaiming He 等，`Mean Flows for One-step Generative Modeling`

**论文类型**：theory-driven / first-principles paper

**核心模式**：从 first principles 出发 -> 推导理论对象 -> 用该理论构造方法 -> 再证明结果优于 heuristic approaches

## 摘要结构

常见框架：

1. 先用较轻的语气介绍已建立框架
2. 点出近期研究在某个 challenge 上很活跃
3. 用 `Despite encouraging results...` 进入 critique
4. 介绍新概念，并与旧概念形成 `in contrast to`
5. 强调理论是 `solely originated from` 定义推出来的
6. 说明它提供了 `principled basis`
7. 给出强 quantitative result
8. 再补充 independence / self-contained 优势

## 引言框架

理论驱动型论文经常采用 **critique-first**：

1. 先承认已有框架有效
2. 再指出现有方法的核心不足不在结果，而在理论基础
3. 说明 heuristic constraint 是“imposed”的
4. 引入新的 ground-truth object 或 theoretical relation
5. 从 first principles 推导关键 identity
6. 说明这比 heuristic 更 principled

典型关键词：

- `intrinsic`
- `well-defined`
- `principled`
- `naturally`
- `does not depend on`
- `self-contained`

## Methods 叙事

推荐模式：**Define -> Derive -> Name**

1. 先给概念命名
2. 用文本解释为什么需要它
3. 再给公式
4. 一步一步推导，不跳步
5. 把关键方程命名成 `X Identity`

这会让理论对象更容易被 reviewer 和记住。

## 与 prior work 的对比

理论型论文常见的对比方式不是指标本身，而是：

- 你基于 first principles
- 对方基于 heuristic constraints
- 你的核心 relation 不依赖具体 neural network 实现
- 对方的约束是 imposed on the network behavior

这类差异最好写成概念层面的对比，而不是情绪化贬低。

## 结果写法

结果部分不仅报告指标，还应强调：

- relative improvement
- independence from external components
- from scratch training
- 不需要 pre-training / distillation / curriculum learning

理论型论文常见强句式：

- `significantly outperforms`
- `by a relative margin of X to Y`
- `trained entirely from scratch`
- `without any pre-training, distillation, or curriculum learning`

## Ablation

理论型论文很适合做 **destructive ablation**：

- 故意把关键项算错
- 证明只有正确理论关系才有效

这种 ablation 对“为什么这个理论对象必要”非常有帮助。

## 图表与表格

适合：

- 按 paradigm 分组的 system-level comparison
- 主图展示视觉结果或主趋势
- 表格同时展示 params、NFE、FID 等多个维度
- 用 figure caption 自己讲清故事，而不是只放图

## 理论型用词建议

### 推荐

- `principled`
- `intrinsic`
- `well-defined`
- `naturally`
- `independent of`
- `self-contained`
- `from first principles`

### 避免

- `revolutionary`
- `breakthrough`
- `completely eliminates`

更稳妥的替代：

- `significantly outperforms`
- `substantial improvement`

## 常见错误

不要：

- 只推导，不解释为什么要这么推导
- 在关键推导处跳步
- 用 heuristic 但假装自己是纯理论
- 过度宣称成“证明最优”

应该：

- 明确从 first principles 出发
- 为关键 identity 命名
- 用 destructive ablation 验证必要性
- 同时强调理论价值和系统结果
