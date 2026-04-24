---
name: results-analysis
description: 当用户要求“analyze experimental results”、“run strict statistical analysis”、“compare model performance”、“generate scientific figures”、“check significance”、“do ablation analysis”，或提到要用严格统计与可视化解释实验数据时使用。该 skill 聚焦严格分析产物，不负责 Results 部分正文写作。
tags: [Research, Analysis, Statistics, Visualization, Scientific Reporting]
version: 0.2.0
---

# Results Analysis

为 ML/AI research 执行**严格、evidence-first 的实验结果分析**。

使用本 skill 产出一套**strict analysis bundle**：
- `analysis-report.md`
- `stats-appendix.md`
- `figure-catalog.md`
- `figures/`

**不要**用本 skill 去写论文的 `Results` 部分正文，也不要写完整实验总结报告。这些应交给 `ml-paper-writing` 或 `results-report`。

## Core contract

### 本 skill 负责
- 校验实验 artifact 与 comparison unit
- 执行严格的描述统计和推断统计
- 在有数据或日志时生成**真实 scientific figures**
- 为 figure 写明用途、caption 要求与 interpretation checklist
- 明确暴露限制、阻塞点和缺失证据

### 本 skill 不负责
- 可直接上论文的 `Results` prose
- 手稿叙事打磨
- 项目级实验 retrospective

如果用户要的是完整实验后总结报告，应在本 bundle 完成后切换到 `results-report`。

## Non-negotiable quality bar

1. **优先生成真实 figure，而不是 figure spec。**
   只要数据可读，就生成真实 figure，不要停在“推荐如何画图”。
2. **绝不编造统计结果。**
   如果 sample size、seed 或 raw metric 缺失，要明确写出阻塞点。
3. **报告完整统计。**
   不能只报 best score，也不能只报 p-value。
4. **解释每一个主 figure。**
   每个核心 figure 都必须包含用途、caption 要求和图后解释说明。
5. **把 evidence 和 prose 分开。**
   本 skill 只产出分析 artifact，不写 manuscript section。

## Standard workflow

### 1. Inventory and validate artifacts

先识别：
- metric 表（`csv`、`json`、`tsv`、logs）
- training curve 和 checkpoint
- seeds / repeated runs
- baseline、ablation 和 comparison family
- evaluation protocol metadata

然后验证：
- metric direction（越高越好还是越低越好）
- analysis unit（run、subject、fold、dataset、seed）
- run / seed 数量
- missing value 或 silent failure
- 方法之间是否可比

如果比较本身在统计上不成立，要先明确指出，再继续后续步骤。

### 2. Lock the comparison questions

跑统计前，先锁定明确的比较问题：
- 哪个方法与哪个 baseline 比？
- primary metric 是什么？
- repeated-measure unit 是什么？
- 哪些 ablation 或 robustness 问题最重要？
- 哪些发现会影响后续决策？

不要把无关比较混进一张大而无区分的表。

### 3. Run strict statistics

始终产出：
- 描述统计：适用时给出 `mean ± std`
- `95% CI` 或其他有明确理由的区间
- run / seed 数量
- 说明假设前提的 significance test
- effect size
- 多重比较修正（如果报告了多个 contrast）

默认要求：
- 先检查参数检验前提
- 前提不满足时使用非参数替代
- 明确说明“检验了什么、用的是什么样本”

参见：
- `references/statistical-methods.md`
- `references/statistical-reporting.md`

### 4. Generate real scientific figures

只要 artifact 可用，就要产出真实 figure。

一个非平凡 analysis bundle 的最低要求：
- **一张主 comparison figure**
- **一张支撑 figure**（training dynamics / ablation / breakdown / error analysis）
- **一张 markdown 精确数值汇总表**

每个主 figure 都必须定义：
- figure purpose
- plotted variables
- error bar 含义
- caption requirement
- interpretation checklist

参见：
- `references/visualization-best-practices.md`
- `references/figure-interpretation.md`

### 5. Write analysis artifacts

#### `analysis-report.md`

总结：
- 分析问题是什么
- 关键发现是什么
- 哪些比较得到最强支持
- 主要 caveat 是什么
- 这次分析如何改变了对实验的理解

#### `stats-appendix.md`

记录：
- 描述统计
- 检验选择
- 已检查的假设前提
- effect size
- confidence interval
- multiple comparison correction
- 明确列出 blocker 和 limitation

#### `figure-catalog.md`

为每个 figure 记录：
- filename
- purpose
- data source
- caption draft requirement
- key observation
- interpretation checklist
- known caveat

### 6. Final QA

在以下条件全部满足前，不要结束：
- [ ] primary comparison question 已明确
- [ ] sample size / seed count 已写明
- [ ] inferential test 有合理依据
- [ ] 主要 contrast 报告了 effect size
- [ ] 数据存在时已生成真实 figure
- [ ] 每个 figure 都有 interpretation note
- [ ] limitation 和 blocker 已明确
- [ ] 没有夹带 manuscript 风格的 `Results` 草稿

## Output structure

```text
analysis-output/
├── analysis-report.md
├── stats-appendix.md
├── figure-catalog.md
└── figures/
    ├── figure-01-main-comparison.pdf
    ├── figure-02-ablation.pdf
    └── ...
```

## Figure interpretation rule

对每一个主要 figure，都要回答这三个问题：
1. **为什么要有这张图？**
2. **读者应该准确注意到什么？**
3. **这个观察改变了我们什么判断或下一步决策？**

如果一张图答不出第 3 个问题，它很可能只是装饰图，而不是科学图。

## Failure mode policy

输入不完整时，必须直接说明。

例如：
- 没有 seed-level data -> 只能做描述性总结，推断性结论被阻塞
- 没有可比 baseline 输出 -> 不能做 significance claim
- 没有可读日志 -> 无法生成 dynamics figure
- run 数太少 -> effect size 可能不稳定，必须写出这一限制

绝不能用自信 prose 去填补缺失证据。

## Reference files

只按需加载：
- `references/statistical-methods.md` - 检验选择与假设前提
- `references/statistical-reporting.md` - 最低报告标准
- `references/visualization-best-practices.md` - 发表级 figure 规范
- `references/figure-interpretation.md` - 如何基于 evidence 解释图
- `references/analysis-depth.md` - 如何从观察推进到机制与决策
- `references/common-pitfalls.md` - 常见分析与报告错误

## Example files

- `examples/example-analysis-report.md`
- `examples/example-stats-appendix.md`
- `examples/example-figure-catalog.md`
