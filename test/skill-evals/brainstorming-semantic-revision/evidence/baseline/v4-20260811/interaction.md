# Baseline interaction record

- Round 0 (`user`, `current-request`): original request delivered through the safe prompt. The Implementer read current project facts, asked one material question, and made no writes. It also presented three approaches before the clarification answer, continuing beyond the requested stop condition.
- Round 1 (`eval-main`, `future-clarification-answer`): delivered only after round 0 returned. The same Implementer compared approaches and recommended the bounded lexical bonus without writes.
- Round 2 (`eval-main`, `future-approach-selection`): delivered only after round 1 returned. The same Implementer confirmed SPEC-001 ownership and presented one complete reconciled draft without writes.
- Round 3 (`eval-main`, `future-whole-spec-approval`): delivered only after round 2 returned. The same Implementer wrote the reviewed draft, refreshed indexes, ran checks, and stopped.

Prompt projection remained isolated: raw Scenario, raw Protocol, business rubric, hard rejects, Reviewer judgment, and future rounds were not included in any Implementer prompt. The Implementer received only the current frozen message, isolated workspace, project rules, permitted pre-change Skill snapshots, reading boundary, and runner stop instructions.
