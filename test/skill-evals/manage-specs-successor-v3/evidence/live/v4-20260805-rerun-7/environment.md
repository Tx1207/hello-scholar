# Live Environment

- Scenario: `manage-specs-successor-v3`
- Protocol: v4 / `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-040000`
- Fixture Base commit: `74d6103c8992ced1d7a64de55c0719d3dfadf04c`
- Live authorization: `approved` / `7b98814052572680aeaed1f5e1199e190d3862e34d9cca903566ca546465fedd`
- Target Skill snapshot: `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
- Preflight `docs sync`, `npm test`, `docs check`, clean Base, and runtime artifact scan passed.
- Execution was strictly serial, but later shell commands omitted explicit `env -C` and ran in the parent worktree. Outcome: `invalid-evaluator-shell-boundary`; no Scorecard or Skill result was created.
