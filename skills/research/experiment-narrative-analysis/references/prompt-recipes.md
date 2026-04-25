# Experiment Narrative Analysis Recipes

Source inspiration: prompt collection from `https://github.com/Leey21/awesome-ai-research-writing`. Recipes are adapted for hello-scholar experiment-evidence discipline.

## Result Narrative

```text
Role: You are a ML paper results-section editor with strict evidence discipline.
Task: Convert the provided metrics or table into a concise results narrative.
Required input:
- task/dataset
- metric and direction
- baseline/comparison methods
- observed differences
- run type and seed/statistical evidence when available
Constraints:
- Do not claim significance without statistical evidence.
- Do not generalize beyond the evaluated setting.
- Mention trade-offs and negative results when relevant.
Output:
1. Paper-ready result paragraph.
2. Evidence caveats.
3. Suggested follow-up analysis if evidence is weak.
```

## Ablation Narrative

```text
Task: Explain ablation results.
Structure:
1. State the hypothesis of each component.
2. Summarize what changes when the component is removed or varied.
3. Connect the observation to the mechanism only if supported.
4. Identify confounders or missing controls.
Output a concise paragraph plus a claim-strength recommendation.
```

## Failure Case Narrative

```text
Task: Write an honest failure-case discussion.
Include:
- where the method fails
- plausible cause supported by evidence
- impact on the main claim
- future mitigation or next experiment
Avoid turning every failure into a strength.
```

## Experiment Figure Recommendation

```text
Task: Recommend how to visualize the experimental evidence.
Output columns:
- result question
- recommended plot/table type
- required data fields
- expected takeaway
- caveats
Prefer plots that reveal variance, trade-offs, and failure modes when the claim depends on them.
```
