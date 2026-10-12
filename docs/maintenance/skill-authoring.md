# Skill 维护参考

本文件保存 hello-scholar Skill 的维护判断，不参与运行时发现。

## 目标

Skill 应提供可复用的领域判断方法，以及让它可靠落地的必要约定。说明这类任务最容易误判什么、依据什么选择、哪些条件会改变做法，以及何时足以行动或停止。流程组织必要操作，格式保存和交换结果。质量看真实任务中的决定、产物、证据与读者理解是否改善，不看文件长度、标题数量或自评分。

## 设计检查

- description 只说明能力和有区别度的适用条件；避免同义触发词和“所有任务都使用”的路由。
- 入口先说明目的与核心判断方法，解释要求为什么有用；必要流程随后落实判断。只在特定分支使用的 schema、示例或长流程放入 reference，并从入口说明何时读取。
- 一个行为只有一个事实源。删除模型默认会做的 no-op、重复规则、陈旧兼容说明和没有现实失败依据的防御分支。
- 固定步骤只用于顺序影响正确性或安全的流程。开放式设计应描述结果、判断标准和停止条件，不固定标题或访谈轮数。
- 从失败反馈概括可迁移的原因与改进，先检查判断方法是否缺失或不适用，避免不断追加强制词、格式限制和只适配当前案例的例外。高层方法要能解释具体选择，不要求每次交付都有“方法论总结”。
- 用读者当前问题筛选内容，保留结论与证据之间的关键关系；来源链接不代替正文解释。经验的适用范围与材料相称，不为压字数丢掉条件，也不为提高抽象层次制造普遍规律。
- 写入、外部副作用和付费操作分别遵守用户授权；Skill 不能把完成任务的授权扩成另一类动作。
- 中英文镜像表达相同契约，但无需逐字翻译。平台专属 UI metadata 留在 `agents/`，不得写进跨平台正文。

## 沉淀与减法

只有已经稳定重复、输入输出和失败边界清楚的做法，才考虑沉淀成 Skill；优先复用现有 Skill 或 reference。稳定操作交给脚本、CLI 或已有工具，Skill 保存何时使用、如何判断结果和必要约束。一次性的尝试或一般工程知识不因使用过就新增入口。

实际任务、工具、环境或模型能力变化，或某条规则的收益变得可疑时，可以用代表性任务对一个候选规则做有限的有无对照。保持目标、输入、验收标准和环境可比，评价实际结果、实质缺陷、人工审查成本及运行开销；根据证据保留、缩小适用范围或删除规则。覆盖不足或规则存在相互作用时保留不确定性，不以一次成功、Token 下降或评论数量代替有效性判断。安全要求和用户授权边界始终有效。

按任务所需能力和当前证据选择模型，不把某一代模型的偏好硬编码为长期规则。沿用现有任务与证据，不必为每次规则调整建立评估系统。科研运行按研究结论、复现或恢复价值使用 `record-experiment`；成本、时长、远程或 GPU 本身不构成记录理由，执行遵守现有授权。

## 验证

先运行 `skill-creator` 的 `quick_validate.py` 检查结构，再按改动影响运行相关本地检查。行为边界有变化时，用少量代表性请求比较无 Skill、旧 Skill 和候选 Skill，检查是否正确触发、是否保留用户意图、是否产生目标产物与证据、是否出现额外审批或旁路写入。固定字符串断言只适合验证真实字段、路径和安全边界。

比较流程相似但关键条件不同的案例，检查判断能否迁移。表达类任务用完整成品检验读者能否理解结论、理由、条件及下一步；不以必须出现某个标题或固定字数代替阅读质量。有限试用、结构检查和跨模型实际表现分别说明覆盖，已有历史证据保持原义。

## 参考方法与采用范围

以下来源于 2026-10-12 核对。方法按本项目目标重新表述，未整体移植上游工作流或提示词。GitHub 关注度仅用于筛选参考，不证明收益。

| 来源 | 采用的方法与本项目落点 |
| --- | --- |
| [Huang 原文](https://x.com/huangtongxueh/status/2108577165306687938)及[全文存档](https://yr.al/b/lwlx1pobqpbkrcdnrjvbagxw.html) | 按问题使用五个方法、按关键不确定性停止追问、独立审查与小增量；科研增量和八入口分工是项目适配。文章未明确 `check`、`handoff` 的上游实现，不将任意同名仓库认作原作者版本。 |
| [Karpathy 原文](https://x.com/karpathy/status/2105819303471976479)与[ASD-STE100 官方说明](https://www.asd-ste100.org/about.html) | 以人的理解需要选择文字、图示或交互；落在根沟通规则和 `synthesize`。中文保留自然表达，“80%”不作为官方合规等级。 |
| [Matt Pocock Skills](https://github.com/mattpocock/skills) | 需求问题的决定依赖、先查可查事实、连接实现与审查；用信息增益停止点代替穷尽全部分支。仓库 [MIT](https://github.com/mattpocock/skills/blob/main/LICENSE)。 |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | 读取完整受影响范围、复用已有能力、最小完整改动与有依据的审查。提供定向 `ponytail` 和独立 `review`，不移植持续强度模式、hooks 或整套命令。相关目录保留上游 MIT 许可。 |
| [Anthropic skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) | 解释方法理由、从反馈概括规律、删掉无用提示；用于本维护说明及全体 Skill 的写作。[该 Skill 的许可](https://github.com/anthropics/skills/blob/main/skills/skill-creator/LICENSE.txt)为 Apache-2.0。 |
| [Anthropic doc-coauthoring](https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring) | 借鉴让缺少聊天上下文的读者检查歧义、遗漏与矛盾的方法，不复制其长提示词或固定确认流程。 |
| [obra/superpowers](https://github.com/obra/superpowers) | 比较成功与失败条件，沿数据流定位问题，以最小诊断检验解释；不移植固定阶段和强制 Skill 路由。仓库 [MIT](https://github.com/obra/superpowers/blob/main/LICENSE)。 |
| [K-Dense Scientific Agent Skills](https://github.com/K-Dense-AI/scientific-agent-skills) | 区分观察与候选解释，核对比较单位、适用条件与证据范围；未报告不能直接推成未执行。只借鉴科研判断方法，不移植其领域工具和完整评估体系。[仓库许可](https://github.com/K-Dense-AI/scientific-agent-skills/blob/main/LICENSE.md)及所查具体 Skill 为 MIT，其他内容按各自许可判断。 |

引用文章观点时注明来源；直接采用或实质改写可复用代码、提示词时保留相应版权与许可。许可证不能从仓库名称或相邻 Skill 推定。
