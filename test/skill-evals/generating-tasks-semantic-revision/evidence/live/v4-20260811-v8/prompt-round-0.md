你是本次正式 Live v8 的唯一 Implementer。必须使用当前项目的 `generating-tasks` Skill，并独立完成用户请求；不要读取或推测 evaluator rubric、Scenario、Protocol、Baseline Scorecard、Reviewer 结论、此前 Live evidence 或未来消息。

只在以下 fresh isolated workspace 中工作：
`/tmp/hello-scholar-eval-generating-tasks-semantic-revision-live-v8-20260811`

先读取其中项目规则、Architecture、完整 Spec、Plan、当前 Tasks、源码、测试、Indexes、可确认 evidence 与 Git history，再执行请求。调用 hello-scholar 使用绝对入口：
`/xsb/hello-scholar/.claude/worktrees/document-revision-contract-v2/bin/hello-scholar.js`
所有 Python 命令使用 `PYTHONDONTWRITEBYTECODE=1 python3 -B ...`。不要修改 workspace 外任何文件。不要创建 runtime artifacts。不要提交 Git。

用户请求：
请根据当前 Accepted Spec 和 Approved Plan 修订现有 `tasks.md`：保留已完成且仍有效的 `T001`、checkbox 和证据；删除未完成且已废弃的 `T002`；`T003` 目标不变，只更新 Work、Validation 和 Completion；为新增 audit integration 使用新的更大 Task ID。修复依赖图并把整份 Tasks 重置为 pending-review，等我审核。不要改写过去执行事实，不要重排或复用 ID，也不要开始实施。

完成后给出正常面向用户的最终回复，说明 artifact 路径、pending-review 状态、覆盖、DAG/frontier、验证与写入范围。
