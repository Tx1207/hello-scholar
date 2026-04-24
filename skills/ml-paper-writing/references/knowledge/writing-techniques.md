# 写作技巧与模式

本文档整理了从成功 ML 会议论文中提炼出的句式模式、过渡短语和写作技巧。

## 过渡短语

### 文献综述中的转场

**引出问题：**

- `However, these methods suffer from [limitation].`
- `Despite recent progress, [challenge] remains unsolved.`
- `While existing approaches address [aspect], they struggle with [issue].`

**提出方案：**

- `To address this, we propose...`
- `We overcome this limitation by...`
- `Our key insight is that...`

**连接相关工作：**

- `Building on [prior work], we extend...`
- `Unlike approaches that [method], we instead...`
- `Following the success of [paper], we apply...`

### Methods 中的转场

- `Our model consists of two main components: [A] and [B].`
- `We divide our approach into [N] stages: [list].`
- `We choose this architecture because...`
- `This formulation allows us to...`

### Results 中的转场

- `Our method achieves [result], outperforming baselines by [margin].`
- `As shown in Table 1, our approach...`
- `Figure 2 demonstrates that...`
- `These results suggest that [insight].`

### Discussion 中的转场

- `These findings reveal that...`
- `This performance gap suggests that...`
- `Beyond the specific task, our results imply...`
- `While these results are promising, several questions remain...`

## 常用句式

### 呈现 claim

强 claim：

- `We show that [approach] achieves [result].`
- `We demonstrate that [method] outperforms...`
- `We prove that [technique] converges to...`

更克制的 claim：

- `Our results suggest that [factor] contributes to...`
- `We observe that [phenomenon] emerges when...`
- `Experiments indicate that [approach] is particularly effective for...`

### 技术描述

- `Formally, we optimize [objective] using [method].`
- `The update rule for [parameter] is given by...`
- `In practice, we implement [feature] as...`

### 结果报告

- `Our model achieves [score] (±[std]), improving over...`
- `On [dataset], we obtain [result], compared to...`
- `Results are averaged over N runs with different seeds.`

## 提高清晰度的技巧

### 主动语态优先

尽量写：

- `We trained the model using...`
- `We conducted experiments on...`

而少写：

- `The model was trained using...`

### 用具体表达替代空泛表达

少写：

- `This approach improves performance.`

多写：

- `This approach improves accuracy by 15%.`

### 显式 signposting

让 reviewer 不费力地跟上结构：

- `We now describe our model architecture.`
- `We evaluate on three tasks: [list].`
- `The results suggest three key insights:`

## 常见模板

### Abstract 开头

推荐：

- `We introduce [method], a novel approach for [task].`
- `We present [method], which achieves [result] by [mechanism].`
- `We propose [framework] to address [challenge].`

避免：

- `In this paper, we study...`
- `Large language models have...`

### 描述 experiments

- `We evaluate on [datasets], comparing against [baselines].`
- `We conduct ablation studies to validate [component].`
- `To verify [claim], we experiment with [variations].`

### 讨论 limitations

- `Our approach has limitations: [constraint].`
- `We note that our method is currently restricted to [condition].`
- `A key limitation is [issue], which we leave for future work.`

## 写作原则

- **Clarity first**：让 reviewer 轻松理解你的贡献
- **Rigor**：提供足够细节以支持复现
- **Storytelling**：paper 应该讲清 problem -> approach -> solution -> impact
- **Honesty**：明确承认 limitation，不要过度宣称

## “Surprisingly” 类发现的表达

适用于真正违背 common practice 的发现：

- `Surprisingly, we observe ...`
- `More surprisingly, under some circumstances, ...`
- `Notably, ...`
- `It is worth noting that ...`

使用原则：

- 只有在发现确实反直觉时才用
- 最好同时给出解释、假设或 literature support
- 避免夸大成“revolutionary”或“breakthrough”

## Ablation 写作

适合用增量式表格和 observation -> explanation 叙述：

- 先给 baseline
- 再给 (a)/(b)/(c) 逐步变化
- 说明每一步增益
- 最后解释为什么这种设计有效

当需要证明设计是“必要”而非“可选”时，可使用 destructive ablation。

## 关键词风格

### 理论驱动型

常用：

- `naturally`
- `intrinsic`
- `well-defined`
- `principled`
- `independent of`

### 设计简化型

常用：

- `minimal`
- `sufficient`
- `simple`
- `plain`
- `decouple`
- `under some circumstances`
- `can compete with`

避免过度宣传词，如：

- `revolutionary`
- `breakthrough`
- `completely eliminates`

更稳妥的替代：

- `significantly outperforms`
- `substantial improvement`
