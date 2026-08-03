# T022：实现 `converge-to-spec` 的偏差审计与 Bundle 完成就绪门

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T008, T021
- Parallel: No。需要 docs 内核和两个真实 Red 场景。

## 目标

新增一个默认只读的 `converge-to-spec`。它对照当前 Spec、Plan、Tasks、实际 diff、代码、测试和 Record，既报告四类实现偏差，也判断 Bundle 是否具备声明完成的合同证据。它不成为执行器或万能修复器；用户要求处理可直接实施的偏差时，只向现有 `tasks.md` 追加 Convergence Tasks。入口只限用户明确要求，或一个 Bundle 的必需 Tasks 和验证已经完成；普通局部工作不因存在该 Skill 而进入 Converge。

## 与原 Skill/规则的比较

- 原 `verification-before-completion` 的核心价值是“没有当前命令证据就不能声称成功”。该规则已在 AGENTS 的 Verification/Goal-Driven Execution 中存在，因此删除 Skill 后不复制一份同义 Prompt。
- `converge-to-spec` 新增的是项目特有的 Bundle 语义：Revision Current、AC 覆盖、Tasks Completion、正式 Record、迁移/清理，以及是否需要后续 Architecture 同步。
- 普通局部 Bug 或零文档 Fast Path 仍按 AGENTS 直接验证，不因 Converge 要求凭空创建 Spec/Plan/Tasks/Record。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `converge-to-spec` 保持 model-invoked，因为 Bundle 完成路径需要主动到达；description 只触发 `traceability/convergence`，不声称执行或修复所有问题。
- `audit | ready check | append convergence tasks` 是三个 branch；默认只读 branch 的完成条件是覆盖四类偏差并给出证据，而不是生成报告文件。
- 具体 Schema 留给 docs 内核，Skill 只保留读取顺序、明确实施基线、偏差分类、停止门和状态 owner，避免与 AGENTS 新鲜证据重复。
- 用正向目标描述允许写入面，删除旧 Verification 文案 sediment 和无证据的“检查完成” no-op。

## 文件边界

### Add

- `skills/hello-scholar/converge-to-spec/SKILL.md`
- `skills/hello-scholar/converge-to-spec/SKILL.zh_CN.md`
- `test/test_converge_to_spec_skill.py`

### Must Not Modify

- `AGENTS.md`、`AGENTS-zh.md`
- `src/`
- 其他 Skill
- T021 的 Scenario、Protocol、Fixture 和 Baseline

## 统一读取和停止门

1. 按 `Architecture -> spec.md -> plan.md -> tasks.md -> git diff/status -> 相关代码/测试/配置 -> Spec 引用的 runs/record.md` 读取，只加载与目标 Bundle 相关的事实。
2. 运行 `hello-scholar docs check`。Spec 未 Accepted、Plan 未 Approved、Plan/Tasks Missing 或 Stale 时，不在错误合同上继续做“通过”结论；报告具体 Revision/owner 和可直接观察的其他阻塞。
3. 默认不写文件。开始前记录允许写入集合，结束后核对 diff；不得创建 `convergence-report.md`、第二份 Architecture 或临时总结文件。

## 偏差审计

1. 建立 `Spec AC -> Plan 阶段/文件边界 -> Task -> 实现/测试/Record 证据` 对照表，在回复中展示必要摘要。
2. 只用四类偏差：`Missing`、`Partial`、`Contradictory`、`Unrequested`。每项包含严重程度、合同引用、`file:line`、证据和修复方向。
3. 检查 Plan 的实际文件范围、接口、顺序、迁移、清理和回滚是否仍成立；不把测试全绿或 Task 勾选框单独视为 Spec 证据。
4. 扫描旧实现/入口/配置/测试/Feature Flag、临时兼容层、未使用依赖/文件和未选候选实现。

## Bundle 完成就绪

只有以下实现与 Bundle 条件全部有证据时才可返回 `Ready for completion evidence`：

1. Spec Accepted，Plan Approved，Plan/Tasks Current。
2. 所有必需 Task 的 Validation 和 Completion 均满足；跳过/取消项有获批理由且不影响 AC。
3. 四类偏差与清理检查没有未解决的阻塞项。
4. Spec 要求的正式 Benchmark/Eval/训练均有合法根目录 Record、终态、结果和决定；普通单元测试不强制 Record。
5. 迁移和旧代码清理已完成；任何未完成项都仍是阻塞。

Converge 同时必须输出两类后续信息：AGENTS 新鲜证据门需要实际运行并读完的精确验证命令；以及是否观察到材料性结构变化。后者只能在用户主动要求，或 Bundle 完成时作为“建议更新 Architecture”的提醒，说明理由并等待用户确认，不能写成 required 前置门。过去的测试摘要可以帮助定位，但不能满足新鲜证据门。

返回 `Ready for completion evidence` 仍不是最终成功声明，也不要求未来步骤提前发生。主 Agent接下来先取得并读完当前验证输出；只有用户已要求，或 Bundle 完成且存在材料性结构变化并确认更新时，才另行用 `docs-maintenance architecture` 更新当前现实。没有这项确认时，`Convergence Ready + AGENTS Fresh Evidence` 即可完成，不固定要求 `Converge -> AGENTS fresh evidence -> Architecture`。

## 用户要求修复时的唯一写入

1. 先判断偏差是否能在现有 Spec/Plan 内直接实施。需要新设计时回 Spec；技术方案失效时回 Plan；Stale 时先由对应 owner 同步。
2. 可直接实施时，在现有 `tasks.md` 末尾追加 `Convergence` Phase，ID 延续当前序列；同时把 `revision` 加一，`approval` 重置为 `pending-review`、`approved_revision` 重置为 `null`、`status` 重置为 `pending`。
3. 每个新 Task 都必须有目标、Spec Coverage、Depends On、Parallel、Files、Work、Validation 和 Completion，并遵守 TDD 显式触发边界。
4. 更新 Tasks `updated` 并运行 docs check/sync。展示新 Revision/覆盖变化后停止，等待用户重新批准 Task 合同；合同获批后仍需另行实施授权。本 branch 不改代码、勾选新增 Task或接着实施；除生成 Index 外，不改 Spec、Plan、Record 或 Architecture。

## 测试顺序

1. 先写静态/Fixture 测试，覆盖 T021 两个场景的合同并确认目标 Skill 不存在时失败。
2. 实现中英文 Skill，检查读取顺序、Stale 停止、四类偏差、清理项、五项实现收敛条件、两类后续动作、默认只读和只追加 Tasks。
3. 负向断言：不得依赖已淘汰 Skill，不得把历史测试摘要当当前证据，不得为普通测试强制 Record，不得直接修代码或写报告。
4. 运行 `python3 -m unittest test/test_converge_to_spec_skill.py` 和 `npm test`。

## 完成标准

- 四类偏差和 Bundle 完成阻塞都有明确事实来源，不靠关键词自报。
- Converge 与 AGENTS 的职责不重复：前者判断合同收敛，后者要求当前命令证据。
- Architecture 是新鲜证据后的独立事务，不会与 Converge 形成互相等待。
- 默认完全只读；获批修复请求只追加当前 Tasks、重置审批并停在人审门。
- 中英文合同一致，没有对已淘汰 Skill 的依赖。
