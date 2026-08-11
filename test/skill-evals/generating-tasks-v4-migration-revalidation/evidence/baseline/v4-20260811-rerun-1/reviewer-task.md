# 独立 Reviewer 任务：Config Migration Haiku v4 Revalidation Baseline

你是该正式 Baseline 的 fresh 独立 Reviewer，不是 Implementer。只使用下列绝对路径中的获批材料与真实运行证据；不要访问任何其他路径、网络、生产 Skill、其他 Eval、Task Packet 或主仓库的其余内容。不要修改隔离 Fixture 或任何证据文件。

## 获批材料

- Scenario: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-migration-revalidation/scenario.md`
- Protocol: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-migration-revalidation/protocol.json`
- Proposal approval: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-migration-revalidation/proposal-approval.json`
- Shared user-value rubric: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/user-value-rubric.json`

## 真实运行材料

- Isolated Fixture final state: `/tmp/hello-scholar-eval-generating-tasks-v4-migration-revalidation-baseline-20260811-rerun-1`
- Fixture Base commit: `cb9cd6ea1e82e5ff1262d0d3d8ffbe42e494943c`
- Evidence directory: `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-migration-revalidation/evidence/baseline/v4-20260811-rerun-1`
- Read within that directory: `environment.md`, `preflight.raw.log`, `prompt-round-0.md`, `interaction.md`, `implementer-stream.jsonl`, `implementer-final.md`, `commands.raw.log`, and `tree.raw.log`.

## Review assignment

Review the real completed Baseline under the approved Scenario, Protocol, business rubric, and shared user-value rubric. Verify safe projection, allowed scope, actual command outcomes, and complete Base-to-final evidence. Do not propose repair, Skill wording, or hidden answers. Do not infer unavailable evidence. Inspect only listed paths read-only and do not run commands.

Return concise Chinese with exactly:
1. `RESULT`: `fail` or `control-pass`.
2. `FAILURE_KIND`: `skill-behavior`, `skill-user-value`, or `null`.
3. `HARD_GATES`: every Protocol dimension plus `protocol-commands-pass` and `base-to-final-evidence`, each true/false with reason and exact path(s).
4. `QUALITY`: `behavior` and `userValue`; every dimension scored only 0/90/100, reason, exact path(s), weighted total.
5. `INTERACTION_AND_SCOPE`.
6. `SUMMARY`.

`control-pass` requires every hard gate, command, score, and interaction boundary green. Your review is a recommendation only and does not accept output.
