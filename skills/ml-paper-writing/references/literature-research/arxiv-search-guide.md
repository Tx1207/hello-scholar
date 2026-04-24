# arXiv 文献搜索指南

## 概述

本指南用于在 arXiv 上发现和评估最新 ML 研究论文，适合做 literature review、找 related work，或持续跟踪近期工作。

## 搜索策略

### 1. 基于关键词搜索

**arXiv Search URL 模式：**

```text
https://arxiv.org/search/?searchtype=all&query=KEYWORDS&abstracts=show&order=-announced_date_first
```

**常见 ML 搜索关键词：**

- General ML：`machine learning`、`deep learning`、`neural networks`
- Specific Areas：`reinforcement learning`、`transformer`、`attention mechanism`、`graph neural networks`
- Applications：`computer vision`、`natural language processing`、`speech recognition`
- Methods：`self-supervised learning`、`contrastive learning`、`foundation models`

技巧：

- 用 `+` 表示 AND
- 用 `|` 表示 OR
- 精确短语加引号，如 `"attention is all you need"`

### 2. 基于类别搜索

推荐的 ML arXiv categories：

- `cs.LG`
- `cs.AI`
- `cs.CV`
- `cs.CL`
- `cs.NE`
- `stat.ML`

**类别过滤 URL 示例：**

```text
https://arxiv.org/search/?cat:cs.LG+OR+cat:cs.AI+AND+all:transformer&abstracts=show&order=-announced_date_first
```

### 3. 基于时间过滤

关注最近 3 个月时：

- 使用 `order=-announced_date_first`
- 按 submission date 手动筛
- 检查 paper metadata 中的日期

## 使用 Chrome MCP 搜索 arXiv

如果可用，优先使用 Chrome MCP：

1. 导航到 arXiv 搜索页面
2. 从结果页提取：
   - 标题
   - 作者
   - arXiv ID
   - 摘要预览
   - 日期
3. 再进入单篇论文页面做详细 review

## 论文质量评估

可用 5 维框架：

| 维度 | 权重 | 关注点 |
|------|------|--------|
| Innovation | 30% | 贡献新颖度 |
| Method Completeness | 25% | 清晰度、严谨性、可复现性 |
| Experimental Thoroughness | 25% | 验证深度 |
| Writing Quality | 10% | 表达和组织 |
| Relevance & Impact | 10% | 领域重要性和潜在影响 |

常见流程：

1. 先看 title / abstract 筛相关性
2. 再进入全文做细审
3. 对每个维度打分
4. 计算加权总分
5. 排序并选择重点论文

## 提取论文元数据

从 arXiv abstract 页面（`https://arxiv.org/abs/ARXIV_ID`）可提取：

- Title
- Authors
- Abstract
- Submission date
- arXiv ID
- Categories
- Comments
- Code repository（若摘要中有 GitHub 链接）

## 与 citation workflow 集成

找到相关论文后：

1. 用 Semantic Scholar API 验证 citation
2. 通过 DOI 程序化获取 BibTeX
3. 带验证状态写入 bibliography

## 常见场景

### 找 related work

可用于：

1. 找最新同题论文
2. 识别 state-of-the-art
3. 找竞争方法
4. 找 baseline comparisons

### 持续跟踪

为以下对象建立固定搜索：

- 你的研究方向
- 竞争实验室 / 作者
- 你所在领域的新方法
- 会议对应的 preprints

### 做 literature review

推荐流程：

1. 从宽关键词开始
2. 限制到最近 1-3 年
3. 做 citation chaining（前向和后向）
4. 评估并筛选高质量论文
5. 按主题和贡献组织

## 搜索建议

1. 尽量用具体关键词，而不是泛泛大词
2. 组合使用关键词、类别和时间过滤
3. 检查 code availability
4. 用 citation count 或 code stars 作为辅助信号
5. 在读全文前认真看 abstract

## 外部资源

- arXiv: https://arxiv.org/
- Semantic Scholar: https://www.semanticscholar.org/
- Papers With Code: https://paperswithcode.com/
- Connected Papers: https://www.connectedpapers.com/
- arXiv API: http://export.arxiv.org/api_help/
