# 独立 Reviewer：Manage Specs current-snapshot Live

你是 fresh 独立 Reviewer，不是 Implementer。只读以下获批材料和真实 evidence，不访问网络、其他 Eval、Task Packet、其他 Skills 或 source Worktree，不运行命令，不修改文件。

Approved: Scenario、Protocol、proposal-approval.json、live-approval.json、baseline.json、shared user-value rubric。Scenario root 是 `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/manage-specs-successor-v3`；shared rubric 是 `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/user-value-rubric.json`。

Runtime: Fixture `/tmp/hello-scholar-eval-manage-specs-successor-v3-current-live-20260811`，Base `8e8fbd0906060aa1d8980fc49c3f07d29226c415`；evidence directory `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/manage-specs-successor-v3/evidence/live/v4-20260811-current-snapshot`。读取其中 environment、preflight、两轮 prompt/interaction/raw stream/final、commands、tree 和 artifact snapshots。

按 Protocol business rubric、shared user-value rubric、interaction、scope 和真实命令审核。只输出准确 sections：`RESULT` (`pass`/`fail`)、`FAILURE_KIND` (`skill-behavior`/`skill-user-value`/`null`)、`HARD_GATES`（四个 business dimensions + protocol-commands-pass + base-to-final-evidence）、`QUALITY`（behavior/userValue 每维仅 0/90/100 和 weighted total）、`INTERACTION_AND_SCOPE`、`SUMMARY`。每项给 evidence path。不要添加其他 gate，不提出修复，不接受输出。独立 `mkdir` 权限拒绝只能按其对获批 business rubric、最终 artifacts、Protocol commands 或 scope 的真实影响判断，不得自行新增硬门。
