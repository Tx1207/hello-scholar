# 独立 Reviewer 任务：Feature Policy Haiku v4 Revalidation Baseline

你是该正式 Baseline 的 fresh 独立 Reviewer，不是 Implementer。只使用下列绝对路径中的获批材料与真实运行证据；不要访问任何其他路径、网络、生产 Skill、其他 Eval、Task Packet 或主仓库的其余内容。不要修改隔离 Fixture 或任何证据文件。

## 获批材料

- Scenario: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/scenario.md`
- Protocol: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/protocol.json`
- Proposal approval: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/proposal-approval.json`
- Shared user-value rubric: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/user-value-rubric.json`

## 真实运行材料

- Isolated Fixture final state: `/tmp/hello-scholar-eval-generating-tasks-v4-feature-policy-revalidation-baseline-20260811`
- Fixture Base commit: `88381176183cdbf375182e762529ed4e06893355`
- Environment preflight: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/evidence/baseline/v4-20260811/environment.md`
- Raw preflight command output: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/evidence/baseline/v4-20260811/preflight.raw.log`
- Safe Prompt projection: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/evidence/baseline/v4-20260811/prompt-round-0.md`
- Actual interaction record: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/evidence/baseline/v4-20260811/interaction.md`
- Raw Implementer stream: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/evidence/baseline/v4-20260811/implementer-stream.jsonl`
- Implementer final reply: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/evidence/baseline/v4-20260811/implementer-final.md`
- Actual Protocol command output: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/evidence/baseline/v4-20260811/commands.raw.log`
- Complete Base-to-final tree evidence: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-feature-policy-revalidation/evidence/baseline/v4-20260811/tree.raw.log`

## Review assignment

Review the real completed Baseline under the approved Scenario, Protocol, business rubric, and shared user-value rubric. Verify that the saved interaction is a safe projection, that the output and final tree respect the allowed scope, that commands have the recorded outcomes, and that complete tree evidence supports the result.

Do not propose a repair, implementation change, new Skill wording, or hidden answer. Do not infer unavailable evidence. You may inspect only the listed Fixture and evidence paths read-only. Do not run commands; all command outcomes needed for review are already saved.

Return a concise Chinese review with exactly these sections:

1. `RESULT`: exactly `fail` or `control-pass`.
2. `FAILURE_KIND`: `skill-behavior`, `skill-user-value`, or `null` when `control-pass`.
3. `HARD_GATES`: every Protocol rubric dimension plus `protocol-commands-pass` and `base-to-final-evidence`, each with `true` or `false`, a short evidence-backed reason, and exact evidence path(s).
4. `QUALITY`: separate `behavior` and `userValue` groups. For every approved dimension, give only a score of `0`, `90`, or `100`, a nonempty evidence-backed reason, and exact evidence path(s). Give each weighted total.
5. `INTERACTION_AND_SCOPE`: state whether the observed safe prompt projection and final tree support the required boundaries, without claiming facts absent from evidence.
6. `SUMMARY`: factual one-paragraph reason for the Baseline result.

A `control-pass` requires all hard gates, Protocol commands, behavior scores, user-value scores, and the full approved interaction to be green. A `fail` must name the first primary failure classification supported by actual evidence. Your review is only a recommendation; it does not accept any output for the user.
