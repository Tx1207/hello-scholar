---
schema: 1
kind: record
run_id: 20260804-164844-manage-specs-options-v3-baseline
title: manage-specs-options-v3 Haiku v4 Baseline
status: completed
spec: null
spec_revision: null
plan_revision: null
started: 2026-08-04T16:48:44Z
completed: 2026-08-04T17:07:26Z
decision: control-pass
summary: Haiku v4 Baseline completed as control-pass; the general Agent preserved all peer options and the deferred benchmark decision without manage-specs.
---

# manage-specs-options-v3 Haiku v4 Baseline

## 1. Purpose

- Obtain real Baseline evidence with the target Skill absent.

## 2. Hypothesis

- Without the dedicated Skill, the general Implementer may miss a material workflow or user-value boundary.

## 3. Experimental Variables

- Target Skill absent; Haiku v4 Implementer and distinct Reviewer; no inherited conversation.

## 4. Controls

- Hash-bound approved Scenario, Protocol, Fixture, shared rubric, clean isolated Git Base, and evaluator-only prompt projection.

## 5. Execution Information

- Scenario SHA-256: `aa8e78d6bdf4c4fe9e4918dd409800cd3f423de131236c259d76f2c2ff6000cb`
- Protocol SHA-256: `2f13abd2406e1a168a1a7ccc7a04f76812c6714cb58ca2819350615ade717937`
- Fixture Base commit: `7140910da66e0b67a056c4692737ea1657261397`
- Model: `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-manage-specs-options-v3-baseline-20260804-164844`
- Stop rule: record only genuine `fail` or `control-pass`; do not open Live without Red and separate authorization.

## 6. Artifact Locations

- Evidence: `test/skill-evals/manage-specs-options-v3/evidence/baseline/v4-20260804/`
- Result: `test/skill-evals/manage-specs-options-v3/baseline.json`

## 7. Execution Events

| Time | Event | Observation | Action |
| --- | --- | --- | --- |
| 2026-08-04T16:48:44Z | preflight complete | clean Fixture Base and approved inputs verified | dispatch Haiku Implementer |

## 8. Key Results

- Result: `control-pass`.
- Implementer: `a89df3ddede5d8806`; Reviewer: `a1d54c15a3f9ece0c`.
- Baseline SHA-256: `0851f3d6de1bad720ecc3894461fc320b2c881b0b63ef6b3bfa1e0f9707f8308`.
- Behavior and user value: `100/100`.

## 9. Observation

- Without the target Skill, the Agent retained all three peer cache-policy options, comparison metrics, and the explicit benchmark-before-decision state with correct scope and generated Indexes.

## 10. Conclusion

- The valid control already satisfies the full contract.

## 11. Decision

- `control-pass`; this case stops without repair, Live Eval, or Scorecard.

## 12. Next Action

- Preserve the evidence and include the control-pass in final user review.
