---
name: review
description: Independently review a specified proposal, code change, implementation against a Spec, or research evidence. Use for design critique, code or MR review, acceptance audits, and requests for another model to challenge a plan; return material findings with evidence and the smallest repair or verification direction.
---

# Review

Find what could invalidate the proposed decision or break the required behavior under its actual conditions. Use independent expectations, concrete counterexamples, and evidence to separate a material problem from an open question or a preference.

Review is read-only by default and needs no Spec. If the user asks for review and repair, establish the findings first, then continue with the repairs and their verification.

## Establish what the judgment covers

Identify the object and the state actually inspected: a Spec's path, revision, and status; the commit and in-scope working-tree changes for code; the inputs, Run Records, and results for evidence. Read the connected material needed to understand it. Judge a proposal as a proposal: code not yet written is not a design defect. Keep the reviewed material and generated Indexes unchanged, and run only checks the existing authorization covers.

## Challenge the consequential assumptions

Derive what should happen from the user outcome, confirmed rules, and real contracts, independently of the implementation and its tests. If those sources disagree, show the conflict instead of picking the version that passes.

- For a design, connect its promise to the mechanism, assumptions, resource limits, and interactions required to deliver it, and seek a realistic case it cannot handle.
- For code, trace inputs, state changes, failures, and outputs through the relevant callers. Confirm a suspected trigger is reachable and the consequence follows. Similar code or an extra layer is not unnecessary complexity until you identify that it serves no responsibility or contract.
- For research, check whether the comparison and measurement support the claimed interpretation. Distinguish failed execution, an inconclusive comparison, a valid negative result, and evidence for adoption; look for incompatible conditions, omitted contrary results, or an unseparated alternative explanation. Check whether an existing Run could have answered the question before a new one was launched.

Pursue the assumption with the largest credible effect on correctness or the next decision; do not expand into a general audit or produce a quota of findings. Before reporting a defect, verify its trigger, evidence, and consequence; otherwise present it as a question with the check that would settle it. A missing report does not prove an execution never happened, and a passing test, another model's agreement, or an old summary does not prove a claim.

## Compare acceptance when a Spec is supplied

For each material `AC-NN`, decide whether it is satisfied, partial, missing, contradictory, or not verifiable, and point to the supporting evidence. For important user-visible behavior, name the real entry point exercised and what remains unverified. Report an incorrect acceptance rule separately instead of rewriting the Spec to fit the implementation.

## Report

Lead with material findings. For each, explain the problem, its trigger, its practical consequence, the direct evidence, and the smallest repair or verification direction; use stable identifiers when findings will be discussed. State the reviewed object and state, the checks performed, and the limits of the judgment. If nothing material is supported, say so within that scope; no findings is not proof of correctness. If the same turn also revises the design, map each finding to the change it caused or the reason it was not adopted; otherwise a recommendation does not itself revise the design.

For review by another Agent or model, or a review that will be resumed later, read [Cross-Agent review](references/cross-agent-review.md).
