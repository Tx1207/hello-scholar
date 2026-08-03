# T059：用当前 Codex subagent 验证 `crash-audit`

- Status: `approved`
- PR: `PR 6 - Architecture、显式 TDD 与 Routing`
- Depends On: T058
- Parallel: No。两个场景分别使用 fresh Agent，评测期间不修改 Skill 或题目。

## 目标

用 T058 的两个真实项目验证当前 `crash-audit`：有关键盲区时能直接指出并给最快验证，证据充分时能克制地说没有重大遗漏；进入后不会漂移成方案重写、Takeoff、Landing 或通用 Review。

这两个 case 都由用户明确请求 Crash Audit，因此只证明“进入后的行为”，不冒充 no-trigger 或平台自动激活证据。`crash-audit` 从创建起就已有显式入口，没有可形成真实 Red 的旧宽触发版本；显式入口继续由现有 `test/test_crash_audit_skill.py`、T065 catalog 和 T048 release contract 静态守卫。若未来修改入口，必须另建带修改前 snapshot 的 `branch: exit` Scenario，不能用 absent 对照伪造价值。

## 文件边界

### Add

- `test/skill-evals/crash-audit-release-blind-spot/scorecard.json`
- `test/skill-evals/crash-audit-release-blind-spot/evidence/live/`
- `test/skill-evals/crash-audit-calibrated-none/scorecard.json`
- `test/skill-evals/crash-audit-calibrated-none/evidence/live/`

### Must Not Modify

- `skills/hello-scholar/crash-audit/`
- T058 的 Scenario、Protocol、Proposal、Fixture、Baseline 和 baseline evidence
- 生产源码、AGENTS、README、Router 或其他 Skill

## 执行方法

1. 完整读取 T001 Workflow，确认两个 Baseline 都是有效 Red，Proposal ID、用户批准 rubric 和所有 Hash 仍当前。出现 `control-pass` 或 Hash 漂移时停止，先让用户复核价值或重开 T058。
2. 每场从原 Fixture 建立独立临时 Git 工作区，记录 `fixtureBaseCommit`，预检项目命令和当前 Skill copy；不复用 Baseline 或另一场产物。
3. 每场用不同的 `fork_turns: "none"` Implementer，Prompt 给当前 `crash-audit/SKILL.md` 绝对路径/Hash并要求完整读取，只提供工作目录、用户原始请求、项目规则和读取禁区；完整 Scenario/Protocol 与 rubric 保持 evaluator-only。
4. 高风险场景核对每项不确定性/盲区的项目证据、影响和最快验证；无重大盲区场景核对它没有填充泛化风险。两场都必须保持两问、默认上限和零文件写入。
5. 每场派发不同的 `fork_turns: "none"` Reviewer，只看获批 rubric、原始输入、输出、命令和完整 final-tree 证据；Reviewer 逐项判断是否真会改变用户决策。
6. 写当前 Proposal/Scenario/Protocol/Fixture/Skill Hash、不同 Agent ID、Terra 模型、硬门、评分、命令/退出码、`criticalPath` 顺序和建议，不写 `timing`。失败时保存 `fail` 并重开 T058 或目标 Skill owner；本 Task 不修 Prompt、不改 rubric。
7. 两场 pass 后把输出和脱敏证据批量交用户；每场保持独立决定，只有用户明确接受当前 Hash 才写 `userDecision: accepted`。

## 与 absent 对照的比较

- 场景 A 必须比对照更准确地锁定 persisted/public contract，而不是只增加风险条数。
- 场景 B 必须显示更好的校准和克制；“列了更多风险”在这里不是增益。
- 如果当前 Skill 与对照没有可见增益，即使静态 Prompt 完整也不能 accepted，交用户决定是否保留。

## 验证与完成

- 两个 Scorecard 通过 T002，硬门全 true，总分和每个维度至少 90，逐维只允许 `0 / 90 / 100`，并由用户最终 accepted。
- 两次运行都完成获批交互和非计时 `criticalPath`；watchdog 只用于结束未完成运行，不作为 Skill 质量结论。
- 运行 `python3 -m unittest test/test_crash_audit_skill.py` 和 `npm test`，清理临时工作区，仓库只保留必要脱敏证据。
