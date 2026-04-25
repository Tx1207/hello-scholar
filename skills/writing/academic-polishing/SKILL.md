---
name: academic-polishing
description: 当用户要求英文论文润色、中文论文润色、降低 AI 腔、改写得更自然、更像顶会论文、保持 LaTeX 和技术含义不变，或需要 publication-ready 学术表达时使用。
version: 0.1.0
---

# Academic Polishing

## Goal

在不改变事实和 claim 的前提下，提升论文段落的自然度、精确度、连贯性和顶会写作质感。

## Boundaries

- 不负责从零设计论文结构；大范围写作交给 `ml-paper-writing`。
- 不负责单纯压缩或扩写；字数预算任务交给 `paper-compression-expansion`。
- 不虚构实验、引用、结果或 limitation。
- 对 citation 真实性、结果一致性有疑问时，转交 `citation-verification` 或 `results-analysis`。

## Default Workflow

1. 确认目标：英文润色、中文润色、去 AI 味、保持 LaTeX、或 reviewer-facing clarity。
2. 冻结不可改内容：数学、citation、实验数字、method name、dataset、metric、claim strength。
3. 使用 `references/prompt-recipes.md` 中合适 recipe 生成修改。
4. 输出 revised text；必要时附 compact modification log。
5. 对可能超出证据的表述标注风险，并给出更保守版本。

## Quality Rules

- 追求自然、准确、克制，不写营销腔或明显 AI 腔。
- 优先提升逻辑连接和信息密度，而不是堆高级词。
- 不使用无必要的列表格式重写连续论文段落。
- LaTeX 片段保持命令、公式和引用结构稳定。

## Resources

- `references/prompt-recipes.md` - 英文/中文润色与 anti-AI 风格模板。
