---
name: paper-logic-diagnosis
description: 当用户要求检查论文逻辑、段落连贯性、claim-evidence 对齐、Reviewer 视角快速审视、找论证漏洞，或判断 novelty / evidence / limitation 是否支撑结论时使用。
version: 0.1.0
---

# Paper Logic Diagnosis

## Goal

从 reviewer 视角诊断论文文本、章节或整体 narrative 的逻辑链条，找出 claim、evidence、scope 和 writing clarity 的问题。

## Boundaries

- 不直接重写整篇论文；需要改写时给出局部建议并转交 `ml-paper-writing` 或 `academic-polishing`。
- 不替代完整 peer review；它是快速逻辑诊断。
- 不凭空判断实验充分性；必须引用用户提供的实验、表格、日志或 manuscript 内容。
- 不生成虚假 citation。

## Default Workflow

1. 明确诊断范围：单段、section、full draft、claim list、figure/table 或 rebuttal argument。
2. 提取核心链条：problem → gap → method → evidence → claim → limitation。
3. 使用 `references/prompt-recipes.md` 执行逻辑检查或 reviewer scan。
4. 输出问题分级：blocking、major、minor、style。
5. 给出可执行修复建议，必要时路由到 writing 或 results skill。

## Quality Rules

- 优先指出证据不足、claim 过强、术语漂移、因果跳跃和段落目的不清。
- 建议应具体到句子、段落或 claim，不写空泛评价。
- 区分 technical correctness、empirical support、novelty framing 和 writing clarity。
- 对不确定结论保持保守。

## Resources

- `references/prompt-recipes.md` - 逻辑检查和 reviewer 视角审视模板。
