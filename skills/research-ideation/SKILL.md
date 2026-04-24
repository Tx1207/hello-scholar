---
name: research-ideation
description: 当用户要求“brainstorm research ideas”、“use 5W1H framework”、“identify research gaps”、“conduct gap analysis”、“start research project”、“conduct literature review”、“define research question”、“select research method”、“plan research”，或提到研究项目启动阶段时使用。提供从想法生成到规划落地的完整研究启动工作流指导。
version: 0.1.0
---

# Research Ideation

支持研究项目启动阶段的完整工作流，包括 literature review、research question 定义、method 选择和 research planning。

## Core Features

### 1. Idea Brainstorming (5W1H Framework)

使用 5W1H 框架系统化头脑风暴研究想法：
- **What**：研究什么问题或现象
- **Why**：为什么这个问题重要
- **Who**：目标受众和相关方是谁
- **When**：研究的时间范围和背景
- **Where**：应用场景和领域在哪里
- **How**：初步的研究方法设想

**与 superpowers:brainstorming 集成**：可调用 `superpowers:brainstorming` skill 进行交互式头脑风暴，快速生成并评估研究想法。

### 2. Literature Review

系统化检索、分析并综合相关文献：
- 构造有效检索关键词
- 通过 WebSearch 在学术数据库（arXiv、Google Scholar 等）中搜索
- 筛选并评估论文质量
- 识别研究趋势与 gap
- 生成结构化 literature review
- **Zotero Integration**：通过 DOI 自动把论文加入 Zotero，按主题归类 collection，并自动附加 open-access PDF 便于全文阅读

### 3. Gap Analysis

系统识别并评估 research gap：
- **Literature gaps**：找出尚未被充分研究的主题或问题
- **Methodological gaps**：发现现有方法的局限和改进空间
- **Application gaps**：识别理论向实践迁移的机会
- **Interdisciplinary gaps**：挖掘交叉学科中的研究机会
- **Temporal gaps**：识别随时间变化而出现的新研究需求

**分析维度：**
- 研究主题覆盖度
- 现有方法优缺点对比
- 实验设置完整性
- 数据集与 benchmark 可得性
- 理论与实践之间的落差

### 4. Research Question Definition

基于文献分析形成具体 research question：
- 识别研究 gap 和机会
- 用 SMART 原则构造问题
- 评估重要性、novelty 和 feasibility
- 明确研究目标和预期贡献

### 5. Method Selection

选择合适的研究方法：
- 分析现有方法的优缺点
- 评估方法适用性
- 识别所需技术与资源
- 考虑实施可行性

### 6. Research Planning

制定详细研究计划：
- 规划研究时间线
- 定义 milestone 和 deliverable
- 识别潜在风险
- 评估资源需求

## When to Use

### 适用场景

在以下情况下使用 `research-ideation`：

1. **启动新研究项目**：有研究兴趣但还没有清晰的 research question
2. **文献综述**：需要系统理解某个研究领域
3. **研究问题 formulation**：需要把模糊想法转成具体问题
4. **方法选择**：需要挑选合适的 research method 和 technical approach
5. **研究规划**：需要规划研究时间线和资源

### Typical Workflow

```text
Research interest → Idea brainstorming (5W1H) → Literature review → Gap analysis → Define question → Select method → Create plan
```

**输出文件：**
- `literature-review.md`：结构化文献综述
- `research-proposal.md`：研究提案（含问题、方法、计划）
- `references.bib`：BibTeX 参考文献
- Zotero collection：按主题整理好的论文与 PDF

## Integration with Other Systems

### 完整研究工作流

```text
research-ideation（研究启动）
    ↓
实验执行（由用户完成）
    ↓
results-analysis（结果分析）
    ↓
ml-paper-writing（论文写作）
```

### Data Flow

- **research-ideation 输出** → 指导实验设计和方法选择
- **实验结果** → 进入 `results-analysis` 做统计分析
- **分析结果** → 用于 `ml-paper-writing` 的 Related Work 和 Methods 部分

### Zotero Integration

通过 Zotero MCP server，`research-ideation` 工作流可自动化管理文献：

- **Paper Discovery**：WebSearch 在学术数据库中查找相关论文
- **Auto-Import**：从搜索结果提取 DOI / arXiv ID / landing-page URL，然后优先使用 `zotero_add_items_by_identifier` 导入 paper/preprint，仅在必要时回退到 webpage
- **Collection Organization**：使用 `zotero_create_collection` 创建基于主题的 collection，并建立标准子集合（Core Papers、Methods、Applications、Baselines、To-Read）
- **PDF Attachment**：`zotero_add_items_by_identifier(..., attach_pdf=true)` 会执行 PDF 级联流程（landing-page PDF hint → direct PDF → Unpaywall），剩余项目可再用 `zotero_find_and_attach_pdfs` 补扫
- **Full-Text Reading**：使用 `zotero_get_item_fulltext` 读取已索引 PDF 内容，用于分析和记笔记
- **Library Search**：使用 `zotero_search_items` 和 `zotero_get_collection_items` 浏览已有文献，避免重复导入

### Key Configuration

- **Literature search scope**：默认最近 3 年论文，可配置
- **Output format**：默认 Markdown，便于编辑和版本控制
- **Citation management**：生成 BibTeX 格式参考文献
- **Zotero collection naming**：采用 `Research-{topic}-{YYYY}` 格式
- **PDF auto-attach**：默认对 open-access 论文启用 Unpaywall 自动附加

## Additional Resources

### Reference Files

按需加载以下方法指南：

- **`references/5w1h-framework.md`** - 5W1H Framework Guide
  - What、Why、Who、When、Where、How 六个维度
  - 系统化研究想法头脑风暴方法
  - 与 `superpowers:brainstorming` 的集成方式
  - 使用示例与最佳实践

- **`references/literature-search-strategies.md`** - Literature Search Strategies
  - 关键词构造技巧
  - 学术数据库选择（arXiv、Google Scholar）
  - 搜索技巧与筛选标准
  - 论文质量评估方法
  - DOI 提取与 Zotero 自动导入流程

- **`references/zotero-integration-guide.md`** - Zotero MCP Integration Guide
  - 可用 Zotero MCP 工具（browse、add、cite）
  - Collection 组织策略与命名规范
  - 自动化工作流：WebSearch → DOI → Zotero import → PDF attach
  - 全文阅读与结构化笔记
  - 常见问题与排障

- **`references/gap-analysis-guide.md`** - Gap Analysis Guide
  - 5 类 Gap Analysis（literature、methodological、application、interdisciplinary、temporal）
  - 5 个分析维度
  - 系统识别研究机会的方法
  - 使用示例与最佳实践

- **`references/research-question-formulation.md`** - Research Question Formulation
  - SMART 原则的应用
  - 问题类型分类（exploratory、confirmatory、applied）
  - 评估标准（importance、novelty、feasibility）
  - 研究目标与贡献定义

- **`references/method-selection-guide.md`** - Method Selection Guide
  - 常见研究方法分类
  - 方法适用性分析
  - 优缺点对比
  - 资源需求评估

- **`references/research-planning.md`** - Research Planning
  - 时间线规划方法
  - Milestone 定义技巧
  - 风险识别与缓解
  - 资源分配策略

### Example Files

完整示例：

- **`examples/example-literature-review.md`** - Literature Review Example
  - 展示结构化 literature review 格式
  - 包含研究趋势分析和 gap 识别

- **`examples/example-research-proposal.md`** - Research Proposal Example
  - 展示完整 research proposal 结构
  - 包含问题、方法和计划的完整示例
