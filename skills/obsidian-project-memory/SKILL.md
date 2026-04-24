---
name: obsidian-project-memory
description: 当用户希望为科研项目维护 Obsidian knowledge base、把现有研究仓库导入 Obsidian、同步 project memory 或 daily notes、把项目上下文沉淀为 durable notes，或在无需 MCP 的情况下把实验、结果、论文、写作和计划写回 Obsidian vault 时使用。
---

# Obsidian Project Memory

为科研项目维护一个**filesystem-first、agent-driven** 的 Obsidian knowledge base。

默认笔记输出语言遵循项目配置中的 `note_language`；如果没有配置，默认使用**英文**。技术术语、论文标题和已建立的文件夹名称在原文更清晰时应保持不变。只有当用户明确要求时，才切换笔记正文语言。

在以下仓库中优先使用本 skill：
- 已存在 `hello-scholar/project-memory/registry.yaml`
- 明显属于科研项目，且应绑定到 Obsidian vault

## Core principles

- **项目状态管理**优先使用脚本。
- **项目理解与综合**优先交给 agent。
- 只把**durable research knowledge** 写入**小而稳定的 vault 结构**。
- **不依赖** MCP、API key、REST plugin 或 `.base` artifact。
- 全局不依赖 `.canvas`，但文献工作流允许维护 `Maps/literature.canvas` 作为默认 literature graph artifact。
- 内部实验总结报告应归类为 `Results/Reports/` 下的**durable、面向结果的笔记**，而不是 `Writing/` 笔记。

## Default vault structure

仅写入以下项目布局：

```text
Research/{project-slug}/
  00-Hub.md
  01-Plan.md
  Knowledge/
  Papers/
  Experiments/
  Results/
    Reports/
  Writing/
  Daily/
  Archive/
```

精确结构与各类笔记职责见 [references/SCHEMA.md](references/SCHEMA.md)。

## Deterministic helper script

使用与当前模式匹配的 `project_kb.py` helper：
- `standby`: `python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" ...`
- `global`: `python3 "$HOME/.codex/plugins/cache/local-plugins/hello-scholar/local/skills/obsidian-project-memory/scripts/project_kb.py" ...`

它只应用于低自由度操作，例如 detect、bootstrap、sync 和 lifecycle management：

```bash
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" detect --cwd "$PWD"
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" bootstrap --cwd "$PWD" --vault-path "$OBSIDIAN_VAULT_PATH"
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" sync --cwd "$PWD" --scope auto
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" lifecycle --cwd "$PWD" --mode archive
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" query-context --cwd "$PWD" --kind broad
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" query-context --cwd "$PWD" --kind experiment --query freezing
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" find-canonical-note --cwd "$PWD" --kind experiment --query freezing
python3 ".hello-scholar/skills/obsidian-project-memory/scripts/project_kb.py" note-lifecycle --cwd "$PWD" --mode archive --note "Results/Old-Result.md"
```

**不要**指望脚本理解项目语义。它负责状态管理，不负责知识综合。

需要判断任务应该交给脚本还是 agent 时，阅读 [references/SCRIPT-VS-AGENT.md](references/SCRIPT-VS-AGENT.md)。

## Default workflow

### 1. Detect and bind

1. 运行当前模式下的 `project_kb.py` helper，执行 `detect --cwd "$PWD"`。
2. 如果仓库已绑定，继续使用现有项目。
3. 如果尚未绑定，但明显是科研项目，则使用当前模式的 `project_kb.py` helper 完成 bootstrap。

详细生命周期见 [references/WORKFLOW.md](references/WORKFLOW.md)。

### 2. Read the minimum context

在写任何内容之前，只读取最小稳定上下文：
- `hello-scholar/project-memory/<project_id>.md`
- `00-Hub.md`
- `01-Plan.md`
- 当天的 `Daily/YYYY-MM-DD.md`（如果存在）

如果任务涉及项目理解、已有文档或历史结果，再按需选择性加载更多上下文。

### 3. Classify the knowledge delta

将当前回合归入以下一个或多个 bucket：
- `knowledge`
- `paper`
- `experiment`
- `result`
- `writing`
- `daily`
- `project-structure`

写入前先阅读 [references/NOTE-ROUTING.md](references/NOTE-ROUTING.md)。

### 4. Follow the default durable research path

实质性科研工作的默认路径：
- `Papers/` -> 提炼可复用想法、baseline 和项目相关性
- `Experiments/` -> 转成可验证的 hypothesis、runbook 或 ablation
- `Results/` -> 提升为带证据和解释的稳定结论
- `Results/Reports/` -> 一轮或一批实验的完整内部 retrospective 报告
- `Writing/` -> 将稳定结论外化为 review、proposal、draft、slides 或 rebuttal notes

`Daily/` 只作为时间线和临时承接层，不作为 durable research knowledge 的最终归宿。

当需要判断一轮工作应如何沿这条路径推进时，阅读 [references/PAPERS-TO-WRITING.md](references/PAPERS-TO-WRITING.md)。

### 5. Decide whether agent-first synthesis is required

在以下场景中，优先采用 **agent-first import/synthesis**：
- 首次导入已有仓库
- 用户明确表示知识库为空或缺少背景
- 需要把多个源文档综合成稳定项目知识
- 项目需要 durable overview、research question、experiment map 或 results summary

这类情况应先由 agent 读取关键来源，再把综合结果写回 Obsidian。

推荐的 source 阅读顺序见 [references/AGENT-FIRST-IMPORT.md](references/AGENT-FIRST-IMPORT.md)。

### 6. Write back minimally

始终保持保守写回。

至少写回：
- 当天 `Daily/YYYY-MM-DD.md`，当本轮工作改变了项目状态时
- `00-Hub.md`，仅当近期进展或顶层状态确实变化时
- `hello-scholar/project-memory/<project_id>.md`，当项目状态发生变化时

然后只写入和 bucket 对应的 durable note：
- `knowledge` -> `Knowledge/`
- `paper` -> `Papers/`
- `experiment` -> `Experiments/`
- `result` -> `Results/`
- `writing` -> `Writing/`
- `daily` -> `Daily/`
- `project-structure` -> 通常写到 `Knowledge/Project-Overview.md` 或 `Knowledge/Source-Inventory.md`

内部实验轮次报告默认使用：
- `Results/Reports/YYYY-MM-DD--{experiment-line}--r{round}--{purpose}.md`

当笔记需要稳定模板时，阅读 [references/NOTE-TEMPLATES.md](references/NOTE-TEMPLATES.md)。

## Knowledge CRUD rules

把 vault 视为一组**canonical notes** 加上辅助性的 daily context。

### Create

- 有意识地摄入新知识，不要把每个新 Markdown 文件都当作 durable note。
- 尽量保持**一个 durable object 对应一个 canonical note**：
  - 一个稳定的 project overview
  - 每条 experiment line 一个稳定 experiment note
  - 每个 durable finding 一个稳定 result note
  - 每篇 paper 一个稳定 paper note
- 对新的 Markdown 文件，默认采取**先总结，再路由**：
  - 文件已经稳定且自洽时，才直接提升
  - 否则并入已有 canonical note，或暂存到 `Daily/`
- 如果新的 durable object 是完整内部实验报告，把它存入 `Results/Reports/`，并链接对应的 `Experiments/` 与 canonical `Results/` note

### Read

- 先做窄查询：
  - 宽泛项目问题 -> `00-Hub.md` + 关键 `Knowledge/` notes
  - 当前活跃工作 -> `01-Plan.md` + 当天 `Daily/` + project memory
  - 特定 experiment / result / paper 问题 -> 先读对应 canonical note
  - 特定内部实验 retrospective -> 先读 `Results/Reports/` 里的对应笔记
- 只有当答案横跨多个 durable source，或读完 canonical notes 后仍依赖 repo 材料时，才使用 agent synthesis

### Update

- 优先**更新**现有 canonical note，而不是创建同级 sibling note。
- 把原始材料视为输入，不要直接把它当作最终 vault 对象。
- `Daily/` 可以快速追加日志，但 durable knowledge 应落在 `Knowledge/`、`Papers/`、`Experiments/`、`Results/`、`Results/Reports/` 或 `Writing/`。

### Delete

- 对“remove”“delete”“stop using”默认按**archive** 处理。
- 只有用户明确要求永久删除时才 purge。
- archive 或 purge durable note 时，要修复 `00-Hub.md`、`01-Plan.md` 和显式索引笔记中的直接链接，避免主工作面指向缺失文件。

## Safety rules

- 不要把整个仓库镜像进 vault。
- 不要生成空洞的目录分类或无内容的 placeholder note。
- 不要把每次 repo 变化都写成一个新笔记。
- 不要把每一次代码修改都当成知识更新。
- 除非用户明确要求，否则不要创建 `.base` 文件。
- 不要制造无控制的 `.canvas` 扩散；默认唯一主要例外是文献工作流中的 `Maps/literature.canvas`。
- 对纯工程回合，优先写 `Daily/` 加 project memory，除非确实影响 experiment、result 或 planning。
- “删除项目知识”默认做 **archive**；只有用户明确要求永久删除时才 purge。

## Reference files

只按需加载：
- `references/SCHEMA.md` - vault 结构与 note 角色
- `references/WORKFLOW.md` - detect / bootstrap / sync / archive 工作流
- `references/PAPERS-TO-WRITING.md` - 从 literature 到 experiments、results、writing 的默认传递路径
- `references/SCRIPT-VS-AGENT.md` - 低自由度脚本操作与 agent 推理的边界
- `references/KNOWLEDGE-CRUD.md` - durable research knowledge 的增删改查规则
- `references/NOTE-ROUTING.md` - 各类知识应写到哪里
- `references/NEW-MD-INGESTION.md` - 新创建 Markdown 文件的摄入方式
- `references/AGENT-FIRST-IMPORT.md` - 如何借助 agent synthesis 导入已有项目
- `references/NOTE-TEMPLATES.md` - 常见 note 类型的轻量模板
