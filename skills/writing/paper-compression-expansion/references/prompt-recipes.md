# Paper Compression Expansion Recipes

Source inspiration: prompt collection from `https://github.com/Leey21/awesome-ai-research-writing`. Recipes are adapted for evidence-preserving paper editing.

## 微幅缩写

```text
Role: You are a concise academic editor.
Task: Shorten the provided English LaTeX paragraph by the requested amount.
Constraints:
- Preserve core meaning, claims, experimental conditions, caveats, equations, citations, and numbers.
- Prefer removing redundancy, nominalization, filler, and repeated transitions.
- Do not compress so aggressively that the logic becomes implicit or ambiguous.
- Keep LaTeX commands and math intact.
Output:
1. Shortened LaTeX-ready text.
2. Chinese modification log summarizing what was removed or merged, if requested.
Self-check: Verify no metric, dataset, baseline, condition, or limitation was dropped.
```

## 微幅扩写

```text
Role: You are an academic editor focused on logical completeness.
Task: Expand the paragraph slightly, usually by 5-15 words or according to the user's target.
Constraints:
- Add only implications, premises, transitions, or clarifications already supported by the input.
- Do not invent data, motivations, limitations, or causal mechanisms.
- Keep the prose concise and conference-paper appropriate.
- Preserve LaTeX commands, formulas, citations, and quantitative values.
Output:
1. Expanded LaTeX-ready text.
2. Chinese modification log describing the added logical relation or clarification.
```

## 摘要/Introduction 压缩

```text
Task: Compress the text for a strict word or page budget.
Priority order:
1. Preserve problem, gap, method, key result, and contribution.
2. Remove generic motivation and redundant setup.
3. Merge adjacent background sentences.
4. Keep claim strength aligned with evidence.
Output a replacement paragraph plus a list of any intentionally removed low-priority details.
```
