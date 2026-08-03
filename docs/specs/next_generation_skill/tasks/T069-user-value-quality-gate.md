# T069：为 Skill 输出增加用户价值与表达质量门

- Status: `completed`
- PR: `PR 0 - Skill Eval 基础设施修正`
- Depends On: T068
- Parallel: No。它修改共享 Eval Schema，必须在新的 Baseline 或 Live Eval 之前完成。

## 为什么要做

现有 Eval 已经能检查事实、业务合同、修改范围和证据，但仍可能接受一种对用户没有真正价值的输出：内容技术上没错，却先讲很长的执行过程，结论埋在末尾；文档只有当前聊天的人看得懂；术语是 Agent 或评测框架的内部语言；下一步和停点不明确。

用户在当前会话明确要求评估两件事：Skill 生成的回答或文档是否贴近用户，以及用户能否轻松看出这份内容的价值。这个 Task 把要求变成独立硬门，不能用业务正确性高分抵消难读，也不能由 AI 在运行后临时发明评价标准。

## 与原做法比较

| 原做法 | 新做法 |
|---|---|
| Scenario rubric 主要判断业务行为 | 业务行为和用户价值分成两组，各自过门 |
| 每个 Protocol 可以自行描述“表达好” | 五个用户价值维度只有一份共享事实源 |
| Reviewer 写一个理由即可 | 每个维度保存 `0 / 90 / 100`、理由和证据引用 |
| Baseline 只看硬门和命令 | Baseline 同样评估业务、用户价值和获批关键路径，才能判断 Skill 是否有真实增益 |
| 输出全绿后 Reviewer 可建议 pass | Reviewer 只能建议；用户仍决定最终 `accepted` |

## 六个不能互相抵消的质量层

1. **Skill 源文件质量**：使用 `writing-great-skills` 检查调用、信息层级、完成条件、Predictability 和 pruning。
2. **场景行为质量**：使用各 Protocol 自己的业务 rubric 检查事实、范围、文件和项目合同。
3. **用户价值质量**：使用本 Task 的共享 rubric 检查用户是否容易理解和使用结果。
4. **流程合理性**：由 T077 的非计时 `criticalPath` 检查必要动作顺序、真实停点和被延后的非关键工作。
5. **相对 Baseline 增益**：对照若在上述门上全绿，必须记 `control-pass` 并暂停，不制造 Red。
6. **用户最终裁决**：Reviewer pass 不会自动成为 `accepted`。

任何一层失败都不能靠其他层平均分补回来。

## 共享用户价值 rubric

新增：

```text
test/skill-evals/user-value-rubric.json
```

它固定五个等权且全部 critical 的维度：

- `value-visibility`：先让用户看到结果、决定或文档价值，不让过程叙述把它埋住。
- `audience-fit`：语言、术语和技术深度匹配用户与项目；保留必要技术名，但不要求用户翻译 Agent 内部话语。
- `information-design`：回答容易扫描；正式文档离开当前聊天仍能独立使用。
- `actionability`：决定、未知项、owner、下一动作或刻意停点明确。
- `signal-to-noise`：没有样板话、重复结论、评测内部叙述和无关细节。

每维只允许 `0 / 90 / 100`，最低分和总分都为 90。`0` 表示材料性缺失或不可用，`90` 表示用户可以快速理解并使用但有轻微表达问题，`100` 表示价值立即可见、准确自然、可独立使用且没有噪声。

## Protocol 与 Hash 合同

每个 Protocol v2 增加：

```json
"userValueRubric": {
  "path": "test/skill-evals/user-value-rubric.json",
  "sha256": "<current-sha256>"
}
```

校验器要求路径唯一、Hash 当前、rubric ID/版本固定、五个维度恰好各出现一次、权重合计 100，并校验 criterion 和锚点。共享文件一旦发生语义变化，所有引用旧 Hash 的 Proposal、Baseline 和 Scorecard 都失效，必须重新提交用户审核。

Protocol v1 是历史输入，不增加此字段，也不修改旧字节。

## Baseline 与 Scorecard 合同

Protocol v2 的 `quality` 必须包含两组：

```json
"quality": {
  "behavior": {
    "scores": {},
    "reasons": {},
    "evidence": {},
    "totalScore": 0
  },
  "userValue": {
    "scores": {},
    "reasons": {},
    "evidence": {},
    "totalScore": 0
  }
}
```

`behavior` 的 key 精确匹配当前 Protocol 业务维度；`userValue` 精确匹配共享五维。每个理由非空，每维至少引用一份场景目录内、带 SHA-256 的证据。

Baseline 的 `failureKind` 是一次失败的 **primary classification**，只允许：

- `skill-behavior`：硬门、命令或业务评分失败；
- `skill-user-value`：用户价值评分失败；
如果一次运行同时失败两层，`failureKind` 选择最先阻断合同判断、最能定位修复 owner 的一层，`summary` 和逐维/逐门证据必须继续列出其他所有失败；这个单值不能被解释为“另一层通过”。`control-pass` 必须业务与用户价值全部通过，并由交互、命令和产物证据证明获批 `criticalPath`。Live `pass` 使用同一规则。合法 `fail` 可以保存并通过静态合同，不能为了让普通测试变绿把失败改写成成功；v2 不存在 `skill-efficiency` 分类或墙钟质量门。

## 文件边界

### Add

- `test/skill-evals/user-value-rubric.json`
- 本 Task 文件。

### Modify

- `test/skill_eval_contract.py`
- `test/test_skill_eval_contract.py`
- `test/skill-evals/WORKFLOW.md`
- 所有尚无 Baseline 的 Protocol v2 和对应 pending Proposal Hash。
- PRD、Plan 和 Task 导航中直接描述 Skill 质量门的部分。

### Must Not Modify

- `test/skill-evals/framework-e2e-paged-cache/` 下的历史 v1 文件。
- 生产 Skill。
- 已保存 Baseline、Scorecard 或 evidence 的语义与 Hash。
- 普通 `npm test` 的无 Agent、无网络边界。

## 测试顺序

1. 先增加失败测试，证明旧校验器会接受缺失/过期共享 Hash、缺失用户价值评分、无证据理由和“业务高分抵消用户价值 0 分”。
2. 实现共享 rubric、双质量组和 Baseline 合同校验。
3. 迁移尚未运行的 Protocol v2，保持 Proposal `pending`，统一重算 Hash。
4. 运行 `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s test -p 'test_skill_eval_contract.py'`。
5. 运行 `npm test` 和 `git diff --check`。

## 完成标准

- 用户价值是独立硬门，不被业务正确性平均掉；关键路径合理性由有序证据核对，不转换成墙钟分数。
- Reviewer 能从逐维理由和原始证据复核评分，而不是只看到一个总分。
- Baseline 能证明 Skill 是否改善了用户可理解性；全绿对照会诚实停止。
- 所有新 Protocol 引用同一份当前 rubric Hash，用户批准前不启动任何 Agent Eval。
- 历史 v1 证据字节未变。
