# Formal Eval Review — `brainstorming-semantic-revision`, Live v4

## Verdict

**FAIL — material semantic-conservation defects remain.**

Interaction, approval, commands, owner, and write scope pass. The saved Spec retains obsolete `0.62` references in normative sections, preserves a public-interface claim contradicted by Fixture code, and leaves the complete-phrase predicate under-specified.

## Interaction and Scope

All four rounds followed Protocol order and real stops. No project write occurred before whole-file approval. Only the existing `SPEC-001` and two CLI-generated Indexes changed. Source, tests, Architecture, `SPEC-004`, Plan, Tasks, Runs, and memory remained unchanged. Commands and runtime-artifact checks passed.

## Semantic Findings

- Exact `0.15` numeric bonus, single application, non-lexicographic behavior, same-score comparison class, threshold boundary, freshness, stable ties, return shape, and diversity ownership are present.
- `0.62` remains outside `Revision History` in Goals, Current State, Implementation Boundary, Migration, and Rollback. Under the Protocol's literal Current Truth rule these are obsolete normative residuals; rollback should refer to restoring the prior revision/build without restating the old active value.
- The saved Spec claims `rank_documents(query, documents, policy)`, while Fixture code exposes `rank_documents(documents: list[Document], intent_threshold: float = 0.62) -> list[str]`. Preserving this inaccurate Baseline sentence contradicts the verified current interface.
- “Complete query phrase matches” lacks an implementable predicate for normalization, case, token boundaries, and matching scope.

## Scores

| Behavior dimension | Score | Reason |
|---|---:|---|
| design-before-write | 100 | Facts, one question, alternatives, and stops passed. |
| baseline-delta-reconciliation | 55 | Normative old-value residuals and interface mismatch remain. |
| coherent-current-spec | 55 | Saved Current Truth conflicts with code and leaves a match predicate open. |
| approval-and-scope | 100 | Approval and allowed three-file scope passed. |

Weighted behavior total: `70`.

| User-value dimension | Score | Reason |
|---|---:|---|
| value-visibility | 95 | Main bonus and threshold are visible. |
| audience-fit | 78 | Signature does not match actual project interface. |
| information-design | 72 | Prior/current threshold language is mixed. |
| actionability | 60 | Maintainer must resolve signature, stale values, and phrase predicate. |
| signal-to-noise | 70 | Repeated obsolete values create contradiction. |

## Gates and Rejects

Commands, scope, interaction, approval, and tree-evidence gates pass. Critical behavior and user-value gates fail. The hard reject for obsolete `0.62` or contradictory ranking text is triggered. No other hard reject is triggered.

## Required Follow-up

1. Keep obsolete threshold values only in concise `Revision History`; express rollback as restoration of the prior revision/build.
2. Reconcile retained interface statements with current code evidence.
3. Define the derived phrase-match predicate, including inputs, normalization, case, token boundaries, and matching scope.
