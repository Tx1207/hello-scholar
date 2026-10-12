---
schema: 2
kind: record
run_id: <run-id>
title: <human-readable title>
status: planned
spec: null
spec_revision: null
started: null
completed: null
decision: pending
summary: <current known facts only>
---

# <human-readable title>

## 1. Current Findings and Interpretation

<Lead with the actual result and what it supports. While planned or running, state that results are unavailable or partial. Explain the decisive evidence, validity and comparison limits, and any actual decision or unresolved next choice. Do not turn an expected result into an observation or a recommendation into an adopted decision.>

- Key measurements and conditions:
- Supporting result or error evidence:
- What this Run establishes and leaves unresolved:
- Decision already made or pending; next action and reason:

## 2. Question and Comparison

<State the question this execution addresses and link the owning Spec or protocol when one exists. An exploratory question may have no mature hypothesis. Explain what changed relative to the baseline or prior conditions, which controls make interpretation possible, and what would count as supporting, negative, or inconclusive evidence.>

## 3. Execution Information

- Exact command:
- CWD:
- Script / entry point:
- Config:
- CLI overrides:
- Seed:
- Data version / split:
- Preprocessing:
- Input artifacts:
- Upstream Run ID:
- Derived artifacts:
- Model / checkpoint:
- Evaluation / generation settings:
- Git branch:
- Git commit:
- Git working-tree state:
- Backend:
- Machine / GPU:
- Python / environment:
- Expected signal:
- Failure signal:
- Stop rule:

## 4. Artifact Locations

- Intended stdout path:
- Intended stderr path:
- Intended result path:
- Intended checkpoint path:
- Actual stdout path:
- Actual stderr path:
- Actual result path:
- Actual checkpoint path:
- Exit code / signal:
- Dashboard / tracking URL:

## 5. Material Execution Events

<Record changes that affect interpretation or recovery, including actual launch, effective configuration deviations, failures, interruptions, and completion. Keep full logs in their actual locations. Repeated polling without a meaningful change needs no event.>

| Time | Event | Observation | Action |
|---|---|---|---|
