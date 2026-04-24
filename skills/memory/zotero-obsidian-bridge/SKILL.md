---
name: zotero-obsidian-bridge
description: 当论文保存在 Zotero 中，但用户希望在已绑定的 Obsidian 项目知识库中维护详细阅读笔记、项目相关文献综合、collection 级 paper-note 覆盖检查，以及连接化知识图谱时使用该 skill。
version: 0.2.0
---

# Zotero Obsidian Bridge

把 **Zotero 作为文献事实来源**，与 **Obsidian 作为持久项目知识库** 连接起来。

当用户希望：
- 在 Zotero 中收集和组织论文，
- 从 Zotero MCP 读取论文，
- 在 Obsidian `Papers/` 下为每篇论文创建或更新一份详细 paper note，
- 将这些 notes 综合成 `Knowledge/` notes，
- 验证整个 Zotero collection 是否具备完整 canonical note 覆盖，
- 以默认 Obsidian canvas 的形式可视化文献结构，

就使用该 skill。

## 核心立场

- Zotero 负责 **collection、metadata、attachments、PDF full text、annotations**。
- Obsidian 负责 **durable reading notes、面向项目的文献知识、cross-note links、synthesis**。
- 优先 **每篇论文一份 canonical paper note**。
- 优先 **filesystem-first 的 Obsidian notes**；不要求 Obsidian MCP。
- 这是一个用于 Zotero 导入的 **显式 agent-first skill**。
- 默认桥接目标优先放在 **`Papers/` + `Knowledge/`**。
- canonical paper-note 文件名优先采用 `Papers/{FirstAuthor}-{Year}-{ShortTitle}.md`。
- 默认 graph artifact 优先采用 **`Maps/literature.canvas`**。
- 每篇 canonical paper note 内优先保留强 review schema：
  - `Claim`
  - `Method`
  - `Evidence`
  - `Limitation`
  - `Direct relevance to repo`
  - `Relation to other papers`
- 对某些 Zotero `webpage` items，只要它们仍提供有价值 metadata、attachment text 或 fulltext，也可视为有效 literature sources。

## 默认工作流

1. 通过 `$obsidian-project-memory` 解析当前项目。
   - 如果 repo 已绑定，则使用现有 vault。
   - 如果它看起来像 research repo 但尚未绑定，则先 bootstrap。
2. 从目标 collection / query 读取 Zotero items。
   - 如果用户要求全 collection 扫描，优先完整覆盖，而不是仅取小样本。
   - 如果通过 MCP 的 transport 失败，但本地存在 `zotero-mcp` 源码 checkout 或 Python 环境，则使用本地 fallback 读取 metadata / fulltext，而不是中止工作流。
3. 对每篇论文：
   - 获取 metadata，
   - 在可用时获取 full text，
   - 在有帮助时获取 annotations / notes，
   - 在 `Papers/` 中创建或更新 canonical paper note。
4. 给每篇 paper note 添加项目相关结构：
   - claim
   - research question
   - method
   - evidence
   - strengths
   - limitation
   - direct relevance to repo
   - relation to other papers
   - links 到相关论文和最匹配的 `Knowledge/` notes
5. 将这一批论文综合成 durable `Knowledge/` notes，例如：
   - `Knowledge/Literature-Overview.md`
   - `Knowledge/Method-Families.md`
   - `Knowledge/Research-Gaps.md`
   仅当综合结果已经稳定到值得成为 canonical note 时才创建。
6. 如果请求是 collection 级的，更新一份 durable inventory note，记录：
   - collection 大小
   - item triage
   - item -> canonical note 映射
   - 当前覆盖计数，例如 `16 / 16`
   - 使用 canonical inventory 路径 `Knowledge/Zotero-Collection-{collection-slug}-Inventory.md`
7. 刷新 `Maps/literature.canvas`。
   - 优先 semantic filtering 和 edge thinning。
   - 优先 argument-map 结构（`paper + claim + method + gap`），而不是稠密 all-to-all paper links。
   - 如有需要，可保留第二份轻量展示 canvas，例如 `Maps/literature-main.canvas`。
8. 如果用户还需要 writing deliverables，则更新：
   - `Writing/literature-review.md`
   - `Writing/comparison-matrix.md`
9. 更新当天 `Daily/` note 和 repo-local project memory。
10. 在批量导入或 schema 重构后，运行确定性验证。

## 默认输出

- `Papers/*.md` - 每篇论文一份详细阅读笔记
- `Knowledge/*.md` - 当一批论文产出稳定知识时，生成 durable literature synthesis notes
- `Knowledge/Zotero-Collection-{collection-slug}-Inventory.md` - 当来源是明确 Zotero collection 且需要覆盖跟踪时使用
- `Maps/literature.canvas` - 默认文献可视图谱
- `Maps/literature-main.canvas` - 经过 semantic filtering 后的可选轻量展示图
- `Writing/literature-review.md` - 当用户要求综合写作交付物时
- `Writing/comparison-matrix.md` - 当跨论文对比有价值时

## 安全规则

- 不要把原始 full text 整段倾倒进 Obsidian。
- 如果 canonical paper note 已存在，不要再创建新 note。
- 默认不要创建 `Concepts/` 或 `Datasets/` 目录树。
- 在 Zotero 导入阶段，不要把 `Experiments/`、`Results/` 或 `Writing/` 视为默认 bridge target。
- 不要把每个关系都强行变成新 note；优先使用 frontmatter fields、sections、wikilinks 和 `linked_knowledge`。
- 如果一个关系还不确定，先把它记录在 note 正文或 `Daily/`，而不是制造 durable structure。
- 如果用户明确要求检查 collection 中 **全部** 论文，不要只停留在代表性子集。
- 对同一 collection 做批量处理后，不要留下未解决的 schema drift。

## References

只加载必要内容：
- `references/WORKFLOW.md` - 端到端 Zotero -> Obsidian 流程
- `references/PAPER-NOTE-SCHEMA.md` - 详细 paper note 字段和 sections
- `references/COLLECTION-INVENTORY-SCHEMA.md` - canonical inventory note 命名与映射约定
- `references/LOCAL-ZOTERO-FALLBACK.md` - MCP transport 失败时的本地 fallback runbook
- `examples/example-collection-inventory.md` - inventory note 示例
- `scripts/canonicalize_paper_note_filenames.py` - 批量重命名已有 paper notes 并更新 note links
- `scripts/verify_paper_notes.py` - 确定性检查 schema、zotero-key 和 inventory 一致性
- `../obsidian-literature-workflow/references/PAPER-NOTE-SCHEMA.md` - 共享 note schema
- `../obsidian-literature-workflow/references/CANVAS-WORKFLOW.md` - 默认文献 canvas 刷新规则
