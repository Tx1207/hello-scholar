# Formal Eval Review: `brainstorming-semantic-revision` Live v3

## Verdict

**FAIL — material semantic-contract defect; no hard-reject scope or interaction violation.**

The interaction protocol, approval boundary, ownership decision, tree scope, and commands all pass. However, the revised Spec does not close the phrase-ordering contract sufficiently for implementation and testing without inventing a material definition of “otherwise comparable.” The saved Spec also retains several `0.62` references that are acceptable as historical context, but the `Current State` wording should be explicitly framed as the pre-revision baseline rather than current normative truth.

## Interaction and Projection

- Four rounds were delivered in protocol order.
- Round 0 read the required facts, asked exactly one material question, and made no writes.
- Round 1 compared three approaches, recommended Option A, and made no writes.
- Round 2 classified `Update Existing Spec`, confirmed `SPEC-001`, presented a complete Revision 3 draft, and made no writes.
- Round 3 followed whole-file approval and stopped after the bounded write and Index refresh.
- No future evaluator reply, raw rubric, prior judgment, or Protocol detail was projected early.

## Semantic-Conservation Findings

### Preserved correctly

The final Spec preserves existing identity, created metadata, ownership boundary, public ranking entry and return type, lexical/semantic/freshness weights, freshness contribution, stable ties, `SPEC-004` diversity ownership, migration and rollback sections, and the absence of a new public phrase parameter or result structure.

### `0.62` references

- Goals: historical change rationale; acceptable.
- Current State: intended as baseline context, but present-tense “current” wording can conflict with Target Design and should explicitly say pre-revision baseline.
- Interfaces: historical transition explanation; acceptable.
- Rollback: historical rollback behavior; acceptable.
- Revision History: concise permitted history.

The issue is Current State clarity rather than the mere presence of the number.

### Phrase bonus and ordering

The exact bonus value is closed at `0.15` for a deterministic complete normalized query phrase and `0.00` otherwise. Partial, fuzzy, semantic-only, and ordinary-term matches are excluded.

The ordering contract remains materially open because “otherwise comparable” does not define which signals are equal, what tolerance is allowed, or what numeric base-score difference the bonus must dominate. Since the bonus contributes `0.15 * 0.7 = 0.105` to total score, tests cannot derive a unique comparison boundary without inventing a decision.

## Scope, Tree, and Commands

Only the existing Spec and two generated Indexes changed. No source, tests, Architecture, `SPEC-004`, Plan, Tasks, Runs, memory, or Skills changed. No staged/untracked files or runtime artifacts remained. Python tests, `docs sync`, `docs check`, and `git diff --check` passed.

## Protocol Behavior Scores

| Dimension | Score | Assessment |
|---|---:|---|
| Design before write | 100 | Required facts, one material question, and three approaches preceded writing. |
| Baseline–Delta reconciliation | 85 | Retained decisions pass, but phrase-order semantics remain under-specified and Current State needs baseline framing. |
| Coherent Current Spec | 88 | One complete Spec exists, but “otherwise comparable” leaves a material implementation/testing decision open. |
| Approval and scope | 100 | Whole-file approval preceded the allowed three-file write set. |

Weighted total: `88.45`.

## User-Value Scores

| Dimension | Score | Assessment |
|---|---:|---|
| Value visibility | 95 | Revised behavior and preserved boundaries are visible early. |
| Audience fit | 94 | Terminology and depth fit the project. |
| Information design | 92 | Standalone structure is clear; Current State labeling is ambiguous. |
| Actionability | 84 | Implementation cannot uniquely determine “otherwise comparable” ordering. |
| Signal-to-noise | 94 | Focused and free of unrelated process narration. |

Weighted total: `91.8`; actionability remains below its critical minimum.

## Gates and Hard Rejects

- Critical behavior dimensions ≥90: fail.
- Behavior total ≥90: fail.
- User-value total ≥90: pass, but actionability critical dimension fails.
- Commands, scope, interaction, and no-hard-reject gates: pass.
- No hard reject was triggered.

## Material Defects

1. Define the exact comparison class and numerical boundary for phrase-over-term ordering.
2. Explicitly frame superseded `Current State` facts as pre-revision baseline or remove them from current normative text.

Artifact evidence overrides the Implementer’s completion narrative.
