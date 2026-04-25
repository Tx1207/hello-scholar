---
name: ml-paper-writing
description: 为 NeurIPS、ICML、ICLR、ACL、AAAI、COLM 撰写 publication-ready 的 ML/AI 论文。用于从 research repo 起草论文、做 literature review、寻找 related work、验证 citation，或准备 camera-ready submission。包含 LaTeX template、citation verification workflow 和论文发现 / 评估标准。
version: 1.0.0
author: Orchestra Research
license: MIT
tags: [Academic Writing, NeurIPS, ICML, ICLR, ACL, AAAI, COLM, LaTeX, Paper Writing, Citations, Research]
dependencies: [semanticscholar, arxiv, habanero, requests]
---

# ML Paper Writing for Top AI Conferences

面向 **NeurIPS、ICML、ICLR、ACL、AAAI、COLM** 的 ML/AI 论文写作指南。该 skill 结合顶级研究者的写作理念（Nanda、Farquhar、Karpathy、Lipton、Steinhardt）与实际工具：LaTeX template、citation verification API、conference checklist。

## Default Operating Order

除非任务非常窄，否则按以下顺序执行：

1. 先从 `references/OPERATING-MODES.md` 锁定当前 operating mode
2. 理解 repo 或 draft 的上下文
3. 把 `references/citation-workflow.md` 作为**唯一默认 citation authority**
4. 主写作路径明确后，再加载 venue / template 相关 reference

Google Scholar 可以作为人工发现入口，但不是本 skill 的 canonical verification authority。默认验证应使用 Semantic Scholar、CrossRef、arXiv 等 programmatic sources。

## Core Philosophy: Collaborative Writing

**论文写作是协作过程，但 Claude 应主动交付草稿。**

典型输入是一个 research repository，其中包含代码、结果和实验 artifact。Claude 的职责是：

1. 探索 repo、结果和已有文档，理解项目
2. 当 contribution 足够清楚时，直接交付完整 first draft
3. 用 web search 和 API 搜索相关文献
4. 根据 scientist 反馈迭代
5. 只有关键决策确实不确定时才提问

**关键原则**：主动交付。repo 和结果清楚时，不要逐节等待确认；先给出可反应的完整草稿，再迭代。

## Critical Rule: Never Hallucinate Citations

AI 生成引用有很高错误率。虚构论文、错误作者、错误年份、伪造 DOI 都属于严重学术风险，可能导致 desk rejection 或 retraction。

**绝不要凭记忆生成 BibTeX。必须程序化查询、验证、导出。**

| Situation | Action |
|-----------|--------|
| 添加引用 | Search API → verify → fetch BibTeX |
| 不确定论文是否存在 | 标记 `[CITATION NEEDED]` |
| 找不到精确论文 | 标记 placeholder，不要编 |

无法验证时使用显式占位：

```latex
% EXPLICIT PLACEHOLDER - requires human verification
\cite{PLACEHOLDER_author2024_verify_this}  % TODO: Verify this citation exists
```

必须告诉 scientist：哪些 citation 是 placeholder，哪些无法确认。

## Workflow 0: Starting from a Research Repository

```text
Project Understanding:
- [ ] Step 1: Explore repository structure
- [ ] Step 2: Read README, docs, and key results
- [ ] Step 3: Identify main contribution with the scientist
- [ ] Step 4: Find papers already cited in the codebase
- [ ] Step 5: Search additional related literature
- [ ] Step 6: Outline paper structure
- [ ] Step 7: Draft and iterate
```

### Explore the Repository

```bash
ls -la
find . -name "*.py" | head -20
find . -name "*.md" -o -name "*.txt" | xargs grep -l -i "result\|conclusion\|finding"
```

重点查找：
- `README.md`
- `results/`、`outputs/`、`experiments/`
- `configs/`
- `.bib` 文件或 citation references
- 任何 draft / notes

### Identify Existing Citations

```bash
grep -r "arxiv\|doi\|cite" --include="*.md" --include="*.bib" --include="*.py"
find . -name "*.bib"
```

这些 citation 是 Related Work 的高信号起点。

### Clarify the Contribution

写作前必须明确主贡献：

```text
Based on my understanding of the repo, the main contribution appears to be [X].
The key results show [Y]. Is this the framing you want for the paper,
or should we emphasize different aspects?
```

不要擅自假设 narrative。

## When to Use This Skill

- 从 research repo 写论文
- 起草或修改论文 section
- 做 literature review 和 related work
- 发现近期论文
- 查找并验证 citation
- 准备 conference submission
- 转投不同 venue 做格式转换
- 根据 scientist feedback 迭代 draft

first draft 是讨论起点，不是最终稿。

## Literature Research & Paper Discovery

### Workflow 5: Finding and Evaluating Papers

```text
Literature Research Process:
- [ ] Step 1: Define search scope and keywords
- [ ] Step 2: Search arXiv and academic databases
- [ ] Step 3: Screen papers by title/abstract
- [ ] Step 4: Evaluate paper quality
- [ ] Step 5: Select top papers and extract citations
- [ ] Step 6: Verify citations programmatically
```

### Search Scope

- **Technique-focused**：`transformer architecture`、`graph neural networks`
- **Application-focused**：`medical image analysis`、`language model alignment`
- **Problem-focused**：`out-of-distribution generalization`、`continual learning`

### arXiv Search

```text
https://arxiv.org/search/?searchtype=all&query=KEYWORDS&abstracts=show&order=-announced_date_first
```

建议：
- 用 `+` 组合关键词
- 按 `cs.LG`、`cs.AI`、`cs.CV`、`cs.CL` 过滤
- 用 `announced_date_first` 看近期论文

### Paper Quality Evaluation

| Dimension | Weight | Focus |
|-----------|--------|-------|
| **Innovation** | 30% | novelty 与 originality |
| **Method Completeness** | 25% | 清晰度和可复现性 |
| **Experimental Thoroughness** | 25% | 验证深度 |
| **Writing Quality** | 10% | 表达清晰度 |
| **Relevance & Impact** | 10% | 领域重要性 |

评分阈值：
- 4.0+：强烈纳入
- 3.5-3.9：相关时纳入
- 3.0-3.4：高度相关时纳入
- <3.0：除非必要，否则排除

详细指南：
- `references/literature-research/arxiv-search-guide.md`
- `references/literature-research/paper-quality-criteria.md`

## Paper-Miner Global Writing Memory

本 skill 会读取由 `paper-miner` 维护的单一全局 writing memory：

```text
~/.hello-scholar/knowledge/paper-miner-writing-memory.md
```

这是 global memory，不是项目局部 memory。卸载 hello-scholar 不应删除累计写作知识。

默认读取顺序：
1. `~/.hello-scholar/knowledge/paper-miner-writing-memory.md`
2. repo-local evidence 和 experiment artifact
3. 必要时读取已引用论文或 notes
4. venue template 和 formatting constraints

读取时先看：
- `How this helps our writing`
- `Writing patterns mined`
- `Structure signals`
- `Reusable phrasing`
- `Venue-specific signals`

不要把新挖掘的 paper-miner 知识散落到多个 maintained file 中。

## Balancing Proactivity and Collaboration

| Confidence Level | Action |
|-----------------|--------|
| **High** | 写完整 draft，交付后按反馈迭代 |
| **Medium** | 写 draft，并标注不确定点 |
| **Low** | 问 1-2 个针对性问题，然后继续 draft |

默认先写，再把问题随 draft 一起提出。

只有以下情况才阻塞等待输入：
- target venue 不明确
- 多个互相冲突的 framing 都合理
- 结果不完整或相互矛盾
- 用户明确要求先 review 再继续

不要因为措辞、section 顺序、结果排序或 citation completeness 阻塞。

## The Narrative Principle

论文不是实验集合，而是由 evidence 支撑的一条清晰 technical story。

Introduction 结束前必须清楚三点：

| Pillar | Description |
|--------|-------------|
| **The What** | 1-3 个具体、成体系的新 claim |
| **The Why** | 严格 empirical evidence 支撑 |
| **The So What** | 为什么社区应关心 |

如果无法用一句话说清 contribution，就还没有形成 paper。

## Paper Structure Workflow

```text
Paper Writing Progress:
- [ ] Step 1: Define the one-sentence contribution
- [ ] Step 2: Draft Figure 1
- [ ] Step 3: Draft abstract
- [ ] Step 4: Draft introduction
- [ ] Step 5: Draft methods
- [ ] Step 6: Draft experiments
- [ ] Step 7: Draft related work
- [ ] Step 8: Draft limitations
- [ ] Step 9: Complete paper checklist
- [ ] Step 10: Final review and submission
```

### Abstract: 5-Sentence Formula

1. 你做成了什么：`We introduce...` / `We prove...` / `We demonstrate...`
2. 为什么难且重要
3. 方法是什么，并包含可检索关键词
4. 有什么证据
5. 最重要的数字或结果

删掉任何可以放在任意 ML 论文开头的泛化句。

### Introduction

必须包含：
- 2-4 条 contribution bullet
- 清晰 problem statement
- 简短 approach overview
- 方法最好在第 2-3 页前开始

### Methods

目标是让他人能复现：
- 概念 outline 或 pseudocode
- 全部 hyperparameters
- 足够架构细节
- 只讲最终设计，ablation 放到 experiments

### Experiments

每个实验都要说清：
- 支撑哪个 claim
- 与主贡献如何关联
- experimental setting
- 图或表中应该观察什么

必须包含：
- error bar 和计算方式
- run / seed 数量
- 主要比较的 statistical test
- baseline、ablation、robustness

## Writing Principles

- 先给 context，再给新信息
- claim 与 evidence 紧邻
- 术语保持一致
- 主动语态优先
- 具体词优先，不用泛泛的 “performance”
- 删除 filler word 和 hedging
- figure caption 要能独立理解
- 不要把关键结果藏到 appendix

## What Reviewers Actually Read

| Paper Section | Reviewer Behavior | Implication |
|---------------|-------------------|-------------|
| Abstract | 几乎都会读 | 必须非常强 |
| Introduction | 大多会快速读 | contribution 前置 |
| Figures | 经常先看 | Figure 1 极关键 |
| Methods | 有兴趣才细读 | 不要埋主线 |
| Appendix | 很少保证阅读 | 只放补充细节 |

## Conference Requirements Quick Reference

| Conference | Page Limit | Extra for Camera-Ready | Key Requirement |
|------------|------------|------------------------|-----------------|
| **NeurIPS 2025** | 9 pages | +0 | checklist，accepted 后 lay summary |
| **ICML 2026** | 8 pages | +1 | Broader Impact Statement |
| **ICLR 2026** | 9 pages | +1 | LLM disclosure，reciprocal reviewing |
| **ACL 2025** | 8 pages (long) | varies | Limitations section mandatory |
| **AAAI 2026** | 7 pages | +1 | 严格遵守 style file |
| **COLM 2025** | 9 pages | +1 | 聚焦 language models |

通用要求：
- double-blind review
- references 不计入页数
- appendix 通常不限，但 reviewer 不保证读
- 所有 venue 均要求 LaTeX

## Using LaTeX Templates Properly

**总原则：先复制完整 template directory，再在里面写。**

```text
Template Setup Checklist:
- [ ] Copy entire template directory
- [ ] Compile template as-is
- [ ] Read example content
- [ ] Replace content section by section
- [ ] Keep examples as comments until stable
- [ ] Clean up at the end
```

不要只复制 `main.tex`。template 还包含 `.sty`、`.bst`、example content 和 Makefile。

编译检查：

```bash
latexmk -pdf main.tex
```

常见坑：
- 只复制 `main.tex`
- 修改 `.sty`
- 随便加 package
- 太早删除 template example
- 不频繁编译

## Conference Resubmission & Format Conversion

```text
Format Conversion Checklist:
- [ ] Identify source and target template differences
- [ ] Create new project with target template
- [ ] Copy content sections, not preamble
- [ ] Adjust page limits and content
- [ ] Update venue-specific requirements
- [ ] Verify compilation and formatting
```

**绝不要把不同 conference 的 LaTeX preamble 混在一起。** 应从 target template 新建项目，只迁移正文、figures、tables 和 bibliography entries。

常见要求：
- ICML：Broader Impact Statement
- ICLR：LLM usage disclosure
- ACL / EMNLP：Limitations section、Ethics Statement
- AAAI：不得修改 style file
- NeurIPS：Paper checklist

## Citation Workflow

`references/citation-workflow.md` 是默认 authority。

默认路径：
1. 用 Semantic Scholar / CrossRef / arXiv / OpenAlex 搜索
2. 重要 claim 用两个来源确认 paper existence
3. 通过 DOI 或可信导出路径获取 BibTeX
4. 引用具体 claim 时，核对原文是否支持
5. 验证后再加入 bibliography

黄金规则：

```text
IF you cannot verify a citation programmatically:
    -> mark it as [CITATION NEEDED] or [PLACEHOLDER - VERIFY]
    -> tell the scientist explicitly
    -> NEVER invent a plausible-sounding reference
```

## Common Issues and Solutions

**Abstract 太泛**：删除第一句泛泛背景，直接从具体贡献开始。

**Introduction 超过 1.5 页**：把背景移到 Related Work，前置 contribution bullet。

**Experiments 没有明确 claim**：每个实验前加一句 “This experiment tests whether ...”。

**Reviewer 觉得难跟**：加 signposting，统一术语，强化 standalone caption。

**缺少 statistical significance**：补 error bar、run 数、统计检验。

## Reviewer Evaluation Criteria

| Criterion | What Reviewers Look For |
|-----------|------------------------|
| **Quality** | 技术可靠，claim 有支撑 |
| **Clarity** | 写作清楚，专家可复现 |
| **Significance** | 对社区有影响 |
| **Originality** | 有新 insight，不一定要新方法 |

NeurIPS 6 分制：
- 6：Strong Accept
- 5：Accept
- 4：Borderline Accept
- 3：Borderline Reject
- 2：Reject
- 1：Strong Reject

## Tables and Figures

### Tables

- 使用 `booktabs`
- 每个 metric 加方向符号（↑ / ↓）
- 最优值加粗
- 数值列右对齐
- 小数位一致

### Figures

- plot 和 diagram 用 vector graphics（PDF / EPS）
- 照片才用高分辨率 raster
- 使用 colorblind-safe palette
- 检查灰度可读性
- 不要在图内放 title
- caption 必须自洽

需要生成、润色或诊断图表标题、table caption、architecture diagram 文案或 visual abstract 时，优先调用 `figure-table-captioning`，不要在本 skill 中临时发明 caption workflow。

## Prompt Micro-Skills

当用户的写作请求是局部、可复用的 prompt 动作时，优先路由到专门 micro-skill：

| Task | Skill |
|------|-------|
| 中英互译、译回中文核对、术语一致性 | `bilingual-academic-translation` |
| 英文/中文润色、降低 AI 腔、publication-ready 表达 | `academic-polishing` |
| 缩写、扩写、page budget 或摘要字数控制 | `paper-compression-expansion` |
| figure/table caption、架构图说明、实验图表表达 | `figure-table-captioning` |
| 段落逻辑、claim-evidence 对齐、reviewer quick scan | `paper-logic-diagnosis` |
| 实验结果叙述、ablation/failure-case narrative | `experiment-narrative-analysis` |

本 skill 保留论文整体 narrative、section drafting、venue adaptation 和 citation-aware writing 的总入口职责。

## References & Resources

### Reference Documents

| Document | Contents |
|----------|----------|
| `references/writing-guide.md` | Gopen & Swan 原则、Ethan Perez micro-tips、word choice |
| `references/citation-workflow.md` | Citation API、Python code、BibTeX 管理 |
| `references/checklists.md` | NeurIPS、ICML、ICLR、ACL checklist |
| `references/reviewer-guidelines.md` | 评审标准、评分、rebuttal |
| `references/sources.md` | 本 skill 的来源索引 |
| `references/literature-research/arxiv-search-guide.md` | arXiv 检索策略 |
| `references/literature-research/paper-quality-criteria.md` | 5 维论文质量评估 |

### LaTeX Templates

`templates/` 目录包含：**ICML 2026**、**ICLR 2026**、**NeurIPS 2025**、**ACL/EMNLP**、**AAAI 2026**、**COLM 2025**。

编译方式：
- VS Code / Cursor：LaTeX Workshop + TeX Live
- 命令行：`latexmk -pdf main.tex`
- 在线：Overleaf

### Key External Sources

- Neel Nanda: narrative、What / Why / So What
- Sebastian Farquhar: 5-sentence abstract
- Gopen & Swan: reader expectation principles
- Zachary Lipton: scientific writing heuristics
- Ethan Perez: micro-level clarity
- APIs: Semantic Scholar、CrossRef、arXiv
