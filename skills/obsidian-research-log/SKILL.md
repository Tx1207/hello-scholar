---
name: obsidian-research-log
description: 当用户讨论 daily research work、TODOs、plans、standups、meetings、milestones 或一般项目进展，并且这些内容应反映到 Obsidian 的 daily notes、plan notes 和 hub updates 中时使用该 skill。
---

# Obsidian Research Log

使用该 skill 让项目规划和 daily progress 保持同步。

## 在工作流中的角色

这是 `obsidian-project-memory` 之下的一个 **supporting skill**。

优先做少量 durable updates，而不是创建额外的 planning folders。

## 默认目标

- `Daily/YYYY-MM-DD.md`
- `01-Plan.md`
- `00-Hub.md` 中的 recent progress block
- `hello-scholar/project-memory/<project_id>.md`

## 规则

- 当模糊 TODO 变成 durable commitments 时，将其转成 `01-Plan.md` 中的具体 checkbox lists。
- 保留 `Daily/` 的时间顺序：追加带日期的 blocks，而不是改写历史。
- 当目标笔记已经是 canonical 时，把 daily notes 链接到被触及的 experiments、papers、results 和 writing notes。
- 如果 meeting note 只是临时性的，先放在 `Daily/`。
- 如果会议输出变成 durable project knowledge，则将其总结并路由到 `Knowledge/`、`Writing/` 或 `01-Plan.md`，而不是默认创建 `Meetings/` 文件夹。
- 优先更新已有 canonical notes，而不是生成平行任务笔记。

## 核心判断规则

Daily logs 用于记录过程。

如果某条信息在几天或几周后仍然重要，应将其中 durable 的部分提升到 `Knowledge/`、`Experiments/`、`Results/` 或 `Writing/`。
