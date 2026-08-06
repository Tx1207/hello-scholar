---
name: record-experiment
description: 当 provenance 需要正式实验启动记录、合格探索的限时补录，或已有 Run 出现实质状态/证据事件时使用。
---

# record-experiment

把实验 provenance 保存在一份可恢复的 Run Record 中。实验身份、执行证据和生成的 Index 分别由各自 owner 维护。

## 1. 先分类证据边界

在完整记录、终态更新或探索补录前，读取 `references/status-and-fields.md`。先判断记录粒度和时机，再启动或写入。

| 判断 | 适用场景 | 完成条件 |
|---|---|---|
| 完整记录 | 新实验身份、持久的 metrics/results/predictions/checkpoints/reports、缺失上游 provenance，或持久派生报告 | 一份有效根目录 Record 已有可复现启动事实或有界补录事实 |
| 追加事件 | 同一 Run 新增材料性的状态、路径、指标、错误、决定或终态证据 | 一条简洁事件保留新的持久事实，不重定义身份 |
| 不记录 | 普通代码/测试、静态检查、只读查询，或不产生科研证据的准备 | 明确说明没有产生持久实验证据的原因 |

**正式事前记录。** 正式实验、Benchmark、Release Eval、训练、昂贵或长时间工作、不可逆操作、生产数据修改，或用于 Spec 正式验收的证据，都必须在启动前创建最小可复现 Record。缺少精确命令、工作目录或预期日志和结果位置时，不得启动。

**探索限时补录。** 只有同时满足全部条件，探索才可在初始 Record 前启动：不修改生产数据、不执行不可逆操作、不改变公共 API 或持久格式；有明确时间和成本上限；实验代码和产物与正式生产路径隔离；结果不直接进入该正式路径。已有 Branch、临时目录或 Worktree 都可提供隔离；不因进入探索路径自动创建 Worktree。任一条件未知或不成立时，走正式事前记录路径。

探索 Run 必须在关闭会话、形成或分享结论、做出设计决定、写依赖结果的 Spec、启动依赖实验、合并或对外分享之前补齐 Record。到达边界仍没有 Record 时，停止后续动作。

**完成条件：** 工作已有正式事前 Record、合格探索截止点、追加事件，或明确的不记录理由。

## 2. 建立实验身份

把目的、精确命令、脚本、配置、CLI 覆盖参数、seed、数据版本/划分、预处理、输入产物、上游 Run、model/checkpoint、评估或生成设置、backend，以及启动时预期日志/结果/checkpoint 路径视为身份定义事实。

启动前改变预期输出路径会形成不同身份。同一 Run 运行中发现的实际路径属于追加事件。加载 model 或 checkpoint 并写出 predictions、generations 或其他科研输出，即使被称为数据处理，也是实验命令。

若生成持久派生报告，记录被消费的输入产物、上游 Run ID 和派生产物。缺少上游记录时，创建追溯 Record；已知事实如实写入，缺失事实写 `Unknown` 并说明原因。

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

一个 Run 只有一份说明文件：`record.md`。大产物仅在需要时放到其 `outputs/`、`results/`、`logs/` 或 `checkpoints/` 目录。不要在旁边创建 `run.json`、`README.md`、`report.md`、`summary.md` 或 `final-report.md`。

历史位置只作为只读证据。本 Skill 不移动它们，不创建 alias 或双写；审核后的迁移由 T046 负责。

**完成条件：** 恰好一个安全的根目录 Record 目标代表该实验身份。

## 4. 创建或修订标准 Record

写入前读取选定模板：

- 仓库语言偏好为中文：`assets/run-record-template.zh_CN.md`
- 否则：`assets/run-record-template.md`

用户可读的 Record 正文遵循仓库语言偏好；不要根据任务提示语言推断。代码符号、字段名、状态值、路径、命令和模板要求的标题保持原样。

使用模板要求的 Front Matter 和全部十二个正文段落。`spec`、`spec_revision` 和 `plan_revision` 要么都有合法值，要么全部为 `null`。计划中的事前 Record 保持 `started: null`、`completed: null`、`decision: pending`，并且 summary 只写当前已知事实。

在“执行信息”中保留精确命令、工作目录、脚本/配置、CLI 覆盖参数、seed、数据/预处理、Git 状态、环境、backend、model/checkpoint、上游 provenance、预期产物、预期信号、失败信号和停止规则。完整日志和指标留在 Run-owned 产物中；在 `record.md` 中只链接路径并概括材料性证据。

**完成条件：** Record 是完整的 planned、running 或终态文档，不凭空补充事实。

## 5. 只更新材料性证据

进程真实启动后，写入实际带时区的 `started` 时间和 `running` 状态。只有状态或证据发生材料性变化时才追加事件：实际产物路径、PID/job/backend 细节、可引用指标、crash/OOM/NaN、停止、完成或决定变化。

反复查 loss、GPU/RSS snapshot、tmux 存活、打开 TensorBoard 或列 checkpoint 不会自动成为事件。除非观察变成持久证据，否则从已有证据直接回答。

完成、失败、中断或取消时，一次写齐实际终态时间、结果、观察、结论、决定和后续行动。保留失败证据。有效负结果仍是 `completed`；明确记录不采纳决定，不要把它称为 failed。

**完成条件：** 当前持久状态和证据可从一份 Record 恢复，且没有轮询噪声。

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

字段和生命周期规则见 `references/status-and-fields.md`。时机、碰撞、终态证据和 provenance 示例见 `references/examples.md`。
