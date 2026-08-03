# T037：将 `test-driven-development` 收窄为显式触发 Skill

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T036
- Parallel: No。必须先取得修改前自动触发的真实 Red 证据。

## 目标

只改变 `test-driven-development` 的入口合同，不削弱 Skill 被明确调用后的任何纪律、证据类型或测试反模式规则。普通任务仍要测试和验证，只是不再自动进入完整 TDD 仪式。

## 原 Skill 内容处理表

### 完整保留

- “先写能因正确原因失败的最便宜 evidence artifact”。
- behavior unit、contract integration、prompt/RAG eval、agent trajectory、research benchmark、skill pressure、macro eval 等证据模式。
- Red -> Verify Red -> Green -> Verify Green -> Refactor；无有效 Red 不得声称 TDD。
- 最小 Green、避免超范围、保持其他测试全绿、真实行为优先于 mock。
- `testing-anti-patterns.md` 和中英文 evidence pattern gallery。
- 中英文 Skill 的同等强度。

### 必须改变

- Front Matter `description` 改成只有两类触发：用户明确请求 TDD；当前 Approved Task 明确要求 TDD。
- `When to Use` 删除 `Always: feature/bugfix/refactor/behavior change` 和“想跳过就是合理化”的自动触发话术。
- 增加短入口门：没有显式触发时立即退出 Skill，回到 AGENTS/Task 的普通实现与验证；不能因为 Skill 文件被偶然读到就强制重做已有代码。
- 明确普通“请加测试”“Validation: npm test”不自动等价于 TDD；需要出现 `$test-driven-development`、`TDD`、`Red-Green-Refactor` 或 Task 的明确 Process 要求。
- 一旦入口门命中，后续 Iron Law 没有可选降级；用户明确说 TDD 后不能改成 tests-after。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `test-driven-development` 保留窄 model invocation，description 只列用户明确要求 TDD 或 Approved Task 明确写 TDD Process 两类真实触发；不设置 `disable-model-invocation: true`，也不让 generic feature/bugfix 语言命中。
- `Red -> Green -> Refactor` 是被调用后的线性 steps，每一步都以真实命令、正确失败/通过原因和当前工作树证据作为 completion criterion。
- evidence pattern gallery 与 anti-pattern 文档继续作为 disclosed reference；入口、Iron Law 和三阶段门留在 `SKILL.md`。
- 删除自动触发 sediment、重复的强制话术和“普通 Validation 等于 TDD”的错误 branch；保留真正改变行为的严格顺序，不用宽松例外稀释它。

## 文件边界

### Modify

- `skills/superpowers-skills/test-driven-development/SKILL.md`
- `skills/superpowers-skills/test-driven-development/SKILL.zh_CN.md`

### Add

- `test/test_tdd_explicit_trigger.py`

### Must Not Modify

- `skills/superpowers-skills/test-driven-development/testing-anti-patterns.md`
- `skills/superpowers-skills/test-driven-development/references/evidence-pattern-gallery.md`
- `skills/superpowers-skills/test-driven-development/references/evidence-pattern-gallery.zh_CN.md`
- Router（T043 负责 Fast/Execution 接线）
- AGENTS、其他 Skill、`src/`
- T036 Scenario/Protocol/Baseline

## 实施细节

1. 中英文 Front Matter 保留 model-readable `description`，但收窄为 TDD、Red-Green-Refactor、test-first 等明确意图，以及 Approved Task 的明确 TDD Process；删除 generic feature/bugfix/refactor 触发，不增加 `disable-model-invocation: true`。正文入口继续核对用户点名或 Approved Task 明确 Process，不在 metadata 塞完整流程。
2. 在正文最前部、Iron Law 前写清显式入口；未命中时不让 Agent继续读后面的强制段落并自我触发。
3. Approved Task 的触发必须来自 Task 明确字段/文字，不从“这个任务有 Validation”推断。
4. 保留异常说明但重写语境：用户已经明确调用 TDD 后，如又明确允许 Throwaway Prototype 等例外，先澄清当前是否撤销 TDD；Skill不能自己把任务归类为例外。
5. 不修改 supporting references 的 bytes。它们描述的是 TDD 启动后的做法，与触发边界无冲突。

## 测试顺序

1. 先写 `test/test_tdd_explicit_trigger.py`，断言当前 description/Always 规则失败，同时锁住 Iron Law、Red/Green、evidence artifacts 和 references bytes。
2. 修改中英文 Skill；测试普通 Bugfix、普通 Feature、仅有 Validation、用户明确 TDD、Approved Task 明确 TDD 五种文本合同。
3. 断言显式触发后没有 `optional`、`if convenient` 或 tests-after 降级语义。
4. 运行 `python3 -m unittest test/test_tdd_explicit_trigger.py` 和 `npm test`。

## 完成标准

- 未指定 TDD 的普通任务不会因 Skill metadata 自动触发；明确自然语言或 Approved Task 仍能让 Agent找到该 Skill。
- 用户/Task 明确指定时仍能只读本文件完成严格 Red-Green-Refactor。
- 三份 supporting references 原字节保留，没有新增配置开关、全局设置或第二个 TDD Skill。
