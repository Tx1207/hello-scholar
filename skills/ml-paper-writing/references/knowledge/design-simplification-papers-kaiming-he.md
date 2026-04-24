# 设计简化型论文：Less Is More

**来源**：Kaiming He 等，`Exploring Plain Vision Transformer Backbones for Object Detection`（ViTDet, 2022）

**论文类型**：design simplification / minimal adaptations

**核心模式**：挑战设计假设 -> 尽量减少改动 -> 展示出人意料的有效性 -> 做公平对比

## 摘要结构

适合采用：

1. 先说明领域中的 conventional design
2. 再指出新技术带来的冲突
3. 说明常见解决方案往往通过引入复杂性来妥协
4. 提出你的 different direction：**minimal approach**
5. 用 `Surprisingly, we observe: (i)... and (ii)...` 抛出第一层 surprise
6. 再用 `More surprisingly...` 抛出更强 claim
7. 最后强调设计解耦、简洁性或可迁移性

关键词：

- `minimal`
- `simple`
- `plain`
- `sufficient`
- `decouple`
- `independence`

避免：

- `optimal`
- 过度攻击常规设计
- 无条件绝对化表述

## 引言框架

常见顺序：

1. 建立传统实践
2. 解释其历史形成原因
3. 引出新技术特征与旧设计之间的冲突
4. 承认主流折中方案有效，但指出其代价
5. 明确说：`we pursue a different direction`
6. 强调 minimal adaptation 的哲学
7. 用 surprise findings 提高可记忆性

## Methods 叙事

设计简化型论文的 Methods 通常强调：

- 我们**不**打算发明一堆新组件
- 我们只做 overcoming challenges 所必需的 minimal adaptations
- 这些改动只发生在必要阶段（如 fine-tuning）
- 它们不破坏上游预训练结构

常用句式：

- `we do not aim to develop new components`
- `minimal adaptations`
- `only during fine-tuning`
- `do not alter pre-training`
- `in contrast to`

## 公平比较

这种论文必须非常重视 fair comparison。

应明确写：

- 为所有 backbone 使用同一实现框架
- 对每个 baseline 分别搜索合理 hyperparameters
- 能够较好复现竞争方法的结果
- 因而比较是 fair 的

## Results 叙事

除了主指标，还应强调：

- scaling behavior
- wall-clock performance
- hardware friendliness
- simpler blocks 带来的实际收益

适合的表达：

- `presents better scaling behavior`
- `under some circumstances`
- `can compete with`
- `better wall-clock performance`

## “Surprisingly” 的分层用法

### 第一层

- `Surprisingly, we observe: (i)... and (ii)...`

用于两个反直觉但较基础的发现。

### 第二层

- `More surprisingly, under some circumstances, ...`

用于更强但仍受条件限制的结论。

### 第三层

- `Interestingly, ...`
- `Notably, ...`
- `It is worth noting that ...`

用于模式观察、重要细节或 caveat。

## Ablation 设计

设计简化型论文常见两类 ablation：

1. **Incremental progression**
   - baseline
   - (a)
   - (b)
   - (c) ours: simple
2. **Destructive comparison**
   - 故意使用错误选择，证明正确设计是必要的

写法上最好形成：

- baseline -> progressive variants -> ours is sufficient

## 常见写法关键词

### 哲学关键词

- `minimal adaptations`
- `simple feature pyramid`
- `plain backbone`
- `fewer inductive biases`
- `independence of upstream vs downstream`

### 方向性关键词

- `pursue a different direction`
- `in contrast to`
- `abandons`
- `enables`

### 谨慎 claim 关键词

- `under some circumstances`
- `can compete with`
- `more prominent for`
- `is sufficient`

## 常见错误

不要：

- 把方法说成 `optimal`
- 对主流做法直接开火
- 忽略 fair comparison
- 隐藏自己不擅长的设置

应该：

- 先承认常规做法的价值
- 强调 minimal change
- 用 `sufficient` 而非 `optimal`
- 清楚说明赢在哪些条件下成立
- 证明对 baseline 也付出了足够对齐努力
