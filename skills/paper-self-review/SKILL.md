---
name: paper-self-review
description: 当用户要求 “review paper quality”、“check paper completeness”、“validate paper structure”、“self-review before submission”，或提到系统化论文质量检查时使用该 skill。它提供面向学术论文的完整质量保障清单。
version: 0.1.0
---

# Paper Self-Review

一个系统化的论文质量检查工具，帮助研究者在投稿前进行全面自审。

## 核心功能

### 1. 结构审查

检查论文各部分是否完整，并符合学术规范：
- Abstract 是否包含问题、方法、结果和贡献？
- Introduction 是否清晰陈述研究动机和背景？
- Method 是否足够详细，可被复现？
- Results 是否充分支撑结论？
- Discussion 是否讨论了局限和未来工作？

### 2. 逻辑一致性检查

验证论文逻辑是否自洽：
- 研究问题是否与方法对应？
- 实验设计是否支撑研究假设？
- 对结果的解释是否合理？
- 结论是否有证据支持？

### 3. 引用完整性

检查 citations 的完整性和准确性：
- 所有引用是否都出现在 references 中？
- 参考文献格式是否一致？
- 是否引用了关键相关工作？
- 引用是否准确反映原文内容？

### 4. Figure / Table 质量

评估 figures 和 tables 的质量与有效性：
- 所有 figures / tables 是否都有清晰标题和 captions？
- Figures / tables 是否支撑正文叙述？
- Figures / tables 是否清晰可读？
- 格式是否符合 journal / conference 要求？

### 5. 写作清晰度

检查写作清晰度和可读性：
- 语言是否简洁清楚？
- 技术术语使用是否恰当？
- 句子结构是否清晰？
- 段落组织是否合理？

## 质量检查清单

使用以下清单做系统化自审：

```text
Paper Quality Checklist:
- [ ] Abstract includes problem, method, results, contributions
- [ ] Introduction clearly states research motivation
- [ ] Method is reproducible
- [ ] Results support conclusions
- [ ] Discussion addresses limitations
- [ ] All figures/tables have captions
- [ ] Citations are complete and accurate
```

## 何时使用

在以下场景使用：

- **投稿前检查** - 向 journal 或 conference 提交前做最终审查
- **初稿完成后** - 完成 first draft 后做系统化 review
- **导师 review 前** - 在请求导师反馈前先做自查，提高质量
- **修订后复核** - 根据 reviewer comments 修订后，验证所有问题是否已处理
- **发给合作者前** - 在发给 collaborators 前做质量检查

## 审查流程

按以下步骤进行系统化论文审查：

### Step 1: 结构审查
先看整体结构，检查各部分是否完整且逻辑连贯。

### Step 2: 内容审查
深入每个 section，检查内容准确性与完整性。

### Step 3: Citation 检查
验证所有 citations 的完整性与准确性。

### Step 4: Figure / Table 审查
检查所有图表的质量和 captions。

### Step 5: 写作质量
审查语言表达和写作清晰度。

### Step 6: 最终清单
使用质量清单完成最终核验。

## 最佳实践

### 审查时机
- **间隔审查** - 初稿完成后等待 1-2 天再审，保持客观性
- **多轮审查** - 进行多轮 review，每轮聚焦不同方面
- **打印审查** - 打印纸质版往往更容易发现问题

### 审查技巧
- **逆向阅读** - 从 conclusion 倒着看，检查逻辑链条
- **朗读** - 大声读出来更容易发现语言问题
- **Reviewer 视角** - 假设自己是 reviewer，用批判性视角阅读

### 常见问题
- Abstract 过短或过长
- Introduction 没有清楚给出研究问题
- Method 细节不足，无法复现
- Results 缺少统计显著性检验
- Discussion 没有讨论研究局限
- Figures / tables 缺少清晰标题和 captions
- Citation 格式不一致

## 总结

`Paper Self-Review` skill 提供了系统化的论文质量检查流程，帮助研究者在投稿前发现并解决问题，从而提升论文质量和接收率。

## 参考文件

按需加载：
- `references/SECTION-CHECKLIST.md` - 分 section 的审查问题
- `references/FINAL-VERDICT.md` - 如何总结投稿准备度与阻塞问题
- `examples/example-self-review.md` - 自审输出示例
