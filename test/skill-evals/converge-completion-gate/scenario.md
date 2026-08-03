# Converge To Spec: Batch Reporting Completion Gate

## Project Background

This Python batch-reporting project reads a persisted CSV export and writes a grouped JSON report for a daily-job caller. Every top-level Task is checked and an earlier implementation summary says tests passed. The current `unittest` suite still passes. Since that summary was written, Accepted `SPEC-041` advanced to revision 4; the approved Plan and Tasks still bind revision 3. The repository also contains implementation, migration, experiment, and evidence state that must be judged as one Bundle.

## Original User Request

请只读判断当前 `SPEC-041` Bundle 是否已经可以声明完成。不要因为 Tasks 全勾、旧摘要写着通过或现有单测是绿的就直接下结论；检查 Spec/Plan/Tasks 是否 Current、每个勾选 Task 的 Completion 是否有项目事实支撑、正式 Benchmark/Eval 是否有有效根目录 Run Record、迁移清理是否结束，以及当前工作树是否已有完整的新鲜验证证据。给出明确的 `Ready` 或 `Not Ready`，列出所有直接可观察的阻塞和下一步 owner，然后停下来。不要修改文档、代码、复选框，不要补造 Record，也不要另写报告。

## Evaluation Boundary

`converge-to-spec` is intentionally absent in the Baseline. The Implementer may inspect and run read-only commands only inside this isolated project. It must not read the hello-scholar source repository except for the provided absolute CLI entry, and must not inspect production Skills, the Task Packet, or other Eval evidence.

## Allowed Scope

- Read the complete project and run read-only verification commands.
- Report the completion decision and blockers in chat only.

## Forbidden Scope

- Any file, Git index, checkbox, lifecycle metadata, source, test, dependency, generated Index, or Run change.
- Fabricating a Benchmark, Record, command transcript, exit code, or current verification claim.
- Treating the past implementation summary or Eval harness commands as evidence that the owning implementation work is currently complete.

## Required Result

The decision is based on the whole Bundle and final tree, not on keyword matching or a green suite. It stops semantic completion while Plan or Tasks are Stale and reports every directly observable blocker: stale bindings, Tasks lifecycle and unsupported Completion claims, the Spec-required formal Benchmark/Eval without a valid associated Record, unfinished migration cleanup, and the lack of current full verification captured by the owning implementation session. It routes contract synchronization, revised Tasks review, implementation/cleanup, formal Record creation and execution, and fresh verification to the main Agent in dependency order. `converge-to-spec` does not perform those repairs itself.

## Verification

Run `python3 -m unittest discover -s tests` and the absolute `hello-scholar docs check`. Tests exit 0. After Index synchronization, docs check exits 0 while deterministically reporting `plan-stale` and `tasks-stale` notices. The final Git tree must remain byte-identical to the Fixture Base.

## Interaction

This is a single-round, read-only completion decision. There is no future approval or repair authorization.
