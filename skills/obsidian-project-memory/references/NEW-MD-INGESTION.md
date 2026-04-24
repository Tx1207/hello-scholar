# 新 Markdown 摄入

当出现新的 Markdown 文件，并且需要决定是否纳入知识库时，使用本指南。

## 三步决策

### 1. 分类

把文件归为以下之一：

- `knowledge`
- `paper`
- `experiment`
- `result`
- `writing`
- `daily`

### 2. 判断：durable note 还是 raw material

只有在以下条件都满足时，才把它视为 **durable note**：

- 完整到足以独立存在
- scope 稳定
- 后面还可能被引用

否则，一律视为 **raw material**。

### 3. 选择动作

从下面三者中选择：

- **promote**
  - 仅当文件本身已经稳定、完整、长期有效
- **merge**
  - 当它只是补充同一对象的现有 canonical note
- **stage-to-daily**
  - 当它仍不稳定、不完整，或尚不值得 promote

默认答案：**先总结，再路由**。

## 示例

### 新 paper summary

- 可能分类：`paper`
- 如果完整且稳定 -> promote 到 `Papers/`
- 如果只是已有 paper note 的部分阅读笔记 -> merge

### 新 experiment plan

- 可能分类：`experiment`
- 如果定义了一条独立 experiment line -> promote 到 `Experiments/`
- 如果只是细化现有实验 -> merge 到对应 note

### 新 result memo

- 可能分类：`result`
- 如果包含带证据的 durable conclusion -> promote 到 `Results/`
- 如果它是一份完整内部实验总结报告 -> promote 到 `Results/Reports/`
- 如果仍处于探索期 -> 先放 `Daily/`，或先 merge 进 experiment note

### 新 meeting note

- 可能分类：`daily`
- 默认 -> 放入 `Daily/`
- 只有当会议产出了稳定决策，且明显属于 `Knowledge/`、`Experiments/` 或 `Writing/` 时，再 promote

### 新 scratch idea

- 可能分类：`daily` 或 `knowledge`
- 默认 -> 放入 `Daily/`
- 只有当它演化为稳定研究问题、方法方向或实验计划时，才后续 promote

## 跨阶段路由提示

当新文件属于 papers、experiments、results 或 writing 时，不要只停在文件分类。还要追问它是否已经清楚指向下一次 durable handoff：

- paper note -> 是否应该更新某个 experiment note？
- experiment note -> 是否已经有稳定发现该写进 `Results/`？
- result memo -> 是否需要同步更新 writing note？

如果下一跳已经明确，优先在同一回合中把下游 canonical note 也补上。
