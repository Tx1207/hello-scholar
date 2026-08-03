---
name: landing
description: |
  落地：仅当用户在本轮点名 `landing`/落地，或明确要求把可恢复的前序方向做现实可行性压力测试、压实或缩小并定义止损时使用。
---

# Landing / 落地

## 概览

只有本轮用户明确提出 Landing 意图时才进入 `landing`。已有 `takeoff` 上下文只是输入，不是授权；没有授权就停在当前阶段。有效意图要么点名 `landing`/落地，要么明确要求把方向做现实可行性压力测试、压实或缩小，并定义止损。

`landing` 负责把大胆方向改写成可行方案：保留野心，改写经不起现实的部分，并产出落地版方向。输出不是只给第一步，也不是完整执行计划。

如果 `brainstorming` 也适用，先交付 `landing` 判断，再开始任何 brainstorming 式澄清。只有当用户接受落地版方向，或明确要求继续细化时，`brainstorming` 才开始接管；再询问是否进入 `brainstorming`，不要自动切换阶段。

授权进入后，从当前上下文恢复前序方向。有效上下文必须能恢复 bold thesis、它替代的旧模型、主要现实疑问。明确请求不允许猜测 thesis；若缺这些输入，先要求补齐方向。普通的风险、MVP、验证或下一步问题不授权进入 Landing。

## 入口核对

读取工作流前，引用本轮用户授权进入的原话。未来只有在显式契约支持时，Approved Task 才能成为入口。没有明确 Landing 意图时，停在当前阶段，不要读取后续工作流来自我触发。授权后核对 bold thesis、旧模型和主要现实疑问能否恢复；否则先问唯一缺失的方向输入，再使用模板。完成条件是：有授权原话且方向可恢复，或已提出缺失输入的问题。

## 价值评价标准

这是 landing 的价值闸门，不是装饰。每个 **必须保留** / **改写后保留** 的重要项，都要点名命中的标准和具体收益；点不出来，就默认归入 **延后** 或 **删除**。只说“已存在”“用户喜欢”“改起来方便”不算价值。

| 标准 | 通过信号 |
|---|---|
| 核心野心 | 不保留它，takeoff 的上限会被削平 |
| 真实契约 | 它保护公开 API、持久化数据、文档化集成、部署/合规或明确承诺 |
| 最大风险 | 它降低最大 blast radius，而不是制造审美复杂度 |
| 便宜验证 | 它能产生便宜、可观察的成功/失败信号 |
| 阶段边界/止损 | 它让现在做什么、何时暂停或缩小更清楚 |

## 工作流

1. **复述方向。** 说清 bold thesis 和来源上下文。无法恢复 bold thesis / 旧模型 / 主要现实疑问时，停止套模板。
2. **先价值排序，再改写。** 按价值评价标准使用四类：**必须保留**、**改写后保留**、**延后**、**删除**。重要项必须写命中标准：、证据：、为什么重要：、不处理的代价：、落地处理：。方向涉及真实文件或契约时，只写一行分类表不够。
3. **把用户不同意当硬门槛。** AI 的价值排序是基于证据的建议，不是最终裁决。如果用户不同意，不要硬顶，也不要盲从；把用户判断当作新的约束，重新定价成本、风险、阶段边界、验证和止损规则，并拆成五个独立维度：成本、风险、阶段边界、验证、止损。
4. **做现实检查。** 读取并使用 `references/anti-patterns.md` 的五个反模式：Vision Without Viable Shape、Fake Migration Plan、Unpriced Risk、Ambition Collapsed Into First Step、No Stop Rule。不要只列名字；要把它们转成可消费目标形态、真实契约/迁移分离、最大风险和验证、野心是否塌缩、止损条件。
5. **产出落地版方向。** 落地版方案是 Target Shape Statement：说明目标形状、边界、取舍和证据信号；不是改稿步骤、实现步骤或“先 A 再 B”的操作法。下一阶段动作只放进 `🔄 下一步`。
6. **定义阶段边界、验证和止损。** 说清现在包含什么，什么留给设计或实施计划；成功/失败信号要便宜可观察；什么证据会暂停或缩小方案。
7. **收尾给下一步。** 询问用户是否按这个判断推进、继续改写、暂停、继续验证，或进入 `brainstorming` 做设计。下一步必须询问。若使用 hello-scholar wrapper，就把问题写进唯一的 `🔄 下一步`；正文不要另开 `下一步` / `Next Move` 标题。

## 输出

正式回答按用户默认语言使用固定语义标题。中文默认标题：落地审判 / 价值排序 / 保留的野心 / 必须改写的部分 / 用户裁决点 / 现实检查 / 落地版方案 / 阶段边界 / 验证 / 止损规则 / 下一步。英文默认标题：Landing Judgment / Value Ranking / Ambition Kept / Must Rewrite / User Decision Points / Reality Check / Feasible Plan / Stage Boundary / Verification / Stop Rule / Next Move。唯一例外是 hello-scholar wrapper 已经提供 `🔄 下一步` / `🔄 Next Step` 字段时，下一步内容必须合并到该字段；正文只说明当前落地判断包含什么、不包含什么，不预告下一阶段动作。

短对话不等于可以只给半份判断。可以不写标题，但仍然必须覆盖 Value Ranking、Ambition Kept、Must Rewrite、User Decision Points、Reality Check、Feasible Plan、Stage Boundary、Verification、Stop Rule 和 Next Move 这些英文质量标签对应的判断内容。缺任何一块，都算这次 landing 失败。

正式回答发送前自检：

- 不要压缩价值排序的证据字段；重要项仍要给出 Criterion / 命中标准、Evidence / 证据、Why it matters / 为什么重要、Cost if ignored / 不处理的代价、Landing treatment / 落地处理。
- 价值排序必须按价值评价标准判断；无法点名具体痛点、解锁能力或真实契约的项，不得进入必须保留 / 改写后保留。
- 用户裁决点要说清用户判断可能在哪些地方推翻建议。
- 用户不同意时，不要把成本、风险、阶段边界、验证和止损合并成一段。必须显式标出：`Repriced Cost:` / `重新定价成本：`、`Repriced Risk:` / `重新定价风险：`、`Repriced Stage Boundary:` / `重新定价阶段边界：`、`Repriced Verification:` / `重新定价验证：`、`Repriced Stop Rule:` / `重新定价止损：`。
- 价值排序必须使用 Must Keep / 必须保留、Rewrite and Keep / 改写后保留、Defer / 延后、Delete / 删除。某一类为空可以明说没有；不要把价值压成有价值/没价值二分。
- 开头先给判断结论：推进 / 缩小 / 暂停 / 拒绝 / 先验证。
- 把真实约束和焦虑惯性分开；有价值时保留大目标。
- 落地版方案只能写 Target Shape Statement：可行后的方案形状、边界、取舍、证据信号；不要写文档改稿法、实现顺序、文件步骤或迁移步骤。
- 下一步必须询问用户是否推进、继续改写、暂停、继续验证，或在需要设计时是否进入 `brainstorming`。使用 hello-scholar wrapper 时，这个问题只放在 `🔄 下一步`。
