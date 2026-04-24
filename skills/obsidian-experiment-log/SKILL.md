---
name: obsidian-experiment-log
description: 当用户讨论实验设计、ablation、training runs、evaluation、baselines、metrics、失败原因或结果解释，并且这些内容应被写入 Obsidian 的 experiment / result notes 时使用该 skill。
---

# Obsidian Experiment Log

当项目工作改变实验状态时，使用该 skill。

## 在工作流中的角色

这是 `obsidian-project-memory` 之下的一个 **supporting skill**。

它应该帮助维护 canonical experiment notes 和 result notes，而不是制造 note sprawl。

## 默认输出

- `Experiments/` 中对应的 canonical note
- 如果已经形成 durable finding，则更新 `Results/` 中对应 canonical note
- 从当天 `Daily/` note 建立链接
- 仅在项目状态实质变化时，更新相关 hub 或 plan 引用

## 主要规则

- 对同一条实验线，优先更新已有 experiment note，而不是创建同级新 note。
- 对同一条稳定结论，优先更新已有 result note，而不是新建平行结果页。
- 原始日志、metric dumps 和临时分析碎片通常应保留在 `Daily/`，直到完成解释。
- 只有当结论稳定到足以被后续引用时，才应创建 result note。

## 最小 experiment sections

- Goal / hypothesis
- Code or config entrypoint
- Dataset / split
- Metrics
- Status（`planned`、`running`、`done`、`failed`）
- Findings / notes
- Next step

## 最小 result sections

- Linked experiment
- Main observation
- Key numbers
- Evidence
- Interpretation
- Decision: keep / iterate / discard

## 链接规则

将 experiments 和 results 直接相互链接；只有当这些引用确实改善主工作面时，才把二者链接回 `00-Hub.md`、`01-Plan.md` 或 `Daily/`。

## 研究路径 handoff

把 experiment notes 视为 `Papers/` 和 `Results/` 之间的桥梁：
- 从论文衍生出的 hypotheses、baselines 和 ablations 应先落到这里，
- 稳定结论应从这里提升到 `Results/`，
- 当一个 result 已经足以支持 claim 时，应更新 `Writing/`，而不是让链条停在中间。
