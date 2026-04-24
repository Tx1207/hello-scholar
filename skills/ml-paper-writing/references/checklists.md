# 会议论文 Checklist

本参考整理主要 ML/AI 会议的必备 checklist。NeurIPS、ICML、ICLR、ACL 等会议都要求作者说明可复现性、限制、伦理和格式合规；缺失关键 checklist 可能导致 desk rejection。

## NeurIPS Paper Checklist

### 必备组成

NeurIPS 投稿必须包含完整 paper checklist。Checklist 通常放在 references 和 supplemental material 之后，不计入正文页数。

### 16 个必查项目

1. **Claims alignment**：摘要和引言中的 claims 必须与理论和实验结果一致，贡献、假设和限制要写清楚。
2. **Limitations discussion**：需要专门讨论强假设、鲁棒性、适用范围和可能失败条件。
3. **Theory & proofs**：理论贡献必须给出完整假设和证明；主文可放直觉性 proof sketch，完整证明放 appendix。
4. **Reproducibility**：说明如何验证结果，包括代码、运行说明、模型访问或 checkpoints。
5. **Data & code access**：提供复现实验的命令、环境和数据访问方式。
6. **Experimental details**：说明 train/val/test split、hyperparameters 和选择方法。
7. **Statistical significance**：报告 error bars、confidence intervals 或 statistical tests，并说明计算方式。
8. **Compute resources**：说明 CPU/GPU 类型、显存/内存、存储、单次运行时间和总计算量。
9. **Ethics code compliance**：确认遵守 NeurIPS Code of Ethics，并说明任何偏离。
10. **Broader impacts**：必要时讨论负面社会影响、fairness、privacy 和缓解策略。
11. **Safeguards**：高风险模型或互联网抓取数据集需要 controlled release 和 usage guidelines。
12. **License respect**：引用已有资产的作者、license 名称、URL、版本和 ToS。
13. **Asset documentation**：新发布数据集或模型需要 datasheet / model card、训练数据和限制说明。
14. **Human subjects**：众包或人类受试者实验要包含说明、截图、报酬和最低工资合规。
15. **IRB approvals**：人类受试者研究需要 IRB 或等价审批，投稿时保持匿名。
16. **LLM declaration**：LLM 作为核心方法组件时要披露；普通写作/编辑辅助通常不要求披露。

作者每题选择 `yes`、`no` 或 `N/A`，并可给 1-2 句理由。诚实承认 limitation 不应被惩罚。

## ICML Checklist

ICML 通常要求 Broader Impact Statement，放在 references 前且不计入页数。

需要覆盖：

- 潜在正面影响
- 潜在负面影响
- 缓解策略
- 可能受影响的人群
- 数据划分、hyperparameters、搜索范围、选择方法
- compute resources、code availability
- error bars、std vs standard error、运行次数、significance tests
- double-blind 匿名要求：无作者名、无致谢、无 grant number、无可识别仓库 URL

## ICLR 要求

### LLM disclosure

如果 LLM 在 research ideation 或写作中发挥到可视为 contributor 的程度，需要在 appendix 单独说明其具体作用。

通常需要披露：

- LLM 用于重要 research ideation
- LLM 用于大量写作
- LLM 可被认为是 contributor

通常不需要披露：

- grammar checking
- minor editing
- code completion

未披露可能导致 desk rejection 或发表后问题。

### 其他要求

- 推荐提供 reproducibility statement
- 可选 ethics statement，不计入页数
- 作者需要承担 reciprocal reviewing 义务

## ACL 要求

ACL 明确要求 Limitations section，且不计入页数。

需要说明：

- 强假设
- 适用范围限制
- 方法可能失败的情况
- generalization concerns

NLP 相关内容还应覆盖：

- bias / fairness
- dual-use concerns
- multilingual considerations
- human evaluation 中的 annotator、agreement 和 compensation

## 通用投稿前 Checklist

### 内容

- [ ] Abstract 符合字数限制
- [ ] 正文在页数限制内
- [ ] References 完整且已验证
- [ ] 包含 Limitations section
- [ ] 所有图表都有自包含 caption
- [ ] 每个 claim 都有证据支撑

### 格式

- [ ] 使用正确会议和年份模板
- [ ] 未修改 margins / font sizes
- [ ] 满足 double-blind 要求
- [ ] review 版本页码设置正确

### 技术

- [ ] 包含 error bars
- [ ] baselines 合理
- [ ] hyperparameters 完整
- [ ] compute resources 说明清楚

### 可复现性

- [ ] code / data availability 已说明
- [ ] 环境和运行命令已给出
- [ ] checkpoints 或模型访问方式已说明

### 伦理

- [ ] broader impacts 已考虑
- [ ] limitations 诚实明确
- [ ] license 合规
- [ ] 人类受试者研究已获 IRB 或等价审批

## 页数快速参考

| Conference | Main Content | References | Appendix |
|------------|-------------|------------|----------|
| NeurIPS 2025 | 9 pages | Unlimited | Unlimited（checklist separate） |
| ICML 2026 | 8 pages（+1 camera） | Unlimited | Unlimited |
| ICLR 2026 | 9 pages（+1 camera） | Unlimited | Unlimited |
| ACL 2025 | 8 pages（long） | Unlimited | Unlimited |
| AAAI 2026 | 7 pages（+1 camera） | Unlimited | Unlimited |
| COLM 2025 | 9 pages（+1 camera） | Unlimited | Unlimited |

## 模板位置

会议模板位于 `templates/`：

```text
templates/
├── icml2026/
├── iclr2026/
├── neurips2025/
├── acl/
├── aaai2026/
└── colm2025/
```
