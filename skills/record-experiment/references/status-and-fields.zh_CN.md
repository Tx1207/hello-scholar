# record-experiment 字段与生命周期

创建或关闭 Record 前读取本参考。没有保留价值的工作不使用 Record，也不产生后续补录义务。很小但承担决策依据的实验仍使用该 schema。

## Front Matter

```yaml
schema: 2
kind: record
run_id: <目录名>
title: <用户可读标题>
status: planned
spec: null
spec_revision: null
started: null
completed: null
decision: pending
summary: <当前已知事实>
```

- `run_id` 必须等于 Run 目录名。
- `spec` 与 `spec_revision` 同时存在或同时为 null；存在时引用真实的 `SPEC-NNN` ID 和正整数 Revision，修订不晚于该 Spec 当前版本。正式探索可以关联 draft Spec。
- 新 Record 没有 `plan_revision`。历史 schema 1 Record 可以保留该字段；仍在运行且需要更新时，可以原地升级为 schema 2，并在正文保留旧 Plan Revision。终态历史 Record 默认不改写。
- `planned` 的 `started` 与 `completed` 为 null；`running` 需要真实、带时区的 `started` 且 `completed: null`；`completed`、`failed`、`interrupted` 需要真实 `started` 与 `completed`，且结束时间不早于开始时间。
- schema 2 启动前取消使用 `status: cancelled`、`started: null`，`completed` 为实际取消时间。已经启动则保留真实开始时间，结束时间不早于开始时间。历史 schema 1 的取消仍要求两个时间戳。
- 有充分证据且决定真实发生前，保持 `decision: pending`。有可用结果不等于已经采用；summary 只写当前事实，不预告成功。

## 状态与终态证据

- `planned`：可复现事前记录已存在，正式实验尚未启动；普通启动检查可以已经执行。
- `running`：正式实验的进程或 job 确实已经启动；`started` 使用这次真实开始时间。
- `completed`：运行产生可用证据，包括有效负结果。
- `failed`：crash、OOM、缺失必需产物或其他故障使预期证据不可用，即使该故障揭示了值得保存的运行边界。
- `interrupted`：运行未完成，保留证据说明了中断。
- `cancelled`：Run 在完成前被有意取消，schema 2 也包括正式实验启动前取消。启动前取消须说明正式命令未启动及原因；已有启动检查日志属于准备，不是该命令的输出。不得伪造正式执行证据，也不得仅为获得它们而启动命令。

有效负结果不是运行故障：使用 `completed`，解释结果及其限制。不采用决定已经发生时才写为决定，否则继续保持 pending。失败、中断和取消也保留证据与已知下一步。不把无效比较解释为反对科研假设的证据。

## 正文与执行信息

先说明当前发现、关键证据、解释边界，以及已经形成的决定或下一个未决选择。planned 或 running Record 尚未产生结果时明确说明，已有部分结果时标明范围。先解释本轮相对对照或原条件检验了什么，再展开复现细节。预期与实测分开。

模板将内容组织为发现、问题与比较、执行信息、产物和重要事件，帮助定位信息，不强制标题，也不要求重复同一事实。保留适用的启动事实、证据与解释后可以合并或更名。现有 Record 不因模板更新而重排；已确认的外部使用方依赖某些标题时，保留其契约。

正式启动前至少记录精确命令和 CWD、入口与配置、覆盖参数、seed、数据和预处理、输入与上游 provenance、model/checkpoint、Git 状态、环境与 backend、预期 stdout/stderr/result/checkpoint 及追踪路径、预期信号、失败信号和停止规则。记录实际生效的条件，不照抄被运行时参数覆盖的名义配置。未知事实写 `Unknown` 并说明原因，不凭记忆重建；区分不适用与未知。精确命令、CWD、stdout/stderr 或 result 位置缺失时不得启动正式 Run。执行请求还须已覆盖命令、资源和停止条件，写下它们不构成授权。

Run 内产物按需放入 `outputs/`、`results/`、`logs/` 和 `checkpoints/`。已启动运行的原始 stdout 与 stderr 分别保存为 `logs/stdout.log` 和 `logs/stderr.log`。启动前取消保留预期路径，但不将其声称为已有证据。完整日志与大指标留在产物文件，Record 保存摘要、路径和退出状态。

值得保留的实验，其普通启动错误、修复和重试追加到同一 planned Record。各次检查使用独立日志，例如 `logs/startup-01.stdout.log` 和 `logs/startup-01.stderr.log`，或引用已有位置；保留实际命令、时间与退出状态，不覆盖此前证据。正式实验启动前，`started` 和 `completed` 保持 null。外层启动器同时包含预检和研究阶段时，标明边界并使用研究阶段的真实开始时间，而非启动器开始时间。修复后更新正式启动条件，保留准备过程的历史。

## 事后补记

用户要求为已经执行的实验保存 Record 时，保留实际运行身份和现有证据，注明记录形成于执行之后，区分已知与无法恢复的事实。原日志按实际位置引用，未捕获的日志如实标为缺失，不为补齐 Record 重跑。仍遵守相同 schema 和生命周期约束：实际开始或结束时间等必需事实无法恢复时，报告缺失事实，不伪造合法终态 Record。

## 粒度与执行不变量

实际证据将影响研究结论、验收或采用判断、后续实验，或重建执行对复现、恢复、资源规划有意义时创建 Record。大小不是有效分界：很小的受控比较可以值得记录，没有这些用途的昂贵远程启动检查仍可留作普通验证。

硬件、时长、远程执行、命令名和临时文件本身不足以触发。普通准备、import、配置检查、单元测试、静态检查、轮询和可丢弃观察不单独建 Record，相关验证保留在任务、已有日志或对应实验的 planned Record 中。只设计研究、总结已有结果和写周报不产生已执行的 Run。

低风险工作没有明确保留需要时，按原任务继续，不询问记录偏好。只有未决成本、生产数据使用或不可逆影响会改变执行授权时才问。明确要求保存已有实验时遵循补记规则；缺少 Record 不产生自动补全历史的义务。

在已授权的 Run 维护范围内，只追加影响解释或恢复的事实：真实开始/结束、状态、实际产物路径、PID/job ID、实际配置、可引用指标、错误、决定或下一动作。重复轮询不创建另一 Record。只读查询 loss、TensorBoard、tmux、GPU/RSS 或 checkpoint 列表时，即使发现重要事件也保持只读；报告发现，不自行推定持久化写入授权。

正式实验启动时，已记录的正式命令只执行一次，执行时分别捕获原始 stdout/stderr，并保留退出码或 signal。此前的普通启动重试仍属于同一 Record 的准备过程；正式执行失败或结束后，获授权的重新执行另建 Run，即使命令相同也如此。不得为补日志重跑实验。远程 job 保存本地提交输出和 remote ID/URI；实际下载前只引用真实远程 URI。

## 来源与派生产物

预测或生成命令在产物提供科研证据时值得记录，不因写文件就自动满足条件。产生这类证据的新派生计算，记录输入、上游 Run ID、计算方法及条件和新产物。对已算出结果写文字摘要或制作展示时，引用已有来源，不建 Run。

从现有证据恢复相关上游来源，不可获得的事实写 `Unknown`；不编造或强求无关的上游 Record。保留每次独立执行实际使用的 Spec Revision、输入版本和结果。后续综合可以改变解释，不能改写原条件或丢弃有效负结果。
