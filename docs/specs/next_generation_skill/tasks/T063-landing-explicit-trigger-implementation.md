# T063：取消 `landing` 自动承接 Takeoff，保留窄显式入口

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T062
- Parallel: No。必须先保留显式价值 Red 和修改前自动串联 Red。

## 目标

只修改 Landing 的进入条件，不削弱它被明确请求后的价值排序、现实检查、目标形态、阶段边界、验证和止损纪律。Takeoff 可以问用户是否需要 Landing，但任何 Skill 都不能在用户回答前自动切换阶段。

## 原 Skill 与新 Skill 比较

### 完整保留

- 前序方向必须可恢复；缺少 thesis、旧模型或现实问题时先请求补齐。
- 五项 Value Criteria 和四个价值桶，以及重要项的完整证据字段。
- 用户不同意时分别重新定价 Cost、Risk、Stage Boundary、Verification、Stop Rule。
- `references/anti-patterns.md` 的五个现实检查。
- Target Shape Statement、Ambition Kept、User Decision Points、Verification、Stop Rule 和询问式 Next Move。
- 中英文固定语义标签和 hello-scholar wrapper 只有一个下一步出口。

### 精确删除或改写

- 删除 description 和正文中的 `Automatically use ... after takeoff`、`自动触发只在 Takeoff 后` 等自动串联合同。
- 不设置 `disable-model-invocation: true`。description 保持 model-facing，但只列用户明确的 Landing 意图：点名 `landing/落地`，或明确要求把刚才方向做现实可行性压力测试、压实/缩小并定义止损。
- “有前序 Takeoff”只是一项输入条件，不再是触发条件；普通 `risk/MVP/verify/next step` 词仍不能触发。
- Takeoff 的 Next Move 只提出选择；Landing 入口必须能指出本轮哪句用户意图授权进入。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`，并按以下思路实施：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- Landing 使用窄 model invocation，leading word 是 `landing/落地`；description 只承担显式意图发现，不把 Takeoff 的存在复制成 trigger。
- `recover direction -> value-rank -> reality-check -> target shape -> boundary/evidence/stop` 是线性 steps，每步保留当前可检查 completion criterion。
- 五个反模式继续作为 disclosed reference；所有分支都需要的价值门和退出门留在 `SKILL.md`。
- 清理自动串联 sediment 与重复 trigger，保留真正改变输出质量的证据字段；不通过新增禁令或配置开关扩大 Prompt。

## 文件边界

### Modify

- `skills/hai-skills/landing/SKILL.md`
- `skills/hai-skills/landing/SKILL.zh_CN.md`

### Add

- `test/test_landing_explicit_trigger.py`

### Must Not Modify

- `skills/hai-skills/landing/references/anti-patterns.md`
- `skills/hai-skills/takeoff/`
- Router、AGENTS、README、其他 Skill或 `src/`
- T062 的 Scenario、Protocol、Proposal、Fixture 和 Baseline

## 实施细节

1. 中英文 description 删除自动承接语义，保留少量真实用户表达和“必须能恢复前序方向”的输入门；两种语言的触发范围一致。
2. Overview 首段改为：只有本轮用户明确提出 Landing 意图才进入。上下文已有 Takeoff 不构成授权；未授权时停止在当前阶段。
3. 在 Workflow 前加入短入口核对：引用触发本轮的用户原话/Approved Task（如果未来明确支持）；没有明确意图就退出，不读取后续模板来自我触发。
4. 保持“用户明确请求但方向不可恢复时先问缺失方向”的行为。显式请求不是允许猜 thesis。
5. 不改变 Value Criteria、Workflow 2-7、Output、自检和 anti-pattern reference 的实质语义；只清理与新入口冲突的重复句。
6. Takeoff 文件 bytes 不变。它继续询问是否 route to Landing，用户同意后的新一轮自然语言才命中 Landing。

## 测试顺序

1. 先写静态/小型路由 Fixture，证明当前 description/Overview 因自动承接规则失败。
2. 覆盖：用户点名 Landing、有清楚自然语言落地意图、只有 Takeoff 上下文、用户明确停在 thesis、普通 MVP/风险问题、显式请求但缺方向六类输入。
3. 锁住四个价值桶、五个重新定价字段、anti-pattern pointer、Target Shape、Stage Boundary、Verification、Stop Rule 和固定输出标签，避免为通过入口测试削弱正文。
4. 运行 `python3 -m unittest test/test_landing_explicit_trigger.py` 和 `npm test`。

## 完成标准

- Takeoff 后没有用户授权时 Landing branch 退出；有明确意图和可恢复方向时完整进入。
- 中英文不含自动串联语义，也没有 `disable-model-invocation: true`、Router 配置或兼容开关。
- Landing 的独立价值、信息层级和反模式 reference 完整保留，Takeoff 未修改。
