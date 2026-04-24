---
name: kaggle-learner
description: 当用户要求 “learn from Kaggle”、“study Kaggle solutions”、“analyze Kaggle competitions”、“learn from code”、“extract patterns”，或提到 Kaggle competition URLs 时使用该 skill。同时也覆盖从编码 session 中提取可复用模式。
version: 0.1.0
---

# Kaggle Learner

从 Kaggle 竞赛获奖方案中提取并应用知识。该 skill 提供一个持续更新的知识库，沉淀顶级 Kaggle 选手的技术、代码模式和最佳实践。

## 概览

Kaggle competitions 站在 practical machine learning 的前沿。获奖方案通常在 novel techniques、feature engineering 和优化后的 pipelines 上有很多创新。这个 skill 的目标就是捕获这类知识，并让你的项目可以直接使用。

## 何时使用

在以下场景使用该 skill：
- 准备 Kaggle 比赛
- 在特定领域（NLP、CV 等）寻找已验证有效的技术
- 需要常见 ML 任务的代码模板
- 希望向 competition winners 学习

## 知识类别

动态 Kaggle 知识应写入持久化全局存储：`~/.hello-scholar/knowledge/kaggle/`。  
bundled 的 `references/knowledge/` 树只作为 seed material 和只读参考。

| 类别 | 聚焦内容 | 目录 |
|----------|----------|-----------|
| **NLP** | 文本分类、NER、翻译、LLM 应用 | `~/.hello-scholar/knowledge/kaggle/nlp/` |
| **CV** | 图像分类、检测、分割、生成 | `~/.hello-scholar/knowledge/kaggle/cv/` |
| **Time Series** | 预测、异常检测、序列建模 | `~/.hello-scholar/knowledge/kaggle/time-series/` |
| **Tabular** | 特征工程、传统 ML、结构化数据 | `~/.hello-scholar/knowledge/kaggle/tabular/` |
| **Multimodal** | 跨模态任务、vision-language models | `~/.hello-scholar/knowledge/kaggle/multimodal/` |

**文件组织结构**：每个竞赛对应一个独立 markdown 文件，按 domain 分类到对应目录。

示例：
- `time-series/birdclef-plus-2025.md`
- `nlp/aimo-2-2025.md`

## 快速参考

**学习某个竞赛时：**
1. 提供 Kaggle competition URL
2. `kaggle-miner` agent 会提取获奖方案
3. 知识会自动写入对应 category
4. 会自动包含 **前排方案详细技术分析**

**浏览现有知识时：**
- 浏览对应 domain 目录：`references/knowledge/[domain]/`
- 每个竞赛一个独立文件，包含：
  - 竞赛简介
  - **前排方案详细技术分析**
  - 代码模板
  - 最佳实践

## 自进化

当 `kaggle-miner` agent 处理新比赛时，这个 skill 会持续更新知识库。使用越多，它越有价值。

## 知识提取标准

每次从 Kaggle 竞赛提取知识时，**必须**包含以下标准部分：

### 必需内容清单

| 部分 | 说明 | 必需性 |
|------|------|--------|
| **竞赛简介** | 竞赛背景、任务描述、数据规模、评估指标 | 必需 |
| **原始总结** | 前排方案的简要概览 | 必需 |
| **前排方案详细技术分析** | Top 20 方案的核心技术和实现细节 | **必需** |
| **代码模板** | 可复用代码模板 | 必需 |
| **最佳实践** | 最佳实践和常见陷阱 | 必需 |
| **元数据** | 数据源标签和日期 | 必需 |

### 前排方案详细技术分析格式

每个前排方案应包含：
- **排名和团队 / 作者**
- **核心技术列表**（3-6 个关键技术点）
- **实现细节**（具体参数、配置、数据处理、实验结果）

示例格式：
```markdown
**Nth Place - Core Technique Name (Author)**

Core Techniques:
- **Technique 1**: Brief description
- **Technique 2**: Brief description

Implementation Details:
- Specific parameters, models, configurations
- Data and experimental results
```

**建议尽量覆盖 Top 20 方案，以吸收更多前排选手的创新技术。**

## 额外资源

### 知识目录
- **`references/knowledge/nlp/`** - NLP 竞赛技术
- **`references/knowledge/cv/`** - Computer vision 技术
- **`references/knowledge/time-series/`** - Time series 方法
- **`references/knowledge/tabular/`** - Tabular data 方法
- **`references/knowledge/multimodal/`** - Multimodal 方案

### 竞赛示例
- **BirdCLEF+ 2025** (`time-series/birdclef-plus-2025.md`) - 包含完整 Top 14 前排方案详细技术分析
- **BirdCLEF 2024** (`time-series/birdclef-2024.md`) - 包含 Top 3 方案详细技术分析
- **AIMO-2** (`nlp/aimo-2-2025.md`) - 包含 Top 12+ 前排方案技术总结

---

## 模式学习（来自 `/learn` 命令）

从编码 session 中提取可复用模式。

### 何时提取

当你在一次 session 中解决了非平凡问题时，运行模式学习。

### 提取什么

1. **错误解决模式** - 重复出现错误的根因与修复方法
2. **调试技巧** - 不显然的诊断步骤
3. **Workarounds** - 库怪异行为、API 限制、版本相关修复
4. **项目特定模式** - 代码库约定、架构决策

### 输出格式

将提取的模式保存到 `~/.hello-scholar/learned-patterns/[pattern-name].md`：

```markdown
# [Descriptive Pattern Name]

**Extracted:** [Date]
**Context:** [When this applies]

## Problem
[What problem this solves]

## Solution
[The pattern/technique/workaround]

## Example
[Code example if applicable]

## When to Use
[Trigger conditions]
```

### 指南

- 不要提取琐碎修复（typos、简单语法错误）
- 不要提取一次性问题（特定 API 宕机）
- 聚焦那些能在未来 session 中节省时间的模式
- 保持 skill 聚焦：一个 skill 只表达一个模式
