# 审稿响应策略库

本文档整理了不同类型审稿意见的系统化回复策略。

## 四大核心策略

### 1. Accept（接受）

适用：
- 审稿人指出的确实是问题
- 修改成本低且能提升质量
- typo、格式问题
- 合理的补充建议

模板：

```text
We thank the reviewer for this valuable suggestion. We have [具体修改行动].
```

### 2. Defend（辩护）

适用：
- 当前做法有充分理由
- 审稿人的建议不适用于本研究
- 需要解释设计选择

原则：
- 礼貌
- 充分给理由
- 不要出现 “The reviewer is wrong”

模板：

```text
We appreciate the reviewer's concern. However, we respectfully note that [解释理由]. This choice is motivated by [具体原因].
```

### 3. Clarify（澄清）

适用：
- 审稿人误解了论文
- 论文中已有内容但不够显眼
- 需要指出已有实验或说明

模板：

```text
We would like to respectfully clarify that [已有内容]. This is discussed in [具体位置]. To make this clearer, we have [改进措施].
```

### 4. Experiment（补实验）

适用：
- 审稿人要求关键实验或对比
- 该实验合理且可行
- 补实验能显著增强说服力

模板：

```text
We thank the reviewer for this valuable suggestion. We have conducted additional experiments on [实验内容]. The results show that [主要发现].
```

## 成功模式

### 模式 1：认可优点，再正面回应批评

先感谢 reviewer 对论文优点的认可，再直接回应 concern，并说明已做动作。

### 模式 2：提供更多清晰度与直觉解释

当 reviewer 质疑清晰度时：
- 扩写相关章节
- 增加算法、图示、appendix
- 改善跨背景读者的理解

### 模式 3：充分论证实验设置

要说明：
- 为什么当前 experimental setup 合理
- 是否考虑过替代方案
- 是否补了额外实验

### 模式 4：主动讨论伦理问题

对隐私、安全、公平性敏感的工作，要补：
- 风险
- mitigation strategy
- 数据处理方式
- responsible use 讨论

### 模式 5：强调实际应用价值

如果方法具备实用性、可扩展性、易部署性，应明确说出来，并用实验或规模结果支撑。

## 策略组合使用

实际 rebuttal 往往需要混用策略：

### Accept + Clarify

当 reviewer 一部分说对，一部分是因为没看清：
- 合理部分接受并修改
- 误解部分礼貌澄清

### Defend + Experiment

当某个建议不适用，但 reviewer 提出的更大 concern 值得补实验时：
- 为当前选择做辩护
- 同时补充另一个能回应 concern 的实验

## 策略选择流程

```text
审稿意见
-> 分类（Major / Minor / Typo / Misunderstanding）
-> 选择策略
```

- Major：优先 `Experiment`，必要时 `Defend`
- Minor：优先 `Accept` 或 `Clarify`
- Typo：直接 `Accept`
- Misunderstanding：用 `Clarify`

## 语气原则

始终做到：
- 感谢 reviewer
- 礼貌
- 给出证据
- 给出具体改动位置
- 只承诺可完成的事情

避免：
- “The reviewer is wrong”
- 过强防御语气
- 模糊回避
- 过度承诺

## 会议特定侧重点

### NeurIPS
- 强调概念新颖性
- 展示 broader impact
- 确保 reproducibility

### ICML
- 强调理论严谨性
- 数学证明和方法论贡献
- 把实验与理论联系起来

### ICLR
- 更重视实验完整性
- 诚实讨论 limitations
- 如适用，披露 LLM usage

### CVPR
- 页数限制严
- 强调视觉效果与实验完整性
- 识别“支持你的 reviewer”，为其提供更强论据

### ACL
- 重视语言学意义和实际应用
- 可以在 rebuttal 中加入小表格
- 主动讨论 ethics 与 broader impact

## 推荐流程

1. 先把每条意见分类
2. 再给每条意见选主策略
3. 能加实验就优先加证据
4. 能澄清就附具体位置
5. 最后统一检查语气与一致性
