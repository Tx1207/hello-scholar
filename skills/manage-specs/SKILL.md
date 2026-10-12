---
name: manage-specs
description: Create, revise, or replace durable project design when decisions, interfaces, invariants, research comparisons, or acceptance criteria need a stable owner, including changes to an existing Spec during implementation.
---

# Manage Specs

Preserve a design that lets another reader understand what should change, why the choice follows from the evidence, and how to judge the result. Make the relationships between goals, decisions, constraints, and consequences explicit; a list of intended actions is not enough.

In ongoing project design or implementation, save a reviewable proposal as a draft once its purpose and concrete approach are clear, including material open questions. Do not wait for every choice to be settled. Pure explanation, standalone questioning, an explicitly unsaved discussion, or a read-only request stays in the conversation. No prior `grilling` session is required.

## Choose the owner

Start from known design paths and relevant project facts; use Indexes or targeted searches when the owner is unknown. Read the plausible owner in full and inspect relevant Architecture, code, tests, and evidence. Preserve an established project document owner instead of creating a competing Spec. For hello-scholar Specs, choose the simplest supported branch:

- **Revise** when one Spec already owns the same capability and lifecycle.
- **Create** when the capability has an independent value, acceptance boundary, and lifecycle.
- **Replace** when the target design will supersede an adopted contract or implementation model.

Use the decision's responsibility and lifetime to choose, rather than the number of changed files. A small fix may require updating an existing contract; a large local refactor may need no new Spec. Resolve ownership directly when the evidence is clear. Ask one focused question only when equally plausible owners or unresolved user choices would materially change the design. For a new identity, read [assets/spec-identity.md](assets/spec-identity.md).

## Explain the design as a connected argument

Lead with the current recommendation or accepted decision, the objects and behavior that change, and the decisive reason. Connect the problem to a concrete design: who owns each decision and state, how data and control move, what callers observe, and what failures mean. Include the necessary implementation sequence and the check associated with each meaningful step. Explain a material alternative through the tradeoff that ruled it out; do not enumerate options merely to populate a section.

Separate confirmed facts, assumptions, accepted decisions, and unresolved choices. Explain which part of the approach depends on an uncertainty and what would resolve it. Preserve still-valid constraints when revising; do not replace a complete design with a patch note or quietly turn a suggestion into a requirement.

For research, connect the question to a comparison that could change the next choice. State baseline and intervention, data and evaluation conditions, relevant controls or interactions, repetitions, interpretation rules, budget, and stop conditions. An exploratory question need not pretend to be a mature hypothesis. A scientific increment may use several Runs; keep its design and cross-Run conclusion here, with links to the actual executions.

Derive observable acceptance from the user's goal, confirmed business rules, and real external contracts. Use current code and tests as evidence, not as substitutes for an unknown rule. For key behavior, name the actual user or consumer entry point and required outcome. For research, distinguish completing a valid investigation from meeting a candidate's adoption criteria: a negative result can answer the question while leaving adoption unsupported.

Record current evidence and its limits beside stable `AC-NN` identifiers. Make the important finding understandable in the Spec itself, then link the supporting code, checks, reviews, or Runs. References should let readers verify the argument without making them reconstruct it.

## Maintain identity and current meaning

Use `schema: 1` and the canonical path:

```text
hello-scholar/specs/<topic>/SPEC-NNN-<name>/spec.md
```

Start an unsettled design as `draft`. A user acceptance or an explicit request to implement that revision makes it `accepted` once material open decisions are resolved. Implementation progress does not add another status: keep `accepted` and record current evidence beside each stable `AC-NN`. Set `completed` only when all acceptance requirements for the current revision have current evidence.

When scope, behavior, interfaces, constraints, or judgment criteria change, increment `revision` and update the affected design and acceptance together. Reassess the evidence or review conclusions whose assumptions changed; unrelated evidence remains usable within its actual coverage. Evidence-only, formatting, date, or lifecycle updates do not increment the revision. A later Spec revision must not rewrite a past Run's experimental conditions or recorded revision.

For a replacement, describe the intended predecessor in the draft, but do not invalidate the existing Spec yet. Write reciprocal `supersedes` and `superseded_by` links and mark the predecessor `superseded` only after the successor is implemented, accepted for use, and validated.

Use [assets/spec-template.md](assets/spec-template.md) for a new English Spec or [assets/spec-template.zh_CN.md](assets/spec-template.zh_CN.md) for Chinese. Follow the requested language, otherwise the target project or existing Spec. Organize content around the decisions readers need to understand; merge irrelevant template divisions and preserve established external consumers. Existing Specs need not be rearranged merely to match a newer template.

## Finish

Read back the changed design for contradictions, missing decision consequences, and unsupported completion claims. Use available document checks within the current authorization. Run `hello-scholar docs sync` only when the CLI is available and its generated Index writes are authorized; otherwise report skipped maintenance without blocking the Spec. Do not create `plan.md` or `tasks.md`.

Return the current choice, concrete changes, revision and status, key evidence, and any decision still blocking progress. Spec maintenance does not perform implementation by itself. When the original task includes implementation, the main agent continues that task under the existing authorization and brings subsequent design changes and evidence back to their owner.
