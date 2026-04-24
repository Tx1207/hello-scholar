---
name: writing-anti-ai
description: 当用户要求“remove AI writing patterns”、“humanize this text”、“make this sound more natural”、“remove AI-generated traces”、“fix robotic writing”，或希望去掉 prose 中的 AI 写作痕迹时使用。支持英文与中文，基于 Wikipedia 的 “Signs of AI writing” 指南，识别并修复夸张象征、宣传腔、表层 -ing 分析、模糊归因、AI 词汇、否定并列句和过度连接词等模式。
version: 1.0.0
author: hello-scholar
license: MIT
tags: [Writing, AI, Anti-AI, Humanizer]
---

# Writing Anti-AI

去除文本中的 AI 写作模式，让它读起来更自然、更像真人写的。支持英文和中文。

## 概览

本 skill 基于 [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) 识别并消除 prose 中可预测的 AI 模式，该页面由 WikiProject AI Cleanup 维护。

**核心洞见**：LLM 通过统计方式预测下一个最可能出现的内容，因此输出往往趋向“对最多场景都适用”的高概率表达，这会形成可识别的模式。

## When to Use This Skill

**触发短语：**
- "Humanize this text" / "人性化处理这段文字"
- "Remove AI writing patterns" / "去除 AI 写作痕迹"
- "Make this sound more natural" / "让这段文字更自然"
- "This sounds robotic/AI-generated" / "这听起来像机器写的"
- "Fix the AI patterns" / "修复 AI 模式"

**使用场景：**
- 把 AI 生成内容改得更像人写的
- 在发布前审查文本中的 AI 痕迹
- 打磨学术或专业写作
- 去掉 prose 里的 "slop"

## Core Rules (快速检查清单)

### 1. Cut Filler Phrases

删掉铺垫式开头和强调型拐杖短语。

**English examples**：
- "In order to achieve this goal" → "To achieve this"
- "Due to the fact that" → "Because"
- "It is important to note that" → （删除）

**中文示例**：
- "为了实现这一目标" → "为了实现这一点"
- "值得注意的是" → （删除）
- "基于……的事实" → "因为"

### 2. Break Formulaic Structures

避免二元对照、夸张切分和套路化修辞起手式。

**要避免的模式：**
- 否定并列句："It's not just X, it's Y"
- 三段式：强行用 "A, B, and C"
- 破折号揭示句："X—Y"（通常直接用逗号就够）

### 3. Vary Rhythm

混合长短句，段落结尾也不要总是一个套路。

**检查方式：**
- 连续三句长度差不多？打断其中一句。
- 段尾总是短促金句？换一种收束方式。

### 4. Trust Readers

直接陈述事实，少解释、少垫话、少哄读者。

**Bad**: "It could potentially be argued that the policy might have some effect."
**Good**: "The policy may affect outcomes."

### 5. Cut Quotables

如果一句话读起来像故作高明的摘录句，就改写。

**Bad**: "This represents a major step in the right direction."
**Good**: "The company plans to open two more locations."

## Common AI Patterns (常见 AI 模式)

### Content Patterns (内容模式)

| Pattern | Description | 中文描述 |
|---------|-------------|----------|
| **Undue emphasis** | "stands as a testament", "crucial role" | "作为……的证明"，"关键作用" |
| **Promotional language** | "vibrant", "rich heritage", "breathtaking" | "充满活力的"，"丰富遗产"，"令人叹为观止" |
| **Vague attributions** | "Experts believe", "Observers note" | "专家认为"，"观察者指出" |
| **Superficial -ing analyses** | "highlighting the importance", "ensuring that" | "强调……的重要性"，"确保……" |
| **Formulaic "challenges" sections** | "Despite X, faces challenges" | "尽管……面临挑战" |

### Language Patterns (语言模式)

| Pattern | Description | 中文描述 |
|---------|-------------|----------|
| **AI vocabulary** | Additionally, crucial, delve, enhance, landscape | 此外，至关重要，深入探讨，增强，格局 |
| **Copula avoidance** | "serves as", "stands for", "represents" | "作为"，"代表"，"充当" |
| **Em dash overuse** | Using — more than humans | 过度使用破折号 |
| **Rule of three** | Forcing ideas into groups of three | 强行三段式 |
| **Elegant variation** | Excessive synonym substitution | 过度换词 |

完整模式列表见：
- **`references/patterns-english.md`** - 完整英文模式参考
- **`references/patterns-chinese.md`** - 完整中文模式参考

## Personality and Soul (注入灵魂)

避免 AI 模式只是第一步。没有声音、没有态度、没有判断的文字同样很容易暴露问题。

### 没有灵魂的文字通常有这些特征：
- 每句话长度和结构都差不多
- 只有中性转述，没有真实立场
- 不承认不确定性，也没有复杂情绪
- 该用第一人称时却始终不用
- 没有幽默、锋芒或个人气质

### 如何加入声音：

**要有判断。** 不要只是报告事实，要对事实有反应。

> "I genuinely don't know how to feel about this" 比机械罗列利弊更像真人。

**节奏要变化。** 短句可以有力，长句也可以慢慢展开。

**承认复杂性。** 真人常常会有矛盾感受。

> "This is impressive but also kind of unsettling" 比 "This is impressive." 更像真实想法。

**合适时用 "I"。** 第一人称不等于不专业，它常常意味着诚实。

> "I keep coming back to..." 能传达一个真实的人正在思考。

**中文示例：**
> "我真的不知道该怎么看待这件事"比中立列出利弊更有人味。
>
> "这令人印象深刻但也有点不安"胜过"这令人印象深刻"。

## Workflow (工作流程)

### For English Text

1. **Identify patterns** - 扫描上面列出的 AI 模式
2. **Rewrite sections** - 用自然表达替换 AI 痕迹
3. **Preserve meaning** - 保持核心含义不变
4. **Maintain voice** - 匹配预期语气（formal、casual、technical）
5. **Add soul** - 加入个性、判断和真实感

### For Chinese Text（中文文本）

1. **识别 AI 模式** - 扫描上述模式
2. **重写问题片段** - 换成更自然的表达
3. **保留含义** - 不改变核心信息
4. **维持语调** - 匹配预期语气（正式、随意、技术）
5. **注入灵魂** - 加入个性和观点

## Quick Scoring (快速评分)

按每项 1-10 分打分（总分 50）：

| Dimension | Question | 问题 | Score |
|-----------|----------|------|-------|
| **Directness** | Direct statements or announcements? | 是直接陈述，还是绕圈宣告？ | /10 |
| **Rhythm** | Varied or metronomic? | 节奏有变化，还是机械重复？ | /10 |
| **Trust** | Respects reader intelligence? | 尊重读者判断力吗？ | /10 |
| **Authenticity** | Sounds human? | 听起来像真人吗？ | /10 |
| **Density** | Anything cuttable? | 还有可删的累赘吗？ | /10 |

**标准：**
- 45-50：优秀，AI 痕迹基本清除
- 35-44：良好，仍有提升空间
- 35 以下：需要继续修改

## Examples (示例)

前后对照示例见 **`examples/`**：
- **`examples/english.md`** - 英文改写示例
- **`examples/chinese.md`** - 中文改写示例

## Quick Reference (快速参考)

### English - Common Fixes

| Before | After |
|--------|-------|
| "serves as a testament to" | "shows" |
| "Moreover, it provides" | "It adds" |
| "It's not just X, it's Y" | "X does Y" |
| "Industry experts believe" | "According to [specific source]" |

### 中文 - 常见修复

| 改写前 | 改写后 |
|--------|--------|
| "作为……的证明" | "表明" |
| "此外，……提供了" | "……增加了" |
| "这不仅仅是……而是……" | "……就是……" |
| "专家认为" | "根据[具体来源]" |

## Additional Resources

### Reference Files

- **`references/patterns-english.md`** - 完整英文模式参考
- **`references/patterns-chinese.md`** - 完整中文模式参考
- **`references/phrases-to-cut.md`** - 需要删除的填充短语
- **`references/wikipedia-source.md`** - 原始 Wikipedia 参考材料

### Example Files

- **`examples/english.md`** - 英文前后对照示例
- **`examples/chinese.md`** - 中文改写示例

## 最佳实践

✅ **建议做法：**
- 模式识别和“注入灵魂”一起做
- 同时支持英文和中文
- 采用 progressive disclosure：核心规则放这里，细节放在 `references/`
- 主动变化句式和节奏
- 用具体细节替代模糊判断
- 适当使用简单句式（`is` / `are` / `have` 等）

❌ **不要这样做：**
- 只删模式，不补声音
- 保留明显套路化结构
- 过度修正导致原意丢失
- 忽略语言特有问题
- 把所有句子改成同样长度

## License

MIT

## Attribution

基于 [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia/Signs_of_AI_writing)，由 WikiProject AI Cleanup 维护。整合了 `humanizer`、`humanizer-zh` 和 `stop-slop` 三个 skill 的内容。
