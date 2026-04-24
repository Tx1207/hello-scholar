# Zotero 来源论文笔记 Schema

## Frontmatter

```yaml
---
type: paper
project: project-slug
title: "Paper Title"
canvas_visibility: hidden
authors:
  - Author A
  - Author B
year: 2026
venue: "NeurIPS"
doi: "10.xxxx/xxxxx"
url: "https://doi.org/..."
citekey: "author2026paper"
zotero_key: "ABCDEFGH"
status: read
keywords:
  - subject-invariance
  - contrastive-learning
concepts:
  - shared geometry
methods:
  - contrastive pretraining
subfield: speech-transfer
related_papers:
  - "Papers/Another-Paper"
linked_knowledge:
  - "Knowledge/Literature-Overview"
  - "Knowledge/Method-Families"
argument_claims:
  - "Shared geometry exists but is fragile"
argument_methods:
  - "Geometry-aware transfer"
argument_gaps:
  - "Still needs speech-specific validation"
paper_relationships:
  - "Papers/Another-Paper::complements"
updated: 2026-03-16T00:00:00Z
---
```

## 规范文件名

```text
Papers/{FirstAuthor}-{Year}-{ShortTitle}.md
```

其中：
- `FirstAuthor` 使用第一作者的姓氏。
- `Year` 使用 4 位出版年份。
- `ShortTitle` 应保持简洁，尽量保留标题关键词顺序；如果标题里有稳定的冒号前缀，优先使用该前缀。

## 章节

```markdown
# Paper Title

## Claim

## Research question

## Method

## Evidence

## Strengths

## Limitation

## Direct relevance to repo

## Relation to other papers

## Knowledge links

## Optional downstream hooks
- Writing:
```

## 规则

- `related_papers` 和 `linked_knowledge` 优先使用项目相对路径。
- `paper_relationships` 只有在语义边稳定到足以支持图构建时才记录。
- `concepts` 和 `methods` 可以保持为普通字符串；默认不要为它们单独建笔记。
- `Direct relevance to repo` 要写得具体且可执行。
- 即使后续为了可读性重写了 `title` 或 `# H1`，文件名仍应稳定保持在 `FirstAuthor-Year-ShortTitle`。
- 每篇论文优先只有一份持久化 canonical note；尽量原位更新，不新增同级兄弟笔记。
- 如果用户要求完整做一遍 collection pass，结束任务前应把整个覆盖集合的 schema 统一好。
- 当 Zotero `webpage` 条目仍然提供有用的附件文本或 fulltext 时，也可以作为可接受输入。
