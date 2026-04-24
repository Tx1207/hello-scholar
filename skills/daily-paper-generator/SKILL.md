---
name: daily-paper-generator
description: 当用户要求“generate daily paper”、“search arXiv for EEG papers”、“find EEG decoding papers”、“review brain-computer interface papers”，或希望为 EEG / brain decoding / speech decoding 研究生成论文摘要时使用。该 skill 会自动在 arXiv 中搜索近期论文、评估质量，并生成结构化中英文总结。
version: 0.4.0
---

# Daily Paper Generator

## 概览

自动化完成与 EEG decoding、brain-computer interface 和 neural foundation model 相关的 arXiv 新论文发现、评审与总结流程。

**核心流程：**
1. 用 Chrome browser 搜索近 3 个月 arXiv 新论文
2. 从 arXiv 页面提取论文元数据
3. 用结构化标准评估论文质量
4. 选出前 3 篇
5. 生成带中文评语和 English review 的结构化摘要
6. 将结果保存为 `daily paper/` 目录下的 Markdown 文件

## When to Use

在以下情况下使用本 skill：
- 用户要求“generate daily paper”或“find recent EEG papers”
- 用户想跟踪 EEG decoding、speech decoding from EEG、brain foundation model 方向的新研究
- 用户需要同时包含中文和英文的论文评语
- 用户希望追踪 neuro / AI 交叉领域近期 arXiv 发表

## Output Format

每篇论文摘要遵循以下结构（完整示例见 `example/daily paper example.md`）：

### 1. Header Section

```markdown
# Paper Title

## 作者及单位
Author list
Institution

## arXiv 链接
https://arxiv.org/abs/ARXIV_ID

**发表日期**: YYYY-MM-DD
**arXiv ID**: XXXX.XXXXX
**分类**: cs.LG, q-bio.NC, eess.SP
```

### 2. Review Sections

**中文评语**（约 300 字）：
- Background（1-2 句）：研究背景与重要性
- Challenges（2-3 句）：现有方法的问题
- Contribution（1-2 句）：本文核心贡献
- Method（2-3 句）：关键技术细节
- Results（2-3 句）：主要发现与指标
- Analysis & Limitations（1-2 句）：意义与局限

**English Review**（自然的 academic English）：
- 与中文评语结构一致的精炼总结
- 使用自然学术 prose，避免明显 AI 痕迹
- 遵循 scientific writing 最佳实践

### 3. Main Figure Section

```markdown
## 主图
[预留论文主图位置]
```

### 4. 元数据表

```markdown
## 论文元数据

| 项目 | 内容 |
|------|------|
| **标题** | Paper Title |
| **第一作者** | First Author Name |
| **作者列表** | Full author list |
| **第一作者单位** | Institution |
| **发表日期** | YYYY-MM-DD |
| **arXiv 链接** | https://arxiv.org/abs/ID |
| **PDF 链接** | https://arxiv.org/pdf/ID |
| **分类** | cs.LG, q-bio.NC, eess.SP |
```

### 5. Integrated Format (for publishing)

```markdown
## 整合格式

Daily Paper MMDD

Paper Title

https://arxiv.org/abs/ARXIV_ID

[Chinese Review]

[English Review]
```

### 6. Appendix

```markdown
## 附录

**github连接：** [Available/Not Available]

**补充说明**

[Key insights, impact points]

**Sources:**
- [arXiv Abstract](URL)
- [arXiv HTML](URL)
- [Paperverse Review](URL) (if available)
```

## Quick Reference

| Task | Method |
|------|--------|
| Search arXiv | 使用 Chrome MCP tools（`chrome-mcp-helper`） |
| Get paper details | 访问 arXiv 页面并提取元数据 |
| Evaluate quality | 使用 `references/quality-criteria.md` 中的标准 |
| Write Chinese review | 遵循 `references/writing-style.md` 中的风格 |
| Write English review | 应用 scientific-writing skill 的最佳实践 |
| Create output | 使用 `example/daily paper example.md` 中的模板 |

## Workflow

### Step 1: Search arXiv Using Chrome

**搜索关键词**（完整列表见 `references/keywords.md`）：
- EEG decoding：`EEG decoding`、`brain decoding`、`neural decoding`
- Speech decoding：`speech decoding from EEG`、`EEG speech reconstruction`
- Foundation models：`EEG foundation model`、`large EEG model`、`brain foundation model`

**方法：用 Chrome browser 搜索 arXiv**

1. 使用 Chrome MCP tools 打开 arXiv 搜索：
   - URL：`https://arxiv.org/search/`
   - 添加搜索参数：`?searchtype=all&query=KEYWORDS&abstracts=show&order=-announced_date_first`

2. **搜索 URL 模式：**
   ```text
   https://arxiv.org/search/?searchtype=all&query=EEG+decoding&abstracts=show&order=-announced_date_first
   https://arxiv.org/search/?searchtype=all&query=EEG+foundation+model&abstracts=show&order=-announced_date_first
   ```

3. **时间过滤**：使用日期过滤或 `announced_date_first` 排序获取近期论文

4. **从搜索结果中提取：**
   - Paper title
   - Authors
   - arXiv ID
   - Abstract preview
   - Publication date

### Step 2: Retrieve Paper Details

对每篇候选论文，访问其 arXiv abs 页面并提取：

**URL 模式：** `https://arxiv.org/abs/ARXIV_ID`

**页面中需要抽取：**
- Title（来自 `<h1>`）
- Authors（来自 `.authors`）
- Abstract（来自 `blockquote.abstract`）
- Submission date（来自 `.dateline`）
- arXiv ID（来自 URL 或页面）
- Categories（来自 `.subjects`）
- Comments（如有）
- 第一作者单位（如果评论区或作者信息里能找到）

### Step 3: Evaluate Paper Quality

使用 `references/quality-criteria.md` 中的 5 维标准评审每篇论文：

| Dimension | Weight | Key Points |
|-----------|--------|------------|
| Innovation | 30% | 贡献的新颖性 |
| Method Completeness | 25% | 清晰度与可复现性 |
| Experimental Thoroughness | 25% | 验证深度 |
| Writing Quality | 10% | 表达清晰度 |
| Relevance & Impact | 10% | 领域重要性 |

**评分方式：** 每个维度打 1-5 分，再计算加权总分。

**流程：**
1. 通过标题和摘要初筛相关性
2. 进入论文详情页做细评
3. 给每个维度评分
4. 按总分排序
5. 选出 Top 3

### Step 4: Generate Paper Summaries

对每篇入选论文，按 `example/daily paper example.md` 的结构生成摘要：

**必需部分：**
1. Title（H1）
2. 作者及单位
3. arXiv 链接（附日期、ID、分类）
4. 中文评语（约 300 字）
5. English Review（自然 academic English）
6. 主图（占位）
7. 论文元数据（metadata table）
8. 整合格式（用于发布）
9. 附录（github link、补充说明、sources）

**撰写中文评语**（见 `references/writing-style.md`）：
- Background：研究背景和重要性
- Challenges：现有方法不足
- Contribution：本文核心贡献
- Method：关键技术细节
- Results：主要发现和指标
- Analysis & Limitations：意义与局限

**撰写 English review：**
- 应用 scientific-writing skill 的最佳实践
- 采用 anti-AI writing 原则，让句式自然
- 保持简洁直接
- 避免套路连接词（如 "furthermore"、"moreover"、"additionally"）

### Step 5: Save Output

在 `daily paper/` 目录下创建 Markdown 文件：

```text
daily paper/
├── 2025-01-26-1430-paper-1.md
├── 2025-01-26-1430-paper-2.md
└── 2025-01-26-1430-paper-3.md
```

**文件名格式：** `YYYY-MM-DD-HHMM-paper-N.md`

**重要：** 使用精确到分钟的时间戳，避免覆盖此前生成的文件。

## Example Output

完整输出示例见 `example/daily paper example.md`，其中展示了 DeeperBrain 论文摘要的完整格式。

## Additional Resources

### Reference Files

- **`references/keywords.md`** - 完整搜索关键词列表与 arXiv URL 模式
- **`references/quality-criteria.md`** - 5 维评估标准与评分细则
- **`references/writing-style.md`** - 中文评语结构、模板与示例分析

### Example Files

- **`example/daily paper example.md`** - 含全部部分的完整输出示例
- **`scripts/arxiv_search.py`** - 旧版 Python 脚本（已废弃，优先使用 Chrome）

### Chrome MCP Tools

使用 Chrome MCP tools 做浏览器自动化：
- **Navigation**：打开 arXiv 搜索页和论文页
- **Screenshot**：截取页面便于分析
- **Tabs**：管理多个 arXiv 页面
- **Content extraction**：从 HTML 中提取元数据

## Important Notes

1. **时间范围：** 默认聚焦最近 3 个月论文，需检查提交日期
2. **链接格式：** 使用 arXiv abs 页面（`https://arxiv.org/abs/ID`），不要直接给 PDF 链接作为主链接
3. **评语长度：** 中文评语约 300 字
4. **质量优先：** 优先看创新性、方法和实验，而不是只看数字指标
5. **双语输出：** 每篇论文都必须提供中文和英文评语
6. **需要 Chrome：** 该流程依赖 Chrome MCP browser automation
7. **格式完整：** 每篇摘要都要包含全部 9 个部分
8. **命名一致：** 整合部分使用 `Daily Paper MMDD` 格式
