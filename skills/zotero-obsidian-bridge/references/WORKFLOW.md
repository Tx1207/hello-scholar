# Zotero -> Obsidian 工作流

## 1. 确定项目

1. 运行 Obsidian project-memory 的 detect 流程。
2. 如果仓库已经绑定，就使用它的 `Research/{project-slug}/` vault 根目录。
3. 如果还没绑定，但明显是科研仓库，就先 bootstrap。

## 2. 从 Zotero 读取

每篇论文优先使用以下读取顺序：
1. `zotero_get_item_metadata`
2. `zotero_get_item_fulltext`
3. `zotero_get_annotations`
4. `zotero_get_notes`

当 PDF 全文不可用时，至少使用 metadata + abstract 作为回退输入。
如果 MCP 传输路径损坏，但本地可用 `zotero-mcp` 源码 checkout，就改走本地 Python 回退去调用同一套 metadata/fulltext 函数，而不是直接中止。
某些 Zotero `webpage` 条目如果仍能提供有意义的 metadata 或 fulltext，也可以当作有效文献条目处理。

## 3. 创建或更新规范 paper note

规范目标路径：
- `Papers/{FirstAuthor}-{Year}-{ShortTitle}.md`

文件名规则：
- `FirstAuthor` 使用第一作者的姓氏。
- `Year` 使用 4 位出版年份。
- `ShortTitle` 优先取标题中稳定的冒号前前缀；否则按顺序保留主体关键词。
- 一旦创建文件名，就要保持稳定，即使后续为了可读性重写了展示用 `title`。

如果笔记已存在，就更新而不是复制。

## 4. 详细阅读笔记要求

每份持久化 paper note 都应包含：
- claim
- research question / problem
- method
- evidence
- strengths
- limitation
- direct relevance to repo
- 指向相关论文以及最匹配 `Knowledge/` 笔记的链接

## 5. 综合沉淀稳定的文献知识

批量导入后，优先采用 agent-first 的方式把综合结果写入 `Knowledge/`：
1. 当这一批已经形成稳定概览时，更新 `Knowledge/Literature-Overview.md`
2. 当方法簇已经清晰时，更新 `Knowledge/Method-Families.md`
3. 当开放问题或张力足够稳定时，更新 `Knowledge/Research-Gaps.md`
4. 如果来源是具名的 Zotero collection，更新一份持久化 inventory note，记录：
   - collection 大小，
   - 分诊桶，
   - collection item -> canonical note 的映射，
   - 当前覆盖情况，例如 `16 / 16`

## 6. 刷新默认 literature canvas

在批量创建笔记或大规模更新笔记后：
1. 重建 `Maps/literature.canvas`
2. 确保核心 paper note 都有指向 `Knowledge/` 的有效 wikilink
3. 保持图结构轻量且面向项目
4. 优先做语义过滤和边瘦身，而不是堆密集的论文两两互连
5. 主图优先采用 `paper + claim + method + gap` 的 argument-map 结构
6. 只有当第二张轻量展示图确实有价值时，才添加 `Maps/literature-main.canvas`

## 7. 只有在确有必要时才向下游推进

- 在 Zotero ingestion 过程中，默认只写 `Papers/` 和 `Knowledge/`
- 只有当用户要求 review、comparison 或面向草稿的综合时，才更新 `Writing/`
- 把 `Experiments/` 和 `Results/` 视为后续项目工作流，而不是默认的 Zotero 导入目标

## 8. 收尾前验证

在批量导入或 schema 重构之后：
1. 验证每篇预期论文都有 canonical note
2. 验证 `zotero_key` 覆盖情况与导入的 collection 一致
3. 验证所有已覆盖笔记都使用同一套 canonical section schema
4. 更新项目 `Daily/` 笔记和 project memory，记录本次变更

推荐验证命令：

```bash
python3 "${CLAUDE_PLUGIN_ROOT}/skills/zotero-obsidian-bridge/scripts/verify_paper_notes.py" \
  --papers-dir "/absolute/path/to/Papers" \
  --filename-scheme "first-author-year-short-title" \
  --expected-zotero-keys "KEY1,KEY2,KEY3" \
  --inventory-note "/absolute/path/to/Knowledge/Zotero-Collection-collection-slug-Inventory.md"
```
