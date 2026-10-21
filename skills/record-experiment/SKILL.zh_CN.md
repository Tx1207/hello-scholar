---
name: record-experiment
description: 启动科研执行前，查找可复用或可派生的已有 Run；一次运行的真实条件、结果和解释具有研究、复现、恢复或决策价值时保存证据；也用于补记已有执行证据或更新 Run 的重要事实。
---

# Record Experiment

让一次执行容易理解、恢复和复用：它回答什么问题、复用了什么、实际运行了什么，以及证据支持什么。总体研究设计和跨 Run 决定由主 Agent 与归属 Spec 负责。

## 从已有 Run 出发

规划新执行前，先按入口和主题查看 `runs/INDEX.md`，再搜索 Record、配置和 `results/`，寻找回答相同或重叠问题的工作。优先复用已有结果、只补跑缺失部分、或用改动后的参数重跑已有入口，而不是写新脚本。新 Run 基于已有 Run 时，把 `derived_from` 设为该 Run，并写明差异和复用的产物，让读者不必比对两份 Record 就能看出变化。

## 判断什么值得保留

根据证据将如何使用判断，不根据命令名、运行时长、硬件或输出文件判断。影响研究结论或后续选择的比较、消融和计算应保留，即使很小或结果为负；对复现、恢复或资源决定确有价值的准备或失败证据同样保留。import、连接与配置检查、启动 smoke、静态检查和轮询不单独建 Run，留在任务验证或对应实验的 planned Record 中。总结和周报不创建 Run。只读查询发现新事实时仍保持只读。边界情形读取 [references/examples.zh_CN.md](references/examples.zh_CN.md)。

## 建立一个身份

使用 `runs/<run-id>/record.md`，其中 `<run-id>` 为 `YYYYMMDD-HHMM-<short-topic>`，适用时加 seed 后缀。不得覆盖或改作他用已有目录；不同 Run 冲突时增加数字后缀。创建或关闭 Record 前读取 [references/status-and-fields.zh_CN.md](references/status-and-fields.zh_CN.md)；`hello-scholar docs check` 会校验其中的字段和生命周期。

一个 Run 对应一次科研执行。正式启动前的错误、修复和重试追加到它的 planned Record。正式执行失败或结束后，再次执行另建 Run，`derived_from` 指向前一次，复用其启动计划，条件允许时从已完成阶段或 checkpoint 继续。已经执行过的实验事后补记现有证据及缺口，不重跑。

获授权的运行启动前，记录复现所需信息：精确命令与 CWD、入口、实际生效的配置与覆盖参数、seed、数据与输入产物、代码版本、环境与硬件、model 或 checkpoint、预期 stdout、stderr 与结果路径以及产物根目录下的 checkpoint 位置、预期与失败信号、停止规则。无法获得的写 `Unknown` 并说明原因，不猜测。英文使用 [assets/run-record-template.md](assets/run-record-template.md)，中文使用 [assets/run-record-template.zh_CN.md](assets/run-record-template.zh_CN.md)，按指定语言或项目语言选择。

## 执行与解释

文档化的正式命令只执行一次，stdout 和 stderr 分别捕获到记录路径；不得先裸跑再为补日志重跑。远程任务保留提交输出和真实 job、产物 URI。记录实际生效的条件、与计划的偏差、真实时间、产物、测量和故障。只有改变解释或恢复方式的观察才追加为事件。

作出比较判断前，确认数据、评价、资源和控制条件使比较有意义。有效负结果使用 `completed`；故障使预期证据无法获得时使用 `failed`。决定真实发生前保持 `decision: pending`，不从单次 Run 推断广泛因果关系。

## 完成

Record 正文先讲当前发现及其含义；计划或运行中时说明尚无结果。报告结果或当前状态、证据与边界、Record 路径，以及已决定或仍需决定的下一步。不为了让结论更满意而自行启动另一 Run。实质修改后，CLI 可用时运行 `hello-scholar docs check`。
