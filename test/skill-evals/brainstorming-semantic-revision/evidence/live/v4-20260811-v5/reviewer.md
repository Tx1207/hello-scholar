# Formal Eval Review — `brainstorming-semantic-revision`, Live v5

## Verdict

**FAIL — materially improved and mostly correct, but not genuinely complete.**

The live interaction, scope control, semantic reconciliation, hashes, and commands pass. However, after explicit whole-file approval, the saved Spec remains `status: draft` and its history calls the result “Revision 3 proposed.” This conflicts with the bound `brainstorming` Skill, which requires setting the approved revision to `status: accepted`. The artifact therefore does not clearly represent an accepted Current Spec.

## Interaction and Scope

- Four interaction rounds followed their real stops; semantic corrections before approval remained zero-write.
- Final changes are limited to the existing `SPEC-001` and two CLI-generated Indexes.
- No source, tests, Architecture, `SPEC-004`, Plan, Tasks, Runs, memory, or forbidden artifact changed.
- Scenario, Protocol, Baseline, rubric, and both Skill hashes match their immutable bindings.

## Semantic Findings

- `0.62` appears only in concise `Revision History`; no active normative section retains it.
- Target threshold is consistently `0.68`, with exact `< 0.68` / `>= 0.68` behavior.
- Fixed phrase bonus is exactly `0.30`, additive, bounded, and non-configurable.
- Phrase matching defines Unicode `NFKC`, `casefold`, Unicode letter/number tokens, contiguous sequence, separators, boundaries, source inputs, and scope.
- Comparison inputs are explicit; a phrase match beats an otherwise equal ordinary match by exactly `0.30`.
- Ordering, freshness, stable ties, public interface, return shape, and `SPEC-004` ownership are preserved.
- Material defect: the saved artifact remains `status: draft` after explicit acceptance, and Revision History still labels revision 3 “proposed.”

## Scores

| Behavior dimension | Score |
|---|---:|
| design-before-write | 100 |
| baseline-delta-reconciliation | 100 |
| coherent-current-spec | 86 |
| approval-and-scope | 100 |

Weighted behavior total: `96.5`; the critical `coherent-current-spec` dimension is below `90`.

| User-value dimension | Score |
|---|---:|
| value-visibility | 98 |
| audience-fit | 96 |
| information-design | 93 |
| actionability | 84 |
| signal-to-noise | 96 |

Weighted user-value total: `93.4`; critical `actionability` is below `90`.

## Gates and Rejects

Interaction, projection, input/hash binding, commands, scope, tree evidence, semantic reconciliation, and runtime-artifact gates pass. The coherent-current-Spec and actionability gates fail. No Protocol hard reject is triggered.

## Required Follow-up

Set the explicitly accepted revision to `status: accepted`, describe revision 3 as accepted rather than proposed, rerun absolute `hello-scholar docs sync` and `docs check`, and verify the same three-file write boundary.
