# T066：把 `takeoff` 收窄为用户明确意图触发

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T060
- Parallel: No。必须先保留两个方向价值对照和修改前宽触发对照；任一 `control-pass` 都先停在人审门。

## 目标

只修改 Takeoff 的进入条件：用户本轮清楚要求放大目标、打开格局或挑战保守目标模型时进入；普通方案比较、事实核对或项目文本里出现 `conservative/兼容/架构` 不自动进入。进入后完整保留当前方向判断、可证伪性、收益账单和阶段边界。

## 原 Skill 与新 Skill 比较

### 完整保留

- `大胆假设，小心求证`，把方向当高杠杆假设而不是神谕。
- Thesis、Confidence、The Trap、High-格局 Direction、Frame-Opening Move、Bold Takes、Options、What Not To Do、First Proof Point、Falsifier、Payoff Ledger 和询问式 Next Move。
- 区分内部兼容惯性与公开 API、持久数据、文档化集成等真实合同。
- 停在方向判断，不写 Spec、Plan、Tasks、代码或迁移步骤；只询问是否进入 Brainstorming/Landing，不自动切换。
- 中英文固定语义标签、短对话完整性和 hello-scholar wrapper 的单一下一步出口。

### 必须改变

- 删除英文 description 中宽泛的 `Use when the user wants...` 主动判断和中文的“即使没点名也要主动触发”。
- 保留窄 model invocation，不设置 `disable-model-invocation: true`。description 只覆盖用户本轮明确表达的 Takeoff 意图，例如点名 `takeoff/起飞/geju/打开格局`，或直接要求“重新判断目标模型、站高一层、别被局部兼容绑架”。
- 单独出现 `conservative`、兼容、架构、方案比较、重构成本或“这个是不是有点保守”不构成授权；入口必须能引用本轮哪句话要求放大目标，而不是从项目内容猜。
- 没有明确意图时退出 Takeoff，继续完成用户原本的普通分析；退出不是拒答、零验证或自动改走 Landing/Brainstorming。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`，并按以下思路实施：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- Takeoff 使用窄 model invocation；leading words 保留 `takeoff/起飞/格局判断`，description 只承担明确意图发现，不把正文中的方案词复制成 trigger。
- `entry check -> inspect facts -> reframe -> proof/payoff -> ask next move` 是线性步骤；入口完成条件是能指出触发本轮的用户原话，方向判断完成条件继续由现有固定语义块约束。
- 方向打法和输出规则留在当前信息层级，不新增配置、Router 或另一份触发清单；逐句清理宽触发 sediment、duplication 和只会扩大上下文的 no-op。
- 本 Task 只改 invocation branch，不借机重写已经通过历史质量测试的方向模型。

## 文件边界

### Modify

- `skills/hai-skills/takeoff/SKILL.md`
- `skills/hai-skills/takeoff/SKILL.zh_CN.md`

### Add

- `test/test_takeoff_explicit_trigger.py`

### Must Not Modify

- `skills/hai-skills/takeoff/agents/openai.yaml`
- `skills/hai-skills/landing/`
- Router、AGENTS、README、其他 Skill 或 `src/`
- T060 的 Scenario、Protocol、Proposal、Fixture、Baseline 和 baseline evidence
- 旧 `test/fixtures/takeoff_landing_*` 历史证据

## 实施细节

1. 中英文 Front Matter description 删除主动推断和宽泛主题触发，保留少量用户会真实说出的明确意图；两种语言的进入范围一致。
2. Overview 前加入短入口核对：引用本轮明确放大目标的用户表达；没有就返回原任务，不继续读取输出模板来自我触发。
3. 区分“明确意图”与“项目材料中的词”：用户说“用 Takeoff 重判目标模型”有效；README 写 `conservative default` 或用户只要求比较成本无效。
4. 不改变正文的事实读取、合同分类、方向打法、固定输出、自检、Next Move 和不自动串联规则；只删除与新入口冲突的重复句。
5. no-trigger 分支仍服从 AGENTS 的 Read/Verification 和用户允许范围，不能用不运行 Takeoff 为理由跳过普通任务。
6. Landing 文件 bytes 不变；Takeoff 仍可在有效输出末尾询问用户是否转给 Landing，但回答前不替用户启动。

## 测试顺序

1. 先写 `test/test_takeoff_explicit_trigger.py`，证明当前英文宽入口和中文主动触发语义失败。
2. 覆盖：点名 Takeoff、明确自然语言放大目标、普通方案比较、项目文件出现 `conservative`、只问兼容事实、有效 Takeoff 后只询问 Landing 六类输入。
3. 锁住现有必需语义块、Confidence、Frame-Opening Move、First Proof Point、Falsifier、Payoff Ledger、非步骤边界和中英文一致性，避免为收窄入口削弱正文。
4. 运行 `python3 -m unittest test/test_takeoff_explicit_trigger.py`、现有 Takeoff/Landing 聚焦测试和 `npm test`。

## 完成标准

- 普通事实核对和方案比较会退出 Takeoff；用户清楚表达放大目标意图时完整进入。
- 中英文不再包含宽泛主动触发，也没有 `disable-model-invocation: true`、Router 开关或兼容 shim。
- Takeoff 的方向价值、输出合同、可证伪性和阶段边界完整保留，Landing 零修改。
- 本 Task 可以单独交给不了解当前对话的 Agent 实施和验证。
