# 审稿标准与评估维度

本参考总结主要 ML/AI 会议审稿人如何评估论文，帮助作者提前识别可能的 reviewer concerns。

## 通用评估维度

主要会议通常围绕四个核心维度评审：

1. **Quality / Technical Soundness**
   - claims 是否由理论或实验充分支撑
   - proofs 是否正确
   - baselines 是否合理且公平
   - methodology 是否可靠

2. **Clarity / Writing & Organization**
   - 论文是否清晰、组织良好
   - 是否能让领域专家复现
   - notation 是否一致、术语是否定义
   - 是否自包含

3. **Significance / Impact**
   - 结果对社区是否重要
   - 是否解决重要问题
   - 是否具有现实影响

4. **Originality / Novelty**
   - 是否提供新 insight
   - 与 prior work 有何不同
   - 贡献是否非平凡

NeurIPS 明确指出：originality 不一定等于“全新方法”，对现有方法给出新 insight 或揭示成功原因也可以非常原创。

## NeurIPS 审稿倾向

NeurIPS 常用 1-6 分：

| Score | 含义 |
|-------|------|
| 6 | Strong Accept |
| 5 | Accept |
| 4 | Borderline Accept |
| 3 | Borderline Reject |
| 2 | Reject |
| 1 | Strong Reject |

审稿人被鼓励：

- 按论文当前写出来的样子评审，而不是想象修完后会怎样
- 提供建设性反馈
- 不要惩罚诚实写 limitation 的作者
- 检查 reproducibility
- 考虑伦理风险

## ICML 审稿倾向

ICML 通常要求：

- Summary
- Strengths
- Weaknesses
- Questions
- Limitations
- Ethics
- Overall Score

ICML 特别关注：

- reproducibility 是否充分
- experimental rigor 是否足够
- writing quality 是否清楚
- novelty 是否非平凡

## ICLR 审稿倾向

ICLR 常用 OpenReview 流程，含公开 review、author response 和 reviewer / AC 讨论。

通常会评：

- Soundness
- Presentation
- Contribution
- Overall
- Confidence

ICLR 特别注意：

- LLM disclosure 是否合规
- code availability
- reciprocal reviewing 义务

## ACL 审稿倾向

ACL 除通用维度外，还会看：

- linguistic soundness
- dataset / model documentation
- multilingual considerations
- ethics review（bias、privacy、dual-use）

ACL 会特别检查 Limitations section 是否诚实充分。

## 什么样的 review 算强

强 review 一般遵循：

1. 准确复述论文观点，证明理解到位
2. 先指出做得好的地方
3. 再指出问题和改进建议
4. 给出具体、可执行的反馈

一个好的 review 通常包含：

- Summary
- 3-5 条 strengths
- 3-5 条 weaknesses
- 2-4 个 clarification questions
- minor issues（可选）
- clear recommendation

## 常见 reviewer concerns 与预防

### 技术

- “Baselines too weak” -> 使用最新且合理的 baselines
- “Missing ablations” -> 提供系统化 ablation
- “No error bars” -> 报告 variance / error bars 和方法
- “Hyperparameters not tuned” -> 写清 tuning 过程和搜索范围
- “Claims not supported” -> 每个 claim 都有对应证据

### 新颖性

- “Incremental contribution” -> 明确写出相对 prior work 的非平凡增量
- “Similar to paper X” -> 在 Related Work 中正面比较
- “Straightforward extension” -> 强调非显然设计或 insight

### 清晰度

- “Hard to follow” -> 加强结构和 signposting
- “Notation inconsistent” -> 统一 notation
- “Missing details” -> 提供 reproducibility appendix
- “Figures unclear” -> 用自包含 caption 和足够尺寸

### 重要性

- “Limited impact” -> 说明 broader implications
- “Narrow evaluation” -> 增加 benchmark 或说明边界
- “Only works in restricted setting” -> 诚实写 scope，并说明仍有价值

## 如何回应 reviewer feedback

### Rebuttal 最佳实践

应当：

- 感谢 reviewer
- 逐条回应具体 concern
- 用证据支持
- 保持简洁
- 承认有效批评

不要：

- 情绪化防御
- 做无法兑现的承诺
- 回避困难问题
- 写过长 rebuttal

### 适合直接接受的批评

- 真实 technical error
- 漏掉重要 related work
- 表达不清
- 缺失实验细节

可以用：
“The reviewer is correct that ... We will revise to ...”

### 可以礼貌反驳的情况

- reviewer 误解论文
- 要求实验明显超出 scope
- criticism 在事实层面不成立

建议用：
“We appreciate this perspective. However, ...”

## 投稿前自审

### Quality
- [ ] 我自己看到这些结果会信吗？
- [ ] 所有 claims 都有证据吗？
- [ ] baselines 是否公平且足够新？

### Clarity
- [ ] 仅靠论文能否大致复现？
- [ ] 非本子领域专家能否跟上叙述？
- [ ] 术语和 notation 是否都已定义？

### Significance
- [ ] 社区为什么该关心这个问题？
- [ ] 别人可以用这项工作做什么？
- [ ] 这个问题是否重要？

### Originality
- [ ] 到底哪一点是新的？
- [ ] 与最近相关工作到底差在哪？
- [ ] 贡献是否非平凡？
