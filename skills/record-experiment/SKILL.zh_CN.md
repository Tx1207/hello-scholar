---
name: record-experiment
description: 一次科研运行的条件、结果和解释具有研究、复现、恢复或决策价值时，保存真实证据；也用于补记已有执行证据或更新 Run 的重要事实。
---

# Record Experiment

让一次执行容易理解和恢复：它回答什么问题、实际运行了什么、产生哪些证据，以及这些证据支持什么。总体研究设计和跨 Run 决定由主 Agent 与归属 Spec 负责。记录 Run 不授权启动、改变研究、扩大预算或开始下一轮实验。

## 判断什么值得保留

根据证据将如何使用判断，不根据命令名、运行时长、硬件或是否生成输出文件判断。影响研究结论或后续选择的比较、消融和其他计算应保留，即使很小或结果为负。准备或失败证据对复现、恢复或资源边界判断确有价值时，同样保留。

普通 import、连接、配置、启动 smoke、静态检查和重复轮询留在任务验证或已有日志中。远程或 GPU smoke 不因花费资源就自动成为 Run。名为 `smoke` 的检查若实际检验了重要假设，也可以值得记录。综合已有材料或写周报不创建新 Run；产生科研证据的新计算可以创建。

值得保留的新运行在启动前创建 planned Record。已有 Run 只在获授权的维护范围内，以同一身份更新重要新事实。事后补记保留现有证据及其缺口，不重跑。只读查询发现新事实时仍保持只读。创建或关闭 Record 前读取 [references/status-and-fields.zh_CN.md](references/status-and-fields.zh_CN.md)；边界情形读取 [references/examples.zh_CN.md](references/examples.zh_CN.md)。

## 建立一个身份

使用 `runs/<run-id>/record.md`，其中 `<run-id>` 为 `YYYYMMDD-HHMM-<short-topic>`，适用时加 seed 后缀。目录名、`run_id` 和 Run 内路径必须一致。不得覆盖或改作他用已有或身份不明的目录；不同运行冲突时增加数字后缀。

新 Record 使用 `schema: 2`。`spec` 和 `spec_revision` 必须同时为 null，或同时指向一个存在的 Spec Revision；允许关联 draft Spec。不得加入 `plan_revision`。历史 schema 1 Record 作为证据保留；仍在运行的历史 Run 确需更新时，可以原地转换为 schema 2，并在正文保留旧 Plan provenance。

获授权的运行启动前，记录精确命令与 CWD、实际生效的输入及版本、配置与覆盖参数、seed、代码/Git 状态、环境与 backend、model/checkpoint、上游 provenance、预期产物、分别捕获 stdout/stderr 的位置、预期与失败信号、停止规则。链接已约定的问题与比较，不静默重新设计它们。后来的 Spec 变化不能改写这次 Run 的真实条件或所用修订。

英文使用 [assets/run-record-template.md](assets/run-record-template.md)，中文使用 [assets/run-record-template.zh_CN.md](assets/run-record-template.zh_CN.md)；优先采用指定语言，否则沿用项目语言。正文先讲当前发现及其含义；没有结果时说明尚在计划或运行中、还没有结论，并区分预期与观察。详细复现信息放在解释之后。

## 从执行证据推导解释

只有已有授权覆盖命令及资源时才执行。启动前取消时，以 `started: null` 和实际取消时间关闭 schema 2 Record，不执行，也不虚构进程证据。否则，文档化命令只执行一次，分别将 stdout 和 stderr 捕获到记录路径。不得先裸跑，再仅为补日志重跑。远程工作保留提交输出和真实 job、产物 URI；实际下载后才能声称本地已有证据。

重建实际生效的条件，包括与启动计划的偏差。记录真实时间、进程状态、产物、测量和失败。观察改变解释或恢复工作时再追加，不把每次轮询结果都变成事件。

作出比较判断前，确认数据、评价、资源条件和所选控制是否使比较有意义。根据问题说明解释边界：OOM 可以确定资源限制，却可能没有检验算法假设；进程成功也可能产生无效比较。保留影响判断的数值、单位、条件和依据，包括负结果与冲突结果。不从单次 Run 推断广泛因果关系。

区分执行状态、科研解释和采用。有效负结果使用 `completed`；故障使预期证据无法获得时使用 `failed`，即使它提供了有用的运行经验。保留失败和中断证据。只有采用或下一步决定真实发生时才记录为决定，否则保持 pending，说明还需解决什么。主 Agent 将这次 Run 与其他证据整合后，决定更广的研究方向。

## 在约定边界内完成

报告结果或当前状态、支持证据、解释边界、Record 规范路径，以及已决定或仍需决定的下一步。不为了让结论更满意而自行启动另一 Run。

Record 发生实质变化后，CLI 可用时使用 `hello-scholar docs check`。只有生成的 Index 写入符合原任务授权时才运行 `hello-scholar docs sync`；狭义的单 Run 写入授权不等于项目级索引授权。不可用或超出范围时，报告跳过的维护，不阻塞有效 Run。
