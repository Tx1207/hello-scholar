---
name: results-report
description: 当用户要求 “write an experiment report”、“summarize experimental results”、“do experiment retrospection”、“write a results report”、“写实验总结报告” 或 “写实验复盘”，或提到希望把已完成实验产物整理成结构化、面向决策的研究报告时使用该 skill。它假设严格分析应首先由 `results-analysis` 完成。
version: 0.1.0
tags: [Research, Reporting, Experiments, Obsidian]
---

# Results Report

在 analysis artifacts 准备好之后，撰写**完整的实验后总结报告**。

该 skill 适用于 `results-analysis` **之后**的阶段。

## 角色边界

### `results-analysis` 负责
- 严格统计
- 真实 figures
- 图表解释脚手架
- stats appendix

### `results-report` 负责
- 完整实验 wrap-up report
- 面向决策的叙事
- 在统一结构中的逐图解释
- limitations、failure cases 和 next actions
- 写回 Obsidian 的 `Results/Reports/`

不要用自信 prose 去替代严格分析。如果 analysis bundle 缺失，先识别阻塞项，再请求或生成缺失 bundle。

## 默认输出

默认报告是一份 **内部研究报告**，而不是 manuscript prose。

文件名应采用：

```text
YYYY-MM-DD--{experiment-line}--r{round}--{purpose}.md
```

示例：
- `2026-03-18--freezing--r03--transfer-summary.md`
- `2026-03-18--contrastive-adversarial--r02--ablation-report.md`

笔记标题应为：

```text
{Experiment Line} / Round {N} / {Purpose} / {YYYY-MM-DD}
```

最终确定文件名或标题前，先阅读 `references/report-naming.md`。

## 必需 frontmatter

```yaml
---
type: results-report
date: 2026-03-18
experiment_line: freezing
round: 3
purpose: transfer-summary
status: active
source_artifacts:
  - analysis-output/analysis-report.md
  - analysis-output/stats-appendix.md
linked_experiments:
  - Experiments/Freezing-Study.md
linked_results:
  - Results/Freezing-vs-Adapter.md
---
```

## 默认报告结构

报告必须包含以下全部 sections：

1. **Executive Summary**
2. **Experiment Identity and Decision Context**
3. **Setup and Evaluation Protocol**
4. **Main Findings**
5. **Statistical Validation**
6. **Figure-by-Figure Interpretation**
7. **Failure Cases / Negative Results / Limitations**
8. **What Changed Our Belief**
9. **Next Actions**
10. **Artifact and Reproducibility Index**

写作前请阅读 `references/report-structure.md`。

## 工作流

### 1. 确认报告对象

先锁定这些字段：
- date
- experiment line
- round
- purpose
- linked experiment note
- 如已存在，则锁定 durable result note

如果 round 不明确，不要静默捏造语义化轮次。可暂时使用 `r00` 占位，但要明确说明后续需要规范化。

### 2. 读取严格分析 bundle

最小必需输入：
- `analysis-report.md`
- `stats-appendix.md`
- `figure-catalog.md`
- 实际 figures（如可用）

如果这些内容缺失，要么先通过 `results-analysis` 生成，要么明确说明哪些 claims 无法被支撑。

### 3. 把报告写成一个决策对象

这份报告不是对输出的流水账记录。

每个 section 都必须回答一个真实问题：
- 我们测试了什么？
- 数值上发生了什么变化？
- 哪些结论真的被支撑？
- 什么失败了或仍然不确定？
- 下一步应该做什么？

关于需要达到的推理深度，阅读 `references/decision-oriented-analysis.md`。

### 4. 在报告内部解释 figures

不要只附图。

对每个主图：
- 说明为什么放这张图
- 指出关键观察
- 解释被支撑的结论
- 解释对决策的影响

必要时阅读 `references/figure-interpretation.md` 和 `references/statistical-completeness.md`。

### 5. 显式选择写入目标

如果当前 repo 已绑定 Obsidian project knowledge base：
- 创建或更新 `Results/Reports/{report-name}.md`
- 链接回对应的 `Experiments/` note
- 当稳定结论成立时，更新匹配的 canonical `Results/` note
- 在当天 `Daily/` note 中追加简短轨迹
- 更新 `hello-scholar/project-memory/<project_id>.md`

如果 repo **未绑定**：
- 在用户要求的输出位置，或 analysis bundle 邻近路径下，写出本地 markdown artifact
- 保持同样文件命名约定
- 明确说明没有尝试 Obsidian write-back

仅在 bound repo 中使用 `obsidian-project-memory` 约定。内部实验报告应放在 `Results/Reports/`，而不是 `Writing/`。

### 6. 以明确的 next actions 结尾

报告必须以操作性决策收尾，例如：
- 停止一条弱分支
- 安排一个缺失的 ablation
- 将稳定发现提升到 manuscript-facing writing
- 更新当前 active plan

## 必需质量标准

- 报告必须可按日期检索，并可归因到一个 experiment line 和一个 round
- 报告必须引用 analysis bundle 中的真实证据
- 当负面结果重要时，必须包含 negative results
- 报告必须区分稳定结论和暂时性解释
- 报告必须明确：项目认知发生了什么变化，接下来应做什么

## 参考文件

按需加载：
- `references/report-structure.md`
- `references/report-naming.md`
- `references/figure-interpretation.md`
- `references/statistical-completeness.md`
- `references/decision-oriented-analysis.md`
- `references/EVIDENCE-PROPAGATION.md`
- `examples/example-results-report.md`
