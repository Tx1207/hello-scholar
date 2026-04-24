# Legacy Literature Map 工作流

此参考仅为向后兼容而保留。

## Legacy 输出

- `Knowledge/Literature-Map.md`

## 当前默认

- 当前默认 literature graph artifact 参见 `CANVAS-WORKFLOW.md`
- 默认图现在是 `Maps/literature.canvas`，而不是 Mermaid 笔记
- 只有在明确要求 note-based map 或为了兼容旧流程时，才保留这套 markdown 工作流

## 刷新触发条件

仅在以下情况刷新 markdown map：

- 新增 Zotero 来源的 paper notes
- paper-note links 或 metadata 发生实质变化
- 完成一轮批量文献 review

## 推荐命令

```bash
LITERATURE_GRAPH_SCRIPT="${CODEX_HOME:-$HOME/.codex}/skills/obsidian-literature-workflow/scripts/build_literature_graph.py"
python3 "$LITERATURE_GRAPH_SCRIPT" --cwd "$PWD"
```

如果安装后的 Codex skill 路径不存在，就显式指向当前 checkout 的仓库路径。不要假设 `${CLAUDE_PLUGIN_ROOT}` 一定存在于 Codex。
