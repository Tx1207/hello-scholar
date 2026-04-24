# “Rethinking” 型论文：挑战既有常识

**来源**：Kaiming He 等，`Autoregressive Image Generation without Vector Quantization`（NeurIPS 2024 Spotlight）

**论文类型**：paradigm-challenging / rethinking paper

**核心模式**：指出 widely-held assumption -> 提出更本质的重述 -> 给出替代方案 -> 证明它有效

## 摘要模式

常见骨架：

1. `Conventional wisdom holds that ...`
2. `We observe that ...`
3. `Is it necessary for ... ?`
4. `In this work, we propose ...`
5. `Rather than ... , we ...`
6. `This approach ...`
7. `We hope this work will ...`

这种结构的好处是：

- 先尊重地承认主流认知
- 再指出 nuance 或反例
- 用一个尖锐问题把读者拉进来
- 最后把自己的方法当成一种概念重述而不是孤立技巧

## 引言框架

适合 “rethinking” 论文的引言通常不是从“这个任务很重要”开始，而是从“这个领域默认相信某件事”开始。

推荐顺序：

1. 建立背景
2. 点出 prevailing belief
3. 把 belief 的具体后果讲出来
4. 提出明确问题：`Is X necessary?`
5. 分析真正必要的东西是什么
6. 提出 alternative framing
7. 给出 broader implication

## 核心写法

### 区分机制与实现

rethinking 论文的关键不是说以前的人都错了，而是说明：

- 某个**实现**被误当成了**本质**
- 真正必要的是更抽象的 requirement

常见表达：

- `X is not a necessity for Y.`
- `What is needed is ...`
- `The concept of X is orthogonal to Y.`
- `This prevailing approach has led to a widespread belief that ...`

## “Rethinking X” 专门章节

如果你在挑战既有常识，最好专门开一节来重新审视 status quo。

推荐结构：

1. 数学化定义传统方法
2. 提取它真正满足的 essential properties
3. 说明这些性质并不依赖传统实现
4. 给出你的替代实现

## 统一不同方法

这类论文常常还会做一件事：把看似不同的方法统一到一个更高层框架下。

适合的结构：

1. 先指出两种方法看似不同
2. 再指出它们共享同一个 core principle
3. 分别说明它们只是不同 implementation
4. 给这个 generalization 命名
5. 解释这种统一带来了什么新可能

## 结果叙事

Results 需要直接对应“rethinking claim”，而不只是堆性能表。

可以重点展示：

- 替代方案确实可行
- 它在多个配置下都有 flexibility
- 它开启了新的 speed / accuracy trade-off
- 它在系统级比较中并不落后，甚至更优

适合的表达：

- `This reveals a largely uncharted realm of ...`
- `This suggests new opportunities for ...`
- `Unlike the common usage of ...`

## Limitations 的写法

rethinking 论文尤其需要诚实，因为它本身就在挑战共识。

应主动承认：

- 目前只在有限 benchmark 上验证
- 依赖某些外部组件
- 视觉 / 生成质量仍与商业系统存在差距
- 还需要更大规模验证

## 语气特点

好的 “rethinking” 论文通常具备：

1. **尊重但坚定**
2. **经验与理论结合**
3. **概念上精确**
4. **claim 有边界**

常见好词：

- `conventional wisdom holds that`
- `we observe that`
- `is not a necessity`
- `what is actually needed`
- `conceptually`
- `suggests`
- `can be`

避免：

- `wrong`
- `obviously`
- `completely proves`
- `everyone has overlooked`

## 常见错误

不要：

- 把 prior work 写成“全都错了”
- 没有 rigorous analysis 就直接挑战共识
- 只讲概念，不给强实验
- 对 alternative 讲得太抽象

应该：

- 说明主流认知为什么会出现
- 给出明确定义和重述
- 用实验、图和表去验证这种重述
- 用 measured language 来写强 claim
