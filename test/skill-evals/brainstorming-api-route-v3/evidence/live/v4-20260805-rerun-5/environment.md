# Live Environment

- Scenario: `brainstorming-api-route-v3`
- Protocol: v4 / `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-030000`
- Fixture Base commit: `d873e68f8ec8257b27d1c33acc765176eb31c471`
- Live authorization: `approved` / `7b98814052572680aeaed1f5e1199e190d3862e34d9cca903566ca546465fedd`
- `brainstorming`: `3ef4002ba6295d65b4733e183f07bfdb9f9a3452641d982914ab5f1342755796`
- `manage-specs`: `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
- `writing-plans`: `b2d467994de3690321a9a2951137bd029b0eb6e6ee063253e6f1ea0b6d544e05`
- Preflight `docs sync`, `npm test`, `docs check`, clean Base, and runtime artifact scan passed.
- Outcome: `invalid-evaluator-orchestration`; concurrent response metadata was again associated to the wrong case before later-round delivery. No Scorecard or Skill result was created.
