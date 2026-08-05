# 独立 Reviewer 任务：Feature Policy Sonnet v3 Baseline

你是该正式 Baseline 的独立 Reviewer。只使用下列绝对路径中的获批材料与真实运行证据；不要访问任何其他路径、网络、生产 Skill、其他 Eval、Task Packet 或主仓库的其余内容。不要修改隔离 Fixture 或任何证据文件。

## 获批材料

- Scenario: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/scenario.md`
- Protocol: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/protocol.json`
- Proposal approval: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/proposal-approval.json`
- Shared user-value rubric: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/user-value-rubric.json`

## 真实运行材料

- Isolated Fixture final state: `/tmp/hello-scholar-eval-generating-tasks-v3-feature-policy-baseline-4ea23bb3`
- Fixture Base commit: `60820982cd6e1b609f501e1aecb374bf10fce81b`
- Environment preflight: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/environment.md`
- Raw preflight command output: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/preflight.raw.log`
- Safe Prompt projection: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/prompt-round-0.md`
- Actual interaction record: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/interaction.md`
- Implementer final reply: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/implementer-final.md`
- Actual Protocol command output: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/commands.raw.log`
- Complete Base-to-final tree evidence: `/xsb/hello-scholar/.worktrees/next-generation-skill/test/skill-evals/generating-tasks-v3-feature-policy/evidence/baseline/v3-20260803/tree.raw.log`

## Review assignment

Review the real completed Baseline under the approved Scenario, Protocol, business rubric, and shared user-value rubric. Verify that the saved interaction is a safe projection, that the output and final tree respect the allowed scope, that commands have the recorded outcomes, and that the complete tree evidence supports the result.

Do not propose a repair, implementation change, new Skill wording, or hidden answer. Do not infer unavailable evidence. You may inspect the listed Fixture and evidence paths read-only. If you run any command, use only a read-only inspection or a Protocol command that cannot write bytecode, and name it in your final response.

Return a concise Chinese review with exactly these sections:

1. `RESULT`: exactly `fail` or `control-pass`.
2. `FAILURE_KIND`: `skill-behavior`, `skill-user-value`, or `null` when `control-pass`.
3. `HARD_GATES`: every Protocol rubric dimension plus `protocol-commands-pass` and `base-to-final-evidence`, each with `true` or `false`, a short evidence-backed reason, and exact evidence path(s).
4. `QUALITY`: separate `behavior` and `userValue` groups. For every approved dimension, give only a score of `0`, `90`, or `100`, a nonempty evidence-backed reason, and exact evidence path(s). Give each weighted total.
5. `INTERACTION_AND_SCOPE`: state whether the observed safe prompt projection and final tree support the required boundaries, without claiming facts that are not in evidence.
6. `SUMMARY`: factual one-paragraph reason for the Baseline result.

A `control-pass` requires all hard gates, Protocol commands, behavior scores, user-value scores, and the full approved interaction to be green. A `fail` must name the first primary failure classification that the actual evidence supports. Your review is only a recommendation; it does not accept any output for the user.