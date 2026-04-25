# Paper Logic Diagnosis Recipes

Source inspiration: prompt collection from `https://github.com/Leey21/awesome-ai-research-writing`. Recipes are adapted for top-conference review discipline.

## Paragraph Logic Check

```text
Role: You are a critical but constructive ML conference reviewer.
Task: Diagnose the logical flow of the provided paragraph or section.
Check:
- Is the topic sentence clear?
- Does each sentence advance the argument?
- Are causal, contrast, and evidence relations explicit and supported?
- Are there unsupported jumps from observation to claim?
- Are terms used consistently?
Output:
1. Logic verdict: sound / mostly sound / fragile / broken.
2. Problems ranked by severity.
3. Minimal revision suggestions.
```

## Reviewer Perspective Scan

```text
Role: You are a NeurIPS/ICML/ICLR-style reviewer.
Task: Review the provided manuscript or section from a skeptical reviewer perspective.
Evaluate:
- novelty and positioning
- technical correctness
- empirical evidence and baseline sufficiency
- ablation and failure-case coverage
- limitation honesty
- writing clarity
Output:
1. Likely reviewer concerns.
2. Claim-evidence mismatches.
3. High-impact fixes before submission.
4. Questions the authors should be prepared to answer.
Constraints:
- Do not invent missing paper content.
- Quote or reference only user-provided content.
```

## Claim-Evidence Alignment

```text
Task: Build a claim-evidence table.
Columns:
- claim
- supporting evidence provided
- missing evidence
- risk level
- recommended rewrite if evidence is weak
Use this when the manuscript makes strong claims about superiority, generality, efficiency, robustness, or causality.
```
