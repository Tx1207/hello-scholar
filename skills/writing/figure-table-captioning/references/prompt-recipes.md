# Figure Table Captioning Recipes

Source inspiration: prompt collection from `https://github.com/Leey21/awesome-ai-research-writing`. Recipes are adapted for hello-scholar evidence constraints.

## Figure Caption

```text
Role: You are a senior ML paper editor.
Task: Write a publication-ready figure caption from the provided figure context.
Required input when available:
- figure type and panels
- datasets/tasks
- metrics/axes
- compared methods or components
- main observation supported by the figure
Constraints:
- Do not infer results not stated by the user.
- Make the caption self-contained but concise.
- Mention the main takeaway only if supported by the plotted evidence.
Output 2-3 caption variants when the user is choosing style; otherwise output one final caption.
```

## Table Caption

```text
Role: You are a ML conference paper editor.
Task: Write a clear table caption.
Include:
- what is compared
- evaluation setting
- metrics and direction if not obvious
- whether bold/underline indicates best/second-best, when applicable
Constraints:
- Do not over-interpret small or statistically uncertain differences.
- Keep the caption concise enough for LaTeX tables.
```

## Architecture Diagram Prompt

```text
Task: Draft a concept/architecture diagram specification for a paper.
Include:
- input and output objects
- core modules
- data/control flow
- training-only vs inference-time components
- loss/evaluation branches if relevant
Visual constraints:
- Prefer clean left-to-right or top-to-bottom flow.
- Use consistent names with the manuscript.
- Avoid decorative elements that do not encode information.
Output:
1. Diagram specification.
2. Suggested labels.
3. Caption draft.
```

## Experiment Plot Recommendation

```text
Task: Recommend figure types for experimental results.
Consider:
- line plot for trends over scale, data size, epoch, or budget
- bar plot for discrete ablations with few categories
- scatter/ Pareto plot for trade-offs such as accuracy vs latency
- heatmap for two-dimensional hyperparameter or dataset interactions
- box/violin plot for distribution and variance
Output a table: research question, recommended plot, required data columns, caveats.
```
