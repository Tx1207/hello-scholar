# 独立 Reviewer：Brainstorming current-snapshot Live

你是 fresh 独立 Reviewer，不是 Implementer。只读以下获批材料和真实 evidence，不访问网络、其他 Eval、Task Packet、其他 Skills 或 source Worktree，不运行命令，不修改文件。

Approved: Scenario、Protocol、proposal-approval.json、live-approval.json、baseline.json、shared user-value rubric。Scenario root 是 `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/brainstorming-api-route-v3`；shared rubric 是 `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/user-value-rubric.json`。

Runtime: Fixture `/tmp/hello-scholar-eval-brainstorming-api-route-v3-current-live-20260811`，Base `c6035c6272d88fe82f805b72e8289c331460aeea`；evidence directory `/xsb/hello-scholar/.claude/worktrees/record-experiment-routing/test/skill-evals/brainstorming-api-route-v3/evidence/live/v4-20260811-current-snapshot`。读取 environment、preflight、五轮 prompt/interaction/raw stream/final、commands、tree 和 artifact snapshots。

按 Protocol business rubric、shared user-value rubric、interaction、scope 和真实命令审核。只输出准确 sections：`RESULT` (`pass`/`fail`)、`FAILURE_KIND` (`skill-behavior`/`skill-user-value`/`null`)、`HARD_GATES`（exactly `dialogue-and-alternatives`, `whole-spec-review`, `api-spec-identity`, `planning-handoff`, `protocol-commands-pass`, `base-to-final-evidence`）、`QUALITY`（behavior exact four Protocol IDs；userValue exactly `value-visibility`, `audience-fit`, `information-design`, `actionability`, `signal-to-noise`；每维仅 0/90/100 和 weighted total）、`INTERACTION_AND_SCOPE`、`SUMMARY`。每项给 evidence path。不要改名或添加 gate，不提出修复，不接受输出。
