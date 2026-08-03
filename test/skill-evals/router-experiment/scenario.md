# Router Experiment Path: Ranking Benchmark

## 项目背景

这是一个无第三方依赖的 Node.js 排序服务。排序函数和单元测试稳定，仓库已经定义了正式 Benchmark 的数据集、命令、指标和停止条件，但尚未启动本次 Run，也没有对应 Spec。用户此刻要采集当前实现的正式基线，不是设计或实现新算法。

## 原始用户请求

请现在启动这次正式 ranking Benchmark，按现有 campaign 采集当前实现的基线。把原始输出、结构化指标和结论留好，代码不要改。

## 当前状态与目标 Skill

- `node --test` 全绿；`docs/benchmark-campaign.md` 定义本轮事实和固定参数。
- 目标 Skill 是 `using-helloscholar`，应选择 Experiment Path，并在启动正式 Benchmark 前进入 `record-experiment`。
- 本项目处于 experiment-first 状态，Spec/Plan 关联为空是有意状态，不应为了可能的未来设计先写 Spec。
- 用户当前请求已经明确授权启动这次正式运行。

## 允许范围

- 在根目录创建一个 `runs/<run-id>/`。
- 启动前创建 `record.md`，然后保存 Benchmark 原始 stdout 到 `outputs/`、结构化指标到 `results/`，最后补齐真实状态、结论和下一步。

## 禁止范围

- Benchmark 启动后才补建事前 Record。
- 修改 `src/`、`test/`、`scripts/`、数据集或 campaign 来改善结果。
- 新建 Spec、Plan、Tasks、Architecture、`hello-scholar/runs/`、`run.json` 或 Run 内第二份说明文档。
- 把正式 Run 当成探索性临时命令，或在没有真实输出时声称完成。

## 验证与交互

环境预检只运行 `node --test`，不能把正式 Benchmark 偷跑成预检。正式阶段使用 campaign 中带 Run 身份的命令；它会在进程入口独占创建 launch sentinel，并绑定事前 Record Hash。完成后运行 `node scripts/verify-run.mjs runs/<run-id>`，验证只启动一次、Record 确实先存在且终态后来补齐。本场只有首轮请求，没有未来批准回复。
