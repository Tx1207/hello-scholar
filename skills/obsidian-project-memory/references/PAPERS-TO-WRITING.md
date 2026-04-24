# Papers -> Experiments -> Results -> Writing

把它作为项目知识库中的默认 durable research pipeline。

## 为什么这条流水线重要

vault 不应把 literature、experiments、results 和 writing 当成彼此孤立的文件夹。

默认预期：

1. `Papers/` 产出 hypotheses、可复用方法、baselines 和 evaluation criteria
2. `Experiments/` 将它们转成可执行测试计划，或吸收到已有实验线
3. `Results/` 记录能跨越单次运行和单天时间线的 durable findings
4. `Writing/` 将这些 findings 变成对外表达：literature review、proposal、draft claims、slides、rebuttal notes

`Daily/` 是临时工作和时间序列的 staging area，不是 durable research object 的终点。

## 默认交接规则

### Papers -> Experiments

当 paper note 产生以下内容时，应从 `Papers/` 推进到 `Experiments/`：

- 可测试 hypothesis
- 值得实现的方法变体
- 值得复现的 baseline
- 值得补充的 ablation
- 值得采用的 evaluation protocol 或 metric

默认动作：

- 如果它属于现有 experiment line，就更新已有 canonical experiment note
- 否则为这个独立 experiment line 新建一个 experiment note
- 从 paper note 回链到对应 experiment note

不要停在“这篇论文很相关”。只要当前回合支持，就至少推进到“因此我们应该测试什么”。

### Experiments -> Results

当 experiment 产出以下内容时，应从 `Experiments/` 推进到 `Results/`：

- 稳定对比
- 可重复失败模式
- durable negative result
- 机制 insight
- 会改变决策的观察

默认动作：

- 将瞬时 run 噪声保留在 `Daily/` 或 experiment note 中
- 只有当观察稳定到足以被后续引用时，才创建或更新 result note
- result note 与 experiment note 之间要双向链接

不要为每次 run 都建 result note。只有当发现能脱离 raw logs 独立存在时才建。

### Results -> Writing

当 result 产出以下内容时，应从 `Results/` 推进到 `Writing/`：

- 可写进论文、报告、slides 或 proposal 的 claim
- 有用的 comparison matrix
- 项目叙事更新
- 应出现在 literature review 或 discussion 中的结论

默认动作：

- 如果写作对象已存在，就更新现有 writing note
- 否则每个外部对象建一个 writing note（review、proposal、draft section、slide outline、rebuttal block）
- 维持到 supporting results 和 key paper notes 的链接

不要让 writing 脱离证据。每个 durable writing claim 都应能回链到 supporting results，必要时也回链到 motivating papers。

## 按文件夹默认提问

### 对 paper note

问：

- 最值得复用的想法是什么？
- 它是否改变了我们该测试什么？
- 哪条 experiment line 应吸收它？
- 它现在是否已经进入 active writing narrative？

### 对 experiment note

问：

- 哪篇 paper 或 prior result 促成了这个实验？
- 这个实验会改变什么决策？
- 什么证据足以把它推进到 `Results/`？
- 如果成功或失败，哪个 writing object 会受益？

### 对 result note

问：

- durable claim 是什么？
- 哪些证据支撑它？
- 它连接了哪些 experiments 和 papers？
- 下一步哪个 writing artifact 应吸收它？

### 对 writing note

问：

- 哪些 result notes 支撑这段文字？
- 哪些 paper notes 提供背景或比较？
- 这个 writing object 还是最新的吗，还是应该吸收更新的 results？

## 主要反模式

避免以下弱工作流：

- paper notes 从不产出 experiment 决策
- experiment notes 从不说明什么发现才算 durable
- result notes 从不流向任何 writing object
- writing notes 脱离链接证据漂移
- 把 durable insight 长期留在 `Daily/` 而不 promote

## 默认 promote heuristic

当拿不准时，按这个顺序：

1. 更新已有 paper note
2. 如果它改变了要测试的内容，更新或创建 experiment note
3. 如果它改变了当前相信的内容，更新或创建 result note
4. 如果它改变了对外表达内容，更新 writing note

除非用户明确要求更窄的操作，否则这就是默认 durable research path。
