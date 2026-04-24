# Rebuttal 模板库

本文档提供系统化 rebuttal 模板，帮助快速撰写结构清晰、专业可信的审稿回复。

## 基本结构

### 标准 Rebuttal 结构

```markdown
# Response to Reviewers

We sincerely thank all reviewers for their valuable feedback and constructive suggestions. We have carefully addressed all comments and made substantial revisions to improve the manuscript. Below, we provide detailed responses to each reviewer's comments.

---

## Response to Reviewer 1

### Major Comments

**Comment 1.1**: [审稿人原始意见]

**Response**: [我们的回复]

**Changes**: [具体修改内容和位置]
```

推荐整体结构：
1. 总体感谢
2. 按 Reviewer 分块
3. 每块再按 Major / Minor 组织
4. 每条意见都包含 `Response` 和 `Changes`
5. 最后总结主要修改

## 开场模板

### 模板 1：标准感谢

```text
We sincerely thank all reviewers for their valuable feedback and constructive suggestions. We have carefully addressed all comments and made substantial revisions to improve the manuscript.
```

### 模板 2：强调改进

```text
We are grateful to the reviewers for their thorough and insightful comments. Their feedback has helped us significantly improve the quality and clarity of our work.
```

### 模板 3：突出重点修改

```text
We thank the reviewers for their careful evaluation and constructive feedback. We have addressed all comments and made major revisions, including [关键改进1], [关键改进2], and [关键改进3].
```

## 回复模板（按策略）

### Accept

- 简单接受：
  `We thank the reviewer for this valuable suggestion. We have [具体修改].`
- 接受并扩展：
  `We appreciate this insightful comment. We agree that [问题] is important. We have [修改1] and [修改2].`
- 修正 typo / formatting：
  `We thank the reviewer for catching this. We have corrected [错误类型] throughout the manuscript.`

### Defend

- 礼貌辩护：
  `We appreciate the reviewer's concern. However, we respectfully note that [做法] is motivated by [理由].`
- 对比说明：
  `While [审稿人建议] has advantages in [场景A], we chose [当前方法] because [理由1] and [理由2].`
- 技术限制：
  `While [建议方法] would be valuable, it is not feasible in our setting due to [限制].`

### Clarify

- 澄清已有内容：
  `We would like to respectfully clarify that [已有内容]. This is discussed in [位置].`
- 指出论文中已有结果：
  `We would like to note that we did [已有工作]. These results are presented in [位置].`
- 承认表达不清：
  `We apologize for the confusion. What we meant is [澄清内容].`

### Experiment

- 已完成实验：
  `We have conducted additional experiments on [实验内容]. The results show that [主要发现].`
- 承诺补实验：
  `We are currently conducting [实验内容] and will include the results in the revised manuscript.`
- 无法做该实验但给出替代：
  `While [建议实验] would be valuable, it is not feasible due to [限制]. However, we have conducted [替代实验].`

## 特殊场景模板

### 多个 Reviewer 提同一点

```text
We thank Reviewers [X] and [Y] for raising this important point. We have [具体修改], which addresses both concerns.
```

### Reviewer 意见相互矛盾

```text
We appreciate both reviewers' perspectives on [问题]. After careful consideration, we have [我们的选择] because [理由].
```

### 无法完全满足要求

```text
We agree that [建议] would be valuable. However, [限制]. We therefore provide [部分实现或替代方案].
```

## 结尾模板

### 单个 Reviewer 结尾

- `We hope our responses and revisions have adequately addressed all of your concerns.`
- `We thank you again for your thorough review and constructive suggestions.`

### 整体 Rebuttal 结尾

推荐总结：
1. 列出主要修改
2. 指明对应 Reviewer
3. 强调论文已明显增强
4. 以礼貌、合作的语气收尾

## 使用指南

### 如何使用这些模板

1. 先选合适的总体结构
2. 把每位 Reviewer 的意见分成 Major / Minor
3. 为每条意见选择策略：Accept / Defend / Clarify / Experiment
4. 用对应模板写初稿
5. 补全具体修改位置和结果
6. 检查全篇语气和格式一致性

### 定制建议

- 顶会（NeurIPS / ICML）：更强调技术细节和实验
- 顶级期刊：更强调 broader impact 和表达清晰度
- 不同 rebuttal 轮次：
  - 第一轮：解释更详细，新增实验更多
  - 第二轮：聚焦未解决问题，尽量简洁
  - 第三轮：强调已经完成的改进和合作姿态

### 常见错误

❌ 只写 `"Done"` 或 `"Fixed"`  
❌ 不给具体位置  
❌ 语气防御性太强  
❌ 承诺无法完成的实验  
❌ 忽略某些意见  

✅ 每条回复都写 `Response + Changes`  
✅ 给出章节、页码、表格、图引用  
✅ 语气礼貌专业  
✅ 只承诺可完成内容  
✅ 回应所有问题，包括小 typo
