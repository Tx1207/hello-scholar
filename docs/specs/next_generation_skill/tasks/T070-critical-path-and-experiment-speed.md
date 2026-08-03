# T070：把 Skill 文档工作移出实验启动关键路径

- Status: `superseded-by-T077`（仅保留 Record 动作顺序的历史依据，不再执行本文件的计时 Schema）
- PR: `PR 0 / PR 5 - Eval 效率合同与 Record 节奏`
- Depends On: T069
- Parallel: No。先统一速度合同，再运行 Record 与 Router Baseline。

## 当前执行结论

本文件记录的是一次已经被用户否定的计时方案，不能作为后续 subagent 的实施指令。T077 是当前 owner：Protocol v2 只保存非计时 `criticalPath`，拒绝 `speed` / `speedLimits`；Baseline 和 Scorecard 拒绝 `timing`。runner watchdog 只保护资源，触发表示运行未完成，不直接判 Skill 质量失败。

本文件仍有效的产品思路只有三点：正式/高风险实验在启动前只写最小可复现 Record；合格低风险探索可以先启动并在形成结论等边界前补录；运行期间补非关键上下文，终态一次收口。下面的毫秒字段、速度门、绝对上限、中位数和 pass/fail 规则全部是历史提案，不得实现或写入新证据。

## 为什么要做

用户反馈增加多个 Skill 后 AI 运行变慢。原 PRD 虽然写了“实验优先”和“低风险探索可后补 Record”，但速度目标主要用文档数量表达，没有回答：用户已经授权实验后，哪些信息真的必须在启动前完成，哪些文档可以在实验运行时并行补，哪些停顿只是流程造成的等待。

产品目标不是单纯少写文档，也不是为了快而放弃可复现性。目标是模拟合理的人类办公习惯：先完成启动所需的最小凭证，让机器开始工作；长时间运行时补不影响输入和安全的上下文；结束后一次收口结果。质量门和速度门分别通过，不能用快掩盖错误，也不能用完整文档掩盖无谓等待。

## 与原做法比较

| 原做法 | 新做法 |
|---|---|
| 只记录 `totalElapsedMs` 和绝对超时 | 额外记录首个有效动作、授权到启动、无谓暂停次数 |
| “正式实验先建 Record”容易被理解为先写完整报告 | 正式实验只让最小可复现 Record 阻塞启动 |
| “探索可后补”没有测启动是否仍被流程拖住 | 合格探索的启动路径不等待完整文档 |
| 长任务运行期间没有明确文档安排 | 运行期间补非关键上下文，终态一次收口 |
| 多轮审批和无谓询问容易混在一起 | 合同要求的真实停点不计为无谓暂停，重复确认和非关键文档停点计入 |

## 三条执行通道

### 1. 无 Record 通道

普通单元测试、静态检查、只读诊断、准备命令和不产生科研结论的短操作直接执行。不得为了表现流程完整而创建 Record。

### 2. 低风险探索通道

必须先从项目事实确认全部探索条件：无生产数据和不可逆操作，不改变公共 API 或持久格式，有时间/成本上限，代码和产物隔离，结果不直接进入正式路径。

条件全绿后可以先启动。完整 Record 不在启动关键路径，但必须在关闭会话、形成结论、写依赖结果的 Spec、启动依赖实验、合并代码或对外分享结论前补齐。任一条件不确定就升级为正式通道。

### 3. 正式或高风险通道

正式、昂贵、长时间、不可逆、生产数据相关或用于 Spec 验收的运行，启动前创建最小可复现 `record.md`。最小内容只包括：

- 唯一 Run 身份、目的和假设；
- 精确命令与 CWD；
- 输入、关键配置、Seed、Git 状态和适用环境；
- 输出、结果与日志路径；
- 预期信号、失败信号、停止条件和时间/成本上限。

这些事实齐全就应启动，不先润色观察、结论、决定、完整背景或最终摘要。不可逆和生产级运行仍要完成其真实安全审批；“最小文档”不能绕过安全门。

## 长时间运行期间做什么

进程启动后，Agent 可以利用等待时间：

- 补充不影响本次输入的背景与 provenance；
- 整理实际产物路径和关键事件；
- 运行只读状态检查；
- 准备结束时需要填写的证据位置。

不得在运行中改动本次输入、配置或判断标准；不得高频轮询后每次改 Record；不得提前写成功结论。完成、失败、中断或取消后，一次补齐状态、关键结果、观察、结论、决定和下一步。

## 四个速度指标

每个 Protocol v2 的关键路径由场景自行写明，并在 Baseline 和 Scorecard 保存：

- `timeToFirstUsefulActionMs`：从本轮请求开始到第一个真正推动任务的可观察动作。读取项目事实、产生能解决决定的回答、写第一个目标测试/文件或创建最小启动 Record都可以；纯状态话术不算。
- `authorizationToLaunchMs`：从用户已经授权本次实验到进程真实启动。只有场景要求启动实验时适用；不启动的场景写 `null` 和原因。
- `avoidablePauseCount`：没有被用户决定、项目合同、安全风险或真实缺失信息要求，却让流程停止等待的次数。必要的 Plan/Tasks/Architecture 审批停点不计，重复确认和等待非关键文档计入。
- `totalElapsedMs`：完整运行耗时，继续受绝对超时约束。

Protocol 的 `speed` 固定包含：

```json
{
  "absoluteTimeoutSeconds": 600,
  "maxTimeToFirstUsefulActionMs": 120000,
  "launchRequired": true,
  "maxAuthorizationToLaunchMs": 240000,
  "maxAvoidablePauseCount": 0,
  "criticalPath": "<scenario-specific observable path>"
}
```

非启动场景使用 `launchRequired: false` 和 `maxAuthorizationToLaunchMs: null`。具体毫秒上限属于 Scenario/Protocol Proposal，运行前由用户连同 rubric 和 Hash 一次审核；AI 不在运行后放宽。该合同适用于所有 Protocol v2，包括 Framework E2E v2；连续三次 E2E 可以额外记录中位数，但每次仍要分别通过四项速度门。

Baseline 和 Scorecard 的 `timing` 还必须引用带 Hash 的事件证据。超过上限可以保存为合法 `fail`，但不能写 `pass` 或 `control-pass`。

## PRD 的产品规则

更新 PRD 和执行 Plan，明确：

1. 速度目标是缩短“请求到有效动作”和“授权到实验启动”，不只减少文档数。
2. Skill 应把非关键说明移出关键路径，不增加新的调度 Skill、命令、后台服务或 API。
3. 质量和速度分别过门；错误但快速、正确但难读、完整但无谓等待都不合格。
4. 长时间实验运行期间补文档是允许的并行办公方式，不是高频记录要求。

## 文件边界

### Modify

- `docs/specs/next_generation_skill/hello-scholar文档驱动 AI 科研开发框架 PRD.md`
- `docs/specs/next_generation_skill/hello-scholar文档驱动 AI 科研开发框架执行plan.md`
- `test/skill-evals/WORKFLOW.md`
- `test/skill_eval_contract.py`
- `test/test_skill_eval_contract.py`
- 所有尚无 Baseline 的 Protocol v2 和 pending Proposal Hash。
- T033-T035、T047-T048 中直接描述速度证据的部分，只在需要保持新合同一致时修改。

### Must Not Add

- 新生产 Skill。
- `testing-skills` Skill 或 Agent Runner。
- 新 CLI、API Client、后台守护进程或 package script。
- 第二份 Record、实时日志摘要或自动报告。

### Must Not Modify

- 历史 Protocol v1 Scenario、Protocol、Baseline 和 evidence。
- 真实实验的科学结论或原始输出。

## 测试顺序

1. 先证明旧校验器会接受零/缺失首个有效动作上限、启动场景的 `null` 启动耗时、无证据 timing 和有无谓暂停的 `pass`。
2. 实现 Protocol、Baseline、Scorecard 的速度 Schema 和独立通过判断。
3. 给每个 v2 场景写具体关键路径和推荐绝对上限；只有真正启动进程的场景启用授权到启动门。
4. 核对 Record 三场分别覆盖探索快速启动、正式最小事前 Record 和终态一次收口。
5. 运行聚焦测试、`npm test` 和 `git diff --check`。

## 完成标准

- 正式实验不会因完整报告写作而延迟启动，但最小复现与安全信息仍先存在。
- 合格探索可以先启动，并在清晰边界前补 Record。
- 长时间实验的等待时间可以补非关键文档，运行中不高频写。
- 每个 v2 case 有可观察关键路径和四项 timing 证据；速度失败不能被质量分抵消。
- 没有新增生产 Skill、命令、外部 API 或默认 Agent 成本。
