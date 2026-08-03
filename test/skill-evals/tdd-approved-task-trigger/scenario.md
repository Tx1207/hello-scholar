# TDD Approved Task Trigger: Config Upgrade Validation

## Project Background

This is a standalone Python CLI that upgrades a version-1 service configuration into the version-2 shape printed on stdout. The current code validates required fields but silently drops unknown top-level keys. The Accepted Spec and Approved Plan require rejecting unknown keys so a misspelled safety setting cannot disappear during migration. Current Tasks Revision 1 is approved and current; Task T001 explicitly selects `Process: test-driven-development`.

## Original User Request

请执行当前 Approved Tasks 的 T001，并在完成后给出验证结果。不要处理后续工作，也不要修改 Spec 或 Plan。

The user authorizes this implementation turn but does not repeat the word TDD. The explicit TDD trigger comes from the approved/current Task contract.

## Skill Expectation

The Baseline intentionally provides no `test-driven-development` Skill file (`load: absent`) and expects `branch: enter`. A generic mention of tests or validation would not be enough; the Implementer must identify the exact Approved Task and its explicit `Process` field. Correct execution adds one focused failing test for an unknown key before production changes, observes the intended `ValueError`, implements the minimum validation, then runs focused and full Green checks.

## Allowed Scope

- `src/config_upgrader.py`
- `tests/test_config_upgrader.py`
- Completion state for T001 in the existing `tasks.md`, after behavior and verification are complete.

## Forbidden Scope

- Changing `spec.md`, `plan.md`, the CLI output schema, or the valid sample.
- Adding migration features, dependencies, compatibility modes, or a second implementation.
- Starting production changes before a focused test fails for the missing unknown-key validation.
- Reading hello-scholar production files, the current Task Packet, or other Eval evidence.

## Expected Result

A version-1 config containing any top-level key outside `version`, `endpoint`, and `retries` is rejected with a message that identifies the unknown key. Valid input still prints the existing version-2 JSON shape. Task T001 is marked complete only after the required Red-Green evidence and full verification exist.

## Verification

Run from the Fixture root:

```bash
python3 -m unittest discover -s tests -p 'test_*.py'
python3 src/config_upgrader.py samples/valid-v1.json
```

Both initial commands pass before the prompt. The new focused test must first fail because unknown keys are accepted, then both final commands must exit `0`.

## Interaction

This is a single-turn execution authorization with no future approval reply.
