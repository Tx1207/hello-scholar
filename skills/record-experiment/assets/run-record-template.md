---
schema: 2
kind: record
run_id: <run-id>
title: <human-readable title>
status: planned
entry: <entry script or command>
derived_from: null
spec: null
spec_revision: null
started: null
completed: null
decision: pending
summary: <condition and current known facts>
---

# <human-readable title>

## 1. Current Findings and Interpretation

<Lead with the actual result and what it supports. While planned or running, say that results are unavailable or partial. Explain the decisive evidence, comparison limits, and any decision actually made or the next unresolved choice.>

## 2. Question and Comparison

<State the question and link the owning Spec when one exists. Explain what changed relative to the baseline, which controls make interpretation possible, and what would count as supporting, negative, or inconclusive evidence.>

- Derived from:
- Difference from that Run:
- Reused artifacts:

## 3. Execution Information

- Exact command:
- CWD:
- Config and CLI overrides:
- Seed:
- Data version / split:
- Input artifacts:
- Model / checkpoint:
- Code version (Git commit and working-tree state, or snapshot path):
- Machine / GPU / environment:
- Expected signal:
- Failure signal:
- Stop rule:

## 4. Artifact Locations

- stdout:
- stderr:
- Results:
- Checkpoints (actual path under the artifact root):
- Exit code / signal:
- Dashboard / tracking URL:

## 5. Material Execution Events

<Record changes that affect interpretation or recovery: actual launch, configuration deviations, failures, interruptions, and completion. Repeated polling without a meaningful change needs no event.>

| Time | Event | Observation | Action |
|---|---|---|---|
