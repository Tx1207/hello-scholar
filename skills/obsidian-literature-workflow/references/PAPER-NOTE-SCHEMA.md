# Paper Note Schema

当你需要在 `Papers/` 下创建或规范 durable paper notes 时，使用本 schema。

## 必需 frontmatter

```yaml
---
type: paper
title: "Paper Title"
project: project-slug
authors:
  - Author A
year: 2026
venue: "Venue"
doi: "10.xxxx/xxxxx"
url: "https://..."
citekey: "author2026paper"
status: read
updated: 2026-03-16T00:00:00Z
---
```

## 规范文件名

```text
Papers/{FirstAuthor}-{Year}-{ShortTitle}.md
```

使用第一作者姓氏、4 位年份，以及按原标题关键词顺序保留的稳定短标题。

## 建议用于知识映射的 frontmatter

```yaml
keywords:
  - decoding
concepts:
  - shared geometry
methods:
  - contrastive learning
related_papers:
  - "Papers/Neighbor-Paper"
linked_knowledge:
  - "Knowledge/Literature-Overview"
  - "Knowledge/Method-Families"
```

## 推荐章节

- `## Claim`
- `## Research question`
- `## Method`
- `## Evidence`
- `## Strengths`
- `## Limitation`
- `## Direct relevance to repo`
- `## Relation to other papers`
- `## Knowledge links`
- `## Optional downstream hooks`

## 真实 collection pass 中的工作规则

- 每篇论文优先只有一个 canonical note，并在整个覆盖集合中保持 schema 对齐。
- 当用户要求检查 **all** papers 时，要做 coverage pass，而不是只抽样看代表性子集。
- 用 `zotero_key` 作为 Zotero 条目与 Obsidian 笔记之间的 durable join key。
- 即使展示用 `title` 后面变了，paper-note 文件名仍应稳定保持 `FirstAuthor-Year-ShortTitle`。
- `Direct relevance to repo` 要足够具体，能直接驱动 experiment、writing 或 review prioritization。
