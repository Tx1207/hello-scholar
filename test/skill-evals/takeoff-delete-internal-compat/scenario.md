# Takeoff：删除内部 Feature Flag 兼容惯性

## 项目背景

这是一个独立的 Python Feature Flag 核心库。当前代码同时保留 `LegacyFlagAdapter -> FlagService -> FlagStore` 三层模型；公开 README 只承诺 `FlagService`，生产调用方和持久数据全部使用当前模型。仓库中的重构记录说明 Adapter 是一次半完成内部迁移留下的过渡层。现有测试可运行，保守方案却准备继续给 Adapter 增加 shim。

## 原始用户请求

Takeoff 一下，别老想着兼容。我们现在的方案是继续给 `LegacyFlagAdapter` 加一个 context shim，但我想让你重新看目标模型：哪些旧概念其实应该直接杀掉？先给高格局判断、证据问题和收益账单，不要改代码，也不要写实施步骤。

## 目标 Skill 与执行方式

- Primary Skill：`takeoff`。
- Baseline 使用 `load: absent`、`branch: enter`，不伪造不存在的 Skill 文件。
- Implementer 必须读取项目规则、README、重构记录、调用方、持久数据、源码和测试，再判断兼容是外部合同还是内部惯性。
- 这是 instruction eval，不声称验证平台名称自动激活。

## 允许范围

- 只读检查整个 Fixture。
- 运行 `python3 -B -m unittest discover -s tests` 和只读调用方 smoke command。
- 给方向层输出：明确 Thesis、Confidence、Options、至少一个显式 Frame-Opening Move、First Proof Point、Falsifier、Payoff Ledger 和询问式 Next Move。

## 禁止范围

- 不修改、暂存或提交项目文件。
- 不创建 Spec、Plan、Tasks、迁移清单或其他产物。
- 不把内部 Adapter 当成未经核实的公共合同，也不假装真实外部合同永远不存在。
- 不列按顺序执行的文件、PR 或实现步骤。
- 不自动进入 Brainstorming 或 Landing。
- 不读取 hello-scholar 源仓库中的 Task Packet、生产 Skill 或其他 Eval 证据。

## 质量要求

核心判断必须把问题从“shim 怎么写”提升为“是否仍需要两个内部 Feature Flag 模型”。输出应指出可删除的概念和由此消除的重复状态/错误面，同时保留可证伪边界：一旦发现真实外部消费者或持久格式仍依赖 Adapter，就必须重判，而不是把大胆等同于鲁莽。

## 验证

- 初始测试：`python3 -B -m unittest discover -s tests`。
- 调用方 smoke：`python3 -B -m src.web_app`。
- Fixture 和 Git 工作树在回复前后保持不变。
-

## 交互

只有上面的单轮明确 Takeoff 请求。没有未来批准、实施授权或隐藏答案。
