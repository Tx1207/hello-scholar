# 审稿回复与 Rebuttal 策略

本文档整理了应对 reviewer comments 的高效策略，提炼自成功的 ML 会议 rebuttal。

## 通用原则

### 核心哲学

1. **语气尊重**：先感谢 reviewer 的时间和反馈
2. **逐点回应**：每个 concern 都要正面回应
3. **以证据为基础**：用数据、实验或引用支撑
4. **简洁清楚**：信息完整，但不要冗长
5. **不要过度承诺**：只承诺真正能做的修改

### 常见回应结构

```markdown
# Response to Reviewer [Number]

Thank you for this insightful comment. We [address the concern].

[Specific response to concern].

[Additional evidence/experiments if needed].

We have revised the manuscript to clarify this point.
```

## 针对具体 concern 的策略

### 1. Clarity 问题

做法：

- 承认原文不清
- 给出 revised text
- 必要时补 example、figure 或 appendix 说明

### 2. 缺少实验

做法：

- 先判断实验是否可行
- 可行就补实验并报告结果
- 不可行就说明为什么不属于当前 scope
- 尽量给替代证据

### 3. Statistical significance

做法：

- 增加 statistical test
- 报 confidence interval
- 区分 practical significance 和 statistical significance
- 诚实说明 sample size 限制

### 4. Baselines 不充分

做法：

- 补 reviewer 提到的重要 baseline
- 若某 baseline 不可比，要明确给出理由
- 必要时引用文献支撑排除理由

### 5. Writing quality

做法：

- 重写问题段落
- 修复 grammar / typo
- 增强 flow 和 signposting

### 6. Overclaiming

做法：

- 把绝对化表述收紧
- 补充条件和边界
- 更明确写 limitation
- 让 claim 与证据强度匹配

## 语气与措辞模式

### 开场感谢

- `Thank you for this insightful comment.`
- `We appreciate the reviewer's suggestion to...`
- `We thank the reviewer for pointing this out.`

### 承认合理批评

- `The reviewer is right that...`
- `We agree this is a limitation.`
- `This is an excellent suggestion.`

### 礼貌反驳

- `We respectfully disagree with this assessment based on...`
- `While we understand the concern, our results suggest...`
- `We believe our approach is justified because...`

### 做出承诺

- `We will add this experiment in the revised version.`
- `We have added additional ablation studies in Section 5.`
- `We have expanded discussion of this point in the revision.`

### 拒绝不合理请求

- `Unfortunately, due to [constraint], we cannot add this experiment.`
- `This would require substantial additional resources beyond our current scope.`
- `We believe this is beyond the scope of the current paper but note it as future work.`

## 常见 rebuttal 组织方式

### Organized Response

建议结构：

1. Summary of Changes
2. Reviewer 1 point-by-point response
3. Reviewer 2 point-by-point response
4. Reviewer 3 point-by-point response

### Evidence-Based Arguments

对 technical concern，优先用：

1. 数据
2. 新实验
3. figure / table
4. 理论解释
5. prior work

### Highlighting Improvements

最好显式列出：

1. 新实验
2. 新分析
3. 文本重写
4. 新 limitation

## Venue-specific 注意点

### NeurIPS

重点通常在：

- novelty
- conceptual contribution
- broader impact
- reproducibility checklist

### ICML

重点通常在：

- methodological rigor
- theoretical contribution
- broader impact

### ICLR

重点通常在：

- experimental thoroughness
- limitations
- LLM disclosure

### ACL

重点通常在：

- 语言质量
- 伦理和数据来源
- clear limitations

## 成功 rebuttal 的建议

### 写之前

1. 先彻底理解 reviewer 的 concern
2. 先处理 major concerns
3. 对可行工作量做现实判断
4. 把 supporting evidence 准备齐
5. 与 co-authors 对齐口径

### 写的时候

1. 引用具体章节、图表和表格
2. 句子短、信息实
3. 既感谢 reviewer，也要适度 defend
4. 对 limitation 保持诚实

### 避免的错误

- 语气防御性过强
- 回应模糊
- 跳过困难问题
- 过度承诺
- 结构混乱
- 用语不专业

## 示例场景

### Clarity concern

Reviewer：`The method description in Section 3 is unclear.`

可用回应：

- 承认原文不清
- 指出重写了哪一节
- 新增了 pseudocode / example / appendix
- 明确表示现在可复现

### Missing baseline

Reviewer：`You should compare with Method X.`

可用回应：

- 已补入 Table 3
- 新 baseline 成绩是多少
- 自己的方法领先多少
- 如有 ablation，说明增益来自何处

### Overclaiming

Reviewer：`The abstract claims state-of-the-art too broadly.`

可用回应：

- 承认 original claim 过强
- 给出 revised sentence
- 增加 Limitations section
- 将泛化表述收紧到具体 tasks / settings

## 最终检查

- [ ] 所有 reviewer concerns 都已回应
- [ ] 回应具体而清楚
- [ ] 语气专业、尊重
- [ ] 关键改动已在 manuscript 中体现
- [ ] 所有 claims 都有证据支撑
- [ ] 承诺都可执行
- [ ] co-authors 已确认
- [ ] 已通读排错

## 备注

- 多读成功 rebuttal 的 reviewer exchange
- 保持 humility，但不要放弃 defend 核心贡献
- 把 rebuttal 当成“澄清和收束证据”的机会，而不是争论场
