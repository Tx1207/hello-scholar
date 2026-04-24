---
name: review-response
description: 从评论分析到专业 rebuttal 写作的系统化 review response workflow。当用户要求 “write rebuttal”、“respond to reviewers”、“draft review response” 或 “analyze review comments” 时使用。目标是提升论文接收概率。
tags: [Research, Academic, Rebuttal, Paper Writing]
version: 0.1.0
---

# Review Response

一个系统化的 review response 工作流，帮助研究者高效、专业地回复 reviewer comments。

## 核心功能

1. **Review Analysis** - 解析并分类 reviewer comments（Major / Minor / Typo / Misunderstanding）
2. **Response Strategy** - 为不同评论类型制定回应策略（Accept / Defend / Clarify / Experiment）
3. **Rebuttal Writing** - 撰写结构化、专业的 rebuttal 文档
4. **Tone Management** - 优化语气，保持专业、尊重与基于证据的表达

## 工作流

```text
Receive reviewer comments -> Parse and classify -> Develop strategy -> Write responses -> Tone check -> Final rebuttal
```

## 何时使用

当你需要以下内容时使用该 skill：
- “Help me write a rebuttal”
- “How to respond to reviewer comments”
- “Analyze these review comments”
- “Develop a review response strategy”

## 使用步骤

1. **提供 reviewer comments** - 把 reviewer comments 文本或文件交给 Claude
2. **分析与分类** - Claude 自动解析并分类评论
3. **策略建议** - 为每条评论提供回应策略建议
4. **撰写 rebuttal** - 基于策略生成结构化 rebuttal 文档
5. **优化语气** - 审阅并优化专业性与礼貌性

## 核心原则

- **Professionalism** - 保持学术专业语气和表达
- **Respectfulness** - 尊重 reviewers 的意见与时间
- **Evidence-based** - 每一条回应都应有充分理由和证据支撑
- **Completeness** - 确保每条 reviewer comment 都获得回应

## 成功因素（基于 ICLR Spotlight Paper 分析）

从成功 rebuttal 案例中提取的关键经验：

### 1. 先认可优点，再积极回应批评
- Reviewers 通常会先肯定论文优点（novelty、impact、practical applicability）
- 即使是 spotlight papers 也会收到建设性批评
- **策略**：先感谢 reviewers 认可的优点，再针对批评逐条回应

### 2. 提供更强的清晰性和直觉理解
- 即使高质量论文也可能存在 clarity 问题
- 需要为不同背景读者补充直觉和更详细解释
- **策略**：扩展关键 sections，把技术细节移到 appendix，并加入 step-by-step walkthroughs

### 3. 充分论证实验设置
- 需要解释为什么采用当前 experimental setup
- 要考虑并讨论 alternative metrics
- 需要用更完整实验支撑 claim
- **策略**：加入 ablation studies，解释为什么做出当前实验设计选择

### 4. 重视伦理考虑
- 对涉及 privacy、security 等敏感议题的研究，ethical considerations 很重要
- Reviewers 会特别关注伦理影响
- **策略**：即便 reviewers 没有明确要求，也应主动讨论伦理问题

### 5. 强调实际应用价值
- Reviewers 会重视方法的 practical applicability 和 scalability
- “easily applicable” 和 “scalable” 是常见加分点
- **策略**：在 rebuttal 中强化方法的实际收益和可扩展性

## 与 `paper-miner` 全局 writing memory 的集成

当 rebuttal 任务涉及：
- tone calibration
- rebuttal phrasing
- clarification language
- structuring multi-point responses
- 或希望从过往优秀论文 / review 写作中学习

在起草前先读取：

- `~/.hello-scholar/knowledge/paper-miner-writing-memory.md`

### rebuttal 工作的默认读取顺序

1. reviewer comments 和 paper context
2. `~/.hello-scholar/knowledge/paper-miner-writing-memory.md`
3. `references/response-strategies.md`
4. `references/rebuttal-templates.md`
5. `references/tone-guidelines.md`

窄范围阅读：
- 先看 `How this helps our writing`
- 再看 `Reusable phrasing`
- 如果 rebuttal 对 venue 敏感，再看 `Venue-specific signals`
- 只有在需要更强修辞结构时才看 `Writing patterns mined`

不要机械照搬 memory 内容。用它改善结构、清晰度、克制感和专业性。

## 参考文档

详细指南请参见：
- `references/review-classification.md` - Review comment 分类标准
- `references/response-strategies.md` - 回应策略库
- `references/rebuttal-templates.md` - Rebuttal 模板与示例
- `references/tone-guidelines.md` - 语气与表达指南

## 相关工具

- **Agent**：`rebuttal-writer` - 专门用于 rebuttal 写作与优化的 agent
- **Command**：`/rebuttal <review_file>` - 快速启动 rebuttal workflow
