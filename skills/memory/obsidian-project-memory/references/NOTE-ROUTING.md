# Note 路由规则

## 先判断：durable note 还是 raw material

### Durable note

当内容满足以下条件时，应视为 durable note：

- 几天或几周后仍可能被引用
- 针对的是边界清晰的对象
- 已足够稳定，可以独立存在
- 适合成为该对象的 canonical note

### Raw material

当内容满足以下条件时，应视为 raw material：

- 只是短生命周期中间产物
- draft、memo、scratch note 或 meeting fragment
- 尚未验证的 analysis dump
- 只是已有笔记的不完整补充

默认规则：**raw material 先总结，再 promote**。

## 按知识类型路由

### Knowledge

稳定且解释性的内容写到 `Knowledge/`，例如：

- 项目背景
- 研究问题
- 数据协议
- 方法图谱
- source inventory
- codebase overview

默认不要放：

- 临时想法
- 尚无稳定 framing 的未验证 hypothesis
- daily 执行日志

### Papers

以文献为中心的内容写到 `Papers/`，例如：

- 单篇论文笔记
- related-work 总结
- 论文与项目关系说明
- 阅读笔记和文献综合

默认不要放：

- 没有文献对象的项目内部总结
- 关于论文的 raw meeting notes
- 无关实现笔记

### Experiments

关于“已经运行或将要运行什么”的内容写到 `Experiments/`，例如：

- experiment design
- runbook
- ablation
- baseline comparison setup
- freezing / transfer / screening study

默认不要放：

- 没有解释的 raw metric dump
- 宽泛的项目 framing
- 应写到 `Results/` 的最终跨实验结论

### Results

能表达 durable finding 的内容写到 `Results/`，例如：

- 最终比较
- 机制结论
- collapse diagnosis
- 图表和 csv 索引
- 跨实验解释
- 能脱离单份报告长期存在的 canonical claim

默认不要放：

- 未处理的 analysis output
- 只是重复 experiment setup 的笔记
- 仍应留在 `Daily/` 的临时结果猜测

### Results Reports

完整的内部实验总结报告写到 `Results/Reports/`，例如：

- 单轮实验 retrospective
- 一条连贯 experiment line 的 batch report
- 由 analysis artifacts 支撑的、面向决策的 wrap-up note

文件命名应遵循：

- `YYYY-MM-DD--{experiment-line}--r{round}--{purpose}.md`

默认不要放：

- 面向 manuscript 的草稿文字
- raw metric dumps
- 没有明确 date / line / round / purpose 的模糊总结

### Writing

面向外部输出的内容写到 `Writing/`，例如：

- paper draft fragments
- slide narrative
- rebuttal notes
- proposal text

内部实验报告默认**不**放这里，除非它已经是对外写作产物。

### Daily

瞬时或过程性内容写到 `Daily/`，例如：

- 今天发生了什么
- 简短 sync 队列
- quick scratch ideas
- 临时计划碎片
- 轻量 meeting notes

不要让 `Daily/` 长期承载 canonical project knowledge；耐久内容后续应 promote。

## 主路由规则

如果一个 note 在几天或几周后仍重要，优先放到 `Knowledge/`、`Experiments/`、`Results/`、`Results/Reports/`、`Papers/` 或 `Writing/`。

如果它主要反映今天的进展或临时组织，优先放到 `Daily/`。

## 跨文件夹 promote 默认路径

把这些文件夹视为 research pipeline，而不是彼此独立的桶：

- `Papers/` 通常回答：我们应该测试、比较或借鉴什么？
- `Experiments/` 通常回答：到底在跑什么，以及什么发现才重要？
- `Results/` 通常回答：基于证据，我们现在相信什么？
- `Results/Reports/` 通常回答：这轮 / 这一批发生了什么，以及它意味着什么决策？
- `Writing/` 通常回答：基于这些结果，对外应该写什么？

默认 promote 路径：

- paper insight -> experiment note
- stable experiment finding -> result note
- coherent round/batch retrospective -> results report note
- durable result claim -> writing note

如果一轮工作只到达其中一个阶段，就停在那里；但如果下一阶段已经很清楚，优先同步更新下游 canonical note，不要让链路断开。
