---
schema: 1
kind: record
run_id: 20260804-164844-manage-specs-independent-v3-baseline
title: manage-specs-independent-v3 Haiku v4 Baseline
status: completed
spec: null
spec_revision: null
plan_revision: null
started: 2026-08-04T16:48:44Z
completed: 2026-08-04T17:07:26Z
decision: fail
summary: Haiku v4 Baseline completed with a genuine skill-behavior Red: the independent classification passed, but the confirmed canonical path changed during creation.
---

# manage-specs-independent-v3 Haiku v4 Baseline

## 1. Purpose

- Obtain real Baseline evidence with the target Skill absent.

## 2. Hypothesis

- Without the dedicated Skill, the general Implementer may miss a material workflow or user-value boundary.

## 3. Experimental Variables

- Target Skill absent; Haiku v4 Implementer and distinct Reviewer; no inherited conversation.

## 4. Controls

- Hash-bound approved Scenario, Protocol, Fixture, shared rubric, clean isolated Git Base, and evaluator-only prompt projection.

## 5. Execution Information

- Scenario SHA-256: `5d8bdcdaf8da15bf01fc6a868f24bb3a1fb630a734fdf5c2386cc8fd43e60485`
- Protocol SHA-256: `29ef3d9318946bf900d5bebc603cfb1c77f8f40b8cdf338e09ad113f30318408`
- Fixture Base commit: `b2744b23b93b87d61c94083a2e61167fab74d9cd`
- Model: `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-manage-specs-independent-v3-baseline-20260804-164844`
- Stop rule: record only genuine `fail` or `control-pass`; do not open Live without Red and separate authorization.

## 6. Artifact Locations

- Evidence: `test/skill-evals/manage-specs-independent-v3/evidence/baseline/v4-20260804/`
- Result: `test/skill-evals/manage-specs-independent-v3/baseline.json`

## 7. Execution Events

| Time | Event | Observation | Action |
| --- | --- | --- | --- |
| 2026-08-04T16:48:44Z | preflight complete | clean Fixture Base and approved inputs verified | dispatch Haiku Implementer |

## 8. Key Results

- Result: `fail` / `skill-behavior`.
- Implementer: `a94f4f6fa9e325a96`; Reviewer: `acb27de04001d4517`.
- Baseline SHA-256: `fdff50b58a1b12b68751169d88265260131cc0634c9fc32699cb8554a114b491`.
- Behavior: `75/100`; user value: `100/100`.

## 9. Observation

- The Agent correctly identified an independent Spec and respected the approval gate, but created `SPEC-010-batch-document-retrieval` instead of the confirmed `SPEC-010-batch-retrieval-api` path.

## 10. Conclusion

- Genuine Red attributable to canonical path identity stability.

## 11. Decision

- `fail`; eligible for the minimal `manage-specs` repair and separately authorized Live Eval.

## 12. Next Action

- Run the hash-bound Live Eval against the repaired current Skill snapshot.
