# Live Environment

- Scenario: `brainstorming-api-route-v3`
- Protocol: v4 / `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-000000`
- Fixture Base commit: `9f5101b19587e8ac1106695db2c624e812fa39ba`
- Live authorization: `approved` / `7b98814052572680aeaed1f5e1199e190d3862e34d9cca903566ca546465fedd`
- `brainstorming`: `3ef4002ba6295d65b4733e183f07bfdb9f9a3452641d982914ab5f1342755796`
- `manage-specs`: `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
- `writing-plans`: `b2d467994de3690321a9a2951137bd029b0eb6e6ee063253e6f1ea0b6d544e05`
- Preflight commands, clean Base, and runtime artifact scan passed.
- Outcome: `invalid-evaluator-orchestration`; a later Protocol message was delivered to the wrong case Agent, so no Scorecard or Skill quality result may be derived from this attempt.
