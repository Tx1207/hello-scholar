---
name: manage-specs
description: Create, revise, or replace durable project design when decisions, interfaces, invariants, research comparisons, or acceptance criteria need a stable owner, including changes to an existing Spec during implementation.
---

# Manage Specs

Preserve a design that lets another reader understand what should change, why the choice follows from the evidence, and how to judge the result. A list of intended actions is not enough; make the relationships between goals, decisions, constraints, and consequences explicit.

Save a reviewable proposal as a draft once its purpose and concrete approach are clear, including material open questions; do not wait for every choice to be settled.

## Choose the owner

Start from known design paths, then Indexes or targeted searches. Read the plausible owner in full with the relevant Architecture, code, tests, and evidence. Preserve an established project document owner instead of creating a competing Spec. For hello-scholar Specs:

- **Revise** when one Spec already owns the same capability and lifecycle.
- **Create** when the capability has an independent value, acceptance boundary, and lifecycle.
- **Replace** when the target design will supersede an adopted contract or implementation model.

Choose by the decision's responsibility and lifetime, not the number of changed files. Ask one focused question only when equally plausible owners would materially change the design.

A new Spec takes the next global number (counting rejected and superseded IDs, at least three digits), reuses the established Topic or the narrow capability boundary shown by Architecture and callers, and is named after the stable public capability rather than the chosen implementation approach: `hello-scholar/specs/<topic>/SPEC-NNN-<name>/spec.md`, for example `batch-retrieval/SPEC-004-public-batch-retrieval-api`.

## Explain the design as a connected argument

Lead with the current recommendation or accepted decision, the objects and behavior that change, and the decisive reason. Connect the problem to a concrete design: who owns each decision and state, how data and control move, what callers observe, and what failures mean. Include the necessary implementation sequence with the check for each meaningful step. Explain a material alternative through the tradeoff that ruled it out.

Separate confirmed facts, assumptions, accepted decisions, and unresolved choices, and say which part of the approach depends on each uncertainty. When revising, keep still-valid constraints and keep the body as the current design; record what changed and why in Revision Notes instead of stacking old revisions in the body. Do not quietly turn a suggestion into a requirement.

For research, connect the question to a comparison that could change the next choice: baseline and intervention, data and evaluation conditions, controls, repetitions, interpretation rules, budget, and stop conditions. Name the prior Runs and artifacts the design reuses and what differs from them. Keep the cross-Run conclusion here, with links to the Runs.

Derive observable acceptance from the user's goal, confirmed business rules, and real external contracts, not from current code output. Record current evidence and its limits beside stable `AC-NN` identifiers, making the important finding understandable in the Spec itself before linking checks, reviews, or Runs.

## Maintain identity and current meaning

Use `schema: 1`. Start an unsettled design as `draft`. A user acceptance or an explicit request to implement that revision makes it `accepted` once material open decisions are resolved; implementation progress adds no status. Set `completed` only when every acceptance requirement of the current revision has current evidence.

Increment `revision` when scope, behavior, interfaces, constraints, or judgment criteria change, and update the affected design and acceptance together. Evidence-only, formatting, date, or lifecycle updates keep the revision. A later revision never rewrites a past Run's conditions or recorded revision.

For a replacement, describe the intended predecessor in the draft without invalidating it. Write reciprocal `supersedes` and `superseded_by` links and mark the predecessor `superseded` only after the successor is implemented, accepted for use, and validated.

Use [assets/spec-template.md](assets/spec-template.md) for English or [assets/spec-template.zh_CN.md](assets/spec-template.zh_CN.md) for Chinese. Merge template divisions that do not help this design; existing Specs need not be rearranged to match a newer template.

## Finish

Read back the changed design for contradictions, missing consequences, and unsupported completion claims, and run `hello-scholar docs check` when available.

The reply, not the Spec file, is what the user reads now. Make it understandable without opening the Spec:

- each decision that changed relative to the previous revision, one line as before → after, with the evidence, review finding, or user decision that caused it; take the list from the Spec's actual diff and its Revision Notes rather than from memory, and state decisions rather than section numbers;
- how to proceed: ordered steps, how each is judged, and the budget and stop conditions;
- choices the user still has to make;
- the Spec path, revision, and status, last.

When another agent will implement, end with a ready-to-paste execution request in a fenced block: the Spec path and revision, ordered steps, prior Runs and artifacts to reuse, acceptance checks, stop conditions, and what is out of scope.
