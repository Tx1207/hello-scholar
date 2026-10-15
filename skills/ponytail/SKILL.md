---
name: ponytail
description: Simplify a specified change or module by removing unnecessary mechanisms and clarifying responsibilities while preserving required behavior. Use for cleanup of AI overengineering, redundant abstractions, or difficult-to-review code; implement a bounded cleanup when requested, and keep assessment-only requests read-only.
---

# Ponytail

Reduce the effort needed to understand and change the code by keeping the mechanisms the current problem actually needs. Work from behavior and responsibility, not a deletion target. A successful cleanup leaves a smaller, coherent implementation with the required contracts still intact.

## Identify the necessary complexity

Use the scope named by the user or already established for the current change. Read the target and its relevant callers, tests, configuration, and contracts before selecting a simplification. If the scope is unresolved and the plausible choices would change the work materially, clarify it. Do not turn a bounded cleanup into a repository-wide refactor.

For each candidate mechanism, ask what current outcome it protects and what would happen if it were removed, merged, or replaced by an existing capability. Trace that answer to actual use:

- An indirection with no separate responsibility may disappear into its caller. A real boundary with independent policy or lifecycle may need to remain.
- Similar implementations may be merged when they express the same rule and must change together. Preserve separate implementations when their contracts or reasons to change differ; visual similarity is not evidence of one responsibility.
- An option with no current use may be removable, but a public configuration or persisted format has consumers beyond a local text search. Confirm that contract before changing it.
- A guard can be redundant when an earlier boundary establishes the invariant for every caller. Keep it when it handles a reachable failure or protects a trust boundary.

Prefer removing mechanisms with no required outcome, then reusing a suitable project capability, standard-library facility, or installed dependency. Choose the minimum new implementation only when those options do not satisfy the contract. An opaque one-liner or a new general-purpose abstraction can increase reading effort despite reducing the diff.

Explain the concrete simplification and why it preserves what matters. For already authorized cleanup, continue directly to the change. When the request asks only whether something is overengineered or asks for a proposal, return the assessment without edits.

## Make the smallest complete change

Implement the selected simplification across every affected local caller, import, export, test, fixture, comment, and document. Complete the connected change; leave unrelated cleanup outside the task. Avoid introducing wrappers, compatibility layers, switches, or extension points to support hypothetical uses removed by the same cleanup.

Preserve confirmed external contracts, required error handling and validation, and meaningful behavior at boundaries. In research code, judge controls by their scientific purpose: a baseline, ablation switch, seed, calibration step, or recorded run condition may be necessary even when it appears repetitive. Preserve negative results and original evidence. Do not remove a research control merely because current tests pass without it.

If a mechanism's contribution is uncertain and matters to the decision, use existing evidence or identify a bounded comparison that could resolve it. Keep the mechanism or state the unresolved choice when evidence is insufficient.

## Verify and explain the result

Check the behavior that could regress because of the actual simplification, including relevant callers and failure paths. Reuse focused existing checks; add a regression case when it resolves a material risk. Do not add tests for reversible, trivial edits or merely assert the new implementation's shape.

Report what was removed, merged, or reused and why it was unnecessary; explain any non-obvious mechanism retained for a real contract. State the observable behavior preserved, the fresh verification performed, and its meaningful limits. A list of suggestions alone does not finish an authorized cleanup request.

Stop when the specified scope is coherently simplified and sufficiently verified. If no safe, useful simplification is supported, explain the responsibilities that justify the current structure. Do not manufacture a change to show a smaller line count.
