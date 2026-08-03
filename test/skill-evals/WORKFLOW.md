# Skill Eval 工作流

本文件是 hello-scholar 产品 Skill 评测的唯一流程事实源。评测由当前 Codex 会话人工编排，使用真实项目 Fixture、全新 Implementer subagent 和独立 Reviewer subagent。普通 `npm test` 只校验已经保存的本地合同与证据，不启动 Agent、网络或额外服务。

禁止为这套流程新增 `testing-skills` 产品 Skill、`codex exec` Runner、external API Client 或默认联网脚本。

## 四阶段

| 阶段 | 允许产物 | 完成条件 |
|---|---|---|
| `proposal` | Scenario、Protocol、Fixture、待审核 Approval | 用户批准当前 Proposal ID 和 Hash |
| `baseline-observation` | Baseline 与最小脱敏证据 | 得到诚实的 `fail` 或 `control-pass` |
| `implementation-eval` | Scorecard 与 Live 证据 | 当前 Skill 的运行合同自洽 |
| `user-accepted` | 更新 Scorecard 的用户决定 | 用户审阅当前证据并明确接受 |

Proposal 阶段没有 Baseline 或 Scorecard 是合法中间态。不得用占位 JSON 伪造尚未运行的阶段。

## 场景目录

每个 case 独占一个目录：

```text
test/skill-evals/<scenario-id>/
├── scenario.md
├── protocol.json
├── proposal-approval.json
├── fixture/
├── baseline.json                 # Baseline 运行后才出现
├── scorecard.json                # Live Eval 后才出现
└── evidence/
    ├── baseline/
    └── live/
```

一个目录和一个 `caseId` 只计一个 case。产品 Skill 默认至少有两个不同 `projectId`；复制 Fixture、只改请求或重命名目录仍是同一个项目。Framework E2E 可以覆盖多个 Skill，但固定 `countsTowardProductSkill: false`，不能替目标 Skill 虚增专属 case。

## 真实项目 Fixture

Fixture 至少包含：

- 项目级规则；
- 可初始化并提交 Base 的 Git 工作树；
- 可运行的代码和测试；
- 会实际改变判断的接口、持久数据、文档、调用方或失败状态。

关键词集合、空目录、硬编码标准答案和同一项目的改名副本无效。每次运行从仓库 Fixture 新建临时副本，初始化 Git，提交 Base，并把 `fixtureBaseCommit` 写入证据；不得复用上次运行后的工作区。

项目规则可以公开真实的语言、依赖、公共接口、数据来源、安全限制、Accepted Bundle 合同和不可变文件，但不能为了本次 Eval 直接告诉 Implementer 应进入哪个 Skill 分支、未来用户会说什么、某份证据的标准分类或用户可读答案。真实单元测试和 artifact verifier 继续放在项目中；它们只检查项目已有或用户已公开要求的可观察合同。表达质量、Skill 分支、rubric 和 hard rejects 始终是 evaluator-only。Proposal 审核前逐个检查 `fixture/AGENTS.md` 和项目文档，发现提示答案时先清理并刷新 Fixture Hash。

Fixture tree hash 可以忽略跨平台运行缓存以保持稳定，但 Proposal 输入本身不得含 `__pycache__/`、`.pyc`、`.pyo`、`.DS_Store` 或 `.hello-scholar-install.json`；静态合同在 Hash 之外单独拒绝这些运行产物。

## Scenario

`scenario.md` 必须让不了解当前对话的 Agent 看懂：

1. 项目背景和当前真实状态；
2. 原始用户请求；
3. 目标 Skill 和允许/禁止范围；
4. 预期与禁止产物；
5. 验证命令、交互轮次和运行边界。

未来用户回复必须逐字写在 Protocol 的交互脚本里，由 Eval 主 Agent 到达真实停点后通过 `followup_task` 发送。回复文字属于 Protocol Hash 的一部分；只有 `contentRole` 或停止条件而没有实际消息，不算可复现脚本。首轮 Prompt 不得提前包含批准、实施授权或标准答案。

`scenario.md` 是评测设计，不是发给 Implementer 的业务请求。它可以写预期、禁止项和质量要求，但完整文件只供 Eval 主 Agent 和 Reviewer 使用。Implementer 首轮只收到 Scenario 中的 `Original User Request` / `原始用户请求` 原文，不收到 Required Result、rubric、hard rejects、预期路径或未来轮次。

## Protocol

`protocol.json` 至少定义：

- `protocolVersion`、`scenarioId`、`projectId`、`caseId`；
- `primarySkill`、`countsTowardProductSkill`、非空 `targetSkills`；
- 每个目标 Skill 的仓库相对 `skillSources`；
- 与 `targetSkills` 精确同键、同时声明 Baseline 与 Live 加载状态的 `skillExpectations`；
- activation probe 的可观察性和 instruction eval 的声明边界；
- Implementer/Reviewer 数量、持久化 `model: "claude-sonnet-5"` 与 `forkTurns: "none"`；实际 Claude Code dispatch 使用 selector `model: "sonnet"`，不得把 selector 写入 Hash-bound evidence；
- Fixture Base 规则和 Base-to-final 全状态证据要求；
- 场景业务 rubric、共享用户价值 rubric 路径/Hash、硬否决项、命令、允许/禁止路径和产物；
- 一句具体、可观察且不包含时间上限的 `criticalPath`，说明从请求到有效结果所需的最短合理流程；
- 多轮发送者、逐字消息、停止条件和首轮未来回复泄漏门。

所有新 Proposal、Baseline 和 Live Eval 使用 `protocolVersion: 3`，并在 Protocol、Baseline、Scorecard、manifest 和 review 中保存 canonical `claude-sonnet-5`。`protocolVersion: 1` 只保存历史 Baseline；`protocolVersion: 2` 是冻结的 Terra 历史 cohort：两者的原 Scenario、Protocol、Approval、Fixture、Baseline、Scorecard（如有）和 evidence 保持原位、原字节，不得新增、改写或回填。若同一业务场景需要继续评测，另建 v3 后继 case 并重新走 Proposal 审核，不能改 Hash 把旧运行伪装成新协议结果。

完整 Protocol 同样是 evaluator-only。它的 rubric、hard rejects、Expected artifacts 和未来消息不能出现在 Implementer Prompt。Eval 主 Agent按固定投影只发送：临时工作目录、当前轮消息、项目内规则、这一轮允许的 Skill snapshot 路径/Hash、仓库外读取禁区和由 runner 单独管理的安全停止条件。该停止条件只保护运行资源，不属于 Proposal、Skill 质量或 Scorecard。原始 `scenario.md`、`protocol.json` 路径也在读取禁区内；不要靠“请忽略后面的答案”代替隔离。

Rubric 使用离散评分，不使用看似精确但无法复现的任意分数：

| 分数 | 含义 |
|---|---|
| `100` | 该维度所有可观察要求都有直接证据，没有可定位缺陷 |
| `90` | 核心行为和边界全部满足，只存在不影响判断的轻微表达或组织问题 |
| `0` | 存在材料性缺失、事实错误、越权或无法由证据证明；若命中 hard reject 同时直接否决 |

每个维度要有一句独立可读的 `criterion`，说明 Reviewer 实际检查什么；只写缩写式 ID 不够。所有维度最低分和总分门固定为 `90`，Reviewer 还必须逐维引用输出、文件或命令证据。

Protocol v3 还必须绑定唯一共享事实源：

```json
"userValueRubric": {
  "path": "test/skill-evals/user-value-rubric.json",
  "sha256": "<current-sha256>"
}
```

共享五维分别检查价值是否先被看见、语言是否匹配用户、信息是否容易扫描且文档可独立使用、决定/未知项/owner/下一步或停点是否明确、以及信噪比。场景业务 rubric 与用户价值 rubric 是两组独立硬门，不能平均；Protocol v1 历史记录不回填此字段。

Protocol v3 必须写一句场景专属 `criticalPath`，但不保存 `speed`、`speedLimits` 或其他墙钟质量字段。`criticalPath` 不是计时 KPI，而是 Reviewer 阅读业务 rubric、hard rejects、逐轮 stop condition、获批命令、产物和完整树证据时使用的流程索引。例如正式实验必须由证据证明最小 Record 先存在、启动命令只执行一次、非关键文档未被放到启动前；这些是可观察的顺序和边界，不是耗时评分。runner 可以设置 watchdog 防止任务无限占用资源，但 watchdog 触发只表示本次运行未完成，不能自动判定 Skill 质量失败。

每个 `skillExpectations` 项把运行阶段和业务分支分开：

```json
{
  "baselineLoad": "absent | pre-change-explicit-file",
  "liveLoad": "current-explicit-file",
  "branch": "enter | exit | optional"
}
```

`baselineLoad` 表示对照 Agent 收到修改前副本还是有意不收到目标 Skill；`liveLoad` 固定为 `current-explicit-file`，表示实现后 Agent 收到当前仓库副本；`branch` 表示两阶段业务上是否应进入该流程。显式读取后退出可以是正确行为。`instruction-eval` 只证明给定指令下的行为，不声称平台自动激活；只有平台能观察 Skill catalog 时，才另存 `activation-probe`。

Protocol v3 的 `commands` 是获批命令模板。Baseline/Scorecard 必须按相同数量和顺序逐项保存原模板 `command`、只替换 `<...>` 占位符后的真实 `executedCommand`、整数 `exitCode` 和证据；重复出现的同名占位符解析为同一值。不能用另一条成功命令替代获批命令。Protocol v1 继续读取旧命令记录，不回写新字段。

## Proposal 与用户批准

Eval 主 Agent先把 Scenario、Protocol、场景业务 rubric 和共享用户价值 rubric 作为一个 Proposal 交用户，说明 Proposal ID、维度、权重、关键最低分、总分门和硬否决项。批准记录必须绑定：

- `proposalId`；
- 当前 `scenarioSha256`；
- 当前 `protocolSha256`；
- 当前 `fixtureSha256`；
- `decision: approved`；
- 最小脱敏用户回复证据。

用户明确批准 Proposal ID、当前 Scenario/Protocol/Fixture Hash，以及 Protocol 绑定的共享 rubric Hash 前，不启动任何 Baseline/Live subagent、不判断输出质量、不写运行证据。Scenario、Protocol、Fixture 或共享 rubric 发生语义变化时，新建 Proposal 并重新审核。`proposal-approval.json` 只能证明字段和 Hash 自洽，不能认证说话者身份；主 Agent负责确认批准确实来自用户。

## 环境预检

每次 Baseline 或 Live Eval 都先验证：

1. Fixture 可复制、可初始化 Git、初始测试通过；所有 Python 预检和 Eval 命令统一设置 `PYTHONDONTWRITEBYTECODE=1`，不得把未被 Fixture Hash 覆盖的 `__pycache__` / `.pyc` 提交进 Base；
2. Node、Git 和场景声明的运行时可用；
3. CLI 使用绝对 `node <hello-scholar-repo>/bin/hello-scholar.js`；
4. Baseline 的显式 Skill copy 匹配 `baselineLoad` 且目录 Hash 正确，或 `absent` 是 Protocol 有意声明的缺失；
5. Live 的 Skill copy 匹配 `liveLoad: current-explicit-file` 和 `skillSources` 的当前目录 Hash；
6. Scenario、Protocol、Fixture 和 Approval Hash 当前。

Loader、PATH、权限、Fixture 语法、依赖、初始测试或 Sonnet 不可用属于环境阻塞，不是 Skill Red。Sonnet 不可用时停止并报告，不得静默改用 Terra、Opus 或其他模型、写入替代模型的 Baseline/Scorecard，或把环境问题包装成质量结论。

## Agent 隔离

Implementer 与 Reviewer 都必须是全新 Sonnet subagent，实际 dispatch 使用 `model: "sonnet"` 和 `fork_turns: "none"`。Protocol、Baseline 和 Scorecard 分别记录 canonical `model: "claude-sonnet-5"`；两个角色的 Agent ID 必须不同。每次最多启动一个正式 Eval Agent，必须等待其真实最终回复并在 Agent registry 确认为 `completed` 后才能启动下一位。Implementer Prompt 只包含：

- 临时工作目录；
- 当前轮逐字消息；首轮消息取 Scenario 的原始用户请求，后续消息取 Protocol 当前 round 的 `message`；
- 本轮明确允许读取的 Skill copy 绝对路径与 Hash；
- 项目内规则、源仓库/其他 Eval 的读取禁区和 runner 安全停止条件。

不要给 Implementer 原始 Scenario/Protocol 文件、rubric、hard rejects、Expected artifacts、主 Agent 疑点或尚未到达的回复。hello-scholar 源仓库除绝对 CLI 入口和显式 Skill snapshot 外都在读取边界之外，特别是当前 Task Packet、生产 Skill 和其他场景证据。观察到越界读取时，本次运行无效，既不能记 Red，也不能记 pass。

每轮实际投递还要保存 `sender`、`contentRole`、获批消息的 SHA-256、完整安全 Prompt 的 SHA-256、stop condition 是否观察到、是否在前一停点后投递及对应证据。首轮消息 Hash 绑定 Scenario 原始请求，后续消息 Hash 绑定 Protocol 逐字文本；第二轮起必须证明前一停点已经发生。`pass` / `control-pass` 完成全部获批轮次，`fail` 可以只保存从首轮开始的真实连续前缀。每次运行的 `promptProjection` 另以证据证明原始 Scenario、完整 Protocol 和未来轮次均未对 Implementer 可见。

Reviewer 必须与 Implementer 不同，只在运行结束后接收获批 Scenario/Protocol、完整原始交互、输出、确定性命令、产物和完整树证据。Reviewer 能看到 rubric 和 hard rejects，但不要给它实现思路、主 Agent 疑点或未发生的隐藏答案。

## Baseline Observation

Baseline 严格按每个目标 Skill 的 `baselineLoad` 使用 `absent` 状态或修改前 immutable copy。每个目标 Skill snapshot 记录状态与 Hash；后续生产 Skill 更新不会使诚实的旧 Baseline 失效。

`result` 只有两种：

- `fail`：业务行为或用户价值至少一组因 Skill 缺失/旧行为直接失败；`failureKind` 用 `skill-behavior | skill-user-value` 保存最先阻断、最能定位修复 owner 的 primary classification，摘要和逐门证据仍列出其他同时发生的失败；
- `control-pass`：行为硬门、确定性命令、业务评分和用户价值评分全部绿，并说明为何通用 Agent 已经足够完成任务。

`control-pass` 必须暂停该 Skill 的后续验收，不得人为加难题制造 Red，不得生成 accepted Scorecard，也不计入产品发布 case。用户先根据当前 Skill 是否仍有可见增益，决定保留、改场景或淘汰。

## Implementation Eval

只有真实 `fail` Baseline 才打开对应 Implementation 和 Live Eval。Live Eval 严格按每个目标 Skill 的 `liveLoad: current-explicit-file` 使用 `skillSources` 指向的当前副本并记录当前目录 Hash，重新创建临时项目和全新 Agent，不复用 Baseline 工作区。

Live Eval 失败时保存真实 `result: fail`、证据和定位信息，重开对应 Scenario 或 Implementation Task。Eval Task 不能顺手修改 Skill、rubric 或考试题。合法 fail 可以留在仓库，普通静态测试只验证其合同自洽。

## 完整树证据

每次运行都覆盖：

- `fixtureBaseCommit..HEAD` committed diff；
- HEAD 后的 index；
- working tree；
- 全部 untracked 文件；
- 最终文件路径和 SHA-256；
- Protocol 原始命令模板、只解析占位符后的真实命令、退出码与对应输出证据。

被引用证据必须是场景目录内的普通文件，使用相对路径并记录自身 SHA-256。拒绝绝对路径、`..`、目录、缺失文件和 symlink/junction。不能因为 Agent 提交后 working tree 为空就省略其他状态。

## 评分与最终决定

Reviewer 严格使用用户批准的场景业务 rubric 和共享用户价值 rubric：两组逐维都只能打 `0`、`90` 或 `100`，每维保存非空理由和证据引用。硬门全 true、命令退出码全为 0、交互顺序完整且两组总分/关键维度都通过，运行才可写 `result: pass`。全部为绿却写 fail、存在失败却写 pass、使用其他分数或没有逐维证据，都是无效合同。

Reviewer 只能建议。Scorecard 初始 `userDecision: pending`；只有用户审阅当前输出、证据和 Hash 后明确接受，才改为 `userDecision: accepted`。最终 accepted 同时要求：

```text
contract_valid
AND baseline_red
AND evaluation_passed
AND user_accepted
AND all_hashes_current
```

每次记录 Implementer/Reviewer 的 Agent ID、canonical `claude-sonnet-5` 模型、Proposal/Scenario/Protocol/Fixture/Skill/共享 rubric Hash、命令、退出码、逐轮消息与停点、完整树和脱敏证据。Protocol、Baseline 和 Scorecard 都拒绝 `speed`、`speedLimits`、`timing` 以及 `skill-efficiency`；不得把 runner 资源保护数据重新包装成 Skill 质量分。

Framework E2E v1 历史目录和所有冻结 v2/Terra evidence 均保持只读；新的后继场景使用 v3 Proposal、自己的 Baseline、Live Eval 和用户接受流程，不复用历史结论。

## 每次运行检查表

1. Proposal ID、批准决定与所有输入 Hash 当前。
2. 环境预检全绿，Fixture Base 已提交。
3. Implementer/Reviewer 均为全新 Sonnet、`fork_turns: "none"` Agent，实际 dispatch 使用 `model: "sonnet"`，ID 不同且运行证据的 canonical `model: "claude-sonnet-5"` 与 Protocol 一致；本次 Skill snapshot 与当前阶段的 `baselineLoad` 或 `liveLoad` 一致。
4. Prompt 是 evaluator-only Scenario/Protocol 的安全投影；当前消息准确，rubric、预期答案和未来回复均未泄漏。
5. Baseline 或 Live 运行未越界读取。
6. 完整树、命令、Hash 和 Agent ID 证据已保存并脱敏。
7. Reviewer 只按获批的业务与用户价值合同给建议。
8. 用户保留最终 accepted 决定权。
