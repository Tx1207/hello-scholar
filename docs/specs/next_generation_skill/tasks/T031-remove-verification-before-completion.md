# T031：删除 `verification-before-completion`

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T023, T024, T025, T029
- Parallel: No。Converge 的完成就绪门必须先通过 Live Eval，所有旧消费者也必须先删除。

## 用户已确认的决定

完整删除 `verification-before-completion`，不把它改造成 Bundle 验证 Skill。新鲜证据纪律保留在 AGENTS，项目特有的 Bundle 一致性与完成就绪由 `converge-to-spec` 承担。

## 原 Skill 与新 owner 的精确分工

原 Skill 的 Iron Law、Identify -> Run -> Read -> Verify -> Claim、完整输出/退出码、不要信任 Agent 报告、Regression 要有 Red/Green 都是正确规则。删除原因不是这些规则过时，而是它们已经属于所有 Agent 工作都应遵循的基础合同，单独 Skill容易漏触发或重复加载。

| 需要回答的问题 | owner |
|---|---|
| 当前测试/build/lint 命令是否真的刚跑过并通过 | AGENTS Verification / Goal-Driven Execution |
| Agent 报告是否与真实 diff 和命令一致 | 主 Agent按 AGENTS 独立核对 |
| Plan/Tasks 是否 Current，AC/清理/Record 是否完整 | `converge-to-spec` |
| 能否最终声称 Spec 完成 | Converge 无阻塞 + 主 Agent当前完整验证证据 |

Fast Path 不需要为了删除该 Skill创建 Bundle；它仍用聚焦命令证明局部声明。

## 文件边界

### Delete

- `skills/superpowers-skills/verification-before-completion/SKILL.md`
- `skills/superpowers-skills/verification-before-completion/SKILL.zh_CN.md`

### Add

- `test/test_no_verification_before_completion_skill.py`

### Modify

- `AGENTS.md`：在现有 Verification 下补一条最小 `Fresh Evidence` 完成门。
- `AGENTS-zh.md`：与英文规则同义同步。

### Must Not Modify

- `converge-to-spec`（T022 已实现）
- 其他 Skill、README、`src/`
- shared catalogs（T065 统一处理）

## 实施与验证

1. 删除两个文件和空目录，不创建 `completion-evidence` 同义 Skill。
2. 删除前先在中英文 AGENTS 的现有 Verification 章节各加入一条同义硬门：做出“完成/已修复/通过”声明前，主 Agent 必须在当前工作树、当前回合运行覆盖该声明的完整命令，读完输出并确认退出码；过去日志、缓存摘要或 subagent 自报不能替代。只写这条跨任务规则，不搬运原 Skill 的流程、表格或口号。
3. 新测试先证明仅删除 Skill 会让这个明确 owner 不可观察，再断言 Skill discovery 不再返回该 name，且中英文 Fresh Evidence 合同存在并一致。
4. 正向断言 Converge 测试仍覆盖 Current、Tasks、Record、清理和过去摘要不可当 fresh evidence。只检查关键合同，不复制原 Skill全文。
5. 运行 `python3 -m unittest test/test_no_verification_before_completion_skill.py test/test_converge_to_spec_skill.py` 和 `npm test`。

## 完成标准

- Skill 目录和安装入口消失。
- 新鲜证据在中英文 AGENTS、Bundle 收敛在 `converge-to-spec`，各有一个明确 owner，没有行为真空或第三份 Prompt。
- 局部任务仍可用局部证据完成，不被迫创建文档。
