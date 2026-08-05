---
schema: 1
kind: record
run_id: 20260804-164844-manage-specs-successor-v3-baseline
title: manage-specs-successor-v3 Haiku v4 Baseline
status: completed
spec: null
spec_revision: null
plan_revision: null
started: 2026-08-04T16:48:44Z
completed: 2026-08-04T17:07:26Z
decision: fail
summary: Haiku v4 Baseline completed with a genuine skill-behavior Red: final supersession artifacts passed, but round-one identity classification recommended modifying the existing Spec.
---

# manage-specs-successor-v3 Haiku v4 Baseline

## 1. Purpose

- Obtain real Baseline evidence with the target Skill absent.

## 2. Hypothesis

- Without the dedicated Skill, the general Implementer may miss a material workflow or user-value boundary.

## 3. Experimental Variables

- Target Skill absent; Haiku v4 Implementer and distinct Reviewer; no inherited conversation.

## 4. Controls

- Hash-bound approved Scenario, Protocol, Fixture, shared rubric, clean isolated Git Base, and evaluator-only prompt projection.

## 5. Execution Information

- Scenario SHA-256: `60174a93e1a97990eb978618cb954d201adc1e8495ab169e140d804316b113f0`
- Protocol SHA-256: `82de007040e561ce2313d1bf673c112d9fb766908b09193024b9bb6c868036d1`
- Fixture Base commit: `84caf63a3f2067a1251d5e6ff54d5661b9853d9f`
- Model: `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-manage-specs-successor-v3-baseline-20260804-164844`
- Stop rule: record only genuine `fail` or `control-pass`; do not open Live without Red and separate authorization.

## 6. Artifact Locations

- Evidence: `test/skill-evals/manage-specs-successor-v3/evidence/baseline/v4-20260804/`
- Result: `test/skill-evals/manage-specs-successor-v3/baseline.json`

## 7. Execution Events

| Time | Event | Observation | Action |
| --- | --- | --- | --- |
| 2026-08-04T16:48:44Z | preflight complete | clean Fixture Base and approved inputs verified | dispatch Haiku Implementer |

## 8. Key Results

- Result: `fail` / `skill-behavior`.
- Implementer: `aa67d00c35a1bb52c`; Reviewer: `a507b77a849022bf7`.
- Baseline SHA-256: `7c547ee19d21f182d291808b00ce756adebe0fc593bd9a76a0ba8ebff5ea4550`.
- Behavior: `70/100`; user value: `98/100`.

## 9. Observation

- The final reciprocal, acyclic `SPEC-012`/`SPEC-005` transaction was correct, but round one recommended modifying the existing design and treated successor as only an option.

## 10. Conclusion

- Genuine Red attributable to successor identity classification when the active implementation model removes the required token store.

## 11. Decision

- `fail`; eligible for the minimal `manage-specs` repair and separately authorized Live Eval.

## 12. Next Action

- Run the hash-bound Live Eval against the repaired current Skill snapshot.
