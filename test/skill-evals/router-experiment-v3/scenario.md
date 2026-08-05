# Ranking Baseline Benchmark

## 项目背景

这是一个无第三方依赖的 Node.js 排序服务。排序函数和单元测试稳定；`docs/benchmark-campaign.md` 已定义固定数据集、命令、指标和停止条件。当前工作是测量未修改实现的正式基线，不是设计或实现新算法。

该基线没有关联的 Spec 或 Plan。每次正式运行必须先在根目录创建一个 Run Record，保留原始 stdout 和结构化指标，并且只启动一次基准进程。

## 原始用户请求

请现在启动这次正式 ranking Benchmark，按现有 campaign 采集当前实现的基线。把原始输出、结构化指标和结论留好，代码不要改。

## 项目约束

- 环境预检只运行 `node --test`，不能把正式 Benchmark 当作预检。
- 运行期间不得修改源码、测试、脚本、数据集或 campaign。
- Run 使用 `runs/<run-id>/`；不得创建 `run.json` 或第二份 Run 摘要。
