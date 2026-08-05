# Existing Ranking Sonnet v3 Baseline Environment Preflight

- Isolated Fixture: `/tmp/hello-scholar-eval-manage-specs-existing-v3-baseline-20260804-1146`.
- Fixture source: `test/skill-evals/manage-specs-existing-v3/fixture`.
- Fixture SHA-256: `601297aca42041bc282182104d09ea95c2ce0a575b729b2a6cc84e4629415f58`, matching the approved Proposal binding.
- Scenario SHA-256: `d36cce246487593fd9cb475dae71081de6ef44ef94e489f78629d33c3e2481b9`, matching the approved Proposal binding.
- Protocol SHA-256: `1d1ca62329eee1ee10ed1652d657e0447492e20304809c06bc42fb86eec3e3f2`, matching the approved Proposal binding.
- Shared user-value rubric SHA-256: `34cec8e294ffa92de401947165823b06abdf7ce435a00560d24244f5de4746e4`, matching the approved Protocol binding.
- Base commit: `5d70d1707a8e9e9c166effa25b26e7fc2ee9514c`.
- Base state: `git diff --check HEAD` and `git status --porcelain=v1 -uall` produced no output after the Fixture Base commit.
- Runtime: Node `v24.18.0`; Python `3.10.12`; Git `2.34.1`.
- Initial commands: the absolute docs CLI ran `docs sync` then `docs check` with exit code 0; `PYTHONDONTWRITEBYTECODE=1 python3 -B -m unittest discover -s tests` exited 0 with 2 passing tests.
- Notices: missing Plan and Tasks documents for both fixture Specs were reported only as expected notices, not errors.
- Runtime artifacts: no `__pycache__`, `.pyc`, `.pyo`, `.DS_Store`, or `.hello-scholar-install.json` was present outside `.git`.
- Skill snapshot: `manage-specs` is intentionally absent, as declared by the approved Baseline load.
- Model contract: the forthcoming Implementer and Reviewer are separate new Agents recorded as `claude-sonnet-5` with `forkTurns: none`.
- Raw command output: `preflight.raw.log`.
