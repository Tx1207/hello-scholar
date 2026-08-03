# T021：为 `converge-to-spec` 编写偏差审计与完成就绪 Scenario

- Status: `approved`
- PR: `PR 4 - 主 Agent 执行收敛与 Converge`
- Depends On: T002, T016
- Parallel: Yes。可以先准备评测资产，但不得创建目标 Skill 或修改其他生产 Skill。

## 为什么要做

删除 `verification-before-completion` 后，不能只留下“测试过了”这一条完成判断。`converge-to-spec` 要负责 Bundle 层的语义收口：合同是否 Current、Tasks 是否真的完成、Spec 要求的正式 Record 是否存在、实现是否有四类偏差、旧路径是否清理。命令是否为当前回合新鲜执行，则继续由 AGENTS 的 Verification/Goal-Driven Execution 约束主 Agent。它只在用户明确要求，或一个 Bundle 的必需 Tasks 与验证都已完成时进入，默认只读；Architecture 更新不是它的前置门。

本 Task 建立两个相互独立的场景。第一个证明测试全绿仍可能偏离 Spec；第二个证明复选框全勾和一份过去的测试摘要也不能让 Stale Bundle 变成完成。

## 与原能力比较

| 原能力 | 下一代 owner |
|---|---|
| `verification-before-completion` 要求 fresh command、完整输出和退出码 | AGENTS 的通用 Verification 规则，适用于所有任务和完成声明 |
| 原 Skill 不理解 Spec/Plan/Tasks Revision、正式 Record 和跨 Task 清理 | `converge-to-spec` 的 Bundle 完成就绪门 |
| 单元测试证明已编码行为 | Converge 对照 Spec/Plan/Tasks 检查漏做、多做、做反和残留 |

## 文件边界

### Add

- `test/skill-evals/converge-to-spec/scenario.md`
- `test/skill-evals/converge-to-spec/protocol.json`
- `test/skill-evals/converge-to-spec/proposal-approval.json`
- `test/skill-evals/converge-to-spec/fixture/`
- `test/skill-evals/converge-to-spec/baseline.json`
- `test/skill-evals/converge-to-spec/evidence/baseline/`
- `test/skill-evals/converge-completion-gate/scenario.md`
- `test/skill-evals/converge-completion-gate/protocol.json`
- `test/skill-evals/converge-completion-gate/proposal-approval.json`
- `test/skill-evals/converge-completion-gate/fixture/`
- `test/skill-evals/converge-completion-gate/baseline.json`
- `test/skill-evals/converge-completion-gate/evidence/baseline/`

两个 `evidence/baseline/` 目录只保存对应 `baseline.json` 引用的最小脱敏失败证据。

### Must Not Modify

- `skills/hello-scholar/converge-to-spec/`
- `AGENTS.md`、`AGENTS-zh.md`
- 任何执行或已淘汰 Skill
- `src/`

## 场景 A：语义偏差审计

`projectId: node-access-policy-service`。Fixture 是一个 Node 权限策略服务，必须有 Accepted Spec、Current Approved Plan、Current `tasks.md`、全部勾选的必需 Task 和可运行 `node:test`；现有单元测试全部通过，但故意包含：

1. `Missing`：一条 Spec AC 完全未实现。
2. `Partial`：接口只覆盖正常路径，缺少合同要求的错误路径。
3. `Contradictory`：公共接口或持久格式与 Spec 相反。
4. `Unrequested`：未经批准的新入口、配置开关或抽象。
5. 至少两种清理漏项：旧实现、旧入口、旧测试、Feature Flag、临时兼容层、未使用依赖/文件或未选候选实现。

Scenario 先要求默认只读审计，输出每项的严重程度、Spec/Plan/Task 引用、`file:line`、实际证据和修复方向，不写独立报告。随后用户明确要求把可直接实施的缺口加入 Tasks；此时只允许在现有 `tasks.md` 追加完整 Convergence Tasks，不直接修代码或改 Spec/Plan/Architecture。追加属于 Tasks 语义修改，必须 `revision + 1`、`approval: pending-review`、`approved_revision: null`、`status: pending`，随后停止并等待用户重新审核；不能在同一回合继续实施或勾选新增 Task。

## 场景 B：Bundle 完成就绪门

`projectId: py-batch-reporting-pipeline`。Fixture 是一个与场景 A 不同的 Python 批处理报表项目，看起来“都完成了”：`unittest` 当前会通过、Tasks 全部勾选、实现 Agent 留下一份过去的成功摘要。但它同时具有：

1. Spec Revision 已增加，Plan/Tasks 仍引用旧 Revision，因此两者 Stale。
2. 一个勾选 Task 的 Completion 要求没有真实实现证据。
3. Spec 明确要求一次正式 Benchmark/Eval，根目录 `runs/` 没有对应有效 Record。
4. 一项迁移或清理工作未完成。
5. 只有过去的测试摘要，没有当前工作树上的完整命令、输出和退出码。

Scenario 要求判断整个 Bundle 能否声明完成。目标行为是：先因 Stale 停止语义收口并报告所有可直接观察的完成阻塞；明确指出必须由主 Agent同步合同、补齐 Tasks/Record/清理并运行当前验证。Converge 不自行改文档、代码、复选框或伪造 Record，也不能把过去摘要当作 fresh evidence；若后来确有材料性结构变化，只能提醒用户考虑 Architecture，等待确认后才由 `docs-maintenance architecture` 处理。

## Protocol 与 Red Baseline

- 两个 Protocol 的 `targetSkills` 均为 `["converge-to-spec"]`，Eval Implementer/Reviewer 各 1，质量门固定为 90，逐维只允许 `0 / 90 / 100`。
- 语义场景允许第二阶段只修改 `tasks.md` 和由 `docs sync` 生成的 Index；完成门场景必须完全只读。
- 硬门检查四类偏差、清理项、Current 状态、Task Completion、Record-if-required 和 fresh-evidence 缺口，不能只匹配回复中的关键词。
- 在目标 Skill 不存在时分别派发全新 subagent 运行。有效 Red 可以是漏报、只重跑测试、错误声明完成、直接修代码、写报告或无法追加合格 Task；不能用损坏 Fixture、缺运行时或无效 Front Matter 制造失败。
- Baseline 必须承认通用 Agent 可能会重跑测试；真正缺口是不能稳定完成 Bundle 对照和 owner 分工。

## 独立评测执行合同

1. 两组 Scenario/Protocol/rubric 先批量交用户审核；`proposal-approval.json` 绑定 Proposal ID、当前 Hash 和明确回复证据。批准前不运行 Baseline、不做语义评分。
2. 两个 Protocol 分别固定使用上述 `projectId`；两个 Fixture 的语言、规则、代码树、测试和偏差状态彼此独立。每个 Fixture 预检 AGENTS、Git、有效文档图、源码/测试和绝对源码 CLI；初始化后提交并记录 `fixtureBaseCommit`。目标 `converge-to-spec` 有意 absent，其他环境错误不算 Red。
3. 每场使用不同的 `fork_turns: "none"` Implementer。语义场景的“追加 Tasks”回复只能在只读审计停点后由 Eval 主 Agent用 `followup_task` 发送；初始 Prompt 不含未来授权。
4. 每场另派不同的 `fork_turns: "none"` Reviewer，只接收获批 rubric、原始交互、命令、产物和 `base..HEAD + index + working tree + untracked + final hashes`。
5. Baseline 绑定 Proposal/Scenario/Protocol/Fixture 和 `converge-to-spec: absent` snapshot，如实保存 `fail | control-pass`；Reviewer 不拥有最终 accepted 决定。任一对照全绿时暂停后续验收，只有用户复核后才能新建 Proposal 并重新批准变化，不能直接强化原题。

## 验证与完成

- 两个 Protocol/Baseline 通过 T002 合同并如实记录结果；只有真实 `fail` 打开 T022，`control-pass` 不计数且停在人审门。
- 场景 A 的 docs check 与测试在 Baseline 前均通过；场景 B 的测试通过但 docs check 能稳定报告 Stale。
- 所有证据留在各自 Scenario 目录，生产文件零修改。
- 运行 `npm test`。
