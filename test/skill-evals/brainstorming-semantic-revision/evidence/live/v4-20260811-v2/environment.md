# Live environment

- Scenario: `brainstorming-semantic-revision`
- Protocol: v4
- Workspace: `/tmp/hello-scholar-eval-brainstorming-semantic-revision-live-v2-20260811a`
- Fixture base commit: `a52f5ce06859d7469e8d554a2dcdea763cc83ca6`
- Implementer: `a8bad765066bac296`
- Model: `claude-haiku-4-5-20251001`
- Fork turns: `none`
- Scenario SHA-256: `8f2d9f225c285e22f21945d2de46ccc622a60c48c0aaf2b3af800308349413ed`
- Protocol SHA-256: `7dd7e2130d1dbf964ac63e5fe977064cdf8b6a04f686d5e6f200f1ea96a5d05d`
- Fixture SHA-256: `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`
- Baseline SHA-256: `902c6e618b2e9f61452b89e557d908cfdae3c0d0164e1863973c7a6325c31e9e`
- Live approval SHA-256: `aac9af86b2a60b48e1d144e7af0faeadbbfd0775aefd302e35b77b7ebed3ebcd`
- Shared user-value rubric SHA-256: `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`
- Current explicit-file Skill tree SHA-256:
  - `brainstorming`: `1b6e1254d3f9c29fb0a7384267462de0cbcf83c6e1dcbbbd0ed74ddbc8fcd225`
  - `manage-specs`: `c2dc722474c3b2f6e9d276118f81f4b054d1227bf173d60296abd49e8c1114f5`

The copied Fixture was synchronized, checked, committed, and clean before round zero. Initial checks passed. Prompt projection hid raw Scenario, raw Protocol, rubrics, hard rejects, expected output, future messages, baseline evidence, prior Live evidence, and the surrounding conversation from the Implementer.

During the final write, local harness policy rejected the first whole-file overwrite. The same Implementer conversation was resumed with operational guidance only. After a fresh complete `Read`, a dedicated `Edit` wrote the selected draft and its artifact read-back correction. No Scenario fact, rubric, expected answer, or future evaluator content was disclosed. These retries did not change the frozen Protocol messages or workspace boundary.

The approved commands passed. The final tree contains no `__pycache__`, `.pyc`, `.DS_Store`, or `.hello-scholar-install.json` runtime artifact.
