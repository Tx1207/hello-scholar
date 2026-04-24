---
name: obsidian-literature-workflow
description: 当用户把论文笔记保存在 Obsidian 项目知识库中，并希望进行 filesystem-first 的文献综述、显式 agent-first Zotero 导入、`Papers/` + `Knowledge/` 综合、collection 级规范化，以及在不依赖 Obsidian MCP 的前提下维护默认 literature canvas 时使用该 skill。
version: 0.5.0
---

# Obsidian Literature Workflow

在 filesystem-first 的 Obsidian 项目知识库内部处理 **literature 子工作流**。

## 在工作流中的角色

这是 `obsidian-project-memory` 之下的一个 **supporting skill**。

当用户说出类似下面的话时使用它：
- “My papers are in Obsidian”
- “Read papers from Zotero and create notes in the vault”
- “Review the notes under `Papers/`”
- “Generate literature knowledge notes from this project vault”
- “Connect paper notes to project knowledge”
- “Show me the literature structure as a map/graph”
- “Check whether all papers already have detailed notes”

## 前提假设

- 项目已经通过 `hello-scholar/project-memory/registry.yaml` 绑定，或可以用 `obsidian-project-bootstrap` 导入
- Durable paper notes 位于 `Research/{project-slug}/Papers/`
- Obsidian note 的写入通过文件系统完成，不需要 Obsidian MCP
- Zotero 仍可作为 metadata / full text 来源；如果源语料在 Zotero 中，使用 `$zotero-obsidian-bridge`

## 默认工作流

1. 读取已绑定项目 memory，并定位 vault root。
2. 如果源论文在 Zotero 中，显式使用 `$zotero-obsidian-bridge` 将其拉入 canonical `Papers/*.md`。
3. 使用文件系统工具扫描 `Papers/` 及相邻综合笔记。
4. 使用 `$obsidian-markdown` 规范化 note metadata 和结构。
   - 优先采用标准化 review schema：
     - `Claim`
     - `Method`
     - `Evidence`
     - `Limitation`
     - `Direct relevance to repo`
     - `Relation to other papers`
5. 先做窄查询：
   - 先读相关 paper notes，
   - 再读链接到的 `Knowledge/` notes，
   - 只有当用户要求 review 或 comparison deliverable 时，才继续打开 `Writing/`。
6. 优先更新现有 paper notes 和 literature synthesis notes，而不是创建同级 sibling notes。
7. 默认将 literature synthesis 写入 `Knowledge/`，而不是 `Experiments/` 或 `Results/`：
   - 更新 `Knowledge/Literature-Overview.md`
   - 更新 `Knowledge/Method-Families.md`
   - 更新 `Knowledge/Research-Gaps.md`
   当综合结论已经稳定并值得成为 canonical notes 时。
8. 如果源是一个命名 collection，且用户关心完整性，则维护 collection inventory note，并给出显式覆盖映射。
9. 在大规模 paper-note 变更或批量创建后，刷新 `Maps/literature.canvas`。
   - 优先 argument-map 结构，而不是稠密的 all-to-all links。
   - 优先 semantic filtering 和 edge thinning。
   - 只有当需要轻量展示图时，才创建 `Maps/literature-main.canvas`。
10. 更新 daily note 和 project memory，记录本轮变更。

## 默认输出

- `Papers/` 始终是一等资产：尽量做到一篇论文一个 durable paper note
- `Knowledge/` 用于保存 durable literature synthesis notes
- `Maps/literature.canvas` 是默认 visual graph surface
- literature work 通常至少应产生以下之一：
  - 新增或更新 paper notes
  - 新增或更新 knowledge notes
  - literature canvas 刷新
  - 在明确请求时补充 writing synthesis

## 默认立场

默认**不要**假设存在：
- `Concepts/`
- `Datasets/`
- `.base` views

该 literature workflow 默认可以创建 `Maps/literature.canvas`。其他 artifacts 仍需要显式理由。

## References

只加载必要引用：
- `references/PAPER-NOTE-SCHEMA.md` - 详细的 paper-note frontmatter 和 section 规范
- `references/CANVAS-WORKFLOW.md` - 如何以及何时刷新 `Maps/literature.canvas`
