# Script 与 Agent 的边界

用本指南判断任务应该交给 `project_kb.py`，还是必须保留为 agent-driven。

## 适合脚本的任务

以下任务低自由度、确定性强，应该每次都表现一致：

- 检测 repo 是否绑定到 project vault
- bootstrap 标准 vault 结构
- 将 repo-driven 状态同步到 daily、hub、plan、memory 和 auto-sync notes
- 为某类问题列出或推荐应读取的 canonical notes
- 对单个 note 执行 archive、purge、rename，并修复显式索引中的直接链接
- 维护 source inventory 和 codebase overview

当前 script-facing commands：

- `detect`
- `bootstrap`
- `sync`
- `lifecycle`
- `query-context`
- `find-canonical-note`
- `note-lifecycle`

## 必须交给 agent 的任务

以下任务需要语义判断，不应硬编码进脚本：

- 判断新的 Markdown 文件是 durable knowledge 还是 raw material
- 判断应 promote、merge 还是 stage 新 Markdown 文件
- 当多个候选存在时，决定哪个现有 note 才是 canonical note
- 从多个项目文档综合背景知识
- 解释实验含义或结果 significance
- 根据概念重叠判断 note 应 split 还是 merge
- 判断某个结果是否足够稳定，可以写进 `Results/`

## 实用规则

如果任务更像：

- “find”
- “move”
- “rename”
- “archive”
- “sync”
- “suggest reads”

那通常适合脚本。

如果任务更像：

- “understand”
- “interpret”
- “decide meaning”
- “summarize”
- “merge concepts”
- “promote to durable knowledge”

那它应继续由 agent 完成。
