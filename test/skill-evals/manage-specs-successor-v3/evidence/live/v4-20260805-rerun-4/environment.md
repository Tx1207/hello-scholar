# Live Environment

- Scenario: `manage-specs-successor-v3`
- Protocol: v4 / `claude-haiku-4-5-20251001`
- Isolated Fixture: `/tmp/hello-scholar-eval-manage-specs-successor-v3-live-20260805-000000`
- Fixture Base commit: `188ba4f0066ae97feaf694eb8983dad7a1c532f9`
- Live authorization: `approved` / `7b98814052572680aeaed1f5e1199e190d3862e34d9cca903566ca546465fedd`
- Target Skill snapshot: `2c4e013ed1a0ded9841e0af94699bb547bb3150b653b443b04c00cb6347dac82`
- Preflight commands, clean Base, and runtime artifact scan passed.
- Outcome: `invalid-evaluator-orchestration`; a later Protocol message was delivered to the wrong case Agent, so no Scorecard or Skill quality result may be derived from this attempt.
