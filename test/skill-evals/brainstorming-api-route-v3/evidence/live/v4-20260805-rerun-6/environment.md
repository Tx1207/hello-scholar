# Live Environment

- Scenario: `brainstorming-api-route-v3`
- Protocol: v4 / `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-brainstorming-api-route-v3-live-20260805-070000`
- Fixture Base commit: `6565e804480f8f12559b3e5069048be1bc342b7c`
- Live authorization: `approved` / `7b98814052572680aeaed1f5e1199e190d3862e34d9cca903566ca546465fedd`
- Brainstorming snapshot: `3ef4002ba6295d65b4733e183f07bfdb9f9a3452641d982914ab5f1342755796`
- Manage-specs snapshot: `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
- Writing-plans snapshot: `b2d467994de3690321a9a2951137bd029b0eb6e6ee063253e6f1ea0b6d544e05`
- Preflight `docs sync`, `npm test`, `docs check`, clean Base, and runtime artifact scan passed.
- One serial Haiku Implementer must retain the same session across all five rounds.
- Every shell command must use explicit `env -C` isolation.
