---
name: review
description: Independently review a specified proposal, code change, implementation against a Spec, or research evidence. Use for design critique, code or MR review, acceptance audits, and requests for another model to challenge a plan; return material findings with evidence and the smallest repair or verification direction.
---

# Review

Find what could invalidate the proposed decision or break the required behavior under its actual conditions. Use independent expectations, concrete counterexamples, and evidence to distinguish a material problem from an unresolved question or a preference.

Review is read-only by default and needs no Spec. If the user requests review and repair, establish the findings first, then continue with authorized repairs and relevant verification; do not insert another approval phase.

## Establish what the judgment covers

Resolve the object and purpose from the request and existing context: a proposal, specified changes, an implementation, or a body of research evidence. Identify the current state actually inspected. For a Spec, retain its path, revision, and status; for code, use the existing commit and relevant working-tree changes; for evidence, identify the actual inputs, Run records, and results. No new commit or identity scheme is required.

Read the object and the connected material needed to understand it. Judge a proposal as a proposal: code that has not yet been written is not itself a design defect. A draft or partial implementation can still be reviewed. Ask about missing scope only when different interpretations would change the review.

Keep source, tests, Specs, Run records, Architecture, and generated Indexes unchanged during the review. Run only relevant checks within the existing authorization, with incidental outputs isolated from the reviewed material. Experiments and paid calls must fit authorization covering those actions; ordinary review does not expand it. Save findings only when requested or already included in the task's scope, in the designated review location.

## Challenge the consequential assumptions

Start from the user outcome, confirmed rules, and real external contracts. Derive what should happen independently of the implementation and its tests. If those sources disagree, show the conflict instead of selecting the version that makes the work pass.

Follow the relationships that can change the conclusion:

- For a design, connect its promise to the mechanism, assumptions, resource limits, and interactions required to deliver it. Seek a realistic case that the design cannot handle, and explain which promise it breaks.
- For code, trace inputs, state changes, failures, and outputs through the relevant callers. Check that a suspected trigger is reachable and that the consequence actually follows. Similar code or an extra layer alone does not establish unnecessary complexity; identify the responsibility or real contract it serves.
- For research, check whether the comparison and measurement support the claimed interpretation. Distinguish failed execution, an inconclusive comparison, a valid negative result, and evidence for adoption. Look for incompatible conditions, omitted contrary results, or another explanation that the evidence has not separated.

Investigate the assumption with the largest credible effect on correctness or the next decision. Use a focused check when it can resolve the question; do not expand into a general audit or generate a quota of findings.

Before reporting a defect, verify its trigger, relevant evidence, and consequence. Present a plausible concern without enough evidence as a question needing a specific check, not as a confirmed failure. Existing comments, a passing test, another model's agreement, and old summaries do not independently prove the claim. State what current code inspection or fresh execution does establish.

A missing report or evidence link does not establish that an execution never happened. Check the relevant direct evidence when available; otherwise report that the claim cannot be verified from the inspected material. Keep absent documentation, absent verification, and a demonstrated failure distinct.

## Compare acceptance when a Spec is supplied

For each material `AC-NN`, determine whether it is satisfied, partial, missing, contradictory, or not verifiable, and point to the evidence that supports that conclusion. Group closely related items when that makes the result easier to read without hiding gaps.

For important user-visible behavior, identify the actual CLI, API, UI, or consumer path exercised and what remains unverified. A passing check only supports what it covers. Report an incorrect acceptance rule separately; do not rewrite the Spec to make the implementation conform.

Run `hello-scholar docs check` when available and relevant to the review. Treat a failed check as evidence, not a reason to refuse the rest of the comparison. Historical Plan/Tasks are relevant only when explicitly examining an unmigrated legacy bundle; they do not control current execution.

## Return a judgment the reader can assess

Lead with material findings. Explain each in connected, plain language: the problem, the conditions that trigger it, its practical consequence, direct evidence, and the smallest repair or verification direction. Use stable finding identifiers when the findings need discussion or tracking; avoid a separate field for every sentence.

State the reviewed object and state, the useful checks actually performed, and any boundary that limits the judgment. If no material finding is supported, say so within that scope. An untested risk is not a defect, and no findings is not proof that all behavior is correct.

Distinguish existing adopted decisions from proposed changes. A recommendation in a review does not itself revise the design or establish adoption.

For independent review by another Agent or model, or for a review that will be resumed later, read [Cross-Agent review](references/cross-agent-review.md). The main Agent owns integration and disposition of findings; the reviewer owns only the assigned review output.