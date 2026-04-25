---
name: bilingual-academic-translation
description: 当用户要求中英互译、英文学术翻译、中文转 LaTeX 英文、英文论文段落译回中文核对，或需要保持术语、公式、citation 和 LaTeX 结构不变的双语学术翻译时使用。
version: 0.1.0
---

# Bilingual Academic Translation

## Goal

在中文、英文和 LaTeX 论文片段之间做忠实、自然、可审查的学术翻译，服务 ML/AI 论文写作和修改。

## Boundaries

- 保留事实、claim、实验数字、公式、citation key、label/ref、表格引用和术语含义。
- 不新增实验结果、baseline、limitation 或未给出的 causal claim。
- 不替代 `citation-verification`；遇到 citation 真实性问题时转交验证。
- 不做大段 narrative 重构；需要结构改写时转交 `ml-paper-writing` 或 `academic-polishing`。

## Default Workflow

1. 判断输入类型：中文草稿、英文 LaTeX、普通英文段落、双语术语表或混合文本。
2. 识别必须冻结的内容：数学公式、命令、citation、实验数字、方法名、dataset、metric 和专有名词。
3. 选择 `references/prompt-recipes.md` 中对应 recipe，并按用户目标调整输出格式。
4. 输出译文；对高风险术语或可能改变 claim 的位置给出简短核对说明。
5. 如果用户要求 publication-ready 英文，在翻译后建议继续进入 `academic-polishing`。

## Quality Rules

- 英文应自然、准确、克制，避免中式直译和营销式表达。
- 中文应忠实、清楚，不为了“顺”而隐藏限定条件。
- LaTeX 输出必须保持源码纯净，特殊字符按需要转义。
- 当原文含糊或 claim 过强时，标注不确定，不自行补事实。

## Resources

- `references/prompt-recipes.md` - 中转英、英转中、中转中和双语核对模板。
