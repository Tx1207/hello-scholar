---
name: citation-verification
description: 为学术写作中的 citation verification 提供参考指引。用户询问“citation verification best practices”、“how to verify references”、“preventing fake citations”，或需要确保引用准确性时使用。该 skill 为 `ml-paper-writing` 提供更细的验证原则和常见错误模式。
tags: [Research, Academic, Citation, Reference]
version: 0.1.0
---

# Citation Verification Reference Guide

用于学术论文写作中的 citation verification 参考指南，提供验证原则与最佳实践。

**核心原则**：写作过程中主动验证每一条引用，默认通过 WebSearch 和 Google Scholar 交叉确认。

## Core Problems

学术论文中的引用问题会直接影响研究可信度：

1. **Fake citations**：引用不存在的论文（AI 生成引用中尤其常见）
2. **Incorrect information**：作者、标题、年份等信息不匹配
3. **Inconsistent formatting**：引用格式混杂不统一
4. **Missing citations**：正文提及但未正式引用

这些问题可能导致：
- 论文被拒稿或撤稿
- 学术声誉受损
- 审稿人质疑研究严谨性

**AI-assisted writing 的特殊风险**：AI 生成引用的错误率大约可达 40%，每一条引用都必须经 WebSearch 验证。

## Verification Principles

本 skill 基于 WebSearch 与 Google Scholar 提供以下验证原则：

### 1. Proactive Verification（写作时即时验证）

**核心思想**：添加引用时立刻验证，而不是等全文写完后再统一检查。

- 每次需要引用时都先用 WebSearch 检索论文
- 在 Google Scholar 中确认论文真实存在
- 通过验证后再加入 bibliography

### 2. Google Scholar Verification

**为什么使用 Google Scholar：**
- 学术文献覆盖最全面
- 提供 citation count，可作为可信度信号
- 可直接导出 BibTeX
- 免费且无需 API

**验证步骤：**
1. WebSearch 查询：`"site:scholar.google.com [paper title] [first author]"`
2. 确认搜索结果中出现该论文
3. 检查 citation count（异常低时要进一步核实）
4. 点击 "Cite" 获取 BibTeX

### 3. Information Matching Verification

**必须匹配的信息：**
- 标题（允许大小写等轻微差异）
- 作者（至少第一作者需匹配）
- 年份（允许 ±1 年误差，考虑 preprint 场景）
- 发表 venue（conference / journal 名称）

### 4. Claim Verification

**关键原则**：如果引用的是某个具体 claim，就必须确认该 claim 真的出现在原文里。

- 使用 WebSearch 找到论文 PDF
- 搜索相关关键词
- 确认 claim 的准确性
- 记录 claim 所在 section / page

## Verification Workflow

### 集成进写作流程

```text
写作过程中需要引用
    ↓
WebSearch 查找论文
    ↓
Google Scholar 验证论文存在
    ↓
确认论文详情
    ↓
获取 BibTeX
    ↓
（若引用具体 claim）验证 claim
    ↓
加入 bibliography
```

**关键点**：验证是写作流程的一部分，不是事后附加步骤。

## Usage Guide

### 与 ml-paper-writing 配合使用

本 skill 的验证原则已经集成到 `ml-paper-writing` 的 Citation Workflow 中。

**自动触发**：使用 `ml-paper-writing` 写论文时，会自动执行 citation verification。

**手动参考**：如果需要更细的验证原则，可单独参考本 skill。

### Verification Step Example

**场景**：需要引用 Transformer 论文

```text
Step 1: WebSearch 检索
Query: "Attention is All You Need Vaswani 2017"
Result: 找到多个相关来源

Step 2: Google Scholar 验证
Query: "site:scholar.google.com Attention is All You Need Vaswani"
Result: ✅ 论文存在，50,000+ citations，NeurIPS 2017

Step 3: 确认详情
- Title: "Attention is All You Need"
- Authors: Vaswani, Ashish; Shazeer, Noam; Parmar, Niki; ...
- Year: 2017
- Venue: NeurIPS (NIPS)

Step 4: 获取 BibTeX
- 点击 Google Scholar 中的 "Cite"
- 选择 BibTeX 格式
- 复制 BibTeX 条目

Step 5: 加入 bibliography
- 粘贴到 `.bib` 文件
- 在正文中使用 \cite{vaswani2017attention}
```

### Handling Verification Failures

**如果在 Google Scholar 中找不到论文：**

1. **检查拼写**：标题或作者名是否正确
2. **换查询词**：尝试不同关键词组合
3. **寻找替代来源**：尝试 arXiv、DOI
4. **标记待补**：使用 `[CITATION NEEDED]`
5. **明确告知用户**：说明该引用当前无法验证

**如果信息不匹配：**

1. **确认来源**：是否找到了正确论文
2. **检查版本**：preprint 与正式发表版本是否不同
3. **更新信息**：采用更准确的版本
4. **记录差异**：注明差异原因

## 最佳实践

### Preventing Fake Citations

1. **不要凭记忆生成引用**：AI 生成引用错误率高
2. **先用 WebSearch 查找**：每条引用都通过 WebSearch 起步
3. **再用 Google Scholar 确认**：验证论文真实存在
4. **即时验证**：添加引用时就完成验证，不要拖到最后

### 处理验证失败

1. **不要猜**：找不到论文时不要编造信息
2. **明确标记**：用 `[CITATION NEEDED]` 明示
3. **通知用户**：清楚指出哪些引用无法验证
4. **给出原因**：说明是未找到、信息不匹配还是其他原因

### 提高验证准确性

1. **查询尽量完整**：包含标题、作者、年份
2. **检查 citation count**：可作为可信度参考
3. **确认 venue**：核对 conference / journal 名称
4. **验证 claim**：引用具体结论时要回到原文确认

### Common Pitfalls

❌ **错误做法：**
- 凭记忆生成 BibTeX
- 跳过 Google Scholar 验证
- 假设论文一定存在
- 对无法验证的引用不做标记

✅ **正确做法：**
- 每条引用都用 WebSearch 检索
- 在 Google Scholar 上确认
- 从 Google Scholar 复制 BibTeX
- 对不可验证引用明确标记

## Summary

**核心原则**：写作过程中主动用 WebSearch 和 Google Scholar 验证每一条引用。

**关键步骤：**
1. WebSearch 查找论文
2. Google Scholar 验证存在性
3. 确认详细信息
4. 获取 BibTeX
5. 必要时验证具体 claim
6. 加入 bibliography

**失败处理**：验证失败时，使用 `[CITATION NEEDED]` 标记，并明确告知用户。

**集成关系**：本 skill 的原则已集成进 `ml-paper-writing`，可自动执行验证。
