# Konwinski Prize 2025 - AI GitHub Issue Resolver 竞赛笔记

> **Competition URL**: https://www.kaggle.com/competitions/konwinski-prize
>
> **Official Website**: https://kprize.ai
>
> **Category**: Code Agent / AI Software Engineering
>
> **Tags**: `code-agent`, `LLM-agent`, `SWE-bench`, `GitHub-issues`, `automated-programming`

---

## 竞赛简介

### 概览

**Konwinski Prize** 是由 **Andy Konwinski** 发起的高奖金竞赛，目标是构建一个能够自动解决**真实 GitHub issue** 的 AI 系统。竞赛采用 contamination-free 的 SWE-bench 评测设置：测试 issue 会在提交冻结后再收集，以尽量避免训练或调参阶段发生数据泄露。

### 奖项结构

- **Grand Prize**：成功率超过 90% 时可获得 $1,000,000（截至当前尚未触发）
- **Round 1 First Place**：$50,000
- **总奖池**：$1,225,000+
- **Round 1 参赛规模**：616 支队伍

### 核心挑战

- **目标**：构建能够自动修复真实 GitHub issue 的 AI Agent
- **评估方式**：在隐藏的 contamination-free 测试集上离线评估
- **成功标准**：真实修复成功率越高越好；错误修复会被重罚
- **时间线**：Round 1 于 2025 年 7 月截止，后续轮次以官方公告为准

### Round 1 成绩概览（2025 年 7 月）

| 排名 | 参赛者 | 分数/表现 | 备注 |
|------|--------|-----------|------|
| 1st | Eduardo Rocha de Andrade | 7.5%（0.058242） | 获得 $50,000 |
| 2nd | camaro | 约 6% - 7% | Public 榜前列 |
| 3rd | Anonymous | 约 5% - 6% | Bronze Medal |
| 4th | Anonymous | 约 5% - 6% | `Select-Patch-Verify-Test` 思路 |
| 5th | Anonymous | 约 5% | 使用 regex traceback analysis |
| 6th | quan16369（2 人队） | 0.8% | 3 correct, 2 wrong，仍获 Gold Medal |

**关键洞察**：第一名只有 7.5%，说明“真实仓库里的 issue 自动修复”远比常规 benchmark 里的代码生成更难，真正困难之处在于定位、验证、选择跳过以及避免错误修复。

### 技术约束

- 只能使用 **open-weight models**
- 不允许调用外部闭源 API
- 必须在本地计算资源下运行
- 测试集在评测前不可见

---

## 前排方案分析

### 1st Place：Eduardo Rocha de Andrade（7.5%）

**总体策略**：高质量 prompt 设计 + 审慎的验证流程 + 保守提交策略。

**核心做法：**

- 细致的 prompt engineering
- 自动构造 Fail-to-Pass tests
- 对候选 patch 做严格校验
- 只有在高置信度时才提交修复

**经验要点：**

1. 真实 issue 的难点不只是“写 patch”，而是先找准该修什么。
2. 验证强于生成，能稳定识别错误 patch 才能避免被重罚。
3. 保守跳过比盲目修复更有价值。

### 4th/6th Place 一类方案：Select-Patch-Verify-Choose

这类方案普遍把流程拆成几个明确阶段：

1. **Select**：根据 issue、traceback、仓库结构筛选候选文件和代码段
2. **Patch**：围绕候选位置生成多个补丁
3. **Verify**：使用模型自检、测试或规则校验评估补丁是否可信
4. **Choose**：按评分函数决定提交哪个 patch，或者直接 skip

这类 pipeline 的优点是可解释、易调参，也更适合受限算力场景。

### 5th Place：Regex traceback analysis

这一类方案强调用更便宜、更稳定的启发式手段缩小搜索空间，典型方法包括：

- 对 traceback 做 regex 抽取
- 将 issue 文本中的文件名、函数名、异常名转成定位线索
- 用规则先找潜在改动位置，再交给模型生成 patch

这种做法的价值在于：先把仓库范围压小，再让 LLM 做局部决策，整体成功率通常会高于“让模型直接全仓自由发挥”。

---

## 任务拆解视角

把 Konwinski Prize 看成一个完整软件工程闭环，会更容易理解高分方案为何都很保守：

### 1. 问题理解

- 读取 GitHub issue
- 提炼复现线索
- 判断这是逻辑 bug、边界条件问题、依赖问题，还是测试缺失

### 2. 定位

- 从 traceback、文件名、函数名、测试名、日志片段中确定候选模块
- 识别最可能需要修改的代码范围

### 3. 生成补丁

- 生成最小改动 patch
- 避免过度重构
- 优先追求“通过验证”而不是“看起来聪明”

### 4. 验证

- 能跑测试就跑测试
- 不能跑测试时，至少做静态一致性检查与模型多次交叉判断
- 对副作用进行显式审查

### 5. 决策

- 高置信度才提交
- 低置信度宁可 skip

---

## 为什么这类竞赛这么难

### 1. Benchmark 更接近真实仓库

这不是单纯的单文件补全，而是要在真实项目上下文中理解：

- issue 描述
- 文件结构
- 依赖关系
- 测试行为
- 可能的副作用

### 2. 错误修复代价很高

很多比赛里“尝试一下”没有太大坏处，但这里错误 patch 会被重罚，因此系统必须能判断“自己不确定”。

### 3. 测试与验证不完整

有些仓库测试本来就不全，或者 issue 难以稳定复现，这迫使方案必须结合：

- prompt-based reasoning
- 规则校验
- 多样本验证
- 保守选择策略

### 4. 泛化要求极强

测试集在提交后收集，意味着不能通过背 benchmark、记住训练数据来偷分，真正比拼的是泛化的软件工程能力。

---

## 可复用方法论

从这场竞赛里，可以抽出几条对 Code Agent 很有价值的原则：

### 原则 1：先缩小搜索空间，再生成 patch

先用 issue 关键词、traceback、函数调用关系、文件路径等线索缩小候选位置，再让模型动手，通常比全仓盲修更稳。

### 原则 2：把“验证”做成独立阶段

不要把 patch generation 和 patch acceptance 混在一起。生成只是候选，验证决定是否值得提交。

### 原则 3：把 skip 当成有效动作

在高惩罚任务中，skip 不是失败，而是风险控制的一部分。

### 原则 4：启发式方法依然重要

regex、错误栈提取、关键词匹配、文件打分这些传统工程技巧，在 Agent 体系中仍然非常有用。

### 原则 5：最小可行修复优于大改动

真实 issue 修复更偏向“小而准”的 patch，大范围重构通常更难通过验证。

---

## 对未来 Code Agent 的启发

Konwinski Prize 表明，下一阶段 Code Agent 的关键不只是更大的模型，而是更可靠的系统设计：

- 更稳的仓库定位能力
- 更强的 test synthesis 与 failure reproduction
- 更好的 patch ranking
- 更明确的 uncertainty estimation
- 更严格的 verification loop

对任何想做自动化软件修复、SWE-bench、repo-level agent 的团队来说，这场竞赛最值得学的不是“神奇 prompt”，而是**保守、分阶段、强验证、允许跳过**的系统工程思路。
