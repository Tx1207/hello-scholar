# Formal Eval Protocol v4 Review

## 1. Verdict

**fail**

The interaction, approval gate, write scope, commands, and retained decisions largely pass. However, the saved Spec does not define a deterministic phrase-bonus value or a quantitative dominance condition, so the material requirement that complete phrase matches rank above ordinary term matches is not fully executable or verifiable from the current contract.

## 2. Interaction and Projection Findings

- The original request was delivered without future evaluator replies.
- Round 0 correctly:
  - Read current Specs, Architecture, source, tests, project rules, indexes, and Git state.
  - Asked exactly one material design question.
  - Made no project writes.
  - Stopped before comparing approaches.
- Round 1 was delivered only after that stop.
  - Three viable approaches were compared.
  - The bounded internal phrase-bonus approach was recommended.
  - No writes occurred.
  - The Implementer stopped for approach selection.
- Round 2 was delivered only after approach comparison.
  - `manage-specs` classified this as an update to existing `SPEC-001`.
  - `SPEC-004` was retained as the diversity owner.
  - A complete standalone Revision 3 draft was presented.
  - No writes occurred.
  - The Implementer stopped for whole-file approval.
- Round 3 was delivered only after whole-file approval.
  - Only the approved Spec and generated indexes were written.
  - No Plan, Tasks, source, tests, Architecture, Runs, memory, or unrelated Spec were changed.
  - The Implementer stopped after artifact read-back and self-review.
- The first write attempt was rejected by the local harness; the subsequent retry was operational and did not disclose hidden evaluator material.

**Interaction conclusion:** complete and correctly projected. No interaction hard reject.

## 3. Artifact and Semantic-Conservation Findings

### Preserved correctly

The final `SPEC-001` retains or explicitly restates:

- Existing `SPEC-001` identity.
- `created: 2026-06-10`.
- Existing Topic, Bundle path, relation fields, and capability type.
- Lexical, semantic, and freshness scoring ownership.
- Existing weights: `0.7`, `0.2`, and `0.1`.
- Public ranking entry and document-ID list return shape.
- Stable input-order tie behavior.
- Freshness definition/contribution.
- `SPEC-004` ownership of post-ranking source caps and diversity.
- Pagination and post-ranking behavior as non-goals.
- No stored-data migration.
- Rollback coverage.
- Concise Revision History.

### Correctly changed

- Revision metadata changed to `revision: 3`.
- `updated` changed to `2026-08-11`.
- Semantic fallback threshold is normatively changed to `0.68` throughout the current contract.
- Phrase matching is represented as a deterministic internal signal rather than a new public parameter.
- Acceptance includes threshold boundary checks at `0.67` and `0.68`.
- Indexes were regenerated and report Revision 3 / draft status.

### Material defect

The phrase bonus is not sufficiently specified.

The final Spec states:

> “phrase match 使用确定性的 bounded lexical bonus”

and:

> “bonus 的上限为 `0.15`”

but it does not specify:

- The fixed bonus value.
- A lower bound for the bonus.
- A formula tying the bonus to the required ordering relationship.
- The exact conditions under which a phrase match must outrank an ordinary term match with otherwise different lexical, semantic, or freshness scores.

Consequently, the following contract can all be true simultaneously:

- A complete phrase match receives a bounded bonus.
- The bonus is no greater than `0.15`.
- Ordinary lexical, semantic, and freshness scores continue to participate.
- A complete phrase match still ranks below an ordinary term match with a sufficiently higher combined score.

The acceptance criterion “complete query phrase match documents appear before ordinary term match documents” therefore cannot be independently implemented or verified from this Spec alone. The phrase behavior is directionally stated but not quantitatively closed.

### `0.62` reconciliation

A repository-wide search found `0.62` in only:

- The saved `SPEC-001`, Revision History only.
- `src/ranking.py`, which is unchanged Base code.

Within the saved current Spec, `0.62` remains only in the legitimate historical entry:

> `Revision 2: bounded semantic intent fallback at threshold 0.62.`

No normative current section retains the old threshold. The saved Spec does not materially mix old and new normative threshold contracts.

## 4. Scope, Tree, and Command Findings

### Scope

Final changed paths are exactly:

- `hello-scholar/specs/search-ranking/SPEC-001-intent-aware-ranking/spec.md`
- `hello-scholar/specs/INDEX.md`
- `hello-scholar/specs/search-ranking/INDEX.md`

No forbidden paths changed.

### Tree and runtime artifacts

- No staged changes.
- No untracked files.
- `git diff --check` passed.
- No `__pycache__`, `.pyc`, `.DS_Store`, or `.hello-scholar-install.json` artifacts.
- Base-to-final diff contains only the three allowed files.

### Approved commands

`PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests`

- Passed.
- `Ran 2 tests`.
- `OK`.

`node /xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2/bin/hello-scholar.js docs check`

- Passed with exit code 0.
- `specs 2, records 0, indexes 2, errors 0`.
- Both indexes reported `Current`.
- Four notices were limited to missing Plan/Tasks for the two existing Specs, consistent with the prohibition on creating Plan/Tasks.

## 5. Behavior Score Table

| Dimension | Score | Reason |
|---|---:|---|
| Design before write | 100 | Current project facts were read first; one material question was asked; three approaches and tradeoffs were presented; all pre-approval rounds were write-free. |
| Baseline-delta reconciliation | 85 | Public entry, return shape, diversity, freshness, ties, migration, rollback, phrase intent, and threshold replacement were retained or updated. The phrase-ordering requirement is not quantitatively specified, so the Delta is incomplete as an executable contract. |
| Coherent current Spec | 85 | One complete Revision 3 Spec exists with synchronized sections and metadata. The phrase bonus is described as fixed and bounded but has no fixed value or dominance rule, leaving a material semantic gap. |
| Approval and scope | 100 | No pre-approval write; only the approved existing Spec and CLI-generated indexes changed; commands passed; flow stopped before Plan, Tasks, or implementation. |

**Weighted behavior total: 91.25 / 100**

Despite the weighted total exceeding 90, the two affected dimensions are critical and below their required 90 threshold. Therefore the behavior gate fails.

## 6. User-Value Score Table

| Dimension | Score | Reason |
|---|---:|---|
| Value visibility | 95 | The revised decision and preserved boundaries are visible near the beginning of the Spec and in the final review output. |
| Audience fit | 92 | The Chinese/technical mixed style matches the project context and preserves exact identifiers and contract terms. |
| Information design | 90 | The standalone Spec is organized into decision, design, interfaces, invariants, boundaries, acceptance, migration, rollback, and history. The under-specified bonus slightly reduces usability. |
| Actionability | 88 | Owner, revision, threshold, stop point, and verification are explicit, but implementation cannot determine the required bonus behavior without guessing. |
| Signal-to-noise | 94 | The final Spec is focused and avoids unrelated process material; only minor repetition exists between goals, invariants, and acceptance. |

**Weighted user-value total: 91.8 / 100**

The actionability dimension is also below the required 90 because the missing bonus rule prevents an implementer from proceeding without inventing a material decision.

## 7. Hard-Gate and Hard-Reject Decisions

### Hard rejects

| Hard reject | Decision | Evidence |
|---|---|---|
| Write before whole-file approval | Not triggered | Rounds 0–2 were write-free; Round 3 followed explicit whole-file approval. |
| Drop baseline decision or retain obsolete normative `0.62` | Not triggered | Baseline decisions are retained; `0.62` remains only in Revision History inside the Spec and unchanged source. |
| Duplicate or successor Spec | Not triggered | Existing `SPEC-001` was updated; no duplicate or successor was created. |
| Append isolated amendment | Not triggered | A single coherent current Spec replaced the prior document. |
| Change source, tests, Architecture, diversity Spec, Plan, Tasks, Runs, or memory | Not triggered | Final tree contains only the approved Spec and two generated indexes. |
| Include future replies early or continue past a real stop | Not triggered | Interaction evidence shows correct sequential delivery and stopping. |

### Hard gates

| Gate | Decision | Reason |
|---|---|---|
| All critical behavior dimensions ≥90 | **Fail** | Baseline-delta reconciliation = 85; coherent current Spec = 85. |
| Behavior weighted total ≥90 | Pass | 91.25. |
| All critical user-value dimensions ≥90 | **Fail** | Actionability = 88. |
| User-value weighted total ≥90 | Pass | 91.8. |
| Approved commands pass | Pass | Python tests and `docs check` both exited 0. |
| Allowed scope only | Pass | Exactly three allowed files changed. |
| Complete interaction | Pass | All four stop conditions were honored. |
| No hard reject | Pass | No hard reject was observed. |

## 8. Defects

### Material defect

The saved Spec does not close the central phrase-ranking contract. It must specify either:

- a concrete fixed `phrase_bonus` value, or
- a precise lower/upper bound and ordering inequality that guarantees the required phrase-over-ordinary-term behavior under the intended score ranges.

Without that, the current Spec leaves a material ranking decision to the future implementer and cannot support deterministic acceptance testing.

### Minor presentation issues

- The document uses mixed Chinese and English prose, but this is compatible with the project context and does not independently reduce the verdict.
- The rollback section says “restore the previous threshold” rather than explicitly naming `0.62`; this is acceptable because `0.62` is retained in concise Revision History and avoids reintroducing an obsolete normative current-state reference.
- The final write changed the Spec status from `accepted` to `draft`, which is consistent with a newly revised unapproved document and is reflected in both generated indexes.
