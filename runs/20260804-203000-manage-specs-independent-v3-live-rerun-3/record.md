---
schema: 1
kind: record
run_id: 20260804-203000-manage-specs-independent-v3-live-rerun-3
title: manage-specs-independent-v3 Haiku v4 Live rerun 3
status: completed
spec: null
spec_revision: null
plan_revision: null
started: 2026-08-04T20:30:00Z
completed: 2026-08-04T22:15:00Z
decision: fail
summary: The Skill produced the complete public API identity, but that path conflicts with the frozen Protocol allowlist and expected artifact path.
---

# manage-specs-independent-v3 Haiku v4 Live rerun 3

## 1. Purpose

- Execute the third authorized current-hash Spec Skill Live evaluation.

## 2. Hypothesis

- Complete Topic and design identity derivation will match the approved Protocol paths.

## 3. Experimental Variables

- Current explicit `manage-specs` snapshot and fresh Haiku agents.

## 4. Controls

- Hash-bound third Live authorization, clean isolated Fixture Base, separate Implementer and Reviewer.

## 5. Execution Information

- Batch: `haiku-v4-spec-live-authorization-batch-v3`
- Batch SHA-256: `7c698bcdb9d4f0b3074b7cf2e34a719dc45b10714136696c08b4674b3030bfd7`
- Fixture Base: `f3b53c68daa432141071cd4a50035c58f8b6bdd4`
- Skill snapshot: `c9315636edf613017422b28f40d2dbe41f534f693ef1234021a3b82186516b46`
- Implementer: `ab68e2c368656b5b8`
- Reviewer: `a3992eb9a5b3bd0ee`

## 6. Artifact Locations

- Evidence: `test/skill-evals/manage-specs-independent-v3/evidence/live/v4-20260804-rerun-3/`
- Result: `test/skill-evals/manage-specs-independent-v3/scorecard.json`

## 7. Execution Events

| Time | Event | Observation | Action |
| --- | --- | --- | --- |
| 2026-08-04T20:30:00Z | preflight complete | current authorization and clean Base verified | dispatch Haiku Implementer |
| 2026-08-04T21:00:00Z | Implementer complete | exact public identity written; commands pass | dispatch distinct Haiku Reviewer |
| 2026-08-04T22:15:00Z | Reviewer complete | frozen Protocol path differs from artifact path | preserve genuine fail |

## 8. Key Results

- Result: `fail`; behavior `60/100`, user value `100/100`.
- Classification, approval ordering, draft content, Index generation, commands, and unrelated scope passed.
- Exact `paths.allow` and `artifacts.expected` contract failed.

## 9. Observation

- The Skill created `SPEC-010-public-batch-retrieval-api`, while the frozen Protocol requires `SPEC-010-batch-retrieval-api`.
- This mismatch is a Scenario/Protocol identity inconsistency rather than evidence that the current canonical-identity repair shortened the public capability.

## 10. Conclusion

- Preserve the formal failure. Do not alter the frozen approved Protocol or misreport the result as a pass.

## 11. Decision

- `fail`; `userDecision: pending`; no user acceptance.

## 12. Next Action

- Treat this case as a frozen-contract conflict when choosing the next valid successor Scenario; do not weaken the production canonical identity to satisfy the stale path.
