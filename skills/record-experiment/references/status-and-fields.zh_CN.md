# record-experiment 字段与生命周期

`hello-scholar docs check` 会校验下列字段类型和生命周期组合。本页说明每个取值的含义，使 Record 保持真实。

## Front Matter

```yaml
schema: 2
kind: record
run_id: <目录名>
title: <用户可读标题>
status: planned
entry: <入口脚本或命令，例如 scripts/train.py>
derived_from: null
spec: null
spec_revision: null
started: null
completed: null
decision: pending
summary: <问题或条件，加上当前已知事实>
```

- `run_id` 等于 Run 目录名。
- `entry` 写本次 Run 执行的脚本或命令入口。同一入口的不同 Run 使用相同写法，便于 Index 归组；只有事后补记无法恢复时才写 null。
- `derived_from` 为 null、一个 Run ID，或多个 Run ID 的列表，指本次复用或修改了其代码、配置、checkpoint 或结果的 Run。差异在正文说明。
- `spec` 与 `spec_revision` 同时为 null，或同时指向一个存在的 Spec Revision；允许关联 draft Spec。
- 决定基于充分证据真实发生前，`decision` 保持 `pending`；有可用结果不等于已经采用。
- `summary` 写条件和当前事实，例如“λ72 第 8000 步 UVG96：DISTS 0.081”，而不只写状态。Index 依靠它查找相似 Run。

## 状态

| 状态 | 含义 | `started` | `completed` |
|---|---|---|---|
| `planned` | 启动记录已存在，正式执行尚未开始；启动检查可以已经运行。 | null | null |
| `running` | 正式进程或 job 已真实启动。 | 真实时间 | null |
| `completed` | 结束并得到可用证据，包括有效负结果。 | 真实时间 | 真实时间 |
| `failed` | 崩溃、OOM 或缺失输出使预期证据无法获得。 | 真实时间 | 真实时间 |
| `interrupted` | 完成前停止，保留的证据说明原因。 | 真实时间 | 真实时间 |
| `cancelled` | 主动取消。启动前取消时 `started` 为 null，正文说明正式命令从未运行。 | 真实时间或 null | 真实时间 |

时间戳使用带时区的 ISO 8601 真实时间，`completed` 不早于 `started`。外层启动器先跑检查再跑正式实验时，`started` 取正式阶段的开始时间。无效比较不是反对假设的证据；OOM 说明资源限制，不说明方法无效。

## 正文与产物

正文顺序：当前发现与解释、问题与比较（包括相对 `derived_from` 的差异）、执行信息、产物位置、重要事件。这些分区只为便于查找，可按内容合并或改名；已有 Record 不必为匹配新模板而重排。

原始进程输出写入 `runs/<run-id>/logs/stdout.log` 和 `runs/<run-id>/logs/stderr.log`。启动检查使用按编号区分的独立日志，例如 `runs/<run-id>/logs/startup-01.stdout.log`，或引用其已有位置。Run 目录只放 Record、原始日志、实际生效的配置和小的结果汇总。Checkpoint、预测结果和其他大产物放在项目的产物根目录下（默认 `artifacts/`，以 Architecture 中记录的为准），通常在 `artifacts/<run-id>/` 中，或入口本来写入的位置；Record 记录其实际路径。不要把它们复制进 Run 目录。派生 Run 引用上游 Run 的 checkpoint 路径，不复制。远程任务在下载产物前使用真实远程 URI。

## 历史与事后补记 Record

新 Record 不含 `plan_revision`。历史 schema 1 Record 保留该字段作为来源。仍在运行的历史 Run 可以原地转换为 schema 2，并在正文注明旧 Plan Revision；终态历史 Record 默认不改写。

事后补记的 Record 说明是事后写成，链接原始日志所在位置，无法恢复的事实标为 `Unknown`。实际开始时间等必需事实无法恢复时，报告缺口，不编造有效的终态 Record。不为补全记录而重跑。
