# T001：建立真实项目 Skill Eval 工作流与用户评审合同

- Status: `completed`
- PR: `PR 0 - Skill Eval Workflow 与静态证据门`
- Depends On: None
- Parallel: No。这是所有后续 Skill Scenario、Baseline 和 Live Eval 的唯一流程事实源。

## 为什么要做

当前仓库有静态 Skill 测试，但没有一份能在当前 Codex 会话中可靠运行的统一协议。实测表明：新 subagent 只收到 `$record-experiment` 名称时返回 `NOT_DISCOVERED`；把 Skill copy 到外部临时项目也不能证明它会进入 subagent 启动时的 Skill catalog。当前环境同时没有全局 `hello-scholar` 命令。

因此本 Task 不能把“名称调用成功”或“命令恰好在 PATH”当作前提。它要建立一套不依赖额外 API、能用真实项目 Fixture 和当前会话 subagent 复核 Skill 行为的手工工作流，并把“什么算输出好”先交给用户审核。

## 已锁定范围

- 最终保留或新增的 14 个产品 Skill 都必须有真实项目 Eval；每个 Skill 默认至少覆盖两个不同 `projectId` 的真实项目。复制同一 Fixture、只换请求或重命名副本仍算同一个项目；高风险或多分支 Skill 可以超过两个场景。
- 九个待删除 Skill 只做删除、引用和安装回归，不为其新增行为 Eval。
- 场景必须在当前 Codex 会话的 subagent 上实际运行；不使用 `codex exec`、外部 API、网络 Runner 或 `testing-skills` 产品 Skill。
- `writing-great-skills` 是 Skill 编写阶段的 authoring gate，不是产品 Skill，不计入这 14 个 Eval 对象。

## 旧做法与新做法

| 方面 | 不再采用 | 本 Task 锁定的做法 |
|---|---|---|
| Skill 加载 | 假设 copy 后 `$skill` 自动可见，或把“读取文件”当成“必须进入分支” | Eval 主 Agent按 case 传绝对 `SKILL.md` 并要求完整读取；文件加载与业务分支期望分开记录；自动发现另作可选探针 |
| CLI | 假设全局存在 `hello-scholar` | 解析当前源码仓库绝对路径，调用 `node <repo>/bin/hello-scholar.js` |
| Agent 上下文 | 继承当前完整对话 | Implementer 和 Reviewer 都使用 `fork_turns: "none"` 与自包含 Prompt |
| 质量标准 | AI 运行后自行决定好坏 | 运行前向用户提交场景和 rubric Proposal；用户批准当前 Hash 后才运行和评分 |
| 测试项目 | 关键词或空目录玩具 Fixture | 有 Git、代码、测试、项目规则和真实冲突/状态的最小真实项目 |
| 普通测试 | `npm test` 同时启动 Agent或拒绝合法 fail | `npm test` 只校验证据合同；最终全部 accepted 由 T048 统一阻止发布 |

## 文件边界

### Add

- `test/skill-evals/WORKFLOW.md`

### Must Not Add Or Modify

- 不得创建 `skills/**/testing-skills/`。
- 不得创建 `test/run-codex-skill-eval.js`、API Client 或 Live Eval package script。
- 不得修改 `package.json`、生产 Skill、Scenario、Baseline 或 Scorecard。

## WORKFLOW.md 必须完整说明

1. 定义 `proposal -> baseline-observation -> implementation-eval -> user-accepted` 四阶段。Baseline 的预期结果是 Red，但真实对照也允许记录 `control-pass`。Scenario/Protocol 先形成带唯一 Proposal ID 的评测建议，用户批准前不得运行 subagent 或写 Baseline。Proposal 阶段尚无 Baseline 是合法中间态，不能为过静态测试先造占位证据。
2. 每个产品 Skill 默认至少覆盖两个不同真实项目。真实项目 Fixture 至少含项目规则、Git 状态、可运行代码/测试以及会影响 Skill 判断的文件；Protocol 的 `projectId` 表示项目身份，不是场景别名。只靠关键词、空目录、硬编码答案或同一 Fixture 的改名副本无效。项目规则可以给真实事实和 Accepted 外部合同，但不能为了 Eval 直接给出被测 Skill 分支、标准分类、未来回复或用户可读答案；业务测试只验项目公开合同，rubric/hard rejects 保持 evaluator-only。
3. 每个场景目录为 `test/skill-evals/<scenario-id>/`：Proposal 阶段包含 `scenario.md`、`protocol.json`、`fixture/`、`proposal-approval.json`；获批并真实运行后增加 `baseline.json` 和小型脱敏 Baseline 证据；实现后再增加 `scorecard.json` 和 Live 证据。一个目录/一个 `caseId` 才算一个 case；发布计数还要求同一产品 Skill 至少两个不同 `projectId`，多 Skill E2E 不给每个 target Skill 虚增专属 case 数。
4. `scenario.md` 写清项目背景、真实用户请求、当前状态、目标 Skill、允许/禁止范围、预期/禁止产物、验证命令、交互回合和 runner 资源停止边界。它是 evaluator-only 考卷，不整份发给 Implementer；首轮只抽取 `Original User Request` / `原始用户请求` 原文。需要用户批准的场景必须把批准回复逐字写入 Protocol，并留到对应 `followup_task`，不能提前泄露给 Implementer。
5. `protocol.json` 用按 `targetSkills` 名称索引的 `skillExpectations` 分开记录 `baselineLoad: absent | pre-change-explicit-file`、固定的 `liveLoad: current-explicit-file` 和 `branch: enter | exit | optional`。前两项分别说明 Baseline 和 Live Agent 收到哪份指令，`branch` 说明业务上是否应进入该流程；三者不能合并。Protocol 还包含 `primarySkill`、`caseId`、`projectId`、质量 rubric、硬门、非计时 `criticalPath`、`gpt-5.6-terra` Agent 数/模型、命令、路径合同和逐字交互消息。完整 Protocol 只给 Eval 主 Agent和 Reviewer；Implementer 只拿当前轮安全投影。未显式触发时的退出边界由 Router 和目标 Skill 静态合同验证；多 Skill E2E 可为每项声明不同的 Baseline 加载状态。
6. Eval 主 Agent把 Scenario/Protocol 作为一个批次提交给用户，说明推荐 rubric、关键维度、权重、否决项和 `criticalPath`。只有用户明确批准 Proposal ID、当前 Scenario/Protocol/Fixture Hash，以及 Protocol 绑定的共享 rubric Hash 和关键路径合同后，才能启动任何 Baseline/Live Agent、写运行证据或判断输出好坏；任何语义修改都生成新 Proposal并重新咨询。`proposal-approval.json` 保存明确回复的最小脱敏证据和 Hash；它是可审计声明，不是密码学身份认证，本地校验器不得声称能证明回复一定来自用户。
7. 运行前做环境预检：Fixture 可复制并初始化 Git；Node、Git 和场景依赖可用；CLI 用 `node <hello-scholar-repo>/bin/hello-scholar.js` 可执行；`gpt-5.6-terra` 可创建；Baseline 按 `baselineLoad` 确认修改前 copy 存在且 Hash 正确或目标有意 `absent`，Live 按 `liveLoad` 确认当前 copy 存在且 Hash 正确。意外缺失/出现、依赖失败、Terra 不可用或 Fixture 初始测试失败记为环境阻塞，不能冒充 Red，也不能静默回退其他模型。
8. 区分两类测试：`activation-probe` 只在当前平台能观察 catalog 时检查名称/描述触发；`instruction-eval` 按当前运行阶段的 `baselineLoad` 或 `liveLoad`，把临时副本绝对 `SKILL.md` 路径和 Hash 交给 subagent，或在 Baseline 明确记录目标 Skill absent。显式文件后的 `enter/exit` 证明指令分支行为，不声称证明平台自动激活。
9. Implementer 与 Reviewer 都是全新 `gpt-5.6-terra` subagent，必须使用不同 Agent ID 和 `fork_turns: "none"`。Implementer Prompt 明确临时工作目录、隔离的 Skill 副本、本轮逐字消息、项目规则和读取禁区；不得包含完整 Scenario/Protocol、rubric、hard rejects、Expected artifacts、Implementation Task、预期 diff、主 Agent 疑点或未来审批回复。hello-scholar 源仓库除绝对 CLI 入口和显式 Skill snapshot 外属于禁止读取范围，尤其不得读取本 Task Packet、当前生产 Skill 或其他场景证据；观察到越界读取时本次运行无效，不能记为 Red 或 pass。每个 Fixture 初始化后提交 Base commit 并记录 `fixtureBaseCommit`；Python 命令统一禁用 bytecode，不能把未 Hash 的缓存带进 Base。
10. 多轮场景由 Eval 主 Agent按 Protocol 中 Hash 绑定的逐字脚本逐轮发送 `followup_task`。运行记录逐轮保存消息 Hash、实际安全 Prompt Hash、stop condition、是否在前一停点后投递和证据；`pass/control-pass` 必须完成全部轮次，`fail` 只能保存从首轮开始的真实前缀。Reviewer 在运行后收到用户已批准的完整 Scenario/Protocol、原始请求/回复、diff、产物和确定性证据，不收到实现思路或主 Agent 疑点。
11. Baseline 使用目标 Skill 缺失或 pre-change immutable copy。预期至少一个行为或用户价值门因该差异失败；`failureKind` 只保存最先阻断、最能定位修复 owner 的 `skill-behavior | skill-user-value`，摘要和逐门证据仍列出全部失败。Loader、CLI、权限、Terra、Fixture 语法或意外依赖缺失造成的失败无效。若对照全绿，如实写 `control-pass` 并暂停该 Skill 的验收：不得伪造 Red、不得直接进入 Live Eval/accepted，也不得计入发布 case；先比较当前 Skill 是否仍有可见增益，再由用户决定保留 Skill、修改场景或淘汰。新 Skill记录 `absent`，重大修改记录修改前目录 Hash；后续生产 Skill 更新不能反过来使诚实的历史对照失效，只有 Scenario/Protocol/Fixture/批准或 Baseline Skill snapshot 被篡改才失效。
12. Live Eval 失败时保存真实 `fail` Scorecard 和证据，重开对应 Implementation/Scenario Task；Eval Task 不偷改 Skill 或 rubric。合法 fail 允许普通静态测试读取，只有 accepted 判断和 T048 发布门失败。
13. 记录 Implementer/Reviewer 的不同 Agent ID、Terra 模型、`forkTurns`、Proposal/Scenario/Protocol/Fixture/Skill Hash、命令/退出码、逐轮停点、`criticalPath` 顺序和脱敏证据。Protocol v2 的每条运行命令按原模板、仅替换占位符后的真实命令、顺序和证据逐项绑定；不能拿任意成功命令替代。diff 覆盖 `fixtureBaseCommit..HEAD`、HEAD 后的 index/working tree、全部 untracked 文件和最终文件 Hash；不能因 Agent commit 后 working tree 为空而漏审。Fixture 中被 tree hash 忽略的 runtime cache 仍直接判非法。不可观测 token 写 `null` 及原因，不伪造调用轨迹或计数；v2 Baseline/Scorecard 不保存 `timing`。
14. 用户是最终质量 owner：Reviewer 依据用户批准 rubric、hard rejects、`criticalPath`、交互停点、命令、产物和完整树证据给出建议。各维度使用可复现的 `0 / 90 / 100` 离散锚点并附证据理由，不允许凭感觉打任意分；Scorecard 只有在硬门、评分和用户最终决定均通过时才是 `accepted`。runner watchdog 只保护资源，触发表示运行未完成，不直接判 Skill 质量失败。Framework E2E 仍按 T047 独立运行三次，每次都必须通过相同的非计时质量合同，不使用中位用时或墙钟门。
15. 新运行只使用 Protocol v2。升级前已有 Baseline 的 v1 场景按原目录、字节和 Hash 只读保留，不能新增 Scorecard；需要复测时另建 v2 后继 case，不能回填旧 Baseline Hash。

## 验证

- 人工逐项对照上述 15 条，确认一个不知道当前对话的 Agent 能执行完整流程。
- `rg -n "codex exec|testing-skills|external API" test/skill-evals/WORKFLOW.md` 只允许出现在禁止说明中。
- 确认文档明确包含 `fork_turns: "none"`、显式/absent 加载、branch enter/exit、绝对源码 CLI、源仓库读取隔离、Base commit、两个不同 `projectId` 和用户 rubric 审核门。
- 运行 `npm test`，确认纯文档新增不启动 Agent 或网络。

## 完成标准

- 14 个产品 Skill 的场景 Task 都能共享本合同，而不各自发明 Agent、CLI、Hash 或用户审批规则。
- 名称发现与指令执行被诚实区分；环境失败不会被包装成 Red。
- 对照意外通过时有诚实的 `control-pass` 停止门，不会通过人为加难题制造 Skill 价值。
- 用户在任何语义质量评分前批准当前 Proposal/rubric，并保留最终 accepted 决定权。
- 本 Task 只新增测试工作流，没有生成评测产物或修改生产 Skill。
