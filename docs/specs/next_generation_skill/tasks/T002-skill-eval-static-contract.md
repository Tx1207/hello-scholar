# T002：实现 Skill Eval Hash、用户批准和证据静态合同

- Status: `completed`
- PR: `PR 0 - Skill Eval Workflow 与静态证据门`
- Depends On: T001
- Parallel: No。它实现 T001 的本地确定性证据门。

## 为什么要做

Live Eval 由当前 Codex 会话人工编排，但 Scenario、Fixture、rubric、Skill 和证据是否还是用户批准的那一版，可以由本地代码确定性检查。校验器必须区分四件事：合同是否完整、对照是否真实 Red、一次 Live Eval 是否 pass、用户是否最终 accepted；否则合法失败证据会锁死修复循环，或 AI 可以绕过用户改变评分标准。

## 文件边界

### Add

- `test/skill_eval_contract.py`
- `test/test_skill_eval_contract.py`

### Must Not Modify

- `test/run-all.js`
- `package.json`
- 任何生产 Skill
- 现有历史 Scorecard 的业务合同

## 公开能力

使用 Python 标准库实现并测试：

- 文件和目录 SHA-256；
- Protocol、Baseline、Scorecard 合同校验；
- Proposal 批准声明与 Hash 一致性校验；
- `contract_valid`、`baseline_red`、`evaluation_passed`、`user_accepted` 四个独立判断；
- 按 `primarySkill` 统计 accepted case 和不同 `projectId`，供 T048 最终检查 14 个 Skill 每项至少覆盖两个真实项目。

## Hash 与路径规则

1. 文件对原始 bytes 计算 SHA-256。目录按 POSIX 相对路径排序，对“路径 + NUL + bytes + NUL”连续计算；忽略 `.git/`、`__pycache__/`、`.DS_Store` 和 `.hello-scholar-install.json`。被 Hash 的 Fixture、Skill snapshot 和证据树只允许普通目录/文件；symlink、junction 或其他特殊节点显式报错，不跟随到树外。
2. `proposal-approval.json`、Baseline 和 Scorecard 必须绑定当前 `scenarioSha256`、`protocolSha256`、`fixtureSha256`。Baseline 另绑定当时的 immutable `baselineSkillSnapshot`；Scorecard 绑定当前全部目标 Skill `{status, sha256}`。生产 Skill 更新只使 Scorecard 过期，不使诚实保存的旧版本/absent Red 失效。
3. 用户批准记录包含非空 `proposalId`、`decision: approved`、获批的 Scenario/Protocol Hash 和最小脱敏回复证据。校验器只能证明字段、证据和 Hash 自洽，不能认证说话者身份；Workflow 与人工审核负责确认它确实来自用户。Hash 变化后旧批准立即失效。
4. 被引用证据必须是场景目录内的普通文件。拒绝绝对路径、`..`、缺失路径、目录和解析后逃出场景目录的 symlink；每份证据还记录自身 SHA-256。

## Protocol 合同

每个 Protocol 至少包含：

- `protocolVersion`、`scenarioId`、`projectId`、`primarySkill`、`caseId`、`countsTowardProductSkill` 和非空 `targetSkills`；`projectId` 必须是稳定、非空的 kebab-case 项目标识；产品专属 case 的 `primarySkill` 必须是 `targetSkills` 成员且计数只归它，Framework E2E 可使用注册的非产品 owner `framework-e2e` 并固定 `countsTowardProductSkill: false`；
- Protocol v2 是新 Proposal、Baseline 和 Live Eval 的唯一版本；v1 只允许存在于已经保存 Baseline 的只读历史场景，且不得新增 Scorecard。静态合同必须拒绝空 v1 Proposal 和 v1 Scorecard，不能通过更新 Hash 把旧运行升级为 v2；
- `skillExpectations` 必须精确覆盖每个 `targetSkills` key；每项含 `baselineLoad: absent | pre-change-explicit-file`、固定的 `liveLoad: current-explicit-file` 与 `branch: enter | exit | optional`，三者不得合并；Baseline snapshot 必须匹配 `baselineLoad`，Scorecard snapshot 必须匹配 `liveLoad` 和当前 `skillSources` Hash；
- activation probe 是否可观察；instruction eval 不能声称平台自动触发；
- Implementer/Reviewer 正整数数量和 `forkTurns: none`；
- 非空 `fixtureBaseCommit` 的产生规则，以及 committed/index/working-tree/untracked/final-hash 证据要求；
- 用户可读 rubric 的维度、独立可读 criterion、权重、关键维度、固定 `0 / 90 / 100` 评分锚点、最低分和硬否决项；
- 非计时 `criticalPath`、验证命令、允许/禁止路径、预期/禁止产物；Protocol v2 显式拒绝 `speed`、`speedLimits`；
- 多轮交互脚本中每轮由谁发送、何时停止以及 Eval 主 Agent届时逐字发送什么；未来用户回复必须由 Protocol Hash 绑定，但完整 Protocol 不得出现在 Implementer Prompt。

v2 Baseline/Scorecard 的命令记录还必须与 `protocol.commands` 数量、顺序和模板逐项相等，并另存只替换 `<...>` 占位符后的 `executedCommand`；同名占位符解析值一致。运行交互逐轮保存获批消息 Hash、实际 Prompt Hash、停点顺序和 Prompt 隔离证据。Fixture 即使在 tree hash 中忽略环境缓存，也必须显式拒绝 `__pycache__`、`.pyc`、`.pyo`、`.DS_Store` 和安装 marker。

未知版本、空 rubric、重复 case、非法枚举、权重错误或非字符串路径/命令都要给出含文件和字段名的错误。

## Baseline 合同

1. `result` 只允许 `fail | control-pass`。`fail` 至少有一个行为或用户价值门失败，并有与 Skill 缺失/旧版行为直接相关的原因与证据；`failureKind` 是 primary classification，摘要和逐门证据仍必须保留其他同时发生的失败。`control-pass` 要求行为硬门、确定性命令和两组质量全部绿，且有序证据符合获批 `criticalPath`，并说明为什么对照已足够完成任务。
2. 环境预检必须满足 Protocol：Baseline 按 `baselineLoad` 确认修改前文件/Hash 正确或 `absent` 是有意缺失；Live 按 `liveLoad` 确认当前文件和 `skillSources` Hash 正确；CLI 绝对入口、Git/Node/场景依赖、Fixture 初始测试和 Base commit 都有效。意外状态或预检失败时运行合同无效。
3. Baseline 绑定当前用户批准 Proposal 与 Hash。没有批准或批准已过期时不能运行。
4. 文件加载与分支进入分别按阶段和 case 判断；例如 TDD 普通 Bugfix 的 Baseline 可以使用修改前文件，Live 必须读取当前文件，但两阶段都应为 `branch: exit`，不能把“显式读取”写成“业务必须进入”。
5. Baseline 的 diff 证据必须能重建 Base 到最终树的全部变化；只存一份可能为空的 working-tree `git diff` 不合格。
6. `control-pass` 是合法且可审计的 Baseline 观察，但 `baseline_red`、`evaluation_passed` 和 `user_accepted` 必须全部为 false；该目录不得生成冒充正式验收的 accepted Scorecard，也不得进入 T048 的两个专属 case 计数。后续动作必须绑定用户对 Skill 独立价值的裁决。

## Scorecard 与 accepted 合同

1. Implementer/Reviewer ID 非空且不同；两者 `forkTurns` 都是 `none`。Live Skill snapshot 的状态必须匹配 Protocol 的 `liveLoad: current-explicit-file`，目录 Hash 必须匹配当前 `skillSources`。每个硬门有布尔结果和非空证据，每条命令逐项绑定 Protocol 模板、真实解析命令和整数退出码；逐轮交互与 Prompt 证据必须证明 Implementer 只收到当前轮安全投影，没有拿到 evaluator-only Scenario/Protocol 或未来消息。
2. `result: pass` 要求硬门全 true、命令全为 0、质量达到用户批准 rubric；每个维度只能打 `0`、`90` 或 `100` 并保存非空理由/证据。`result: fail` 至少有一个可定位的真实失败。全部为绿却写 fail、存在失败却写 pass、任意连续分数或无理由评分都无效。
3. 合法 `fail` 是可保留、可诊断的合同记录，普通 `npm test` 只验证其自洽性，不因结果为 fail 自动失败。`evaluation_passed` 和 T048 最终发布门仍返回 false。
4. Reviewer 只能使用当前批准的 rubric。`userDecision` 初始为 `pending`；Reviewer pass 不会自动把它改成 accepted。只有用户审阅摘要/证据后明确接受，`userDecision: accepted` 才成立。
5. `accepted` 同时要求合同有效、运行 pass、用户决定 accepted、全部 Hash 当前。Skill 变化要求重跑 Live Eval；Scenario/Protocol/Fixture 语义变化还要求新 Proposal 和重新咨询。
6. Protocol v2 的 Baseline/Scorecard 不得保存 `timing` 或把 watchdog 诊断包装成质量字段；运行未完成可以如实记环境/运行阻塞，但不能仅凭墙钟耗时判定 Skill 质量失败。

## 自动发现与阶段边界

- `test/test_skill_eval_contract.py` 自动遍历 `test/skill-evals/` 的场景目录，不维护手写名单；普通说明文件不算 Scenario。每个唯一 `scenarioId/caseId` 只计一次；只有 `countsTowardProductSkill: true` 且 Baseline 为真实 Red、最终 Scorecard accepted 的目录才计入 `primarySkill`。发布统计同时按 `projectId` 去重，同一 Skill 即使有多个 case 也必须至少覆盖两个不同项目；Framework E2E 和 `control-pass` 不替任何 target Skill增加专属 case 或项目数。
- Proposal 中间态允许只有 Scenario、Protocol、Fixture 和 `proposal-approval.json`（批准前 decision 可为 `pending`）；批准后才允许新增 Baseline。存在 Baseline 时必须完整，存在 Scorecard 时也必须完整，不能用占位 JSON 过门。
- T002 完成时尚无场景目录是合法的。每 Skill 至少两个真实 case 和全部 accepted 由 T048 收口，不能在 PR 0 提前阻塞后续 Scenario Task。

## 测试顺序

1. 用 `TemporaryDirectory` 覆盖：合法 Proposal pending/approved；完整 accepted；合法 pass 但用户 pending；合法 fail；合法 `control-pass` 且不能计数/accepted；预期 absent 与意外缺失；pre-change Baseline 在生产 Skill 更新后仍有效；旧 Scenario/Protocol/Fixture/Scorecard Skill/证据 Hash；批准声明证据不一致；同一 Agent；非法 `baselineLoad` / `liveLoad` / `branch` 组合；Baseline/Live snapshot 与各自加载合同不一致；未来回复泄露；缺 Base-to-final diff；绝对/`..`/缺失/目录/symlink 逃逸证据；被 Hash 目录中的链接节点；重复 case；同一 Skill 多 case 但只有一个 `projectId`；E2E 不虚增 primary Skill case。
2. 先观察缺实现失败，再实现到 `python3 -m unittest test/test_skill_eval_contract.py` 通过。
3. 运行 `npm test`，确认只读本地文件，不启动 subagent、网络或外部 API。

## 完成标准

- 批准声明与所有输入 Hash 绑定，AI 无法在合同上静默换 rubric 后沿用旧批准；身份真实性仍由用户审核，不做虚假安全承诺。
- Loader/CLI/Fixture 环境问题不能冒充 Skill Red。
- 对照全绿时能保存 `control-pass` 事实，但不能绕过独立价值复核进入 accepted 或发布计数。
- 合法 fail 不锁死修复循环；最终 accepted 仍有严格且独立的发布门。
- 工具能在 T048 对用户最终决定保留的候选 Skill逐项确认至少两个 accepted case，且至少覆盖两个不同真实 `projectId`；不为凑固定数量保留 Skill。
