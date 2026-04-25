---
name: paper-compression-expansion
description: 当用户要求缩写、扩写、控制字数、压缩摘要、扩展论文段落、适配 page budget，或在不改变 LaTeX、事实和 claim 的情况下微调论文长度时使用。
version: 0.1.0
---

# Paper Compression Expansion

## Goal

根据字数、页数或信息密度目标，对论文文本做可审查的压缩或扩写。

## Boundaries

- 不删除关键实验条件、限定词、失败案例或 limitation。
- 不为扩写编造数据、机制解释或相关工作。
- 不负责整体论文重构；章节级 narrative 交给 `ml-paper-writing`。
- 如果需要解释实验含义，先调用 `experiment-narrative-analysis` 或 `results-analysis`。

## Default Workflow

1. 明确目标：压缩比例、增加词数、页数预算、摘要字数或 reviewer readability。
2. 标记不可删内容：任务、方法、关键结果、数据集、metric、限定条件和 caveat。
3. 按 `references/prompt-recipes.md` 选择压缩或扩写策略。
4. 输出修改后文本，并在需要时附中文 modification log。
5. 自查是否改变 claim strength 或丢失必要限定。

## Quality Rules

- 压缩优先删冗余表达，不删证据边界。
- 扩写只能显式化原文已支持的逻辑关系。
- LaTeX 片段保持公式、citation 和命令稳定。
- 输出应能直接替换原文。

## Resources

- `references/prompt-recipes.md` - 缩写、扩写和 page-budget 调整模板。
