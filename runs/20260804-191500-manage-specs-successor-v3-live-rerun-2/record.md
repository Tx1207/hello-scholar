---
schema: 1
kind: record
run_id: 20260804-191500-manage-specs-successor-v3-live-rerun-2
title: manage-specs-successor-v3 Haiku v4 Live rerun 2
status: completed
spec: null
spec_revision: null
plan_revision: null
started: 2026-08-04T19:15:00Z
completed: 2026-08-04T20:05:00Z
decision: fail
summary: The successor relationship and scope passed substantively, but the actual SPEC-012 path omitted the approved and Protocol-required stateless identity.
---

# manage-specs-successor-v3 Haiku v4 Live rerun 2

## 1. Purpose

- Revalidate the successor transaction against the current repaired `manage-specs` hash.

## 2. Hypothesis

- The Skill will retain correct successor classification and reciprocal links.

## 3. Experimental Variables

- Current explicit `manage-specs` snapshot and fresh Haiku agents.

## 4. Controls

- Hash-bound second Live authorization, clean isolated Fixture Base, separate Implementer and Reviewer.

## 5. Execution Information

- Batch: `haiku-v4-spec-live-authorization-batch-v2`
- Batch SHA-256: `1af4f2a1463a42f541b738288673a868d1312745382a70a615d7597da0dc4dd7`
- Fixture Base: `31def0c27bba579419d01450ef689a06a697219a`
- Skill snapshot: `8a61252673b48af9241aaaf1bea0b8568110f0394b809326cfcb6e0e81794bdd`

## 6. Artifact Locations

- Evidence: `test/skill-evals/manage-specs-successor-v3/evidence/live/v4-20260804-rerun-2/`

## 7. Execution Events

| Time | Event | Observation | Action |
| --- | --- | --- | --- |
| 2026-08-04T19:15:00Z | preflight complete | authorized inputs and clean Base verified | dispatch Haiku Implementer |

## 8. Key Results

- Result: `fail`; behavior `95.5/100`, user value `100/100`.
- Classification, approval ordering, reciprocal links, commands, and unrelated scope passed.
- Exact artifact identity failed.

## 9. Observation

- The approval and Protocol required `SPEC-012-signed-stateless-session-tokens`, while the Implementer proposed and created `SPEC-012-signed-session-tokens`.

## 10. Conclusion

- The Skill still shortens a confirmed public identity when deriving successor paths.

## 11. Decision

- `fail`; no user acceptance. Preserve the valid relationship work and exact path failure.

## 12. Next Action

- Strengthen successor-path derivation to preserve all confirmed public identity words before writing, then reauthorize the current Skill hash.
