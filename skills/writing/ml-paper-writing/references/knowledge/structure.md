# 论文结构模式

本文档汇总可执行的 ML 会议论文组织模式，提炼自成功发表的论文。

## 引言模式

### 模式：Contribution Statement Structure

**适用场景：** 在引言中引入核心贡献

**结构：**

1. 从更宽的背景或问题切入
2. 收缩到具体限制
3. 把你的方法呈现为解决方案
4. 直接说清楚贡献

**模板：**

```markdown
[Context/Problem]: Existing approaches struggle with [limitation] due to [reason].

[Our Approach]: We propose [method name], which [key innovation].

[Contribution]: This achieves [result] and enables [capability].
```

### 模式：Bulleted Contribution List

**适用场景：** 需要清晰列出多项贡献，方便 reviewer 快速抓住重点

建议：

- 放在引言末尾附近
- 用 2-4 个 bullets
- 每条尽量 1-2 行
- 用强动词开头，如 `We propose`、`We demonstrate`、`We show`

### 模式：Related Work Organization

**适用场景：** 组织 related work

原则：

- 按方法学组织，不按时间线流水账
- 把论文按 approach / assumption 分组
- 对每组说明你的方法如何不同
- 多用 “One line of work uses X whereas we use Y because...” 这种对比式表达

## 方法部分模式

### 模式：Algorithm Presentation

适合新算法或优化方法：

1. 先给高层 overview
2. 再给数学形式化
3. 若复杂则给 pseudocode
4. 最后补 implementation details

### 模式：Component Breakdown

适合多组件架构：

- 先给整体 architecture
- 再拆成关键 components
- 说明每个组件的角色
- 最后解释它们如何组合

## Results 部分模式

### 模式：Quantitative Opening

开 Results 时，优先先摆出最强 quantitative result：

- 用精确数字和指标
- 对比 baselines
- 说明 statistical significance

### 模式：Table Integration

表格呈现时建议：

- 每列最优结果加粗
- 标明指标方向（↑ / ↓）
- caption 自包含
- 正文先引用表，再解释表

## Discussion 模式

### 模式：Limitations First

在讨论限制时：

- 第一段直接说 limitation
- 说明 limitation 为什么不推翻核心 claim
- 把 limitation 与 future work 分开

### 模式：Broader Impact Framing

结尾常见结构：

1. 直接影响
2. 推广到相关领域
3. 如有必要讨论社会影响
4. 以前瞻性表述结束

## 章节过渡模式

常见转场：

- Introduction -> Methods：`We now describe our approach.`
- Methods -> Results：`We evaluate our method on [tasks].`
- Results -> Discussion：`These results suggest that [insight].`

## 写作提醒

- **Consistency**：术语保持一致
- **Flow**：每个 section 都要自然引到下一个
- **Clarity**：通过 signposting 把结构显式写出来
- **Audience**：默认读者是疲惫 reviewer，要让他们读起来省力

## 何凯明（Kaiming He）的结构模式

基于其代表性论文可归纳出：

### 摘要

- 直接陈述贡献
- 或采用问题 -> 解决方案模式

例如 ResNet 的开头就是：

```text
Deeper neural networks are more difficult to train. We present a residual learning framework ...
```

### 引言

常见三段式：

1. 问题陈述
2. 方法概述
3. contribution list

### 方法部分

常见顺序：

1. 符号定义
2. 问题形式化
3. 方法描述
4. 实现细节

### 实验部分

常见顺序：

1. 实验设置
2. 主要结果
3. 消融实验
4. 可视化分析
