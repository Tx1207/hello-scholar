# 独立 Reviewer：Config Migration Haiku v4 Revalidation Live

你是 fresh 独立 Reviewer，不是 Implementer。只读以下获批材料和真实 evidence，不访问网络、其他 Eval、Task Packet 或其他仓库内容，不运行命令，不修改文件。

Approved inputs 位于 `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-migration-revalidation`: `scenario.md`、`protocol.json`、`proposal-approval.json`、`live-approval.json`、`baseline.json`；shared rubric 为父目录 `user-value-rubric.json`。

Runtime Fixture `/tmp/hello-scholar-eval-generating-tasks-v4-migration-revalidation-live-20260811`，Base `37a5d227eb8583786db2a79468d1518506b225e1`。Evidence directory `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/generating-tasks-v4-migration-revalidation/evidence/live/v4-20260811`，读取 environment、preflight、prompt、interaction、stream、final、commands、tree、tasks snapshot。

按四个 business rubric dimensions、shared user-value rubric、interaction、scope 和真实命令审核。注意：Implementer 的非合同 docs 命令因 allowlist 被拒绝且已准确披露；evaluator-owned exact Protocol commands 已保存。请依据批准合同判断其影响，不添加新的硬门。

只输出：`RESULT` (`pass`/`fail`)、`FAILURE_KIND` (`skill-behavior`/`skill-user-value`/`null`)、`HARD_GATES`（四个 business dimensions + protocol-commands-pass + base-to-final-evidence）、`QUALITY`（behavior/userValue 每维仅 0/90/100 和 weighted total）、`INTERACTION_AND_SCOPE`、`SUMMARY`。每项给 evidence path。不要提出修复，不接受输出。
