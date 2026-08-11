---
schema: 1
kind: architecture
status: current
applies_to: main
updated: 2026-07-30
---
# Current Architecture

`src/policy.py` evaluates global defaults and tenant overrides. Rules are in-memory dictionaries; callers receive one boolean and do not observe evaluation details.
