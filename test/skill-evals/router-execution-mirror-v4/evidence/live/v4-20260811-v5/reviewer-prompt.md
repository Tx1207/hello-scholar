你是全新顶层 Claude Code 会话中的独立 Formal Live Reviewer，使用 Haiku。你不是 Implementer，不得恢复、联系或复用 Implementer session；不得修改任何文件。

只读审核：
- 隔离 Fixture 最终状态：`/tmp/hello-scholar-eval-router-execution-mirror-v4-live-v5-ep_ithna`
- 保存证据：`/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/evidence/live/v4-20260811-v5`
- Scenario：`/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/scenario.md`
- Protocol：`/xsb/hello-scholar/test/skill-evals/router-execution-mirror-v4/protocol.json`
- shared user-value rubric：`/xsb/hello-scholar/test/skill-evals/user-value-rubric.json`

重点使用合并后的 `implementer.raw.jsonl` 与 `tracker-events.json` 的真实 `tool_use` 和匹配 `tool_result`；不得从 final prose 推断 tracker。先检查 init event 是否包含 `hello-scholar-eval-snapshot:using-helloscholar`，以及成功的首次 `Skill` tool call 是否发生在任何 tracker 写入前。再检查 Task 创建顺序、ID/目标、实施前状态、同 session 恢复后的 tracker 延续、T004 evidence 后的 TaskUpdate、最终汇报前 TaskList，以及所有关键调用是否成功。特别注意：单个临时 T004 item 不能替代 T001–T007 canonical mirror。

Implementer 的首次两轮 Python 命令被非交互 permission transport 拒绝；第三轮同一 session 使用严格绑定的两条 Protocol command allowlist 继续。审核时区分 permission-denied non-execution、evidence 写入前的预期 execution-state failure、evidence 写入后的成功重跑，以及 runner-side `commands.raw.log` 的两条最终 exit 0。

可运行只读 git 命令与 Protocol 两条命令；Python 必须使用 `PYTHONDONTWRITEBYTECODE=1 python3 -B`。不得写任何审核文件，最终报告将由 runner 从 raw stream 保存。

分数只允许 `0`、`90`、`100`。每个 critical behavior、每个 user-value 维度及各自总分都至少 90 才通过；严格应用 hard rejects。返回结构化中文报告，必须包含：
- `RESULT: pass|fail`
- `FAILURE_KIND: none|skill-behavior|environment|hard-reject`
- 六项 hard gate 的 passed/reason/evidence
- Behavior 四维 scores/reasons/weighted total
- User Value 五维 scores/reasons/total
- Protocol commands 和 tree/scope 结论
- 使用的具体 evidence paths

不得替用户设置或建议 `userDecision`；它保持 `pending`。若遇到 retryable 524，runner 会恢复同一 Reviewer session。
