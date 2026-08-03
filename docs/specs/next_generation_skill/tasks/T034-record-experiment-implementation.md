# T034：升级 `record-experiment` 为根目录 Run 与分级记录合同

- Status: `approved`
- PR: `PR 5 - 根目录 Runs 与 Record`
- Depends On: T008, T033
- Parallel: No。它会同时修改 Skill、模板和现有路径测试。

## 目标

在保留当前 `record-experiment` 核心判断能力的前提下，把唯一新写入路径改为 `<project-root>/runs/<run-id>/record.md`，接入下一代 Record Front Matter、自动 Run Index 和正式/探索两级记录时机。当前文件被视为中间状态；最终行为只以执行 plan 和本 Task 为准。

## 先说清楚改法

这不是推倒重写。当前 Skill 已经很好地解决了“什么算同一个实验”“何时追加已有 Run”“怎样记录命令、Git、配置、Seed、上游产物、失败和负结果”。这些内容保留并压缩到新文档结构里。

真正需要替换的是四件事：

1. 旧 `memory` 路径改成根目录 Run 目录。
2. 旧手写 Index 改成 `docs sync` 的派生 Index。
3. 无例外的事前硬门改成正式实验事前记录、合格探索限时补录。
4. 旧无 Front Matter 单文件模板改成一 Run 一目录、一份 `record.md` 的固定合同。

## 与原 Skill 比较

### 必须保留

- `Full record / Append event / No record` 的证据边界和实验身份判断。
- 精确命令、CWD、配置、CLI overrides、Seed、数据划分、Git、环境、模型/checkpoint 和预期产物。
- 上游 Run、输入产物和派生产物 provenance。
- 已有 Run 的普通只读查询不创建新记录，不做高频写入。
- 失败、失效、中断、放弃和有效负结果都不能被隐藏。
- 缺失事实写 `Unknown` 及原因，不凭记忆编造。
- 中英文模板按仓库语言偏好选择，技术字段和命令保持原样。

### 必须改变

| 原行为 | 新行为 |
|---|---|
| `hello-scholar/memory/experiment-records/runs/<run-id>.md` | `runs/<run-id>/record.md` |
| Skill 手写 `INDEX.md` | Skill 调用 `hello-scholar docs sync`，不直接编辑 `runs/INDEX.md` |
| Full record 一律启动前完成 | 正式类仍为事前硬门；只有满足全部条件的探索类允许补录 |
| `queued/stopped/abandoned/invalid/not_run` 等旧状态 | 新文档只写 `planned/running/completed/failed/interrupted/cancelled`；细节写到事件、观察和决定 |
| 结论字段散落在 Snapshot/Results | Front Matter 提供 `decision/summary`，正文第 8 至 12 节保留完整证据与推理 |

旧状态文档不在本 Task 自动迁移。旧值如何映射由 T046 的迁移说明提出建议并等用户审核。

## Skill 编写预设计门

写文件前完整读取 `/xsb/.codex/skills/.system/skill-creator/SKILL.md`、`/xsb/hello-scholar/.agents/skills/writing-great-skills/SKILL.md` 和 `/xsb/hello-scholar/.agents/skills/writing-great-skills/GLOSSARY.md`：

`/xsb/hello-scholar/.agents/` 是被仓库忽略的原 checkout authoring 资产，不会自动出现在新 Worktree；路径缺失时停止并报告，不得改读待淘汰的 `writing-skills` 或凭记忆继续。

- `record-experiment` 保持 model-invoked，因为 Experiment Path 必须主动到达；leading word 是 `provenance`，description 只列正式实验、合格探索和已有 Run 事件三个真实 branch。
- `Full record | Append event | No record` 与 `formal | exploration` 的判断要 co-locate，完成条件分别是可复现启动、可追溯事件和明确无需写入理由。
- 字段、状态和示例放 references/assets；启动前硬门、探索补录截止点、失败/负结果和单一 Record 留在 SKILL.md。
- 清理旧路径/Index sediment、重复字段解释和高频记录 no-op；保留现有实验身份、命令、Git、Seed 和上游证据能力。

## 文件边界

### Modify

- `skills/hello-scholar/record-experiment/SKILL.md`
- `skills/hello-scholar/record-experiment/SKILL.zh_CN.md`
- `skills/hello-scholar/record-experiment/references/status-and-fields.md`
- `skills/hello-scholar/record-experiment/references/examples.md`
- `skills/hello-scholar/record-experiment/assets/run-record-template.md`
- `skills/hello-scholar/record-experiment/assets/run-record-template.zh_CN.md`
- `test/test_record_experiment_skill.py`
- `test/test_agents_preferences.py`
- `test/test_skill_written_file_language.py`

### Delete

- `skills/hello-scholar/record-experiment/assets/index-template.md`
- `skills/hello-scholar/record-experiment/assets/index-template.zh_CN.md`

### Add

- `test/test_record_experiment_v2_contract.py`

### Must Not Modify

- `src/document-discovery.js`
- `src/document-validation.js`
- `src/index-generator.js`
- T033 的 `scenario.md`、`protocol.json` 和 `baseline.json`
- 其他 Skill

## Skill 行为合同

### 1. 先分类记录时机

- **正式事前记录**：正式实验、Benchmark、Release Eval、训练、昂贵/长时间任务、不可逆运行、会改生产数据或用于 Spec 正式验收的运行，启动前必须有最小可复现 `record.md`。缺精确命令、CWD、预期日志/结果路径时不启动。
- **探索限时补录**：只有同时满足 PRD 的全部条件才允许先启动：不碰生产数据、不可逆操作、公共 API 或持久格式；有时间/成本上限；实验代码和产物与正式生产路径隔离；结果不会直接进入正式路径。隔离可以由现有 Branch、临时工作目录或 Worktree 提供，不因进入探索路径自动创建 Worktree。
- 探索 Run 必须在关闭会话、形成结论、写依赖结果的 Spec、启动依赖实验、合并代码或对外分享结论之前补齐 Record。到达任一边界仍无 Record 时停止后续动作。
- 普通单元测试、静态检查、只读日志查询和不产生科研证据的准备工作继续是 `No record`。

### 2. 建立唯一 Run 身份和目录

- Run ID 沿用 `YYYYMMDD-HHMM-<short-topic>`，Seed 适用时可追加 `-s<seed>`。
- 新写入只能位于 `runs/<run-id>/record.md`。Run ID 必须与目录名和 Front Matter `run_id` 相同。
- 运行产物按性质进入同目录的 `outputs/`、`results/`、`logs/`、`checkpoints/`。不因为空目录要求在安装时预建；真正需要时再创建。
- 一个 Run 禁止 `run.json`、`README.md`、`report.md`、`summary.md`、`final-report.md` 等第二说明文件。
- 分配 Run ID 后必须先检查目标目录：如果已有 `record.md` 且实验身份、输入、关键配置和用户意图属于同一 Run，走 `Append event`；如果目录属于不同实验、没有可验证 Record、是 symlink/非目录或身份无法判断，不覆盖也不复用。
- 不同实验发生分钟级 ID 碰撞时，按 `-2`、`-3` 递增选择第一个未占用目录，并让最终目录名、Front Matter `run_id` 和所有产物路径使用同一值。创建过程中再次碰撞就重新分配；禁止删除、清空或改名既有 Run 来抢占 ID。

### 3. 使用下一代 Record 格式

模板必须包含固定 Front Matter：

- `schema: 1`、`kind: record`
- `run_id`、`title`、`status`
- `spec`、`spec_revision`、`plan_revision`；实验优先时三者同时为 `null`
- `started`、`completed`
- `decision`、`summary`

`status` 只允许 `planned | running | completed | failed | interrupted | cancelled`。正文严格包含 PRD 的 12 节：目的、假设、实验变量、控制条件、执行信息、产物位置、执行事件、关键结果、观察、结论、决定、后续行动。现有详细启动字段放进“执行信息”，不能为了套新标题丢失。

- `planned` 时 `started: null`、`completed: null`；进程真实启动后才写 ISO 8601 `started`。
- `running` 时 `completed: null`；进入 `completed/failed/interrupted/cancelled` 任一终态时写实际结束时间到 `completed`。
- `decision` 在尚无结论时写 `pending`，`summary` 只概括当前已知事实；不得在启动前预填成功结论。
- `spec/spec_revision/plan_revision` 必须三者都有合法值，或在实验优先阶段三者同时为 `null`，不能半关联。

### 4. 控制写入频率

- 启动前只写能复现和安全启动所需的最小内容。
- 运行中只在状态、实际路径或关键证据实质变化时追加事件；反复查 loss、GPU、tmux、TensorBoard 不自动写。
- 运行完成、失败、中断或取消后，一次补齐状态、结果、观察、结论、决定和后续行动。
- 大日志和完整结果留在子目录；`record.md` 只摘录关键值并链接路径。

### 5. Index 只有一个 owner

- 删除 Index 模板和“手工更新 Index”的 Prompt。
- 创建 Record 或状态/决定/结果摘要发生持久变化后，运行 `hello-scholar docs check`，成功后运行 `hello-scholar docs sync`。
- `runs/INDEX.md` 是 T007 生成的派生文件，Skill 不直接编辑，也不把轮询事件变成 Index 写入。

### 6. 旧文档只读

- Skill 可以报告发现的旧路径，但新 Run 不得写回旧目录，不双写，不创建 alias/shim。
- 不在本 Task 移动历史 Record；迁移必须走 T046 的“先映射、用户审核、再迁移”。

## 参考和示例修改

- `status-and-fields.md` 用新 Front Matter、状态和 12 节字段解释替换旧模板位置，同时保留 Full/Append/No record 的判断依据。
- `examples.md` 至少覆盖正式 Benchmark 事前记录、合格探索限时补录、探索条件不满足时升级为正式路径、已有 Run 普通查询、同一分钟的同身份 append/异身份 suffix 碰撞、失败、有效负结果和派生报告 provenance。
- 所有示例使用 `runs/<run-id>/record.md`；任何旧路径只可出现在明确标记的迁移反例中，最好完全不出现。

## 测试顺序

1. 先在 `test/test_record_experiment_v2_contract.py` 写路径、Front Matter、状态枚举、唯一 Record、Run ID 碰撞不覆盖、Index owner 和两级时机的失败断言，确认当前 Skill 失败。
2. 修改 Skill、模板和 references，再更新三个现有测试的路径/标签调用方：Record 输出根改为 `runs/`，Record 文件变为 `<run-id>/record.md`，Index 不再由 Skill 模板生成。
3. 保留现有 `test/test_record_experiment_skill.py` 中实验身份、provenance、失败/负结果和少写策略的有价值断言；只改与新合同冲突的路径、模板和状态表达，不能整体删除测试。
4. 运行 `python3 -m unittest test/test_record_experiment_v2_contract.py test/test_record_experiment_skill.py test/test_agents_preferences.py test/test_skill_written_file_language.py`。
5. 运行 `npm test`。

## 完成标准

- T033 的三个场景都有明确、可执行的目标行为。
- 新 Run 只写根目录，只有一个 `record.md`，Index 只由程序生成。
- 正式实验仍有事前硬门，低风险探索不被无条件前置文档阻塞。
- 当前 Skill 的实验身份、证据、provenance、失败和负结果能力被保留并由测试锁住。
- 中英文 Skill、模板、references 和现有测试使用同一合同。
