---
name: figure-table-captioning
description: 当用户要求生成或润色 figure caption、table caption、图标题、表标题、visual abstract、论文架构图说明，或需要把实验图表叙述成 publication-ready caption 时使用。
version: 0.1.0
---

# Figure Table Captioning

## Goal

为论文图、表、架构图和 visual abstract 生成准确、信息充分、可投稿的标题与说明。

## Boundaries

- 不根据图像臆测未提供的实验结果；缺少信息时要求用户提供图、表、指标或上下文。
- 不负责实际绘制 raster image；图像生成或编辑应使用图像工具/设计 skill。
- 不替代 `results-analysis` 的统计解释；caption 只表达已有证据。
- 不夸大图表传达的信息。

## Default Workflow

1. 收集上下文：图/表内容、变量、dataset、metric、baseline、主要观察和目标 venue。
2. 判断任务类型：短 title、完整 caption、architecture diagram text、visual abstract narrative 或 plot recommendation。
3. 使用 `references/prompt-recipes.md` 中对应 recipe。
4. 输出 publication-ready caption，并可附 concise rationale 或 alternate versions。
5. 检查 caption 是否自洽、不过度解释、能独立阅读。

## Quality Rules

- Caption 应回答 what、how to read、main takeaway，必要时包含 setting。
- 表 caption 强调比较对象、metric 和统计含义。
- Figure caption 避免只写“Results on X”，应说明趋势或设计意图。
- 架构图说明必须区分模块、数据流和训练/推理路径。

## Resources

- `references/prompt-recipes.md` - 图标题、表标题、架构图和绘图建议模板。
