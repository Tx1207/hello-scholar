# Literature Canvas 工作流

## 默认输出

- `Maps/literature.canvas`

## 目标

提供默认的 Obsidian literature graph，使其：

- 以 `Papers/` 作为 canonical paper-note surface
- 以 `Knowledge/` 作为 canonical synthesis surface
- 可视化 paper-to-paper 和 paper-to-knowledge 关系
- 足够轻量，便于每次大规模 Zotero 导入后刷新

## 默认行为

- 以 paper-note 的 frontmatter 和 wikilinks 作为主要图来源
- 以 `Papers/*.md` 和相关 `Knowledge/*.md` 作为 file nodes
- 文献导入和 review 工作流默认生成 `.canvas`
- Mermaid 或 markdown graph note 只作为兼容性补充，不是默认主产物
- 优先使用 `paper`、`claim`、`method`、`gap` 组成的 argument-map 结构，而不是论文两两全连
- 强力稀疏化边，只保留主要推理链和少量明确的 semantic paper-to-paper 关系
- 当支线让显示图变乱时，应隐藏或降权

## 刷新触发条件

以下情况应刷新 literature canvas：

- 新增 Zotero 来源的 paper notes
- paper notes 增加了新的 `linked_knowledge` 边或重要 wikilinks
- 做完一轮文献综合后更新了 knowledge notes
- 完成一轮批量 Zotero review 或 note ingestion
- 全 collection 规范化导致大量 paper-note 关系变化

## 推荐命令

```bash
LITERATURE_CANVAS_SCRIPT="${CODEX_HOME:-$HOME/.codex}/skills/obsidian-literature-workflow/scripts/build_literature_canvas.py"
python3 "$LITERATURE_CANVAS_SCRIPT" --cwd "$PWD"
```

如果安装后的 Codex skill 路径不存在，就显式指向当前 checkout 的仓库路径。不要假设 `${CLAUDE_PLUGIN_ROOT}` 一定存在于 Codex。

## 展示规则

- 如果确实需要第二张更轻的展示图，就维护 `Maps/literature-main.canvas` 作为过滤后的 presentation copy，不要把默认工作 canvas 越堆越重。
