# Obsidian 项目知识库 Schema

## 仓库本地 memory 文件

- `hello-scholar/project-memory/registry.yaml`：按 `project_id` 建索引的 registry
- `hello-scholar/project-memory/<project_id>.md`：项目回合中使用的紧凑 project memory snapshot

注意：`registry.yaml` 当前为了历史兼容，磁盘上实际使用 JSON 格式。

可选的 per-project registry 字段：

- `note_language`：生成 / 同步笔记的语言；支持 `en`、`zh-CN`

语言优先级：

1. `hello-scholar/project-memory/registry.yaml` 中的项目配置
2. 环境变量 `OBSIDIAN_NOTE_LANGUAGE`
3. 默认 `en`

## Vault 布局

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

## 顶层位置的角色

- `00-Hub.md`：项目首页、当前状态、关键数字、核心链接
- `01-Plan.md`：活跃目标、任务、未解问题、下一步行动
- `Knowledge/`：稳定的项目理解，如背景、研究问题、方法综述、数据协议、source inventory
- `Papers/`：论文笔记、文献总结、related-work 素材
- `Experiments/`：实验设计、runbook、ablation、机制研究
- `Results/`：规范化 durable findings、诊断、图表索引、跨实验结论
- `Results/Reports/`：内部实验轮次报告和批量 retrospective
- `Writing/`：论文草稿、slides、proposal、rebuttal 素材
- `Daily/`：daily logs、轻量 sync 队列、草稿笔记、会议碎片
- `Archive/`：不应继续停留在主工作面的历史材料

## 最小 note 类型

- `project`
- `daily`
- `paper`
- `experiment`
- `result`
- `results-report`
- `synthesis`
- `meta`
- `writing`
- `task`

## 主要设计规则

这个 schema 有意保持小而稳。优先维护少量 durable notes，而不是堆大量 placeholder notes。
