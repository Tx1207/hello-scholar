---
name: record-experiment
description: "明确正式、昂贵或需要保留证据的科研运行启动前或更新时使用：完整/baseline/release Benchmark 或 Eval、完整训练、长时间或昂贵的 GPU/远程 job、需要保留的 checkpoints/predictions/results、用于验收/论文/产品决策/下游实验的证据，或已有 Run 的实质事件。"
---

# record-experiment

把材料性实验 provenance 保存在一份可恢复的 Run Record 中，同时不延误普通测试或小实验。实验身份、执行证据和生成的 Index 分别由各自 owner 维护。

## 1. 先分类证据边界

在完整记录或终态更新前读取 `references/status-and-fields.md`。先判断记录粒度，再启动或写入。

| 判断 | 适用场景 | 完成条件 |
|---|---|---|
| 完整记录 | 明确正式、昂贵、长时间、远程或需要保留证据的实验；缺失上游 provenance；或持久派生报告 | 一份有效根目录 Record 已包含可复现的事前事实 |
| 追加事件 | 同一 Run 新增材料性的状态、路径、指标、错误、决定或终态证据 | 一条简洁事件保留新的持久事实，不重定义身份 |
| 不记录 | 普通代码/测试、静态检查、只读查询、准备工作，或没有明确正式、成本或保留证据信号的低风险小实验 | 直接运行，并简要说明没有创建持久 Run 的原因 |

**默认不记录。** 普通测试、smoke check 和低风险小实验直接运行。不要仅因命令或文件名包含 `eval`、`benchmark`、`inference` 或 `experiment` 就创建 Run。模糊但低风险的工作不询问用户，直接按小实验运行；只有生产数据、不可逆操作或显著费用等安全事实不明确时才询问。

未记录的小实验结果只作为临时观察。如果以后需要正式证据，为后续正式运行创建 Record；不追溯补录先前 scratch 实验。已有 Branch、临时目录或 Worktree 可提供隔离，但本 Skill 不自动创建 Worktree。

**正式事前记录。** 明确正式/baseline/release Benchmark 或 Eval、完整训练、长时间或昂贵的 GPU/远程 job、需要保留的 checkpoints/predictions/results，或用于验收、论文、产品决策、对外分享或下游实验的证据，必须在启动前创建最小可复现 Record。缺少精确命令、工作目录、预期原始 stdout/stderr 路径或预期结果位置时，不得启动。

**完成条件：** 工作已有正式事前 Record、追加事件或明确的不记录理由，且没有延迟补录义务。

## 2. 建立实验身份

把目的、精确命令、脚本、配置、CLI 覆盖参数、seed、数据版本/划分、预处理、输入产物、上游 Run、model/checkpoint、评估或生成设置、backend，以及启动时预期日志/结果/checkpoint 路径视为身份定义事实。

启动前改变预期输出路径会形成不同身份。同一 Run 运行中发现的实际路径属于追加事件。加载 model 或 checkpoint 并写出 predictions、generations 或其他科研输出，并且结果跨过上面的完整记录边界时，属于实验命令。

若生成持久派生报告，记录被消费的输入产物、上游 Run ID 和派生产物。其已保留输入缺少上游 Record 时，为这些已保留输入恢复 provenance；已知事实如实写入，缺失事实写 `Unknown` 并说明原因。这不补录先前的一次性小实验。

**完成条件：** 身份要么匹配一个已有 Run，要么已有安全分配新 Run 所需的事实。

## 3. 分配唯一根目录 Run

新 Record 只能写入：

```text
runs/<run-id>/record.md
```

使用 `YYYYMMDD-HHMM-<short-topic>`；适用时追加 `-s<seed>`。目录名、Front Matter 的 `run_id` 和 Run-owned 产物路径必须使用同一 ID。

写入前检查目标：

- 若真实存在的 `record.md` 与当前工作具有同一身份、输入、关键配置和用户意图，走追加事件。
- 若目录属于另一身份、没有可验证 Record、是 symlink、不是目录，或无法安全分类，不覆盖也不复用。
- 不同身份在同一分钟冲突时，按 `-2`、`-3` 递增选择第一个未使用目录。创建时再次检查；禁止删除、清空、改名或覆盖已有 Run 来抢占 ID。

一个 Run 只有一份说明文件：`record.md`。产物仅在需要时放到其 `outputs/`、`results/`、`logs/` 或 `checkpoints/` 目录。每个已记录 Run 都预留 `logs/stdout.log` 和 `logs/stderr.log` 保存原始进程输出。不要在旁边创建 `run.json`、`README.md`、`report.md`、`summary.md` 或 `final-report.md`。

历史位置只作为只读证据。本 Skill 不移动它们，不创建 alias 或双写；审核后的迁移由 T046 负责。

**完成条件：** 恰好一个安全的根目录 Record 目标代表该实验身份。

## 4. 创建或修订标准 Record

写入前读取选定模板：

- 仓库语言偏好为中文：`assets/run-record-template.zh_CN.md`
- 否则：`assets/run-record-template.md`

用户可读的 Record 正文遵循仓库语言偏好；不要根据任务提示语言推断。代码符号、字段名、状态值、路径、命令和模板要求的标题保持原样。

使用模板要求的 Front Matter 和全部十二个正文段落。`spec`、`spec_revision` 和 `plan_revision` 要么都有合法值，要么全部为 `null`。计划中的事前 Record 保持 `started: null`、`completed: null`、`decision: pending`，并且 summary 只写当前已知事实。

在 Record 中保留精确命令、工作目录、脚本/配置、CLI 覆盖参数、seed、数据/预处理、Git 状态、环境、backend、model/checkpoint、上游 provenance、预期产物、预期原始 stdout/stderr 路径、预期信号、失败信号和停止规则。完整日志和指标留在 Run-owned 产物中；在 `record.md` 中只链接路径并概括材料性证据。

**完成条件：** Record 是完整的 planned、running 或终态文档，不凭空补充事实。

## 5. 只启动一次并保留进程证据

已记录 Run 的文档化命令只执行一次；使用不会改变有效参数或工作目录的捕获方式，把原始 stdout 写入 `runs/<run-id>/logs/stdout.log`，把原始 stderr 写入 `runs/<run-id>/logs/stderr.log`。记录实际路径和退出码或终止 signal。禁止先裸跑命令、再仅为补日志而重跑。

进程真实启动后，写入实际带时区的 `started` 时间和 `running` 状态。只有状态或证据发生材料性变化时才追加事件：实际产物路径、PID/job/backend 细节、可引用指标、crash/OOM/NaN、停止、完成或决定变化。

远程 job 要保留本地提交 stdout/stderr、退出状态和远程 job ID 或 URI。在远程日志和产物被有意下载前，用实际 URI 链接；远程证据不在本地 Run 中时，不得声称已经本地保存。

反复查 loss、GPU/RSS snapshot、tmux 存活、打开 TensorBoard 或列 checkpoint 不会自动成为事件。除非观察变成持久证据，否则从已有证据直接回答。

完成、失败、中断或取消时，一次写齐实际终态时间、结果、观察、结论、决定、后续行动、原始 stdout/stderr 路径，以及退出码或 signal。保留失败证据。有效负结果仍是 `completed`；明确记录不采纳决定，不要把它称为 failed。

**完成条件：** 当前持久状态、原始进程输出、退出状态和产物可从一份 Record 恢复，且没有轮询噪声。

## 6. 同步生成的 Index

创建 Record 或材料性改变其状态、决定或摘要后，运行：

```sh
hello-scholar docs check
hello-scholar docs sync
```

`runs/INDEX.md` 由文档 CLI 生成。不直接编辑 `runs/INDEX.md`，也不创建手写 Index 模板。

**完成条件：** `docs check` 先成功，再运行 `docs sync`；只有 Record 和 CLI 生成的 Index 反映持久文档变化。

## 7. 向用户说明持久结果

每次判断后，向用户说明判断和简要原因。如创建或更新了 Record，给出其标准 Record 路径和 `docs check`/`docs sync` 的状态；对于正式事前 Record，说明已记录命令是否解除启动阻塞。若为“不记录”，说明原因及没有更改 Run 或 Index。只报告持久事实，不报告瞬时监控。

字段和生命周期规则见 `references/status-and-fields.md`。分类、捕获、碰撞、终态证据和 provenance 示例见 `references/examples.md`。
