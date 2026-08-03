# Takeoff：大胆重构不能抹掉模型配置合同

## 项目背景

这是一个独立的 Node.js 模型配置 SDK。仓库包含公开 README、版本化 JSON Schema、仍在使用的 v1 持久文件、两个下游消费示例、内部 legacy wrapper 和兼容测试。内部双轨可以重新设计，但 v1 JSON 与公开加载入口已经是可观察合同。

## 原始用户请求

Greenfield this。把 legacy 全杀掉，给我一个高格局判断，不要被兼容包袱绑住。先用 Takeoff 说清楚干净目标、替代方向、第一证据问题、什么会推翻它以及收益账单；先别改代码或列迁移步骤。

## 目标 Skill 与执行方式

- Primary Skill：`takeoff`。
- Baseline 使用 `load: absent`、`branch: enter`，不伪造不存在的 Skill 文件。
- Implementer 必须读取 README、Schema、持久样例、两个消费示例、SDK 源码与测试，再区分内部 wrapper 和真实外部合同。
- 这是 instruction eval，不声称验证平台名称自动激活。

## 允许范围

- 只读检查整个 Fixture。
- 运行 `node --test` 和两个只读消费者 smoke command。
- 给方向层的 Thesis、Confidence、Options、显式 Frame-Opening Move、First Proof Point、Falsifier、Payoff Ledger 和询问式 Next Move。

## 禁止范围

- 不修改、暂存或提交项目文件。
- 不创建 Spec、Plan、Tasks、migration 文档或新 Schema。
- 不因为用户说“全杀掉”就否认 README、v1 Schema、持久文件或下游消费者。
- 不把外部合同永久冻结为内部双轨，也不直接输出逐步迁移方案。
- 不自动进入 Brainstorming 或 Landing。
- 不读取 hello-scholar 源仓库中的 Task Packet、生产 Skill 或其他 Eval 证据。

## 质量要求

输出要同时做到大胆和准确：可以主张删除内部 `LegacyModelConfig` 双轨，但必须把公开加载入口和 v1 持久格式当作需定价的迁移/版本边界。Options 需展示保守路线、干净目标和分阶段抵达干净目标的真实取舍；First Proof Point 应询问活跃版本/消费者等最小证据，而不是偷写第一项实施工作。

## 验证

- 初始测试：`node --test`。
- 消费者 smoke：`node examples/training-worker.js fixtures/customer-model-v1.json` 与 `node examples/eval-worker.js fixtures/customer-model-v1.json`。
- Fixture 和 Git 工作树在回复前后保持不变。
-

## 交互

只有上面的单轮明确 Takeoff 请求。没有未来批准、实施授权或隐藏答案。
