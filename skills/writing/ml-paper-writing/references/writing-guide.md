# ML 论文写作哲学与最佳实践

本参考汇总 Neel Nanda、Andrej Karpathy、Sebastian Farquhar、Zachary Lipton、Jacob Steinhardt、Ethan Perez 等研究者的写作建议。

## 叙事原则

一篇论文不是实验日志堆砌，而是一篇**短、严谨、证据驱动的技术故事**。引言结束前必须把三件事讲清：

- **What**：你到底提出了什么具体 claim
- **Why**：为什么证据足以支撑这些 claim
- **So What**：为什么社区应该在意

如果你不能用一句话说清贡献，通常说明论文核心还没收拢。

## 时间分配

抽象地说，应该把大致相同的时间投入到：

1. abstract
2. introduction
3. figures
4. 其余部分总和

原因很简单：很多 reviewer 在看到 methods 之前，已经根据 title、abstract、introduction 和 figures 形成了初步判断。

## Abstract 写法

推荐 5 句公式：

1. 你做成了什么
2. 为什么这件事难且重要
3. 你怎么做的
4. 你有什么证据
5. 最重要的结果数字

避免通用开场，例如：

- “Large language models have achieved remarkable success...”
- “Deep learning has revolutionized...”

应直接从你的具体贡献切入。

## Introduction 结构

建议控制在双栏 1-1.5 页，methods 最迟应在第 2-3 页开始。

推荐结构：

1. Opening hook：问题和为什么现在重要
2. Background / challenge：为什么难，现有方法哪里不够
3. Your approach：你的核心 insight
4. Contribution bullets：2-4 条，具体且可证伪
5. Results preview：最重要的结果和评估范围
6. Paper organization：可选

好的 contribution bullet：

- We prove that X converges in O(n log n) time under assumption Y
- We introduce Z, a 3-layer architecture that reduces memory by 40%
- We demonstrate that A outperforms B by 15% on benchmark C

差的 contribution bullet：

- We study the problem of X
- We provide extensive experiments
- We make several contributions

## 句子层面的清晰度

### Gopen & Swan 原则

- 主语和谓语尽量靠近
- 重要信息放句尾（stress position）
- 句首先放上下文（topic position）
- old information 在前，new information 在后
- 一个句子 / 段落只承担一个主要功能
- 动作用动词表达，不要全变成名词化短语
- 新信息前先给上下文

### 微观写作建议

- 少用模糊代词：`this`、`it`、`these`
- 动词尽量靠前
- 一句只表达一个主要意思
- 用主动语态
- 少用无意义连接词和口语填充

## 词汇选择与精确性

优先精确而不是泛泛：

| 模糊表达 | 更精确表达 |
|----------|------------|
| performance | accuracy、latency、throughput |
| improves | increases accuracy by X%、reduces latency by Y |
| large | 1B parameters、100M tokens |
| fast | 3x faster、50ms latency |
| good results | 92% accuracy、0.85 F1 |

保持术语一致，不要来回切换：

- model / network / architecture
- training / learning / optimization
- sample / example / instance

同时尽量少用削弱语气的 hedging，除非真的存在不确定性。

## 数学写作

- theorem 前先写清楚 assumptions
- proof 旁边给 intuitive explanation
- notation 全文统一
- 符号第一次出现就定义

常见惯例：

```latex
% Scalars
$x$, $y$, $\alpha$

% Vectors
$\mathbf{x}$, $\mathbf{v}$

% Matrices
$\mathbf{W}$, $\mathbf{X}$

% Sets
$\mathcal{X}$, $\mathcal{D}$
```

## Figure 设计

Figure 要在读者跳过正文时也能讲出核心故事。

原则：

- Figure 1 很关键
- caption 必须自包含
- 图里通常不要再塞 title
- 优先使用 vector graphics（PDF/EPS）
- 使用 colorblind-safe palette，如 Okabe-Ito
- 不要只靠红绿区分
- 灰度打印下也要能看懂

## 常见错误

### 结构错误

- 引言过长
- methods 太晚出现
- 没有明确 contribution bullets
- 实验没有对应 claim

### 写作错误

- generic opening
- 术语不一致
- 被动语态过多
- 过度 hedging

### 图表错误

- plots 用 raster 而不是 vector
- 红绿色方案
- 图内标题过多
- caption 不自包含

### 引用错误

- Related Work 逐篇流水账
- 漏掉关键相关工作
- 使用未验证的 AI citations
- citation key / bibliography 风格不一致

## 投稿前检查

### Narrative
- [ ] 能用一句话说清 contribution
- [ ] 引言把 What / Why / So What 讲清
- [ ] 每个实验都支撑一个具体 claim

### Structure
- [ ] Abstract 近似 5 句结构
- [ ] Introduction 不超过 1-1.5 页
- [ ] Methods 在第 2-3 页前后开始
- [ ] 有 2-4 条具体 contribution bullets
- [ ] 有 Limitations section

### Writing
- [ ] 术语一致
- [ ] 没有 generic opening
- [ ] 不必要 hedging 已删
- [ ] 所有 figures 都有自包含 caption

### Technical
- [ ] 所有 citations 已验证
- [ ] error bars 和方法已说明
- [ ] compute resources 已记录
- [ ] code / data availability 已说明
