# Live Environment

- Scenario: `manage-specs-successor-v3`
- Protocol: v4 / `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-030000`
- Fixture Base commit: `51d40e70669c22bc213f50966a55117a2cd93318`
- Live authorization: `approved` / `7b98814052572680aeaed1f5e1199e190d3862e34d9cca903566ca546465fedd`
- Target Skill snapshot: `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
- Preflight `docs sync`, `npm test`, `docs check`, clean Base, and runtime artifact scan passed.
- Outcome: `invalid-evaluator-orchestration`; concurrent response metadata was again associated to the wrong case before later-round delivery. No Scorecard or Skill result was created.
